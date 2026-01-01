---
description: 'Webサイトのルートを探索してCLAUDE.SITEMAP.mdにサイトマップを生成する'
---

# サイトマップの生成

コードベースからWebサイトのルート（URL）を探索し、`CLAUDE.md` の `## Sitemap` セクションに記録する。

## 前提

- Webサイト/Webアプリのリポジトリでない場合は作業を中止し、その旨を伝える
- `## Sitemap` セクションがなければ追加する
- 既存のセクションがある場合は内容を上書き更新

## ワークフロー

1. **判定**: Webサイト関連のリポジトリか確認（フレームワーク、ルーティング設定の有無）
2. **探索**: ルーティング設定、pagesディレクトリ、routerの定義などからURLを抽出
3. **生成**: CLAUDE.md の `## Sitemap` セクションに箇条書きで出力

## 探索対象

- Next.js: `app/`, `pages/` ディレクトリ
- React Router: `createBrowserRouter`, `<Route>` の定義
- Vue Router: `router/index.ts` など
- その他フレームワーク固有のルーティング設定
