import fs from "node:fs";
import { cp, mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import build from "@hono/vite-build/cloudflare-workers";
import adapter from "@hono/vite-dev-server/cloudflare";
import ssg from "@hono/vite-ssg";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import honox, { devServerDefaultOptions } from "honox/vite";
import rehypeMdxToc from "rehype-mdx-toc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkBreaks from "remark-breaks";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkRehype from "remark-rehype";
import {
	defineConfig,
	type Manifest,
	type Plugin,
	type ResolvedConfig,
} from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { BLOG_BASE_PATH } from "./config";

const entry = "./app/server.ts";
const root = fileURLToPath(new URL(".", import.meta.url));

type RehypeNode = {
	type: string;
	tagName?: string;
	name?: string;
	properties?: Record<string, unknown>;
	attributes?: Array<{ type: string; name?: string; value?: unknown }>;
	children?: RehypeNode[];
};

const rehypeArticleLinks = () => (tree: RehypeNode) => {
	const addTargetToLinks = (node: RehypeNode) => {
		if (
			node.type === "element" &&
			node.tagName === "a" &&
			!(typeof node.properties?.href === "string" &&
				node.properties.href.startsWith("#"))
		) {
			node.properties = {
				...node.properties,
				target: "_blank",
				rel: ["noopener", "noreferrer"],
			};
		}
		if (
			(node.type === "mdxJsxTextElement" ||
				node.type === "mdxJsxFlowElement") &&
			node.name === "a"
		) {
			const attributes = node.attributes ?? [];
			const href = attributes.find(
				(attribute) =>
					attribute.type === "mdxJsxAttribute" &&
					attribute.name === "href",
			);
			if (typeof href?.value === "string" && href.value.startsWith("#")) {
				node.children?.forEach(addTargetToLinks);
				return;
			}
			for (const [name, value] of [
				["target", "_blank"],
				["rel", "noopener noreferrer"],
			] as const) {
				const existing = attributes.find(
					(attribute) =>
						attribute.type === "mdxJsxAttribute" &&
						attribute.name === name,
				);
				if (existing) existing.value = value;
				else attributes.push({ type: "mdxJsxAttribute", name, value });
			}
			node.attributes = attributes;
		}
		node.children?.forEach(addTargetToLinks);
	};

	addTargetToLinks(tree);
};

const devImageProxy = (base: string): Plugin => ({
	name: "dev-image-proxy",
	apply: "serve" as const,
	configureServer(server) {
		server.middlewares.use((req, res, next) => {
			const requestUrl = new URL(req.url ?? "/", "http://localhost");
			const pathname = requestUrl.pathname;
			if (base !== "/" && pathname === base.slice(0, -1)) {
				res.writeHead(308, { Location: `${base}${requestUrl.search}` });
				res.end();
				return;
			}
			const url = pathname.startsWith(base)
				? pathname.slice(base.length - 1)
				: pathname;
			const match = url?.match(
				/^\/entries\/([^/]+)\/([^/]+\.(png|jpg|jpeg|gif|webp|svg))$/,
			);
			if (match) {
				const [, slug, file] = match;
				const filePath = path.resolve(root, `app/entries/${slug}/${file}`);
				if (fs.existsSync(filePath)) {
					const extension = path.extname(filePath).slice(1);
					res.setHeader(
						"Content-Type",
						`image/${extension === "jpg" ? "jpeg" : extension === "svg" ? "svg+xml" : extension}`,
					);
					res.end(fs.readFileSync(filePath));
					return;
				}
			}
			next();
		});
	},
});

// Package the server build after SSG and the earlier client build have finished.
function prepareAssets(): Plugin {
	let config: ResolvedConfig;
	return {
		name: "blog-prepare-assets",
		apply: (_config, { command, mode }) =>
			command === "build" && mode !== "client",
		configResolved(resolved) {
			config = resolved;
		},
		async closeBundle() {
			const base = config.base.replace(/^\/+|\/+$/g, "");
			const outDir = path.resolve(config.root, config.build.outDir);
			const publicDir = path.join(outDir, "public");
			const destination = path.join(publicDir, base);
			await mkdir(destination, { recursive: true });

			// SSG HTML already includes the base path; client assets are relative to Vite's base.
			async function copyHtml(directory: string): Promise<void> {
				for (const entry of await readdir(directory, { withFileTypes: true })) {
					if (entry.name === "public" || entry.name.startsWith(".")) continue;
					const source = path.join(directory, entry.name);
					if (entry.isDirectory()) await copyHtml(source);
					else if (entry.name.endsWith(".html")) {
						const relative = path.relative(outDir, source);
						const target = path.join(
							publicDir,
							entry.name === "index.html"
								? relative
								: relative.replace(/\.html$/, "/index.html"),
						);
						await mkdir(path.dirname(target), { recursive: true });
						await cp(source, target);
					}
				}
			}
			await copyHtml(outDir);
			const manifest: Manifest = JSON.parse(
				await readFile(path.join(outDir, ".vite/manifest.json"), "utf8"),
			);
			const assets = new Set(
				Object.values(manifest).flatMap((entry) => [
					entry.file,
					...(entry.css ?? []),
					...(entry.assets ?? []),
				]),
			);
			for (const asset of assets) {
				const target = path.join(destination, asset);
				await mkdir(path.dirname(target), { recursive: true });
				await cp(path.join(outDir, asset), target);
			}
			if (config.publicDir)
				await cp(config.publicDir, destination, { recursive: true });
		},
	};
}

export default defineConfig(({ mode }) => {
	const rawBase = BLOG_BASE_PATH;
	if (!/^\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]*$/.test(rawBase)) {
		throw new Error(
			"config.ts: BLOG_BASE_PATH must be / or an absolute path such as /blog",
		);
	}
	const base = `${rawBase.replace(/\/$/, "")}/`;
	const basePath = base.replace(/\/$/, "");
	return {
		base,
		root,
		build: {
			modulePreload: {
				polyfill: true,
			},
			assetsDir: "static",
			emptyOutDir: mode === "client",
			ssrEmitAssets: true,
			rollupOptions: {
				output: {
					entryFileNames: "static/[name].js",
					assetFileNames: (assetsInfo) => {
						if (assetsInfo.name === "index.css") return "styles/index.css";
						if (assetsInfo.name === "initTheme.ts")
							return "static/initTheme.js";
						return assetsInfo.name ?? "";
					},
				},
			},
		},
		plugins: [
			devImageProxy(base),
			honox({
				devServer: {
					adapter,
					// Keep Vite's base without stripping it before Hono receives the request.
					base: undefined,
					exclude: [
						...devServerDefaultOptions.exclude,
						...(basePath === ""
							? []
							: [
									new RegExp(`^${basePath}/(?:@|node_modules/|app/.*\\.tsx?$)`),
								]),
						/\/favicon\.ico(?:\?|$)/,
					],
				},
				client: {
					input: [
						"/app/client.ts",
						"/app/styles/index.css",
						"/app/initTheme.ts",
					],
				},
			}),
			mode !== "client" && ssg({ entry }),
			mdx({
				jsxImportSource: "hono/jsx",
				remarkPlugins: [
					remarkFrontmatter,
					remarkMdxFrontmatter,
					remarkBreaks,
					remarkRehype,
					remarkGfm,
				],
				rehypePlugins: [
					rehypeSlug,
					[rehypeMdxToc, { name: "headings", skipDepth: [1] }],
					rehypeArticleLinks,
					rehypeStringify,
					[rehypePrettyCode, { theme: "dark-plus" }],
				],
			}),
			tailwindcss(),
			viteStaticCopy({
				targets: [
					{
						src: [
							"./app/entries/**/*.png",
							"./app/entries/**/*.jpg",
							"./app/entries/**/*.jpeg",
							"./app/entries/**/*.webp",
						],
						dest: path.join(
							"public",
							base.replace(/^\/+|\/+$/g, ""),
							"entries",
						),
						rename: { stripBase: 2 },
						overwrite: false,
					},
				],
			}),
			build(),
			prepareAssets(),
		],
	};
});
