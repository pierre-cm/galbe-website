import yaml from "js-yaml"
import { resolve, extname } from "path"
import { watch } from "fs"
import config from "../config"
import { buildSitemap } from "./fetch"

const isGit = extname(config?.repository) === ".git"
const sitemapStr = await Bun.file("sitemap.yaml").text()
const sitemap = yaml.load(sitemapStr) as Record<string, any>

const srcDir = resolve(import.meta.dir, "..", config?.repository, "docs")
if (!isGit) {
  watch(srcDir, (event, filename) => {
    console.log(`Detected ${event} in ${resolve(srcDir, filename)}`)
    buildSitemap(sitemap, resolve("src/content/docs"), [
      resolve(srcDir, filename),
    ])
  })
}

Bun.spawn({
  cmd: ["bunx", "astro", "dev"],
  stdout: "inherit",
})

export {}
