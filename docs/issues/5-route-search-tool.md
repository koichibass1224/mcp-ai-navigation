# Issue #5: route_search MCPツール実装

### 背景 / 目的
Google Directions APIを呼び出すroute_searchツールを実装する。これがMVPのコア機能であり、Claudeがルート検索を自律的に実行できるようになる。

- 依存: #4
- ラベル: `backend`, `mcp`, `google-maps`

### スコープ / 作業項目
- [ ] `@googlemaps/google-maps-services-js`パッケージ追加
- [ ] `backend/src/services/googleMaps.ts`作成
  - Google Mapsクライアント初期化
  - Directions API呼び出し関数
- [ ] `backend/src/mcp/tools/routeSearch.ts`作成
  - MCPツールスキーマ定義（`docs/04_api.md`参照）
  - ツール実行ロジック
  - レスポンス変換（Google APIレスポンス → Claude向け構造）
- [ ] MCPサーバーにroute_searchツールを登録

### ゴール / 完了条件（Acceptance Criteria）
- [ ] 環境変数`GOOGLE_MAPS_API_KEY`を読み込める
- [ ] `route_search`ツールがMCPツール一覧に表示される
- [ ] origin/destinationを指定してDirections APIからルートを取得できる
- [ ] polyline、distance、durationがレスポンスに含まれる
- [ ] avoid、alternatives、departure_timeパラメータが機能する

### テスト観点
- ユニット: Google Mapsクライアント初期化
- リクエスト: route_searchツール実行
- 検証方法: 「東京駅」→「横浜駅」でルートが返る

### 参考ドキュメント
- `docs/04_api.md` - route_search MCP Tool Schema、Google Directions API呼び出し
- `docs/01_requirements.md` - 自然文入力例と期待動作

### 要確認事項
- Google Maps APIキーの権限設定（Directions API有効化）
