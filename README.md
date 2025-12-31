# Homepage Monorepo

複数のサイト/アプリを 1 つの Turborepo で管理するためのモノレポです。Vite を中心に、ブログは Hono + Honox + MDX で構成し、Cloudflare Workers にデプロイします。

## 構成

### Apps

- `apps/blog` - ブログ本体。HonoX + Vite で構成されていて、mdxで記事を執筆する。
- `apps/web` - メインの Web サイト（Vite）
- `apps/docs` - ドキュメント/サンドボックス（Vite）

### Packages

- `packages/ui` - 共有 UI コンポーネント
- `packages/biome-config` - Biome 設定の共通化
- `packages/typescript-config` - TypeScript 設定の共通化

## 事前準備

- Node.js
- pnpm `8.15.6`

## セットアップ

```sh
pnpm install
```

## よく使うコマンド

```sh
pnpm dev     # すべてのアプリを開発モードで起動
pnpm build   # 全体ビルド
pnpm lint    # lint
pnpm check   # Biome check
pnpm format  # Biome fix
```

特定のアプリのみ起動する場合:

```sh
pnpm --filter blog dev
pnpm --filter web dev
pnpm --filter docs dev
```

## メモ

- ルートのコマンドは Turborepo 経由で各パッケージの同名タスクを実行します。
- それぞれのアプリ固有の詳細は `apps/*` 内の設定や `package.json` を参照してください。
