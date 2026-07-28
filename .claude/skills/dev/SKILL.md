---
name: dev
description: "?"
argument-hint: "[drift|links|next|features-sync|自然文|Issue番号]"
user-invocable: true
disable-model-invocation: false
---

> このスキルを更新するときは [CLAUDE.md](CLAUDE.md) の方針に従う。

外側（利用者）から内側（実装）への同心円で設計し、コードから読み取れない意図は `.docs/` に記録する。`.docs/` は開発対象の製品リポジトリの直下に置く（このスキルが入っているプラグインリポジトリではない）。

# 振り分け

`/product:dev {入力}` は入力の種類で振り分ける。

- `drift` / `links` / `next` / `features-sync` / `skills` ⇒ [サブコマンド](#サブコマンド)
- 自然文（要望・アイデア・作業依頼、例:「ログイン機能を追加して」）⇒ [request.md](references/request.md) を Read し、signal / backlog / issue に分類して記録・実装へ進む
- 数字・`#N`・GitHub URL ⇒ [request.md](references/request.md) の「Workflow: 既存 Issue の続き」（Issue 取得から PR まで）
- `signals/{slug}` のパス ⇒ [request.md](references/request.md) の既存記録の更新・昇格
- 引数なし ⇒ [request.md](references/request.md) の「Workflow: 入力なし」（signals から backlog 候補を提案）

Issue / PR の書式は [gh-templates.md](references/tools/gh-templates.md)、リポジトリ設定・ブランチ衛生は [gh.md](references/tools/gh.md)、スクリーンショットの手順は [screenshot-upload.md](references/tools/screenshot-upload.md)、PR や差分のレビュー観点と受け入れ判定は [review.md](references/tools/review.md)。

# Product Design

Jesse James Garrett's UX 5 planes (Strategy, Scope). Ref: [ux-five-planes.md](references/design/ux-five-planes.md)

- JTBD: 機能の前に「顧客が雇うジョブ」を特定する
- Scenario: 「クリックする」でなく「迷う／安心する」を書く

# UI Design

OOUI + UX 5 planes (Structure, Skeleton, Surface). Ref: [ux-five-planes.md](references/design/ux-five-planes.md)

## OOUI

- 名詞→動詞: 対象を選んでから操作を選ぶ
- メニュー項目は名詞（「登録する」でなく「利用者」）
- オブジェクトごとに一覧と詳細
- Modeless: 線形フロー強制禁止、複数経路で到達できる
- 構造はオブジェクトで作る（タスクは変わる、オブジェクトは残る）

## Screen Order

操作順でなく、不安を解消する順に並べる。

## Page Routing

URL はレイアウトの入れ子を反映し、リソース指向にする。パラメータ名は `:id` でなく単数リソース名（`/users/:user/posts/:post`）。詳細 ⇒ [page-routing.md](references/design/page-routing.md)

# Domain Design

Eric Evans's DDD (Strategic): aggregate, invariant, boundary. 概念モデルのみ、実装は Code Design。

## Aggregate & Invariant

- 集約: 整合性を保つオブジェクトの一塊
- 不変条件: 集約境界で常に守るルール
- 集約ルートは不変条件ごとに分ける
- 不変条件を持つロジックは Domain 層として独立させる

## Entity & Value Object

- Entity: 同一性 (ID) を持つ
- Value Object: 値そのもの、同一性なし

# Code Design

Kent Beck's Simple Design: passes tests, reveals intent, no duplication, fewest elements.

## Type Honesty

- `as unknown as T` や `any` を使いたくなったら設計の歪み
- 抽象化（interface、抽象クラス）を作らない。具体クラスを直接使う
- TypeScript の `interface` 構文は使わない、`type` で表す

## Structure

- 入力→出力 ⇒ 関数
- 設定保持＋複数操作（API client、DB 接続）⇒ クラス
- 不変データ＋ロジック不要 ⇒ type
- 引数 4 超 ⇒ Builder or オブジェクト引数

## Entity Implementation

- イミュータブル（Object.freeze）
- 状態変更は `with*()` で新インスタンス
- フラットに保つ、他の Entity を入れ子にしない

## Value Object Implementation

- バリデーション付き値（Zod + Object.freeze）
- 判定ロジックは getter
- 複数値の更新は `with*()`

詳細 ⇒ [value-object.md](references/design/value-object.md)

## Layered Architecture

依存方向は Interface → Application → Domain → Infrastructure の一方向、逆転させない。

- 単純 CRUD ⇒ 直接実装、層を分けない
- 複数処理関連 or 重複ロジック ⇒ Service 層
- DI コンテナ禁止、コンストラクタ注入のみ
- DB 接続・API キーは env で受け、トップで具体クラス生成して下位に渡す（バケツリレー）
- 判断軸: モックなしでテストできるか

詳細 ⇒ [architecture.md](references/design/architecture.md)

## Patterns

- 変換チェーン ⇒ [Fluent API](references/design/fluent-api.md)
- 複数リソース調整 (3+) ⇒ [Service Layer](references/design/service-layer.md)
- API 簡略化 ⇒ Facade
- 状態遷移 ⇒ [FSM](references/design/fsm.md)
- 型レベル状態区別・単位混同防止・バリデーション前後 ⇒ [Phantom Type](references/design/phantom-type.md)
- 生成パターンが複数 ⇒ Factory Method
- 外部 interface 変換 ⇒ Adapter（具体クラス）
- UI 非同期状態（ブラウザ／CLI）⇒ [Reducer](references/design/reducer.md)（バックエンド禁止）

## Error Handling

- バックエンド: throw しない、`T | Error` を戻す、`instanceof` で判別
- フロントエンド: ErrorBoundary

詳細 ⇒ [error-handling.md](references/design/error-handling.md)

## TypeScript Mapping

Beck's Implementation Patterns ⇒ TS:

- クラス継承 ⇒ Union 型 + exhaustive switch
- Interface ⇒ type + 関数
- Method Object ⇒ クロージャ or オブジェクト引数
- Collection wrapper ⇒ ReadonlyArray + utils

## React

詳細 ⇒ [react.md](references/design/react.md)

# API Design

詳細 ⇒ [api.md](references/design/api.md)

# Database Design

詳細 ⇒ [database.md](references/design/database.md)

# Documentation

`.docs/` に製品ドキュメントを管理する。コードから読み取れない意思決定・声・計画を記録し、コードと矛盾がない状態を保つ。UX 5 planes の各層は `.docs/` の成果物に対応する（⇒ [ux-five-planes.md](references/design/ux-five-planes.md)）。

## ディレクトリ構造

以下は推奨であり、制約ではない。必要ならここに無いディレクトリやファイルを増やしてよい。揃えられるところは揃える（バラバラよりは統一されている方が探しやすい）というだけで、この構造に収まらないことを理由に記録をやめない。

製品が1つの場合はフラットに並べる。

```
.docs/
  index.md                    製品の方向性、解決する問題
  value.md                    解決する痛みと提供価値の深掘り（必要なら）
  glossary.md                 用語集
  features.md                 機能一覧（小規模）
  features/                   機能ファイル分割（中〜大規模）
    index.md
    {slug}.md   または NNN_{日本語名}.md
  pages.md                    画面一覧（画面数30以上、必要なら）
  pages/                      画面ファイル分割（ルートファイル単位、必要なら）
  user-flows.md               ユーザー導線
  stories/                    業務ストーリー（ロール横断のユースケース、必要なら）
  sitemap.md                  URL一覧
  architecture.md             システム構成
  integrations.md             外部システム連携（必要なら）
  domain.md                   ドメインモデル（必要なら）
  models/                     ドメインモデル分割（テーブル数40以上、必要なら）
  roles-and-permissions.md    ロール権限（必要なら）
  milestones.md               リリース計画（必要なら）
  capabilities.md             ロール別できることサマリ（必要なら）
  page-capabilities.md        ロール × 画面の詳細できること（必要なら）
  manual/                     エンドユーザーマニュアル（必要なら）
  backlogs/                   プロダクトバックログ
  decisions/                  ADR（意思決定記録）
  signals/                    顧客と社内の声
  sources/                    一次情報（議事録・要件書・配布物）
  notes/                      自由メモ
  references/terms/           業界用語のアトミック定義
  drafts/                     検討中の草案
```

製品が複数ある場合は `products/{product-name}/` で分ける。`.docs/` 直下は全製品共通、`products/{product-name}/` は製品固有。

## 3種類の情報

対話から書く。コードから読み取れない意図・声・計画・価値。基本は Claude が対話で人間から得た情報を整理して書く。signals / backlogs の人間ゾーン（[human-claude-zone.md](references/docs/human-claude-zone.md)）だけは人間が直接書ける。

- index.md, value.md, glossary.md, milestones.md, capabilities.md, manual/, stories/
- backlogs/, decisions/, signals/, notes/, references/terms/

コードから生成する。実装が正で、文書はその索引・要約。対話で得た補足や意図の追記・編集もする。

- features（または features/）, user-flows.md, sitemap.md, architecture.md
- 必要に応じて integrations.md, domain.md, roles-and-permissions.md, api-schema.md, components.md
- 部分更新する。追記コメントは残し、コードと矛盾する箇所だけ上書き。丸ごと再生成しない

一次情報として残す。決定の根拠。

- sources/ に議事録・要件書・配布物を日付キーで保存
- decisions/ や milestones.md, signals/ から `[[sources/minutes/YYYY-MM-DD-{topic}]]` で逆リンクし、判断の出所を辿れるようにする

## ナレッジグラフとリンク

ドキュメントは相互リンクで繋がったナレッジグラフとして育てる。1ファイル＝1ノード、`[[]]`＝エッジ。

原則。

- 専門用語・製品用語・機能名・他ドキュメントは本文に登場したら `[[]]` でリンクする。節（`##`）ごとに初出1回が目安
- wikiリンク `[[slug]]` または `[[path/file|表示名]]` を使う。Markdown リンク `[text](path)` は使わない
- 表記が揺れる語は `[[正式名|本文の表記]]`（例: `[[単位数|単位]]`、`[[pl|PL]]`）
- 未解決リンクは「次に書くべきノード」のしるしになる
- 見出し・コードブロック・mermaid・frontmatter の中にはリンクを張らない
- 孤立ノードを作らない。新ファイルは関連ノードか索引（glossary.md など）から必ず1本繋ぐ

## 専門知識のノード化

製品の外にある専門知識（業界用語・制度・会計・技術）は `references/terms/{用語}.md` に1用語1ファイルで定義する。フォーマットとルールは [glossary.md](references/docs/glossary.md) を参照。

棲み分け。

- references/terms/ = 製品の外にある専門知識のアトミック定義（グラフのノード）
- notes/ = 長文の解説・深掘り（terms から文中でリンクする先）。一時的な棚卸し・調査メモ（`ephemeral: true`）も置く。詳細は [notes.md](references/docs/notes.md)
- glossary.md = 用語の索引、および機能名・製品固有用語の定義
- features/ = 製品の機能

## 矛盾の検出と更新

ドキュメントは古くなる。定期的にサブエージェントで矛盾を検出し、ユーザーと一緒に何が正しいかを確認して更新する。

- index.md の方向性が現状のコードと合っているか
- features がコードの実態と一致しているか
- backlogs に完了済みの項目が残っていないか
- decisions の内容が現在の実装と矛盾していないか
- milestones の日付が現状計画と合っているか
- roles-and-permissions が `requireRole()` の宣言と一致しているか

コードと文書が矛盾する場合、コードを正とする。ただし人間に確認してから更新する。

## 各ファイルのフォーマット

対話から書く。

- [index.md](references/docs/index.md)
- [value.md](references/docs/value.md)
- [glossary.md](references/docs/glossary.md)
- [milestones.md](references/docs/milestones.md)
- [capabilities.md](references/docs/capabilities.md)
- [page-capabilities.md](references/docs/page-capabilities.md)
- [stories.md](references/docs/stories.md)
- [manual.md](references/docs/manual.md)
- [backlogs.md](references/docs/backlogs.md)
- [decisions.md](references/docs/decisions.md)
- [signals.md](references/docs/signals.md)
- [sources.md](references/docs/sources.md)

コードから生成する。

- [features.md](references/docs/features.md)
- [pages.md](references/docs/pages.md)
- [sitemap.md](references/docs/sitemap.md)
- [architecture.md](references/docs/architecture.md)
- [integrations.md](references/docs/integrations.md)
- [domain.md](references/docs/domain.md)
- [roles-and-permissions.md](references/docs/roles-and-permissions.md)
- [api-schema.md](references/docs/api-schema.md)
- [components.md](references/docs/components.md)

共通ルール。

- [writing-rules.md](references/docs/writing-rules.md): 記述ルール
- [human-claude-zone.md](references/docs/human-claude-zone.md): signals/backlogs の人間ゾーンと Claude ゾーンの境界
- [validation.md](references/docs/validation.md): 検証基準

## サブコマンド

`/product:dev {sub}` でドキュメント運用のタスクを呼び分ける。各サブコマンドは `commands/{sub}.md` に詳細を書く。

人間の入力だけでなく、fable / sonnet が作業中に該当すると判断したら指示を待たずに自分で呼び出してよい。ただし next は 300+ agent 規模の重い処理になるため、実行前にオーナーの確認を取る。

- [next](commands/next.md): コードベース全体を多レンズで探索し、未捕捉タスクを `tasks.md` に追記する。Workflow ファンアウトで網羅性を担保する。重い処理（300+ agent 規模）。
- [drift](commands/drift.md): 仕様書／README と実装の乖離を検出する。「実装済」記述と実コードの突合、テーブル数・画面数・ロール権限の食い違い。
- [features-sync](commands/features-sync.md): routes と features を突合し、ドキュメントを実装に同期する。
- [links](commands/links.md): `[[wikilink]]` を解決して未定義リンク・孤児ページ・循環参照を検出する。
- [skills](commands/skills.md): 技術スタックを見て役に立ちそうな Skill パッケージ（react-doctor、shadcn/ui、cloudflare/skills 等）を判定し、`vpx skills` で自動追加する。
