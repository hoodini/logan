import fs from "fs"
import path from "path"

/**
 * Terminal image rendering utilities
 * Supports: iTerm2, Kitty, WezTerm, Sixel-capable terminals
 * Falls back to ASCII art for unsupported terminals
 */

export namespace TerminalImage {
  type Protocol = "iterm" | "kitty" | "sixel" | "none"

  /**
   * Detect which image protocol the terminal supports
   */
  export function detectProtocol(): Protocol {
    const term = process.env.TERM || ""
    const termProgram = process.env.TERM_PROGRAM || ""
    const kittyPid = process.env.KITTY_PID
    const weztermPid = process.env.WEZTERM_PANE
    const lcTerminal = process.env.LC_TERMINAL || ""
    const minttyBuild = process.env.MINTTY_SHORTCUT

    // Kitty terminal
    if (kittyPid) {
      return "kitty"
    }

    // WezTerm supports both iTerm2 and Kitty protocols
    if (weztermPid) {
      return "iterm"
    }

    // iTerm2
    if (termProgram === "iTerm.app" || lcTerminal === "iTerm2") {
      return "iterm"
    }

    // Mintty (Git Bash on Windows) - supports Sixel
    if (minttyBuild) {
      return "sixel"
    }

    // xterm with Sixel support (check TERM)
    if (term.includes("xterm") && process.env.XTERM_VERSION) {
      return "sixel"
    }

    // mlterm, foot, contour - known Sixel terminals
    if (term.includes("mlterm") || term.includes("foot") || termProgram === "contour") {
      return "sixel"
    }

    return "none"
  }

  /**
   * Render an image using iTerm2 inline image protocol
   */
  function renderIterm(imageData: Buffer, width?: number, height?: number): string {
    const base64 = imageData.toString("base64")
    const params: string[] = ["inline=1"]
    
    if (width) params.push(`width=${width}`)
    if (height) params.push(`height=${height}`)
    
    // iTerm2 escape sequence: ESC ] 1337 ; File = [params] : base64data BEL
    return `\x1b]1337;File=${params.join(";")};size=${imageData.length}:${base64}\x07`
  }

  /**
   * Render an image using Kitty graphics protocol
   */
  function renderKitty(imageData: Buffer, width?: number, height?: number): string {
    const base64 = imageData.toString("base64")
    const chunks: string[] = []
    const chunkSize = 4096

    // Kitty uses chunked transmission for large images
    for (let i = 0; i < base64.length; i += chunkSize) {
      const chunk = base64.slice(i, i + chunkSize)
      const isLast = i + chunkSize >= base64.length
      const m = isLast ? 0 : 1 // m=1 means more chunks coming

      if (i === 0) {
        // First chunk includes image parameters
        const params = [`a=T`, `f=100`, `m=${m}`]
        if (width) params.push(`c=${width}`)
        if (height) params.push(`r=${height}`)
        chunks.push(`\x1b_G${params.join(",")};${chunk}\x1b\\`)
      } else {
        chunks.push(`\x1b_Gm=${m};${chunk}\x1b\\`)
      }
    }

    return chunks.join("")
  }

  /**
   * Render using pre-generated Sixel data
   */
  function renderSixel(sixelData: string): string {
    return sixelData
  }

  /**
   * Load and render logo image
   */
  export function renderLogo(options?: { width?: number; height?: number }): string | null {
    const protocol = detectProtocol()
    
    if (protocol === "none") {
      return null // Caller should use ASCII fallback
    }

    try {
      const assetsDir = path.join(__dirname, "..", "assets")
      
      if (protocol === "sixel") {
        const sixelPath = path.join(assetsDir, "cli-logo.sixel")
        if (fs.existsSync(sixelPath)) {
          const sixelData = fs.readFileSync(sixelPath, "utf-8")
          return renderSixel(sixelData)
        }
      }

      const pngPath = path.join(assetsDir, "cli-logo.png")
      if (!fs.existsSync(pngPath)) {
        return null
      }

      const imageData = fs.readFileSync(pngPath)

      switch (protocol) {
        case "iterm":
          return renderIterm(imageData, options?.width, options?.height)
        case "kitty":
          return renderKitty(imageData, options?.width, options?.height)
        default:
          return null
      }
    } catch {
      return null
    }
  }

  /**
   * Check if terminal supports inline images
   */
  export function isSupported(): boolean {
    return detectProtocol() !== "none"
  }
}
