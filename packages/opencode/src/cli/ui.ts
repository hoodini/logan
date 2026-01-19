import z from "zod"
import { EOL } from "os"
import { NamedError } from "@opencode-ai/util/error"
import { TerminalImage } from "./terminal-image"

export namespace UI {
  // Rainbow colors: Orange -> Yellow -> Pink -> Purple -> Cyan
  const C = {
    ORANGE: "\x1b[38;5;208m",
    YELLOW: "\x1b[38;5;220m",
    PINK: "\x1b[38;5;205m",
    PURPLE: "\x1b[38;5;135m",
    CYAN: "\x1b[38;5;51m",
    RESET: "\x1b[0m",
    DIM: "\x1b[90m",
  }

  // Phoenix ASCII art (fallback when image not supported)
  const PHOENIX = [
    `${C.ORANGE}      .${C.YELLOW}*${C.ORANGE}.       `,
    `${C.ORANGE}    ${C.YELLOW}.' ${C.PINK}*${C.YELLOW} '.    `,
    `${C.YELLOW}   /  ${C.PINK}*${C.PURPLE}@${C.PINK}*  \\   `,
    `${C.PINK}  : ${C.PURPLE}*${C.CYAN}o${C.PURPLE}@${C.CYAN}o${C.PURPLE}* :  `,
    `${C.PURPLE}   \\ ${C.CYAN}'*'${C.PURPLE} /   `,
    `${C.CYAN}    '._.'    `,
    `${C.RESET}`,
  ]

  // Colored LOGAN logo (fallback when image not supported)
  const LOGO_TEXT = [
    `${C.ORANGE}█     ${C.YELLOW}█▀▀█ ${C.PINK}█▀▀▀ ${C.PURPLE}█▀▀█ ${C.CYAN}█▀▀▄${C.RESET}`,
    `${C.ORANGE}█     ${C.YELLOW}█░░█ ${C.PINK}█░░█ ${C.PURPLE}█▀▀█ ${C.CYAN}█░░█${C.RESET}`,
    `${C.ORANGE}█▄▄▄▄ ${C.YELLOW}▀▀▀▀ ${C.PINK}▀▀▀▀ ${C.PURPLE}▀░░▀ ${C.CYAN}▀░░▀${C.RESET}`,
  ]

  export const CancelledError = NamedError.create("UICancelledError", z.void())

  export const Style = {
    TEXT_HIGHLIGHT: "\x1b[96m",
    TEXT_HIGHLIGHT_BOLD: "\x1b[96m\x1b[1m",
    TEXT_DIM: "\x1b[90m",
    TEXT_DIM_BOLD: "\x1b[90m\x1b[1m",
    TEXT_NORMAL: "\x1b[0m",
    TEXT_NORMAL_BOLD: "\x1b[1m",
    TEXT_WARNING: "\x1b[93m",
    TEXT_WARNING_BOLD: "\x1b[93m\x1b[1m",
    TEXT_DANGER: "\x1b[91m",
    TEXT_DANGER_BOLD: "\x1b[91m\x1b[1m",
    TEXT_SUCCESS: "\x1b[92m",
    TEXT_SUCCESS_BOLD: "\x1b[92m\x1b[1m",
    TEXT_INFO: "\x1b[94m",
    TEXT_INFO_BOLD: "\x1b[94m\x1b[1m",
  }

  export function println(...message: string[]) {
    print(...message)
    Bun.stderr.write(EOL)
  }

  export function print(...message: string[]) {
    blank = false
    Bun.stderr.write(message.join(" "))
  }

  let blank = false
  export function empty() {
    if (blank) return
    println("" + Style.TEXT_NORMAL)
    blank = true
  }

  export function logo(pad?: string) {
    // Try to render the actual image first (works in iTerm2, Kitty, WezTerm, Sixel terminals)
    const imageOutput = TerminalImage.renderLogo({ width: 60 })
    if (imageOutput) {
      const result = []
      if (pad) result.push(pad)
      result.push(imageOutput)
      result.push(EOL + EOL)
      result.push(C.DIM + "  Logan is your advanced AI code assistant." + C.RESET + EOL)
      result.push(C.DIM + "  by Yuval Avidani, AI Builder & Speaker, YUV.AI" + C.RESET + EOL)
      return result.join("").trimEnd()
    }

    // Fallback to ASCII art for unsupported terminals
    const result = []
    const maxRows = Math.max(LOGO_TEXT.length, PHOENIX.length)
    
    for (let i = 0; i < maxRows; i++) {
      if (pad) result.push(pad)
      if (i < LOGO_TEXT.length) {
        result.push(LOGO_TEXT[i])
      } else {
        result.push("                              ")
      }
      result.push("  ")
      if (i < PHOENIX.length) {
        result.push(PHOENIX[i])
      }
      result.push(EOL)
    }
    
    // Add branding
    result.push(EOL)
    result.push(C.DIM + "  Logan is your advanced AI code assistant." + C.RESET + EOL)
    result.push(C.DIM + "  by Yuval Avidani, AI Builder & Speaker, YUV.AI" + C.RESET + EOL)
    
    return result.join("").trimEnd()
  }

  export async function input(prompt: string): Promise<string> {
    const readline = require("readline")
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    return new Promise((resolve) => {
      rl.question(prompt, (answer: string) => {
        rl.close()
        resolve(answer.trim())
      })
    })
  }

  export function error(message: string) {
    println(Style.TEXT_DANGER_BOLD + "Error: " + Style.TEXT_NORMAL + message)
  }

  export function markdown(text: string): string {
    return text
  }
}
