import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { TanStackRouterVite } from "@tanstack/router-plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite-plus"

export default defineConfig({
  fmt: {
    semi: false,
  },
  lint: {
    ignorePatterns: [
      ".nitro/**",
      ".output/**",
      ".tanstack/**",
      ".wrangler/**",
      "src/components/ui/**",
      "src/hooks/use-mobile.ts",
      "src/route-tree.gen.ts",
    ],
  },
  test: {
    passWithNoTests: true,
  },
  resolve: { alias: { "@": resolve(__dirname, "./src") } },
  plugins: [
    TanStackRouterVite({
      generatedRouteTree: "./src/route-tree.gen.ts",
    }),
    viteReact(),
    tailwindcss(),
  ],
})
