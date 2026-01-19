import { createSignal, createEffect, on, onCleanup, Show, createMemo, For } from "solid-js"
import { IconButton } from "@opencode-ai/ui/icon-button"
import { Icon } from "@opencode-ai/ui/icon"
import { Tooltip } from "@opencode-ai/ui/tooltip"
import { Button } from "@opencode-ai/ui/button"
import { Spinner } from "@opencode-ai/ui/spinner"
import "./live-preview.css"

interface LivePreviewProps {
  files: Record<string, string>
  activeFile?: string
  class?: string
  onClose?: () => void
  onRefresh?: () => void
}

/**
 * LivePreview - Real-time preview component for Logan AI
 * 
 * This component renders a live preview of web applications as they're being built.
 * It supports HTML, CSS, and JavaScript files and automatically refreshes when
 * content changes.
 * 
 * Part of Logan AI by Yuval Avidani (YUV.AI)
 */
export function LivePreview(props: LivePreviewProps) {
  let iframeRef: HTMLIFrameElement | undefined
  const [error, setError] = createSignal<string | null>(null)
  const [loading, setLoading] = createSignal(true)
  const [scale, setScale] = createSignal(1)
  const [viewMode, setViewMode] = createSignal<"desktop" | "tablet" | "mobile">("desktop")
  const [lastUpdate, setLastUpdate] = createSignal(Date.now())

  const viewportSizes = {
    desktop: { width: "100%", height: "100%" },
    tablet: { width: "768px", height: "1024px" },
    mobile: { width: "375px", height: "667px" },
  }

  // Combine all files into a single HTML document
  const combinedHTML = createMemo(() => {
    const files = props.files
    if (!files || Object.keys(files).length === 0) {
      return null
    }

    // Find HTML file
    let htmlContent = ""
    let cssContent = ""
    let jsContent = ""

    for (const [filename, content] of Object.entries(files)) {
      const lower = filename.toLowerCase()
      if (lower.endsWith(".html") || lower.endsWith(".htm")) {
        htmlContent = content
      } else if (lower.endsWith(".css")) {
        cssContent += content + "\n"
      } else if (lower.endsWith(".js") || lower.endsWith(".jsx") || lower.endsWith(".ts") || lower.endsWith(".tsx")) {
        // Basic transpilation for TSX/JSX - wrap in try/catch for safety
        jsContent += `
try {
  ${content}
} catch (e) {
  console.error('Error in ${filename}:', e);
}
`
      }
    }

    // If we have HTML, inject CSS and JS
    if (htmlContent) {
      // Inject CSS if not already in head
      if (cssContent && !htmlContent.includes("<style>")) {
        const styleTag = `<style>\n${cssContent}\n</style>`
        if (htmlContent.includes("</head>")) {
          htmlContent = htmlContent.replace("</head>", `${styleTag}\n</head>`)
        } else if (htmlContent.includes("<body")) {
          htmlContent = htmlContent.replace("<body", `${styleTag}\n<body`)
        } else {
          htmlContent = styleTag + "\n" + htmlContent
        }
      }

      // Inject JS if not already present
      if (jsContent && !htmlContent.includes("<script>")) {
        const scriptTag = `<script>\n${jsContent}\n</script>`
        if (htmlContent.includes("</body>")) {
          htmlContent = htmlContent.replace("</body>", `${scriptTag}\n</body>`)
        } else {
          htmlContent = htmlContent + "\n" + scriptTag
        }
      }

      return htmlContent
    }

    // If no HTML, create a basic document
    if (cssContent || jsContent) {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Logan AI Preview</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      margin: 0; 
      padding: 16px; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
    }
    ${cssContent}
  </style>
</head>
<body>
  <div id="root"></div>
  <div id="app"></div>
  <script>
    window.onerror = function(msg, url, line, col, error) {
      console.error('Preview Error:', msg, 'at line', line);
      return true;
    };
    ${jsContent}
  </script>
</body>
</html>`
    }

    return null
  })

  // Update iframe when content changes
  createEffect(
    on(combinedHTML, (html) => {
      if (!html || !iframeRef) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      setLastUpdate(Date.now())

      try {
        const blob = new Blob([html], { type: "text/html" })
        const url = URL.createObjectURL(blob)

        iframeRef.onload = () => {
          setLoading(false)
          URL.revokeObjectURL(url)
        }

        iframeRef.onerror = () => {
          setError("Failed to load preview")
          setLoading(false)
          URL.revokeObjectURL(url)
        }

        iframeRef.src = url
      } catch (e) {
        setError(`Preview error: ${e instanceof Error ? e.message : "Unknown error"}`)
        setLoading(false)
      }
    }),
  )

  const handleRefresh = () => {
    if (iframeRef && combinedHTML()) {
      const html = combinedHTML()!
      const blob = new Blob([html], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      setLoading(true)
      iframeRef.src = url
    }
    props.onRefresh?.()
  }

  const cycleViewMode = () => {
    const modes: Array<"desktop" | "tablet" | "mobile"> = ["desktop", "tablet", "mobile"]
    const current = modes.indexOf(viewMode())
    setViewMode(modes[(current + 1) % modes.length])
  }

  const zoomIn = () => setScale((s) => Math.min(s + 0.1, 2))
  const zoomOut = () => setScale((s) => Math.max(s - 0.1, 0.5))
  const resetZoom = () => setScale(1)

  const hasContent = createMemo(() => !!combinedHTML())
  const fileCount = createMemo(() => Object.keys(props.files || {}).length)

  return (
    <div class={`flex flex-col h-full bg-background-base ${props.class ?? ""}`} data-component="live-preview">
      {/* Header */}
      <div class="shrink-0 h-12 flex items-center justify-between px-4 border-b border-border-weak-base bg-background-stronger">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1.5">
            <div class="size-2 rounded-full bg-icon-success-base animate-pulse" />
            <span class="text-12-medium text-text-strong">Live Preview</span>
          </div>
          <Show when={fileCount() > 0}>
            <span class="text-12-regular text-text-weak">
              {fileCount()} file{fileCount() > 1 ? "s" : ""}
            </span>
          </Show>
        </div>

        <div class="flex items-center gap-1">
          {/* Viewport modes */}
          <div class="flex items-center gap-0.5 mr-2">
            <Tooltip value="Desktop" placement="bottom">
              <IconButton
                icon="expand"
                variant={viewMode() === "desktop" ? "secondary" : "ghost"}
                onClick={() => setViewMode("desktop")}
              />
            </Tooltip>
            <Tooltip value="Tablet" placement="bottom">
              <IconButton
                icon="task"
                variant={viewMode() === "tablet" ? "secondary" : "ghost"}
                onClick={() => setViewMode("tablet")}
              />
            </Tooltip>
            <Tooltip value="Mobile" placement="bottom">
              <IconButton
                icon="collapse"
                variant={viewMode() === "mobile" ? "secondary" : "ghost"}
                onClick={() => setViewMode("mobile")}
              />
            </Tooltip>
          </div>

          {/* Zoom controls */}
          <div class="flex items-center gap-0.5 mr-2 border-l border-border-weak-base pl-2">
            <Tooltip value="Zoom out" placement="bottom">
              <IconButton icon="dash" variant="ghost" onClick={zoomOut} />
            </Tooltip>
            <button
              type="button"
              class="px-2 py-1 text-12-medium text-text-weak hover:text-text-strong min-w-10 text-center"
              onClick={resetZoom}
            >
              {Math.round(scale() * 100)}%
            </button>
            <Tooltip value="Zoom in" placement="bottom">
              <IconButton icon="plus-small" variant="ghost" onClick={zoomIn} />
            </Tooltip>
          </div>

          {/* Refresh */}
          <Tooltip value="Refresh preview" placement="bottom">
            <IconButton icon="arrow-left" variant="ghost" onClick={handleRefresh} />
          </Tooltip>

          {/* Close */}
          <Show when={props.onClose}>
            <Tooltip value="Close preview" placement="bottom">
              <IconButton icon="close" variant="ghost" onClick={props.onClose} />
            </Tooltip>
          </Show>
        </div>
      </div>

      {/* Preview area */}
      <div class="flex-1 min-h-0 relative overflow-hidden bg-[#1a1a1a]">
        <Show
          when={hasContent()}
          fallback={
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-text-weak">
              <div class="flex flex-col items-center gap-2">
                <Icon name="eye" class="size-12 text-icon-weak-base" />
                <span class="text-14-medium">No preview available</span>
                <span class="text-12-regular text-text-subtle max-w-64 text-center">
                  Start building a web app and the live preview will appear here automatically.
                </span>
              </div>
              <div class="flex flex-col items-center gap-1 mt-4 opacity-60">
                <span class="text-10-regular text-text-subtle">Powered by</span>
                <span class="text-12-medium text-text-weak">Logan AI by YUV.AI</span>
              </div>
            </div>
          }
        >
          {/* Loading overlay */}
          <Show when={loading()}>
            <div class="absolute inset-0 flex items-center justify-center bg-background-base/80 z-10">
              <div class="flex items-center gap-2">
                <Spinner />
                <span class="text-14-regular text-text-weak">Updating preview...</span>
              </div>
            </div>
          </Show>

          {/* Error message */}
          <Show when={error()}>
            <div class="absolute top-0 left-0 right-0 p-3 bg-surface-critical-base text-text-critical-base text-12-medium z-20">
              {error()}
            </div>
          </Show>

          {/* Iframe container */}
          <div
            class="absolute inset-0 flex items-center justify-center p-4 overflow-auto"
            style={{
              "background-image": `
                linear-gradient(45deg, #2a2a2a 25%, transparent 25%),
                linear-gradient(-45deg, #2a2a2a 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #2a2a2a 75%),
                linear-gradient(-45deg, transparent 75%, #2a2a2a 75%)
              `,
              "background-size": "20px 20px",
              "background-position": "0 0, 0 10px, 10px -10px, -10px 0px",
            }}
          >
            <div
              class="bg-white shadow-2xl transition-all duration-200"
              style={{
                width: viewMode() === "desktop" ? "100%" : viewportSizes[viewMode()].width,
                height: viewMode() === "desktop" ? "100%" : viewportSizes[viewMode()].height,
                "max-width": "100%",
                "max-height": "100%",
                transform: `scale(${scale()})`,
                "transform-origin": "center center",
                "border-radius": viewMode() !== "desktop" ? "8px" : "0",
                overflow: "hidden",
              }}
            >
              <iframe
                ref={iframeRef}
                title="Live Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                class="w-full h-full border-none bg-white"
              />
            </div>
          </div>

          {/* Device frame for mobile/tablet */}
          <Show when={viewMode() !== "desktop"}>
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-12-regular text-text-weak bg-background-base/80 px-3 py-1.5 rounded-full">
              {viewMode() === "mobile" ? "iPhone SE" : "iPad"} • {viewportSizes[viewMode()].width} × {viewportSizes[viewMode()].height}
            </div>
          </Show>
        </Show>
      </div>

      {/* Footer with branding */}
      <div class="shrink-0 h-8 flex items-center justify-between px-4 border-t border-border-weak-base bg-background-stronger">
        <div class="flex items-center gap-2">
          <Show when={hasContent()}>
            <span class="text-10-regular text-text-subtle">
              Last update: {new Date(lastUpdate()).toLocaleTimeString()}
            </span>
          </Show>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-10-regular text-text-subtle">Logan AI</span>
          <span class="text-10-regular text-text-weak">by</span>
          <a
            href="https://yuv.ai"
            target="_blank"
            rel="noopener noreferrer"
            class="text-10-medium text-text-interactive-base hover:underline"
          >
            YUV.AI
          </a>
        </div>
      </div>
    </div>
  )
}

export default LivePreview
