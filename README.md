# サンドボックス

このリポジトリは[TanStack Start](https://tanstack.com/start/latest/docs/framework/react/overview)を用いたテンプレートです。

## 開発

```bash
vp install
vp dev
```

UIライブラリは以下で最新に保つ事ができます。

```
make update
```

## 検証

```bash
vp lint
vp fmt
vp test
vp run check
vp build
```

## 機能

### SPA

開発する製品の内容が管理画面などSPAの適している場合は、[vite.config.ts](vite.config.ts)の `spa.enable` の設定を `true` にします。

```
spa: { enabled: true },
```

### ページ

サンプルとして以下のページが存在します。

- `/` - ホーム
- `/canvas` - Canvasのサンプル
- `/error` - エラーのページの確認
