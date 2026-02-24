# 実装計画書

## MCP × Google Maps AIナビ PoC

---

## フェーズ構成

| フェーズ | 目的 | 含むIssue |
|---|---|---|
| **Phase 1: Walking Skeleton** | フロント→バックエンド→Claude→MCP→Google Mapsの垂直スライスを最速で動かす | #1〜#7 |
| **Phase 2: Core機能** | MVP機能（地図・入力・ルート描画・結果表示）を実装 | #8〜#12 |
| **Phase 3: AI判断可視化** | Claudeの判断過程を可視化しPoCの価値を示す | #13〜#14 |
| **Phase 4: 堅牢化・デプロイ** | エラーハンドリング・UI仕上げ・本番デプロイ | #15〜#17 |

---

## 依存関係マップ

```
Phase 1: Walking Skeleton
#1 ─┬─► #2 ─► #3 ─► #4 ─► #5
    └─► #6 ─► #7（#2に依存）

Phase 2: Core機能
#6 ─► #8 ─► #11
#6 ─► #9 ─► #10（#5に依存）─► #12
                              └─► #11

Phase 3: AI判断可視化
#10 ─► #13 ─► #14

Phase 4: 堅牢化・デプロイ
#12, #14 ─► #15 ─► #16 ─► #17
```

---

## Issueアウトライン表

### Issue #1: プロジェクト初期セットアップ
**概要**: frontend/backendのディレクトリ作成、package.json初期化、TypeScript設定
**依存**: -
**ラベル**: `infra`, `setup`
**受け入れ基準（AC）**:
- [ ] `frontend/`に`package.json`、`tsconfig.json`、`vite.config.ts`が存在する
- [ ] `backend/`に`package.json`、`tsconfig.json`が存在する
- [ ] `.env.example`がルートに作成されている
- [ ] `npm install`が両ディレクトリでエラーなく完了する
- [ ] `.gitignore`に`node_modules`、`.env`が含まれている

---

### Issue #2: バックエンド基盤 + /api/health
**概要**: Express + TypeScript環境構築、ヘルスチェックエンドポイント実装
**依存**: #1
**ラベル**: `backend`
**受け入れ基準（AC）**:
- [ ] `npm run dev`でExpressサーバーが起動する
- [ ] `GET /api/health`が`{ "status": "ok" }`を返す
- [ ] CORS設定が有効になっている
- [ ] 環境変数`PORT`で起動ポートを変更できる

---

### Issue #3: MCPサーバー基盤構築
**概要**: @modelcontextprotocol/sdkを用いたインプロセスMCPサーバーのスケルトン実装
**依存**: #2
**ラベル**: `backend`, `mcp`
**受け入れ基準（AC）**:
- [ ] MCPサーバーがExpressプロセス内で起動する
- [ ] `tools/list`で空のツール一覧が返る
- [ ] MCPサーバーの起動ログが出力される
- [ ] `/api/health`でMCPサーバーのステータスが確認できる

---

### Issue #4: Claude API連携基盤
**概要**: @anthropic-ai/sdkを用いたClaude API通信の基盤実装
**依存**: #3
**ラベル**: `backend`, `ai`
**受け入れ基準（AC）**:
- [ ] 環境変数`ANTHROPIC_API_KEY`を読み込める
- [ ] Claude APIにテストメッセージを送信し応答を受け取れる
- [ ] MCPツール定義をClaude APIに渡せる構造になっている
- [ ] APIエラー時に適切なエラーログが出力される

---

### Issue #5: route_search MCPツール実装
**概要**: Google Directions APIを呼び出すroute_searchツールの実装
**依存**: #4
**ラベル**: `backend`, `mcp`, `google-maps`
**受け入れ基準（AC）**:
- [ ] 環境変数`GOOGLE_MAPS_API_KEY`を読み込める
- [ ] `route_search`ツールがMCPツール一覧に表示される
- [ ] origin/destinationを指定してDirections APIからルートを取得できる
- [ ] polyline、distance、durationがレスポンスに含まれる
- [ ] avoid、alternatives、departure_timeパラメータが機能する

---

### Issue #6: フロントエンド基盤（Vite + React）
**概要**: Vite + React + TypeScript環境構築、基本レイアウト作成
**依存**: #1
**ラベル**: `frontend`, `setup`
**受け入れ基準（AC）**:
- [ ] `npm run dev`で開発サーバーが起動する
- [ ] Header/Footer/MainLayoutコンポーネントが表示される
- [ ] Tailwind CSSが適用されている
- [ ] ダークモードの背景色`#1a1a2e`が適用されている

---

### Issue #7: フロント⇔バックエンド疎通確認
**概要**: フロントエンドからバックエンドAPIを呼び出し、Walking Skeletonを完成させる
**依存**: #2, #6
**ラベル**: `frontend`, `backend`, `integration`
**受け入れ基準（AC）**:
- [ ] フロントエンドから`/api/health`を呼び出せる
- [ ] 環境変数`VITE_API_BASE_URL`でAPI URLを設定できる
- [ ] CORS経由でのリクエストが成功する
- [ ] 通信エラー時にコンソールにエラーが出力される

---

### Issue #8: Leaflet地図表示
**概要**: react-leaflet + OpenStreetMapによる地図コンポーネント実装
**依存**: #6
**ラベル**: `frontend`, `map`
**受け入れ基準（AC）**:
- [ ] 画面左側70%に地図が表示される
- [ ] 東京駅付近（35.68, 139.76）を初期中心として表示
- [ ] ズーム・パン操作が可能
- [ ] OpenStreetMapタイルが正しく読み込まれる
- [ ] Leaflet CSSが適用されている

---

