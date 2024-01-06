import { defineConfig } from "astro/config"
import starlight from "@astrojs/starlight"
import config from "./config"
import yaml from "js-yaml"
import { readFileSync } from "fs"

const sitemap = yaml.load(readFileSync("sitemap.yaml"))

const parseSitenode = (sitenode, basePath = "") => {
  const items = []
  for (const [path, menu] of Object.entries(sitenode)) {
    if (menu?.md) items.push({ label: menu.label, link: `${basePath}/${path}` })
    else if (menu?.items)
      items.push({
        label: menu.label,
        items: parseSitenode(menu.items, `${basePath}/${path}`),
      })
  }
  return items
}

// https://astro.build/config
export default defineConfig({
  site: config.site,
  base: config.base,
  integrations: [
    starlight({
      title: "Kadre",
      logo: {
        src: "./src/assets/kadre.svg",
      },
      social: {
        github: "https://github.com/pierre-cm/kadre",
      },
      sidebar: parseSitenode(sitemap),
      components: {
        ThemeSelect: "./src/components/SwitchDarkmode.astro",
        Pagination: "./src/components/Pagination.astro",
      },
      customCss: ["./src/styles/custom.css"],
    }),
  ],
})
