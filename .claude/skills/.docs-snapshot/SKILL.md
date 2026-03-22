---
name: docs-snapshot
description: "Regenerate .docs/snapshot/ from codebase."
context: fork
---

# Snapshot再生成

`.docs/snapshot/`のファイルをコードから生成・更新する。

snapshot/は手で編集しない。常にコードから再生成できる。

## 基本方針

- ブランチの差分から影響範囲を特定し、関連する snapshot ファイルだけを再生成する
- サブエージェントで並列実行する
- 各ファイルは独立しているので全て同時に生成可能
- 対象の snapshot ファイルは丸ごと上書きする

## snapshotの種類

snapshot には2種類のファイルがある。

### 技術snapshot

コードの構造を反映する。ファイル構成は固定。

- features.md: 機能一覧と現在の状態（常に）
- user-flows.md: ユーザー導線（常に）
- architecture.md: システム構成（外部連携がある場合）
- sitemap.md: ページ一覧（ルートが多い場合）
- domain-model.md: エンティティと関係（ドメインが複雑な場合）
- api-schema.md: API仕様の要約（APIがある場合）
- components.md: UIコンポーネント一覧（コンポーネントが多い場合）

### 製品仕様snapshot

製品のルール・制約・ポリシーを体系化する。ファイル構成は固定せず、製品の特徴と規模に応じて動的に決定する。

情報源:
- `app/assets/*.md` — 利用規約、ガイド、NSFWポリシー、インボイス案内等
- `.docs/notes/` — 内部設計メモ、ポリシー検討、CS対応記録等
- `.docs/backlogs/` — 未実装機能の設計と背景
- `.docs/glossary.md` — 用語定義
- コードのドメインロジック — ステータス遷移、決済フロー、バリデーション等

目的: お問い合わせ対応や社内の仕様確認で、AIが完璧に回答できるレベルの資料を生成する。「ガイドにはこう書いてあるが実装はまだ」のような乖離も明記する。

## ワークフロー

### Phase 1: 対象の決定

以下の優先順位で対象を決定する:

- 「全て」と明示された場合: 全ファイルを更新する
- snapshot/ フォルダが空または存在しない場合: 全ファイルを更新する
- 上記以外: `git diff main...HEAD --name-only` でブランチの変更ファイルを取得し、影響する snapshot ファイルだけを更新する

技術snapshotの変更ファイル対応:

| 変更の種類 | 更新する snapshot |
|---|---|
| ルート定義・ページ追加削除 | sitemap.md, user-flows.md |
| API・エンドポイント変更 | api-schema.md |
| コンポーネント追加削除 | components.md |
| スキーマ・モデル変更 | domain-model.md |
| 機能追加・変更・削除 | features.md, user-flows.md |
| インフラ・設定変更 | architecture.md |

製品仕様snapshotの変更ファイル対応:

| 変更の種類 | 製品仕様snapshotを更新 |
|---|---|
| `app/assets/*.md`（規約・ガイド）の変更 | はい |
| `.docs/notes/`（ポリシー・CS記録）の変更 | はい |
| `.docs/backlogs/`（未実装機能）の変更 | はい |
| ドメインロジック（ステータス遷移、決済、バリデーション）の変更 | はい |
| `.docs/glossary.md` の変更 | はい |

判断に迷う場合は対象に含める。

### Phase 2: 情報収集（製品仕様snapshotのみ）

製品仕様snapshotを生成する場合、まず全ての情報源を読み込む。

1. `app/assets/` 配下の全mdファイル（日本語版のみ、`.en.md`は除く）
2. `.docs/notes/` 配下の全mdファイル
3. `.docs/backlogs/` 配下の全mdファイル
4. `.docs/glossary.md`
5. コードのドメインロジック（ステータス定義、決済処理、バリデーション等）

情報を読み込んだら、製品の特徴を分析してファイル構成を決定する。ファイル分割の基準:

- 1つのファイルが長くなりすぎない（目安: 200行以内）
- 問い合わせで参照する単位でファイルを分ける
- 関連するルールが1箇所にまとまるようにする

### Phase 3: 並列生成

対象の snapshot ファイルをサブエージェントで並列生成する。

技術snapshotのフォーマットは references/formats.md の「技術snapshot」セクションを参照。
製品仕様snapshotのフォーマットは references/formats.md の「製品仕様snapshot」セクションを参照。

### Phase 4: 検証

生成したファイルの整合性を確認する。

技術snapshot:
- features.md と user-flows.md の機能に抜け漏れがないか
- sitemap.md のルートが実際のルート定義と一致するか
- glossary.md の用語と一致しているか

製品仕様snapshot:
- 利用規約・ガイドの内容が漏れなく反映されているか
- コードの実装状態と記述が一致しているか
- 「ガイドに記載あり・実装なし」の乖離が明記されているか
- Wikiリンクが正しいファイル名を参照しているか
- 脚注の情報源が正確か