### Issue #9: 入力フォーム（出発地・目的地・自然文条件）
**概要**: SidePanelに配置するInputForm、LocationInput、MessageInputコンポーネント実装
**依存**: #6
**ラベル**: `frontend`, `ui`
**受け入れ基準（AC）**:
- [ ] 出発地・目的地のテキスト入力欄が表示される
- [ ] 自然文条件の入力欄が表示される
- [ ] 「ルート検索」ボタンが表示される
- [ ] 入力値がAppコンポーネントのstateに反映される
- [ ] 空入力時にボタンが無効化される

---

### Issue #10: /api/navigate エンドポイント実装
**概要**: ナビリクエストを受け取り、Claude→MCP→Google Mapsを経由してルートを返すメインAPI
**依存**: #5, #9
**ラベル**: `backend`, `api`
**受け入れ基準（AC）**:
- [ ] `POST /api/navigate`でリクエストを受け付ける
- [ ] origin/destination/messageを受け取りClaudeに渡す
- [ ] Claudeがroute_searchツールを呼び出し、結果を返す
- [ ] polyline/distance/duration/stepsを含むレスポンスを返す
- [ ] reasoningフィールドにClaudeの判断情報を含む
- [ ] バリデーションエラー時に400を返す

---

### Issue #11: ルート描画（RouteLayer）
**概要**: バックエンドから取得したpolylineを地図上に描画するコンポーネント実装
**依存**: #8, #10
**ラベル**: `frontend`, `map`
**受け入れ基準（AC）**:
- [ ] polyline座標配列を受け取り地図上に線を描画する
- [ ] ルート線の色がシアン（#00d4ff）で表示される
- [ ] 出発地マーカー（緑）が表示される
- [ ] 目的地マーカー（赤）が表示される
- [ ] ルート全体が画面に収まるようfitBoundsが適用される

---

### Issue #12: 結果パネル（ResultPanel）
**概要**: ルート検索結果（距離・時間・経由情報）を表示するコンポーネント実装
**依存**: #10, #11
**ラベル**: `frontend`, `ui`
**受け入れ基準（AC）**:
- [ ] 距離（例: 32.4 km）が表示される
- [ ] 所要時間（例: 45分）が表示される
- [ ] ルート概要（例: 首都高速経由）が表示される
- [ ] ローディング中はスピナーまたは「検索中...」が表示される
- [ ] 結果がない場合は非表示またはプレースホルダー表示

---

### Issue #13: AI判断情報のレスポンス整形
**概要**: Claudeのツール選択理由・パラメータ決定過程をreasoningフィールドに構造化して返す
**依存**: #10
**ラベル**: `backend`, `ai`
**受け入れ基準（AC）**:
- [ ] reasoning.messageにClaudeの判断説明テキストが含まれる
- [ ] reasoning.toolsUsedに使用ツール名・パラメータ・理由が含まれる
- [ ] 複数ツール呼び出し時も全て記録される
- [ ] システムプロンプトに判断理由出力の指示が含まれる

---

### Issue #14: ReasoningLog表示
**概要**: Claudeの判断過程（ツール選択理由）をフロントエンドに可視化するコンポーネント
**依存**: #13
**ラベル**: `frontend`, `ui`
**受け入れ基準（AC）**:
- [ ] 使用したツール名が表示される
- [ ] 各ツールのパラメータが表示される
- [ ] Claudeの判断理由テキストが表示される
- [ ] 折りたたみ/展開が可能
- [ ] パープル系（#8b5cf6）のスタイルが適用されている

---

### Issue #15: エラーハンドリング改善
**概要**: API通信エラー・Google Maps APIエラー・Claude APIエラーの適切なハンドリングとUI表示
**依存**: #12, #14
**ラベル**: `backend`, `frontend`, `error-handling`
**受け入れ基準（AC）**:
- [ ] Claude APIエラー時に503とエラーメッセージを返す
- [ ] Google Maps APIエラー時に502とエラーメッセージを返す
- [ ] フロントエンドでエラーメッセージをユーザーに表示する
- [ ] ネットワークエラー時にリトライを促すメッセージを表示
- [ ] タイムアウト設定が適用されている（フロント30秒、Claude25秒、Google10秒）

---

### Issue #16: UI/UXブラッシュアップ
**概要**: ダークモードUIの仕上げ、レスポンシブ対応、ナビ風デザインの完成
**依存**: #15
**ラベル**: `frontend`, `ui`, `design`
**受け入れ基準（AC）**:
- [ ] カラースキームがdocs/05_sitemapに準拠している
- [ ] 1280px以上で左70%/右30%レイアウト
- [ ] 768px〜1279pxで上60%/下40%レイアウト
- [ ] 768px未満で縦スタック
- [ ] ローディング状態のアニメーションが実装されている

---

### Issue #17: デプロイ設定（Vercel + Railway）
**概要**: フロントエンドをVercel、バックエンドをRailwayにデプロイする設定
**依存**: #16
**ラベル**: `infra`, `deploy`
**受け入れ基準（AC）**:
- [ ] Vercelにフロントエンドがデプロイされる
- [ ] Railwayにバックエンドがデプロイされる
- [ ] 環境変数が各プラットフォームに設定されている
- [ ] 本番環境でCORS設定が正しく動作する
- [ ] デプロイ手順がREADMEに記載されている

---

## 要確認事項

1. **Claude APIモデル**: `claude-sonnet-4-20250514`で確定か？コスト・精度のトレードオフ確認
2. **Google Maps APIクォータ**: 日次1,000リクエスト制限で十分か？
3. **geocode/distance_compare ツール**: MVP必須か？Phase 2以降に後回し可能か？
4. **会話履歴（conversationHistory）**: MVP時点で条件変更→再検索の対話機能は必須か？
5. **Vercel/Railway無料枠**: 現時点でアカウント・プロジェクト作成済みか？
