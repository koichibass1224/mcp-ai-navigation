# Issue #14: ReasoningLog表示

### 背景 / 目的
Claudeの判断過程（ツール選択理由）をフロントエンドに可視化するコンポーネントを実装する。これによりPoCの価値「MCPを使う意味」がデモ参加者に伝わる。

- 依存: #13
- ラベル: `frontend`, `ui`

### スコープ / 作業項目
- [ ] コンポーネント作成
  - `src/components/SidePanel/ReasoningLog.tsx`
    - AI判断ログ全体のコンテナ
    - 折りたたみ/展開機能
  - `src/components/SidePanel/ToolCallEntry.tsx`
    - 各ツール呼び出しの詳細表示
    - ツール名、パラメータ、理由
  - `src/components/SidePanel/AiMessage.tsx`
    - Claudeの判断説明テキスト
- [ ] パープル系スタイル適用（#8b5cf6）
- [ ] 型定義参照
  - `ReasoningData`インターフェース

### ゴール / 完了条件（Acceptance Criteria）
- [ ] 使用したツール名が表示される
- [ ] 各ツールのパラメータが表示される
- [ ] Claudeの判断理由テキストが表示される
- [ ] 折りたたみ/展開が可能
- [ ] パープル系（#8b5cf6）のスタイルが適用されている

### テスト観点
- 手動確認: ルート検索後にAI判断ログが表示される
- 手動確認: 折りたたみ/展開が動作する
- 検証方法: ツール名・パラメータがAPIレスポンスと一致

### 参考ドキュメント
- `docs/05_sitemap.md` - ReasoningLogレイアウト、カラースキーム
- `docs/01_requirements.md` - F-06 AI判断ログ表示
- `docs/04_api.md` - reasoning フィールド仕様
