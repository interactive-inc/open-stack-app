# リクエストの振り分け

何かしたい時に投げる単一の入口。入力を読み、行き先を決めて記録し、必要なら実装まで進める。Issue / PR の書式は [gh-templates.md](tools/gh-templates.md)、signals / backlogs の書式は本スキルの Documentation 規約（references/docs/）が正本。Issue / PR の本文を組み立てる前に、必ず [gh-templates.md](tools/gh-templates.md) を Read する。

## 入力の解釈

数字や `#N` を含むときは既存 Issue / PR の続き作業として扱う。

GitHub の Issue / PR URL は同上。

`signals/{slug}` のパスは既存記録の更新・昇格として扱う。

それ以外の自然文は中身を読んで振り分ける。

入力なしのときは backlog 候補の提案に振る（signals から候補を提案する）。

## 振り分けの判定

入力の粒度と当事者性で行き先を決める。

### signal に振る

主語が「お客さんが」「〇〇さんが言ってた」のような観察報告。誰がやるか・何をやるかは未定。

例「求人検索の絞り込みが効かないって細川さんが言ってた」「経営者向けの画面が分かりにくいと福岡の顧客から複数声が来てる」

書式と保存場所は signals 規約（[signals.md](docs/signals.md)）に従う。

### backlog に振る

主語が「〜したい」「〜できたらいい」のような自分・チームの発想。粒度は大きく、まだ実装に落ちない。

例「求人一覧にお気に入り機能つけたい」「経営者向けダッシュボードを作りたい」

書式と保存場所は backlogs 規約（[backlogs.md](docs/backlogs.md)）に従う。

### issue に振る

「〜を直す」「〜を作る」のような着手できる具体的な作業。やる人とやることが明確。

例「求人一覧で1ページ目だけお気に入りボタンが効かないバグ修正」「TASK-1234 を実装する」

Bug / Feature / Task の選び方、Title 規則、Assignment、`.github/*_TEMPLATE.md` の優先順位は [gh-templates.md](tools/gh-templates.md) に従う。

### 既存 Issue / PR の続き作業に振る

数字、`#N`、GitHub URL を含む入力。下記「Workflow: 既存 Issue の続き」を参照。

## 曖昧な時の振る舞い

判定に迷う粒度（声とも backlog ともとれる、backlog とも issue ともとれる）は勝手に振らない。「これは X として扱います、よければそのまま、違えば Y / Z」と提示してから振る。判定理由を1行で添える。

## GitHub 操作の原則

Issue / PR の作成・編集・close / reopen・ラベル・テキストコメントは、必ず gh コマンドで行う。ブラウザで PR / Issue の作成画面・編集画面を開かない。

外向き操作（git push・PR 作成・Issue 起票）は、指示に明示されている場合のみ行う。実装だけを頼まれた作業で勝手に push や PR 作成をしない。既定はコミットで止まる。

個人情報・機密情報はリポジトリの規約に従い、Issue / PR 本文にもスクリーンショットにも出さない。

起票前に既存 Open Issue との重複を `gh issue list` で確認する。重複ではなく関連なら本文からリンクする。起票・更新後は `gh issue view` / `gh pr view` で本文が意図通り反映されたことを確認する。

PR 作成の前提として uncommitted changes が無いことを `git status` で確認する。あれば止めて呼び出し元に返す（コミット漏れの可能性）。リモートにブランチが無ければ `git push -u origin` で push、既にあれば `git push` で更新する。base は指定が無ければリポジトリの既定に従う。

UI 変更を含む PR には動作確認スクリーンショットが必須。撮影・アップロード・貼り付け・検証の手順は [screenshot-upload.md](tools/screenshot-upload.md) が正本。

次の場合は作成・更新せず、根拠つきで呼び出し元に返す。既存の Open Issue / PR と重複している可能性がある。テンプレートに埋まらない情報が多く、勝手に構造化すると設計判断になる。UI 変更を含むのにスクリーンショットが無い。base・reviewer・ラベル・マイルストーンの指定が無く、既定値を選ぶと意図と食い違う可能性がある。

## Workflow: 新規の依頼

### Classify

入力を読んで signal / backlog / issue のどれかに分類する。迷う場合は候補を提示してユーザーに確認する。

### Discuss（issue / backlog のとき）

書き込む前に方針を議論する。Vision alignment（製品の方向性に合うか）を最初に報告し、必要なら追加で質問する（技術的実現性、優先度の根拠、影響範囲）。調査が要るなら何を調べるか提案する。複数の選択肢を提示し、1案に絞らない。最終判断は人間が行う。Claude は材料を出す側に徹する。

### Record

signal なら signals 規約に従って記録する。`.docs/index.md` を先に読んでビジョンと整合チェックする。類似テーマがあれば該当 slug.md の Claude ゾーンに追記、無ければ新規 slug.md を作成する。ビジョン外なら `## 課題` セクションにその旨を明記する。`index.md` は触らない（再生成手順は [signals.md](docs/signals.md) に記載）。

backlog なら backlogs 規約に従って記録する。`.docs/index.md` と `.docs/backlogs/index.md` を先に読む。入力が signals/ slug ならその内容を背景としてリンクする。既存 backlogs/ slug を指定された場合は `---` ゾーン分離を解析し、Claude ゾーン（`---` より上）のみ書き換える。新規作成時は `---` を置かない（人間ゾーンは人間が必要時に末尾へ足す）。`index.md` は触らない。

