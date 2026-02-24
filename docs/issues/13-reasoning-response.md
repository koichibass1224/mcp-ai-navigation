# Issue #13: AI判断情報のレスポンス整形

### 背景 / 目的
Claudeのツール選択理由・パラメータ決定過程をreasoningフィールドに構造化して返す。これによりPoCの核心である「AIがその場で判断する」ことを可視化できる。

- 依存: #10
- ラベル: `backend`, `ai`

### スコープ / 作業項目
- [ ] システムプロンプト更新
  - 判断理由を必ず出力するよう指示追加
  - 出力フォーマットの明確化
- [ ] レスポンス整形ロジック
  - Claudeの応答からreasoning情報を抽出
  - toolsUsed配列の構築
    - ツール名
    - パラメータ
    - 選択理由
- [ ] 複数ツール呼び出し対応
  - 全てのtool_useを記録
- [ ] 型定義
  - `ReasoningData`インターフェース

### ゴール / 完了条件（Acceptance Criteria）
- [ ] reasoning.messageにClaudeの判断説明テキストが含まれる
- [ ] reasoning.toolsUsedに使用ツール名・パラメータ・理由が含まれる
- [ ] 複数ツール呼び出し時も全て記録される
- [ ] システムプロンプトに判断理由出力の指示が含まれる

### テスト観点
- リクエスト: 「渋滞を避けて」で検索
- 検証方法: reasoningにdeparture_time指定の理由が含まれる

### 参考ドキュメント
- `docs/04_api.md` - reasoning フィールド仕様、Claudeシステムプロンプト設計
- `docs/01_requirements.md` - F-06 AI判断ログ表示、自然文入力例と期待動作
