import { createContext, createSignal, useContext, createEffect, on, batch, ParentProps, createMemo } from "solid-js"
import { createStore } from "solid-js/store"
import { useSync } from "./sync"

/**
 * PreviewProvider - Context for managing live preview state in Logan AI
 * 
 * This context tracks file changes from the AI session and provides
 * the content to the LivePreview component for real-time rendering.
 * 
 * Part of Logan AI by Yuval Avidani (YUV.AI)
 */

type PreviewFileType = "html" | "css" | "js" | "other"

interface PreviewFile {
  path: string
  content: string
  type: PreviewFileType
  timestamp: number
}

interface PreviewState {
  enabled: boolean
  files: Record<string, PreviewFile>
  activeFile: string | null
  autoRefresh: boolean
  lastUpdate: number
}

interface PreviewContextValue {
  state: PreviewState
  enabled: () => boolean
  files: () => Record<string, string>
  toggle: () => void
  enable: () => void
  disable: () => void
  setAutoRefresh: (value: boolean) => void
  updateFile: (path: string, content: string) => void
  removeFile: (path: string) => void
  clear: () => void
  setActiveFile: (path: string | null) => void
  lastUpdate: () => number
  hasWebFiles: () => boolean
}

const PreviewContext = createContext<PreviewContextValue>()

export function usePreview() {
  const context = useContext(PreviewContext)
  if (!context) {
    throw new Error("usePreview must be used within a PreviewProvider")
  }
  return context
}

// Helper to determine file type from path
function getFileType(path: string): PreviewFileType {
  const lower = path.toLowerCase()
  if (lower.endsWith(".html") || lower.endsWith(".htm")) return "html"
  if (lower.endsWith(".css") || lower.endsWith(".scss") || lower.endsWith(".less")) return "css"
  if (
    lower.endsWith(".js") ||
    lower.endsWith(".jsx") ||
    lower.endsWith(".ts") ||
    lower.endsWith(".tsx") ||
    lower.endsWith(".mjs")
  ) {
    return "js"
  }
  return "other"
}

// Check if a file is a web file that should be included in preview
function isWebFile(path: string): boolean {
  const type = getFileType(path)
  return type !== "other"
}

export function PreviewProvider(props: ParentProps) {
  const [state, setState] = createStore<PreviewState>({
    enabled: false,
    files: {},
    activeFile: null,
    autoRefresh: true,
    lastUpdate: Date.now(),
  })

  // Try to get sync context for watching file changes
  let sync: ReturnType<typeof useSync> | undefined
  try {
    sync = useSync()
  } catch {
    // Sync context may not be available
  }

  // Watch for file changes from the AI session
  createEffect(() => {
    if (!sync || !state.enabled) return

    const sessionDiffs = sync.data.session_diff
    if (!sessionDiffs) return

    // Iterate through all sessions and their diffs
    for (const [sessionId, diffs] of Object.entries(sessionDiffs)) {
      if (!diffs || !Array.isArray(diffs)) continue

      for (const diff of diffs) {
        if (!diff.file || !isWebFile(diff.file)) continue

        // Use the "after" content as the current file state
        const content = diff.after ?? ""
        const existingFile = state.files[diff.file]

        // Only update if content has changed
        if (!existingFile || existingFile.content !== content) {
          setState("files", diff.file, {
            path: diff.file,
            content,
            type: getFileType(diff.file),
            timestamp: Date.now(),
          })
          setState("lastUpdate", Date.now())
        }
      }
    }
  })

  // Get files as simple content map for the preview component
  const files = createMemo(() => {
    const result: Record<string, string> = {}
    for (const [path, file] of Object.entries(state.files)) {
      result[path] = file.content
    }
    return result
  })

  // Check if we have any web files to preview
  const hasWebFiles = createMemo(() => {
    const fileList = Object.values(state.files)
    return fileList.some((f) => f.type === "html" || f.type === "css" || f.type === "js")
  })

  const value: PreviewContextValue = {
    state,
    enabled: () => state.enabled,
    files,
    toggle: () => setState("enabled", (e) => !e),
    enable: () => setState("enabled", true),
    disable: () => setState("enabled", false),
    setAutoRefresh: (value) => setState("autoRefresh", value),
    updateFile: (path, content) => {
      if (!isWebFile(path)) return
      setState("files", path, {
        path,
        content,
        type: getFileType(path),
        timestamp: Date.now(),
      })
      setState("lastUpdate", Date.now())
    },
    removeFile: (path) => {
      setState("files", path, undefined!)
      setState("lastUpdate", Date.now())
    },
    clear: () => {
      setState("files", {})
      setState("lastUpdate", Date.now())
    },
    setActiveFile: (path) => setState("activeFile", path),
    lastUpdate: () => state.lastUpdate,
    hasWebFiles,
  }

  return <PreviewContext.Provider value={value}>{props.children}</PreviewContext.Provider>
}

export default PreviewProvider
