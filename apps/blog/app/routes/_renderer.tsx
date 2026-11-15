import { Style } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { HasIslands, Link, Script } from "honox/server";
import { Footer } from "../components/Footer/Footer";
import { Header } from "../islands/Header";
import { blogUrl } from "../lib/url";

export default jsxRenderer(({ children }) => {
	return (
		<html lang="ja">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>hayapo.dev</title>
				<meta name="author" content="hayapo" />
				<link rel="icon" href={blogUrl("/favicon.ico")} />
				<script
					src={blogUrl(
						import.meta.env.PROD ? "/static/initTheme.js" : "/app/initTheme.ts",
					)}
				/>
				{import.meta.env.PROD ? (
					<HasIslands>
						<Script src={blogUrl("/static/client.js")} async />
					</HasIslands>
				) : (
					<Script src={blogUrl("/app/client.ts")} async />
				)}
				<Style />
				<Link
					href={
						import.meta.env.PROD
							? "/app/styles/index.css"
							: blogUrl("/app/styles/index.css")
					}
					rel="stylesheet"
				/>
			</head>
			{/*
			TODO:
				メディアクエリ周りをいい感じにする。
				スクリーンサイズに合わせて header と main の width を三段階くらいで調整したい
			*/}
			<body>
				<div className="flex min-h-svh flex-col bg-background text-primary font-mono">
					<Header />
					<div aria-hidden="true" class="col-span-12 h-(--header-height)" />
					<main class="min-w-0 flex-1">{children}</main>
					<Footer />
				</div>
			</body>
		</html>
	);
});
