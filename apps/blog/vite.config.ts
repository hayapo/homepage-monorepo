import { fileURLToPath } from "node:url";
import build from "@hono/vite-build/cloudflare-workers";
import adapter from "@hono/vite-dev-server/cloudflare";
import ssg from "@hono/vite-ssg";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import honox from "honox/vite";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import remarkBreaks from "remark-breaks";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkRehype from "remark-rehype";
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "node:path";
import fs from "node:fs";

const entry = "./app/server.ts";
const root = fileURLToPath(new URL(".", import.meta.url));

const devImageProxy = () => ({
  name: "dev-image-proxy",
  apply: "serve" as const,
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      const match = req.url?.match(/^\/entries\/([^/]+)\/(.+\.(png|jpg|jpeg|gif|webp))$/);
      if (match) {
        const [, slug, file] = match;
        const filePath = path.resolve(root, `app/entries/${slug}/${file}`);
        if (fs.existsSync(filePath)) {
          res.end(fs.readFileSync(filePath));
          return;
        }
      }
      next();
    });
  },
});

export default defineConfig({
  root,
  build: {
    modulePreload: {
      polyfill: true,
    },
    assetsDir: "static",
    emptyOutDir: false,
    ssrEmitAssets: true,
    rollupOptions: {
      input: ["./app/styles/index.css", "./app/initTheme.ts"],
      output: {
        entryFileNames: "static/[name].js",
        assetFileNames: (assetsInfo) => {
          if (assetsInfo.name === "index.css") return "styles/index.css";
          if (assetsInfo.name === "initTheme.ts") return "static/initTheme.js";
          return assetsInfo.name ?? "";
        },
      },
    },
  },
  plugins: [
    devImageProxy(),
    honox({
      devServer: { adapter },
      client: { input: ["/app/client.ts", "/app/styles/index.css"] },
    }),
    ssg({ entry }),
    viteStaticCopy({
      targets: [
        {
          src: [
            "./app/entries/**/*.png",
            "./app/entries/**/*.jpg",
            "./app/entries/**/*.jpeg",
            "./app/entries/**/*.webp",
          ],
          dest: "entries",
          rename: { stripBase: 2 }, // app/entries/ の2階層を除去
          overwrite: false,
        },
        {
          src: ["./app/initTheme.ts"],
          dest: "static",
          rename: (_fileName: string, _fileExtension: string, fullPath: string) => {
            const destPath = normalizePath(path.relative(__dirname, fullPath).replace(/^app\//, ""));
            return destPath;
          },
          overwrite: false,
        },
      ],
    }),
    mdx({
      jsxImportSource: "hono/jsx",
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkBreaks, remarkRehype, remarkGfm],
      rehypePlugins: [rehypeStringify, [rehypePrettyCode, { theme: "dark-plus" }]],
    }),
    tailwindcss(),
    build(),
  ],
});
