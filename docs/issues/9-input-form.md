# Issue #9: 入力フォーム（出発地・目的地・自然文条件）

### 背景 / 目的
SidePanelに配置する入力フォームを実装する。ユーザーが出発地・目的地・ナビ条件を入力し、ルート検索をトリガーできるようにする。

- 依存: #6
- ラベル: `frontend`, `ui`

### スコープ / 作業項目
- [ ] コンポーネント作成
  - `src/components/SidePanel/InputForm.tsx`（フォーム全体）
  - `src/components/SidePanel/LocationInput.tsx`（出発地/目的地入力）
  - `src/components/SidePanel/MessageInput.tsx`（自然文条件入力）
  - `src/components/SidePanel/SearchButton.tsx`（検索ボタン）
- [ ] App.tsxに状態追加
  - `origin: string`
  - `destination: string`
  - `message: string`
- [ ] 入力値のバリデーション
  - 出発地・目的地が空の場合はボタン無効化
- [ ] ダークモードUI適用（パネル背景#16213e）

### ゴール / 完了条件（Acceptance Criteria）
- [ ] 出発地・目的地のテキスト入力欄が表示される
- [ ] 自然文条件の入力欄が表示される
- [ ] 「ルート検索」ボタンが表示される
- [ ] 入力値がAppコンポーネントのstateに反映される
- [ ] 空入力時にボタンが無効化される

### テスト観点
- 手動確認: 入力欄に文字を入力できる
- 手動確認: 空状態でボタンがdisabled
- 検証方法: React DevToolsでstate確認

### 参考ドキュメント
- `docs/05_sitemap.md` - コンポーネント構成、入力パネルレイアウト
- `docs/01_requirements.md` - F-02, F-03
