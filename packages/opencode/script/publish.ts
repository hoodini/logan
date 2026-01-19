#!/usr/bin/env bun
import { $ } from "bun"
import pkg from "../package.json"
import { Script } from "@opencode-ai/script"
import { fileURLToPath } from "url"

const dir = fileURLToPath(new URL("..", import.meta.url))
process.chdir(dir)

// Use logan as the binary name
const binaryName = "logan"
const packageName = "logan-ai"

const { binaries } = await import("./build.ts")
{
  const name = `${binaryName}-${process.platform}-${process.arch}`
  console.log(`smoke test: running dist/${name}/bin/${binaryName} --version`)
  await $`./dist/${name}/bin/${binaryName} --version`
}

await $`mkdir -p ./dist/${packageName}`
await $`cp -r ./bin ./dist/${packageName}/bin`
await $`cp ./script/postinstall.mjs ./dist/${packageName}/postinstall.mjs`

await Bun.file(`./dist/${packageName}/package.json`).write(
  JSON.stringify(
    {
      name: packageName,
      description: "LOGAN - Your Personal AI Coding Agent. Open-source, multi-provider, runs in your terminal.",
      author: "Yuval Avidani <yuval@yuv.ai> (https://yuv.ai)",
      homepage: "https://github.com/hoodini/logan",
      repository: {
        type: "git",
        url: "git+https://github.com/hoodini/logan.git"
      },
      license: "MIT",
      keywords: ["ai", "coding-assistant", "cli", "terminal", "llm", "claude", "openai", "gpt", "copilot", "agent"],
      bin: {
        [binaryName]: `./bin/opencode`,
      },
      scripts: {
        postinstall: "bun ./postinstall.mjs || node ./postinstall.mjs",
      },
      version: Script.version,
      optionalDependencies: binaries,
    },
    null,
    2,
  ),
)

const tags = [Script.channel]

const tasks = Object.entries(binaries).map(async ([name]) => {
  if (process.platform !== "win32") {
    await $`chmod -R 755 .`.cwd(`./dist/${name}`)
  }
  await $`bun pm pack`.cwd(`./dist/${name}`)
  for (const tag of tags) {
    await $`npm publish *.tgz --access public --tag ${tag}`.cwd(`./dist/${name}`)
  }
})
await Promise.all(tasks)
for (const tag of tags) {
  await $`cd ./dist/${packageName} && bun pm pack && npm publish *.tgz --access public --tag ${tag}`
}

if (!Script.preview) {
  // Create archives for GitHub release
  for (const key of Object.keys(binaries)) {
    if (key.includes("linux")) {
      await $`tar -czf ../../${key}.tar.gz *`.cwd(`dist/${key}/bin`)
    } else {
      await $`zip -r ../../${key}.zip *`.cwd(`dist/${key}/bin`)
    }
  }

  // Docker publishing (optional - update image name for your registry)
  const image = "ghcr.io/hoodini/logan"
  const platforms = "linux/amd64,linux/arm64"
  const dockerTags = [`${image}:${Script.version}`, `${image}:latest`]
  const tagFlags = dockerTags.flatMap((t) => ["-t", t])
  // Uncomment to enable Docker publishing:
  // await $`docker buildx build --platform ${platforms} ${tagFlags} --push .`
}
