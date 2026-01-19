#!/usr/bin/env bun
/**
 * LOGAN - Easy Publish Script
 * 
 * This script builds and publishes LOGAN to npm.
 * 
 * Usage:
 *   # First time / patch release (1.0.0 -> 1.0.1)
 *   OPENCODE_VERSION=1.0.0 bun run script/publish-logan.ts
 * 
 *   # Minor release (1.0.x -> 1.1.0)  
 *   OPENCODE_BUMP=minor bun run script/publish-logan.ts
 * 
 *   # Major release (1.x.x -> 2.0.0)
 *   OPENCODE_BUMP=major bun run script/publish-logan.ts
 * 
 * Prerequisites:
 *   1. npm login (run `npm login` first)
 *   2. bun installed
 */

import { $ } from "bun"
import { fileURLToPath } from "url"
import path from "path"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     🐺 LOGAN - Publishing to npm                              ║
║     Your Personal AI Coding Agent                             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`)

// Check if logged into npm
try {
  const whoami = await $`npm whoami`.text()
  console.log(`✓ Logged in to npm as: ${whoami.trim()}`)
} catch {
  console.error(`
❌ You are not logged in to npm!

Run this command first:
  npm login

Then run this script again.
`)
  process.exit(1)
}

// Set channel to latest for release
process.env.OPENCODE_CHANNEL = process.env.OPENCODE_CHANNEL || "latest"

console.log(`\n📦 Building LOGAN for all platforms...\n`)

// Run the main publish script
await import("./publish.ts")

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║     ✅ LOGAN published successfully!                          ║
║                                                               ║
║     Install with:                                             ║
║       npm install -g logan-ai                                 ║
║       bun add -g logan-ai                                     ║
║       npx logan-ai                                            ║
║                                                               ║
║     Run with:                                                 ║
║       logan                                                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`)