issue なら [gh-templates.md](tools/gh-templates.md) を Read し、Bug / Feature / Task 判定と Template に従って `gh issue create` する。重複は `gh issue list` で先にチェックする。issue として記録した後、ユーザーが実装に進みたいなら「Workflow: 既存 Issue の続き」に合流する。

### Promote

signal や backlog として記録したものを後で issue に昇格させたい場合は、該当 slug を指定して再分類で issue を選ぶ。元の signal / backlog は残し、issue 本文の Source 行に元 slug を `[[signals/{slug}]]` または `[[backlogs/{slug}]]` で記録する。

## Workflow: 既存 Issue の続き（Issue 取得から PR まで）

入力が数字や URL の場合、または新規の依頼から issue 起票後に実装へ進む場合。

### Inspect

`gh issue view {N}` で本文を取得し、`## Plan` セクションが埋まっているか判定する。

`gh pr list --search "{N} in:body" --state all --json number,title,state,headRefName,isDraft` で紐づく PR を検索する。

結果をユーザーに提示してから分岐する。既存 PR ありなら「既存 PR に乗る / 新規 PR を作る」を確認。乗る場合は Plan をスキップして Branch に進む。既存 PR なし＋既存 Plan ありなら「使う / 更新する / 作り直す」を確認。既存 PR なし＋既存 Plan なしなら Plan に進む。

### Plan

技術計画を作成し Issue body に書き込む。[gh-templates.md](tools/gh-templates.md) の Task Template の書式に従う。計画はコードベースを読んで影響範囲を把握してから作成する。下記「Plan の skip 基準」に該当する場合は計画できない旨を返してユーザーに判断を委ねる。

「作り直す」ならフル再生成して上書き。「更新する」なら差分のみ反映。「使う」ならスキップ。

### Report

計画と PR 状況をユーザーに提示し、実装に進むか確認する。進めるなら Branch へ。止めるならワークフロー終了。

### Branch

`{issue番号}-{自然な英文}` のブランチを切る。例 `42-fix-pagination-offset`。既存 PR に乗る場合は `gh pr checkout {pr番号}` でチェックアウトする。

worktree を使うかは「検証に dev server が要るか」で決める。

- dev server 不要（純ロジック・テストと CLI で受け入れ判定できる・docs のみ 等）: `.worktrees/` 配下に worktree を切ってそこで作業し、PR まで進めてよい
- dev server 必要（UI 変更・ブラウザ検証・実 HTTP での確認が要る）: worktree を使わない。main checkout でブランチを切って作業し、常駐の dev server（hot reload）で検証する。worktree で dev server を起動するのは禁止（[dev-server.md](tools/dev-server.md) 参照）

worktree の add / remove はメインプロセス（指揮者）だけが行う。

### Code

Issue のタスクリストに沿って実装する。タスクを完了したらチェックを入れる。適宜コミットする。

### Verification

変更内容のチェックリストを作成し、実動作を確認する。ブラウザで動く機能は `agent-browser` や実ブラウザ操作で動作確認する。それ以外は実コマンド実行で確認する。

UI 差分がある PR では、PR 本文に before / after のスクショを必ず貼る。手順は [screenshot-upload.md](tools/screenshot-upload.md) を参照。

全項目パスしてから次に進む。

### Pull Request

push して `gh pr create` で PR を作成する。本文は [gh-templates.md](tools/gh-templates.md) の PR Template（と `.github/PULL_REQUEST_TEMPLATE.md`）に従い、操作は「GitHub 操作の原則」に従う。

## Workflow: 入力なし（提案）

入力なしで呼ばれた場合は backlog 候補の提案に入る。

### 手順

`.docs/index.md` を読み、製品のビジョン、価値軸、戦略的方向性を把握する。

`.docs/backlogs/index.md` を読み、既存バックログを確認する。

`.docs/signals/` 配下のうち、まだ backlogs に登録されていないファイルを全て読む。

各 signal を次の基準で評価する。

ビジョン整合（製品の掲げる目的に資するか）。

価値軸との一致（製品が掲げる価値のどれに資するか）。

戦略方向との適合（現在の優先度、リニューアルテーマ等に合うか）。

構造的問題との関連（既知の構造的課題に対応するか）。

声の数（声が多いほど信号が強い）。

`.docs/index.md` の「やらないこと」に該当する signal は除外する。

候補を推奨度でグループ化して提示する。

Develop（ビジョン整合と戦略適合が高い）。

Investigate（ビジョン整合はあるが要調査）。

Skip（ビジョン外、スコープ外）。

各候補にテーマ名、ビジョン軸、1行の根拠を添える。

ユーザーがどれを進めるか確認する。承認された候補に対して「Workflow: 新規の依頼」の Discuss → Record（backlog）をバッチで実行する。

## Plan の skip 基準

「Workflow: 既存 Issue の続き」の Plan フェーズで、次の場合は計画できない旨を返してユーザーに判断を委ねる。

要件が曖昧で複数の解釈がある。

外部サービスや環境の情報が不足している。

別の Issue に依存している。

技術的な不明点が多くリスクが高い。

`Plan` フェーズの計画作成自体はコードベースを読み [gh-templates.md](tools/gh-templates.md) の Task Template に従ってテキストを組み立てる。GitHub への書き込みは Plan フェーズの最後に1回だけ行う。

## やらないこと

書式の定義は本文に書かない。Issue / PR の Template、必須セクション、Title 規則、Assignment、ブランチ命名、`.github/*_TEMPLATE.md` の優先順位は [gh-templates.md](tools/gh-templates.md) を参照する。signals / backlogs の書式と保存場所は references/docs/ を参照する。

勝手に振り分けない。判定に迷うときはユーザーに確認する。理由を添える。
