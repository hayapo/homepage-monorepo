import { Style } from "hono/css";
import { jsxRenderer } from "hono/jsx-renderer";
import { Link, Script } from "honox/server";
import { Header } from "../components/Header/$Header";
import styles from "/app/styles/index.css?url";

export default jsxRenderer(({ children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>hayapo.dev</title>
        <link rel="icon" href="/favicon.ico" />
        {/*<script src="/app/initTheme.ts" />*/}
        <Script src="/app/client.ts" async />
        <Style />
        {/*<Link href="/app/styles/index.css" rel="stylesheet" />*/}
        {/* TODO: build時にスタイルが読み込まれなくなってしまったので対応する*/}
        {import.meta.env.PROD ? (
          <link href="/styles/index.css" rel="stylesheet" />
        ) : (
          <Link href={styles} rel="stylesheet" />
        )}
        {import.meta.env.PROD ? <script src="/static/initTheme.js" /> : <script src="/app/initTheme.ts" />}
      </head>
      {/*
			TODO:
				メディアクエリ周りをいい感じにする。
				スクリーンサイズに合わせて header と main の width を三段階くらいで調整したい
			*/}
      <body className="mx-4 bg-background text-gray-12 h-svh">
        <Header />
        <main class="max-w-(--max-width) mx-auto">{children}</main>
      </body>
    </html>
  );
});
