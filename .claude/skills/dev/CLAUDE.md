# dev スキルの編集ルール

このスキル（SKILL.md / references / commands）を作成・更新するときの方針。

## スキルの責務

product は開発のベストプラクティス全体を扱う。常時展開される前提のスキルであり、同時に `/product:dev ログイン機能を追加して` のようにユーザーが直接呼び出す入口でもある。

対象は開発対象の製品リポジトリ。`.docs/` はそのリポジトリの直下に置くものであり、このプラグインリポジトリのことではない。

## ディレクトリ構成と寿命

トピックでディレクトリを切り、寿命（変更の理由と頻度）はここに明文化する。

- references/design/ — 設計手法。コア。差し替えるのは開発の思想を変えたときだけ。気軽に触らない
- references/docs/ — .docs/ の構造とフォーマット。中程度。成果物の形式を変えるときに更新
- references/request.md — 依頼の振り分けと実装フロー。中程度。運用の型を変えるときに更新
- references/tools/ — GitHub / Sentry / CI などツールの手順。短命。ツール都合で気軽に足し、使わなくなったら気軽に消す
- commands/ — .docs/ 運用のサブコマンド

短命なものがコアを浸食しないよう、追加時はまずどのディレクトリに属するか（＝何が理由で変わるものか）を決める。迷ったら寿命の短い側に置く。

## SKILL.md の書き方

- SKILL.md は索引に保つ。判断基準・振り分け・リンクだけを書き、詳細は references/ に置く
- 「将来候補」「TODO」などスキル自体の育て方に関するメタ情報は SKILL.md に書かない。実行時のコンテキストに載せる価値がないものは全てこの CLAUDE.md に書く
- references を跨いで内容を重複させない。設計手法は design、成果物の書式は docs、フローは process、ツール手順は tools

## Adopted design methods

外側（利用者）から内側（実装）への同心円。採用した設計手法だけを記す。

- Product Design ⇒ Garrett's UX 5 planes (Strategy, Scope)
- UI Design ⇒ OOUI + Garrett's UX 5 planes (Structure, Skeleton, Surface)
- Domain Design ⇒ Evans's DDD (Strategic only, conceptual)
- Code Design ⇒ Beck's Simple Design + Layered Architecture

Tactical DDD（Aggregate / Entity / VO 実装）は Code Design に置く。

## Policy

- 採用したものだけ書く（線路を敷く）。代替・比較・実行順序は書かない
- 同じ観点に競合する手法を並べない
- 採用は厳守。設計検査にも使う
- より良い手法が見つかれば差し替える

## Out of Scope

- コーディング規約、文章作法（製品リポジトリの CLAUDE.md や rules の領分）
- エージェントの役割分担・委譲ルール（プラグインの agents/ の領分）
- 環境構築・デプロイ手順

## サブコマンドの将来候補（必要になったら追加）

- lint — 書式チェック（Markdown ルール・frontmatter 必須項目・命名規則）
- index — features/signals/backlogs の index.md 再生成
- orphan — どこからも参照されていない .md の検出
- status — 実装ステータス記号と実装の自動突合
- sync — backlog/signal を tasks.md へ昇格、tasks.md の判断済を docs 本文へ吸収
- glossary — 用語の整合（定義漏れ・揺れ）
- publish — docs→HTML 同期
- review — 6 読者導線・3 クリック到達・説明の薄さの読み物検査
