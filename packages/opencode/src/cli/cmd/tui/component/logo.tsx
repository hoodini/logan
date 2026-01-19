import { TextAttributes, RGBA } from "@opentui/core"
import { For, type JSX } from "solid-js"
import { useTheme, tint } from "@tui/context/theme"

// Shadow markers (rendered chars in parens):
// _ = full shadow cell (space with bg=shadow)
// ^ = letter top, shadow bottom (▀ with fg=letter, bg=shadow)
// ~ = shadow top only (▀ with fg=shadow)
const SHADOW_MARKER = /[_^~]/

// LOGAN logo with color markers: O=orange, Y=yellow, P=pink, U=purple, C=cyan
const LOGO_LEFT = [`█      `, `█      `, `█▄▄▄▄  `]
const LOGO_RIGHT = [`█▀▀█ █▀▀▀ █▀▀█ █▀▀▄`, `█__█ █__█ █▀▀█ █__█`, `▀▀▀▀ ▀▀▀▀ ▀~~▀ ▀~~▀`]

// Color definitions for rainbow gradient
const COLORS = {
  orange: { r: 255, g: 136, b: 0, a: 255 } as RGBA,
  yellow: { r: 255, g: 200, b: 0, a: 255 } as RGBA,
  pink: { r: 255, g: 100, b: 150, a: 255 } as RGBA,
  purple: { r: 150, g: 100, b: 255, a: 255 } as RGBA,
  cyan: { r: 0, g: 200, b: 255, a: 255 } as RGBA,
}

// Phoenix ASCII art
const PHOENIX = [
  "    .*. ",
  "  .' * '.",
  " /  *@*  \\",
  ": *o@o* :",
  " \\ '*' /",
  "  '._.'",
]

export function Logo() {
  const { theme } = useTheme()

  const renderLine = (line: string, fg: RGBA, bold: boolean): JSX.Element[] => {
    const shadow = tint(theme.background, fg, 0.25)
    const attrs = bold ? TextAttributes.BOLD : undefined
    const elements: JSX.Element[] = []
    let i = 0

    while (i < line.length) {
      const rest = line.slice(i)
      const markerIndex = rest.search(SHADOW_MARKER)

      if (markerIndex === -1) {
        elements.push(
          <text fg={fg} attributes={attrs} selectable={false}>
            {rest}
          </text>,
        )
        break
      }

      if (markerIndex > 0) {
        elements.push(
          <text fg={fg} attributes={attrs} selectable={false}>
            {rest.slice(0, markerIndex)}
          </text>,
        )
      }

      const marker = rest[markerIndex]
      switch (marker) {
        case "_":
          elements.push(
            <text fg={fg} bg={shadow} attributes={attrs} selectable={false}>
              {" "}
            </text>,
          )
          break
        case "^":
          elements.push(
            <text fg={fg} bg={shadow} attributes={attrs} selectable={false}>
              ▀
            </text>,
          )
          break
        case "~":
          elements.push(
            <text fg={shadow} attributes={attrs} selectable={false}>
              ▀
            </text>,
          )
          break
      }

      i += markerIndex + 1
    }

    return elements
  }

  const renderPhoenixLine = (line: string): JSX.Element[] => {
    const elements: JSX.Element[] = []
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      // Gradient from orange at top to cyan at bottom
      const colors = [COLORS.orange, COLORS.yellow, COLORS.pink, COLORS.purple, COLORS.cyan]
      const colorIndex = Math.min(Math.floor(i / 2), colors.length - 1)
      elements.push(
        <text fg={colors[colorIndex]} selectable={false}>
          {char}
        </text>,
      )
    }
    return elements
  }

  return (
    <box flexDirection="column">
      <box flexDirection="row" gap={2}>
        {/* LOGAN Logo */}
        <box>
          <For each={LOGO_LEFT}>
            {(line, index) => (
              <box flexDirection="row" gap={1}>
                <box flexDirection="row">{renderLine(line, COLORS.orange, true)}</box>
                <box flexDirection="row">{renderLine(LOGO_RIGHT[index()], [COLORS.yellow, COLORS.pink, COLORS.purple, COLORS.cyan][index() % 4], true)}</box>
              </box>
            )}
          </For>
        </box>
        {/* Phoenix */}
        <box>
          <For each={PHOENIX}>
            {(line, index) => {
              const colors = [COLORS.orange, COLORS.yellow, COLORS.pink, COLORS.purple, COLORS.cyan, COLORS.purple]
              return (
                <box flexDirection="row">
                  <text fg={colors[index()]} selectable={false}>{line}</text>
                </box>
              )
            }}
          </For>
        </box>
      </box>
      {/* Branding text */}
      <box paddingTop={1}>
        <text fg={theme.textMuted} selectable={false}>Logan is your advanced AI code assistant. Describe a task to get started.</text>
      </box>
      <box>
        <text fg={theme.textMuted} selectable={false}>by Yuval Avidani, AI Builder & Speaker, YUV.AI</text>
      </box>
    </box>
  )
}
