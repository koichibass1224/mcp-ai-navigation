# 01. 要件定義書

## MCP × Google Maps AIナビ PoC

---

## 1. プロジェクト概要

### 1.1 プロジェクト名

MCP × Google Maps AIナビ Web PoC

### 1.2 目的

MCP（Model Context Protocol）を用いた「実行AI型ナビゲーション」の思想検証PoCをWebブラウザアプリとして構築する。従来のFunction Callingベース実装との構造的差分を、動くデモで直感的に示すことが最終ゴール。

### 1.3 本PoCで証明したいこと

- **AIがその場で判断する**: ルート探索ロジックをコードに固定実装せず、Claudeが自然文条件を解釈してAPI呼び出しを自律的に決定する
- **MCPの接続標準化の価値**: ツール追加時にFunction Calling定義を書き直す必要がなく、MCPサーバーにツールを追加するだけで拡張できる
- **実車ナビの"頭脳"が同一構造で動く**: Web/組み込みに関わらず、Claude ↔ MCP ↔ API の構造は不変

### 1.4 PoC位置づけ

- Webアプリとしての完成度は目的ではない
- 実車・組み込み前提の「思想検証」
- 本番品質不要、挙動と思想が伝わることを優先

---

## 2. ユーザー体験（UX）要件

### 2.1 想定ユーザー

- 社内デモ参加者（企画・開発メンバー）
- MCP × AIナビの思想を評価する意思決定者

### 2.2 コアユーザーフロー

```
1. ユーザーが出発地・目的地を入力
2. 自然文でナビ条件を入力（例：「渋滞を避けて最短で」）
3. Claudeが条件を解釈し、MCP経由でGoogle Maps APIを呼び出し
4. 取得したルート・距離・時間を自社ナビ風UIに描画
5. （任意）条件を変えて再検索（例：「やっぱり高速使って」）
```

### 2.3 自然文入力例と期待動作

| ユーザー入力 | Claudeの解釈 | API呼び出し |
|---|---|---|
| 「渋滞を避けて最短で」 | avoid=tolls不要、duration優先、traffic考慮 | Directions API（departure_time指定） |
| 「一番早いルートで」 | duration最短 | Directions API + alternatives=true |
| 「高速使わないで」 | avoid=highways | Directions API（avoid=highways） |
| 「右折少なめで」 | 複数ルート比較→maneuver解析 | Directions API（alternatives=true）→ステップ解析 |
| 「3つのルートを比較して」 | 複数候補取得 | Directions API（alternatives=true） |

### 2.4 非機能要件

- **レスポンス時間**: 入力から結果表示まで10秒以内（目標5秒）
- **同時接続**: 1〜3人程度（デモ用途）
- **可用性**: デモ時に動けばよい（SLA不要）
- **セキュリティ**: APIキーの適切な管理（.env、サーバーサイド保持）

---

## 3. 機能要件

### 3.1 MVP機能（必須）

| # | 機能 | 説明 |
|---|---|---|
| F-01 | 地図表示 | Leaflet + OpenStreetMapによる自社ナビ風地図表示 |
| F-02 | 出発地・目的地入力 | テキスト入力（地名・住所）による地点指定 |
| F-03 | 自然文条件入力 | チャット形式でナビ条件を自然文入力 |
| F-04 | ルート描画 | Claudeが選定したルートのpolylineを地図上に描画 |
| F-05 | 距離・時間表示 | ルートの総距離・所要時間を表示 |
| F-06 | AI判断ログ表示 | Claudeがどのツールをなぜ選んだかを可視化 |

### 3.2 将来機能（非スコープ）

| # | 機能 | 備考 |
|---|---|---|
| F-07 | 経由地追加 | Places API連携が必要 |
| F-08 | 複数ルート同時描画・比較UI | UI複雑化のため後回し |
| F-09 | 音声入力 | Web Speech API等 |
| F-10 | GPSリアルタイム追従 | 実車連携フェーズ |
| F-11 | 走行履歴保存 | DB必要 |

---

## 4. 技術要件・制約

### 4.1 技術スタック（確定）

| レイヤー | 技術 | 選定理由 |
|---|---|---|
| フロントエンド | React (Vite + TypeScript) | Claude Codeとの相性、コンポーネント管理 |
| 地図ライブラリ | Leaflet + OpenStreetMap | Google Maps UI非使用方針、軽量、OSS |
| バックエンド | Node.js (TypeScript) + Express | MCP SDK対応、フロントと言語統一 |
| MCPサーバー | Node.js (TypeScript) + @modelcontextprotocol/sdk | 公式SDK最成熟 |
| AI | Claude Sonnet (API) | コスパ重視、PoC十分な精度 |
| Google Maps | Directions API / Distance Matrix API | データプロバイダとしてのみ利用 |
| デプロイ | Vercel (フロント) + Railway (バックエンド) | 無料枠でPoC運用可能 |

### 4.2 外部API

| API | 用途 | 料金目安 |
|---|---|---|
| Google Directions API | ルート検索・polyline取得 | 月$200無料クレジット（約40,000リクエスト） |
| Google Distance Matrix API | 複数ルート距離・時間比較 | 同上クレジット内 |
| Claude API (Sonnet) | 自然文解釈・ツール選択判断 | $3/MTok入力, $15/MTok出力 |

### 4.3 コスト想定（PoC期間1ヶ月）

- Google Maps API: 無料枠内（月数百リクエスト想定）
- Claude API: 月$10〜30程度（デモ数十回想定、1回あたり約1,000〜3,000トークン）
- Vercel / Railway: 無料枠内

### 4.4 制約事項

- Google Maps UIコンポーネント（InfoWindow, SearchBox等）は使用しない
- オフライン対応不要
- 認証・ユーザー管理不要
- データベース不要（ステートレス）

---

## 5. 非スコープ（明確な除外事項）

- 実車連携（CAN/センサー/GPS追従）
- 音声案内
- 高精度UIデザイン
- モバイルネイティブ対応
- ユーザー認証・マルチテナント
- 走行履歴の永続化
- 負荷テスト・パフォーマンスチューニング

---

## 6. PoC成功判断基準

### 必須達成条件

- [ ] 自然文入力の違いによって、異なるルート結果が返ること
- [ ] Claudeがルート条件をコードに固定実装せず解釈していること
- [ ] MCP経由でGoogle Maps APIが正しく呼ばれること
- [ ] 自社ナビ風UIにルート・距離・時間が描画されること
- [ ] Claudeの判断過程（ツール選択理由）が可視化されていること

### 望ましい達成条件

- [ ] 条件変更（追加指示）で再検索が動くこと
- [ ] 「MCPを使う意味」がデモ参加者に説明不要で伝わること
- [ ] レスポンスが5秒以内であること

---

## 7. 用語定義

| 用語 | 定義 |
|---|---|
| MCP | Model Context Protocol。AIモデルと外部ツール/APIを標準化された方式で接続するプロトコル |
| BFF | Backend for Frontend。フロントエンド専用のバックエンドレイヤー |
| polyline | Googleが返すエンコード済みルート座標列。デコードして地図上に線として描画する |
| 自社ナビ風UI | Google Maps標準UIを使わず、独自にデザインした地図+ルート表示画面 |
| Function Calling | AIに外部関数を呼ばせる従来手法。個別定義が必要 |
