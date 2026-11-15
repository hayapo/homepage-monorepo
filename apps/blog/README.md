# ブログの開発と配信

ブログは HonoX + Vite + MDX で構成し、記事を静的生成して Cloudflare Workers に配信します。

## ベースパス

ブログ内の `apps/blog/config.ts` で指定します。

```ts
export const BLOG_BASE_PATH = "/blog";
```

`/notes` や `/` も指定できます。環境変数による上書きは行いません。変更後は開発サーバーを再起動するか、ブログを再ビルドしてください。Turborepoもこの設定をキャッシュの依存対象として扱います。

Vite の `base` → `import.meta.env.BASE_URL` → `app/lib/url.ts` の順で参照します。ブログ内のリンクには `blogUrl()` を使います。記事内の相対画像 URL はそのまま使えます。

ホームページはブログのベースパスを参照しません。本番のWorkerへの振り分けとブログトップのリダイレクトはCloudflare側で管理します。

## 開発

リポジトリルートで実行します。

```sh
pnpm run dev
# ブログだけ起動する場合
pnpm --filter blog run dev
```

起動ログに表示される `http://localhost:<port>/blog/` を開きます。ホームページとブログは別ポートです。開発用の同一ポートへのプロキシはありません。

## ビルドと検証

```sh
pnpm --filter blog run build
pnpm --filter blog exec wrangler dev
```

`wrangler dev` のローカル URL に `/blog/` を付けて確認します。生成HTML・CSS・JS・画像は `dist/public/<ベースパス>/`、Worker本体は `dist/index.js` に出力します。ビルド開始時に旧出力を消すため、ベースパスや記事の変更前の生成物は残りません。

公開ファイルの配置は `vite.config.ts` の `closeBundle` フックで、サーバービルド完了後に行います。クライアントビルドや開発サーバーでは実行しません。

## 本番配信

`hayapo.dev` がCloudflareで管理されていることを前提に、以下を設定します。

| 対象                | Cloudflareの設定                  | 処理                                        |
| ------------------- | --------------------------------- | ------------------------------------------- |
| `hayapo.dev`        | Custom Domain                     | homepage Workerへ配信                       |
| `hayapo.dev/blog/*` | Worker Route                      | blog Workerへ配信                           |
| `hayapo.dev/blog`   | Redirect Rules（Single Redirect） | `https://hayapo.dev/blog/`へ308リダイレクト |

Custom DomainとWorker Routeは各アプリの `wrangler.jsonc` に宣言してあり、デプロイ時にCloudflareへ反映されます。アプリ内でWorker間の振り分けは行いません。

Redirect RuleはCloudflareダッシュボードで `hayapo.dev` のルール作成画面から設定します。

- 条件（Custom filter expression）：`(http.host eq "hayapo.dev" and http.request.uri.path eq "/blog")`
- 転送先の種類：Static
- 転送先URL：`https://hayapo.dev/blog/`
- ステータスコード：308
- Preserve query string：有効

このRedirect Ruleは `wrangler deploy` では作成されないため、本番公開前にCloudflare側で設定してください。`/blog/`自体は条件に含まれず、リダイレクトループを防げます。

参考：[CloudflareのRedirect Rule作成手順](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/)

Cloudflareの設定はローカルには適用されません。開発中はブログのポートへ直接アクセスします。ブログのVite開発サーバーには、ローカルでの `/blog` → `/blog/` のリダイレクトを残しています。

```sh
pnpm --filter homepage run deploy
pnpm --filter blog run deploy
```

`apps/blog/config.ts` はCloudflareのRouteを自動変更しません。公開パスを変更する場合は `wrangler.jsonc` のRouteとCloudflareのRedirect Ruleも合わせて更新します。`/` に配置する場合は、ホームページとドメインを共有する現在の振り分けも見直してください。

Cloudflare Workers Buildsの監視対象には、各アプリに加え、共通パッケージ、lockfileを含めます。
