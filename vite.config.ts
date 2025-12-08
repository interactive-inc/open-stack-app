import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  resolve: { alias: { "@": resolve(__dirname, "./src") } },
  plugins: [
    TanStackRouterVite({
      generatedRouteTree: "./src/route-tree.gen.ts",
    }),
    viteReact(),
    tailwindcss(),
  ],
})
