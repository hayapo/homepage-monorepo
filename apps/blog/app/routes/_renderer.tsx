import { Style } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import { Header } from "../components/Header/$Header";

export default jsxRenderer(({ children }) => {
	return (
		<html lang="ja">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link rel="icon" href="/favicon.ico" />
				<script src="/app/initTheme.ts" />
				<Script src="/app/client.ts" async />
				<Style />
				<Link href="/app/styles/index.css" rel="stylesheet" />
			</head>
			{/*
			TODO:
				メディアクエリ周りをいい感じにする。
				スクリーンサイズに合わせて header と main の width を三段階くらいで調整したい
			*/}
			<body class="mx-4 bg-background text-gray-12 h-svh">
				<Header />
				<main class="max-w-3xl mx-auto">{children}</main>
			</body>
		</html>
	);
});
