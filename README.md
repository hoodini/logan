<p align="center">
  <a href="https://yuv.ai">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="Logan AI logo">
    </picture>
  </a>
</p>
<p align="center"><strong>Logan AI</strong> — The Personal AI Coding Assistant of Yuval Avidani</p>
<p align="center">
  <a href="https://yuv.ai"><img alt="YUV.AI" src="https://img.shields.io/badge/YUV.AI-Website-blue?style=flat-square" /></a>
  <a href="https://linktr.ee/yuvai"><img alt="Links" src="https://img.shields.io/badge/Linktree-@yuvai-green?style=flat-square" /></a>
  <a href="https://x.com/yuvalav"><img alt="X/Twitter" src="https://img.shields.io/badge/X-@yuvalav-black?style=flat-square" /></a>
  <a href="https://youtube.com/@yuv-ai"><img alt="YouTube" src="https://img.shields.io/badge/YouTube-@yuv--ai-red?style=flat-square" /></a>
  <a href="https://instagram.com/yuval_770"><img alt="Instagram" src="https://img.shields.io/badge/Instagram-@yuval__770-purple?style=flat-square" /></a>
</p>

---

> **⚠️ NOTICE:** This project is a modified fork of [OpenCode](https://github.com/anomalyco/opencode), 
> an open-source AI coding agent. Logan AI has been redesigned and rebranded by **Yuval Avidani** 
> as a personal AI assistant. Full credit to the original OpenCode team for their excellent work.

---

[![Logan AI Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://yuv.ai)

## About Logan AI

**Logan AI** is your personal AI coding assistant, built on the powerful foundation of OpenCode. 
This project has been customized and enhanced by [Yuval Avidani](https://yuv.ai) to serve as a 
personalized development companion.

### Who is Yuval Avidani?

Yuval Avidani is a developer and AI enthusiast building tools at the intersection of artificial 
intelligence and software development. Logan AI represents his vision for a personal, customizable 
AI coding assistant.

**Connect with Yuval:**
- 🌐 Website: [yuv.ai](https://yuv.ai)
- 🔗 All Links: [linktr.ee/yuvai](https://linktr.ee/yuvai)
- 🐦 X/Twitter: [@yuvalav](https://x.com/yuvalav)
- 📺 YouTube: [@yuv-ai](https://youtube.com/@yuv-ai)
- 📸 Instagram: [@yuval_770](https://instagram.com/yuval_770)

---

## Installation

```bash
# Clone the repository
git clone https://github.com/hoodini/logan.git
cd logan

# Install dependencies
bun install

# Run Logan AI
bun dev
```

### Desktop App (BETA)

Logan AI is also available as a desktop application.

| Platform              | Download                              |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `logan-desktop-darwin-aarch64.dmg`    |
| macOS (Intel)         | `logan-desktop-darwin-x64.dmg`        |
| Windows               | `logan-desktop-windows-x64.exe`       |
| Linux                 | `.deb`, `.rpm`, or AppImage           |

---

## Agents

Logan AI includes built-in agents you can switch between with the `Tab` key.

- **build** - Default, full access agent for development work
- **plan** - Read-only agent for analysis and code exploration
  - Denies file edits by default
  - Asks permission before running bash commands
  - Ideal for exploring unfamiliar codebases or planning changes

Also included is a **general** subagent for complex searches and multistep tasks.
This is used internally and can be invoked using `@general` in messages.

---

## Documentation

For configuration and usage documentation, see the [docs folder](./packages/opencode/docs/).

### System Prompt Customization

Logan AI allows full customization of the coding agent's system prompt. See the 
[System Prompt Architecture](./packages/opencode/docs/SYSTEM_PROMPT_ARCHITECTURE.md) guide.

---

## Credits & Attribution

This project is based on **[OpenCode](https://github.com/anomalyco/opencode)**, an excellent 
open-source AI coding agent. Full credit and gratitude to the original OpenCode team.

**Modified and Rebranded by:**
- **Yuval Avidani** — [yuv.ai](https://yuv.ai)

Logan AI is released under the MIT License, maintaining the same open-source spirit as the 
original OpenCode project.

---

## License

MIT License — See [LICENSE](./LICENSE) for details.

Original work: Copyright (c) 2025 OpenCode  
Modifications: Copyright (c) 2025-2026 Yuval Avidani (YUV.AI)
