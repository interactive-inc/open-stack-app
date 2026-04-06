# backlogs/

課題の詳細な分析と計画。backlogスキルで作成・更新する。
feedbacks/の声から掘り下げる場合と、直接課題を追加する場合がある。

## slug.md

feedbacks/と同じslugで対応させる。直接追加の場合は独自slug。

FrontMatter:

```yaml
---
is-done: false
decision: 未定 | 開発する | 見送り
vision-axis: 価値1 | 価値2 | 価値3 | セキュリティ | 販売向け
signal-ids:
  - {feedbacks/ slug}
  - {feedbacks/ slug}
reference-id: TASK-{番号}
notion-page-id: {Notion Page ID}
---
```

- `is-done`: 開発完了したら true にする。index.md 再生成時に「完了」セクションへ移動
- `decision`: 判断結果。本文の「## 判断」と同じ値を入れる
- `vision-axis`: index.md のどの価値軸に合致するか
- `signal-ids`: このバックログの根拠となる feedbacks/ のslugリスト。件数と出所が両方わかる
- `reference-id`, `notion-page-id`: 任意。外部システムとの紐付け

本文:

```md
# {課題テーマ名}

## 背景

{[[slug]]へのwikiリンク、または直接記述}

## 調査

- {調査結果} [^1]
- {調査結果} [^2]

## 対応案

- {案A}: {概要}
- {案B}: {概要}

## 判断

未定 / 開発する / 見送り

---

[^1]: {YYYY-MM-DD} {調査ソース・根拠の詳細}
[^2]: {YYYY-MM-DD} {調査ソース・根拠の詳細}
```

脚注に日付と根拠をまとめる。本文は結論だけ。

## index.md

slug.mdのfrontmatterから再生成するキャッシュ。手で編集しない。
is-done: true のものは「完了」セクションに移動する。

```md
# バックログ

## 開発する

- {課題テーマ名} [[{slug}]]
  {対応案の要約1文}

## 未定

- {課題テーマ名} [[{slug}]]
  {調査状況1文}

## 見送り

- {課題テーマ名} [[{slug}]]
  {見送り理由1文}

## 完了

- {課題テーマ名} [[{slug}]]
  {対応結果1文}
```

## ルール

- 調査結果は事実を書く。推測は「推測:」と明記
- 対応案は複数出す。1案に絞らない(絞るのはdecisions/の役割)
- 判断が「開発する」になったらdecisions/にADRを作成して実装に進む
- 判断が「見送り」でも削除しない。理由を残す
- is-done を true にしたらファイルは残す（履歴として）
