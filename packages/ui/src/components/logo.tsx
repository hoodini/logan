/**
 * Logan AI Logo Components
 * 
 * Part of Logan AI by Yuval Avidani (YUV.AI)
 * A modified fork of OpenCode
 */

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path data-slot="logo-logo-mark-shadow" d="M12 16H4V8H12V16Z" fill="var(--icon-weak-base)" />
      <path data-slot="logo-logo-mark-o" d="M12 4H4V16H12V4ZM16 20H0V0H16V20Z" fill="var(--icon-strong-base)" />
    </svg>
  )
}

export const Splash = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M60 80H20V40H60V80Z" fill="var(--icon-base)" />
      <path d="M60 20H20V80H60V20ZM80 100H0V0H80V100Z" fill="var(--icon-strong-base)" />
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 42"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
      data-component="logan-logo"
    >
      <g>
        {/* L */}
        <path d="M6 6V30H24V36H0V6H6Z" fill="var(--icon-strong-base)" />
        {/* O */}
        <path d="M48 30H30V18H48V30Z" fill="var(--icon-weak-base)" />
        <path d="M48 12H30V30H48V12ZM54 36H24V6H54V36Z" fill="var(--icon-strong-base)" />
        {/* G */}
        <path d="M84 24V30H72V24H84Z" fill="var(--icon-weak-base)" />
        <path d="M84 24H66V30H84V36H60V6H84V12H66V24H84Z" fill="var(--icon-strong-base)" />
        {/* A */}
        <path d="M108 30H96V24H108V30Z" fill="var(--icon-weak-base)" />
        <path d="M108 12H96V30H90V6H108V12ZM114 36H108V12H114V36ZM114 24H96V18H114V24Z" fill="var(--icon-strong-base)" />
        {/* N */}
        <path d="M138 30H126V18H138V30Z" fill="var(--icon-weak-base)" />
        <path d="M138 12H126V36H120V6H138V12ZM144 36H138V12H144V36Z" fill="var(--icon-strong-base)" />
        {/* AI dot */}
        <circle cx="165" cy="21" r="12" fill="var(--icon-interactive-base)" />
        <text x="165" y="27" text-anchor="middle" font-size="14" font-weight="bold" fill="var(--text-inverse-base)">AI</text>
      </g>
    </svg>
  )
}

export const LoganBrand = (props: { class?: string; showSubtitle?: boolean }) => {
  return (
    <div classList={{ "flex flex-col items-center gap-1": true, [props.class ?? ""]: !!props.class }}>
      <Logo class="h-8" />
      <Show when={props.showSubtitle}>
        <span class="text-10-regular text-text-weak">
          by <a href="https://yuv.ai" target="_blank" rel="noopener noreferrer" class="text-text-interactive-base hover:underline">Yuval Avidani (YUV.AI)</a>
        </span>
      </Show>
    </div>
  )
}

import { Show } from "solid-js"
