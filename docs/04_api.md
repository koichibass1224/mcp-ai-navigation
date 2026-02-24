# 04. API設計

## MCP × Google Maps AIナビ PoC

---

## 1. API設計の全体構成

本PoCには2種類のAPI/インターフェースが存在する。

```
┌──────────────────────┐
│  ① Backend REST API   │  ← フロントエンドが叩く
│     /api/navigate     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  ② MCP Tool定義       │  ← Claudeが呼ぶ（MCPプロトコル経由）
│   route_search        │
│   distance_compare    │
│   geocode             │
└──────────────────────┘
```

---

## 2. Backend REST API

### 2.1 エンドポイント一覧

| メソッド | パス | 説明 |
|---|---|---|
| POST | `/api/navigate` | ナビゲーションリクエスト（メイン） |
| GET | `/api/health` | ヘルスチェック |

### 2.2 POST /api/navigate

ユーザーの自然文入力を受け取り、Claude + MCP経由でルート情報を返す。

#### リクエスト

```json
{
  "origin": "東京駅",
  "destination": "横浜駅",
  "message": "渋滞を避けて最短で",
  "conversationHistory": [
    {
      "role": "user",
      "content": "渋滞を避けて最短で"
    }
  ]
}
```

| フィールド | 型 | 必須 | 説明 |
|---|---|---|---|
| origin | string | ✅ | 出発地（地名・住所） |
| destination | string | ✅ | 目的地（地名・住所） |
| message | string | ✅ | 自然文でのナビ条件 |
| conversationHistory | array | ❌ | 直前までの会話履歴（条件変更時に使用） |

#### レスポンス（成功: 200）

```json
{
  "route": {
    "polyline": [
      { "lat": 35.6812, "lng": 139.7671 },
      { "lat": 35.6815, "lng": 139.7650 },
      ...
    ],
    "summary": "首都高速経由",
    "distance": {
      "text": "32.4 km",
      "value": 32400
    },
    "duration": {
      "text": "45分",
      "value": 2700
    },
    "steps": [
      {
        "instruction": "北に向かって進む",
        "distance": "200 m",
        "duration": "1分"
      }
    ]
  },
  "reasoning": {
    "message": "渋滞を避けるため、首都高速経由のルートを選択しました。現在の交通状況を考慮すると、一般道より15分短縮できます。",
    "toolsUsed": [
      {
        "name": "route_search",
        "params": {
          "origin": "東京駅",
          "destination": "横浜駅",
          "avoid": ["tolls"],
          "alternatives": true,
          "departure_time": "now"
        },
        "reason": "渋滞回避のため、出発時刻を指定してリアルタイム交通情報を考慮"
      }
    ]
  },
  "conversationHistory": [
    { "role": "user", "content": "渋滞を避けて最短で" },
    { "role": "assistant", "content": "渋滞を避けるため..." }
  ]
}
```

| フィールド | 型 | 説明 |
|---|---|---|
| route | object | ルート情報（描画用） |
| route.polyline | array | デコード済み座標配列（Leaflet描画用） |
| route.summary | string | ルート概要テキスト |
| route.distance | object | 総距離 |
| route.duration | object | 所要時間 |
| route.steps | array | ターンバイターンの案内ステップ |
| reasoning | object | AI判断情報（ログ表示用） |
| reasoning.message | string | Claudeの判断説明テキスト |
| reasoning.toolsUsed | array | 使用したMCPツールとその理由 |
| conversationHistory | array | 更新された会話履歴 |

#### レスポンス（エラー: 400/500/503）

```json
{
  "error": {
    "code": "CLAUDE_API_ERROR",
    "message": "Claude APIへの接続に失敗しました",
    "details": "Rate limit exceeded"
  }
}
```

| エラーコード | HTTPステータス | 説明 |
|---|---|---|
| VALIDATION_ERROR | 400 | リクエストパラメータ不正 |
| CLAUDE_API_ERROR | 503 | Claude API通信エラー |
| GOOGLE_MAPS_ERROR | 502 | Google Maps API通信エラー |
| INTERNAL_ERROR | 500 | サーバー内部エラー |

### 2.3 GET /api/health

```json
{
  "status": "ok",
  "services": {
    "claude": "connected",
    "googleMaps": "connected",
    "mcpServer": "running"
  }
}
```

---

## 3. MCP Tool定義

### 3.1 ツール一覧

| ツール名 | 内部利用API | 目的 |
|---|---|---|
| route_search | Directions API | ルート検索・polyline取得 |
| distance_compare | Distance Matrix API | 複数地点間の距離・時間比較 |
| geocode | Geocoding API | 地名→緯度経度変換 |

### 3.2 route_search

**目的**: 出発地→目的地のルートを検索し、polyline・距離・時間を返す。

#### MCP Tool Schema

```json
{
  "name": "route_search",
  "description": "指定された出発地と目的地のルートを検索します。渋滞回避、高速道路回避などの条件を指定できます。alternatives=trueで複数ルート候補を取得できます。",
  "inputSchema": {
    "type": "object",
    "properties": {
      "origin": {
        "type": "string",
        "description": "出発地（住所または地名）"
      },
      "destination": {
        "type": "string",
        "description": "目的地（住所または地名）"
      },
      "avoid": {
        "type": "array",
        "items": {
          "type": "string",
          "enum": ["tolls", "highways", "ferries"]
        },
        "description": "回避する要素のリスト"
      },
      "alternatives": {
        "type": "boolean",
        "description": "代替ルートも取得するかどうか（trueで最大3ルート）",
        "default": false
      },
      "departure_time": {
        "type": "string",
        "description": "出発時刻。'now'で現在時刻。リアルタイム交通情報を考慮する場合に指定。",
        "default": "now"
      },
      "traffic_model": {
        "type": "string",
        "enum": ["best_guess", "pessimistic", "optimistic"],
        "description": "交通予測モデル。departure_time指定時のみ有効。",
        "default": "best_guess"
      }
    },
    "required": ["origin", "destination"]
  }
}
```

#### 内部処理（Google Directions API呼び出し）

```
GET https://maps.googleapis.com/maps/api/directions/json
  ?origin={origin}
  &destination={destination}
  &avoid={avoid}
  &alternatives={alternatives}
  &departure_time={departure_time}
  &traffic_model={traffic_model}
  &language=ja
  &key={API_KEY}
```

#### レスポンス（Claudeに返す形式）

```json
{
  "routes": [
    {
      "summary": "首都高速経由",
      "distance": { "text": "32.4 km", "value": 32400 },
      "duration": { "text": "45分", "value": 2700 },
      "duration_in_traffic": { "text": "52分", "value": 3120 },
      "polyline": "encoded_polyline_string",
      "steps": [
        {
          "instruction": "北に向かって進む",
          "distance": "200 m",
          "duration": "1分",
          "maneuver": "turn-right"
        }
      ],
      "warnings": []
    }
  ],
  "geocoded_waypoints": [
    { "place_id": "ChIJ...", "types": ["train_station"] }
  ]
}
```

### 3.3 distance_compare

**目的**: 複数の出発地・目的地の組み合わせで距離・時間を一括比較する。

#### MCP Tool Schema

```json
{
  "name": "distance_compare",
  "description": "複数の出発地・目的地の組み合わせで距離と所要時間を一括比較します。異なるルートの所要時間を比較する場合に使用します。",
  "inputSchema": {
    "type": "object",
    "properties": {
      "origins": {
        "type": "array",
        "items": { "type": "string" },
        "description": "出発地のリスト"
      },
      "destinations": {
        "type": "array",
        "items": { "type": "string" },
        "description": "目的地のリスト"
      },
      "departure_time": {
        "type": "string",
        "description": "出発時刻。'now'で現在時刻。",
        "default": "now"
      }
    },
    "required": ["origins", "destinations"]
  }
}
```

#### 内部処理（Google Distance Matrix API呼び出し）

```
GET https://maps.googleapis.com/maps/api/distancematrix/json
  ?origins={origins}
  &destinations={destinations}
  &departure_time={departure_time}
  &language=ja
  &key={API_KEY}
```

#### レスポンス

```json
{
  "rows": [
    {
      "elements": [
        {
          "distance": { "text": "32.4 km", "value": 32400 },
          "duration": { "text": "45分", "value": 2700 },
          "duration_in_traffic": { "text": "52分", "value": 3120 },
          "status": "OK"
        }
      ]
    }
  ],
  "origin_addresses": ["東京都千代田区丸の内..."],
  "destination_addresses": ["横浜市西区..."]
}
```

### 3.4 geocode

**目的**: 地名・住所を緯度経度に変換する。地図の初期表示位置設定やマーカー配置に使用。

#### MCP Tool Schema

```json
{
  "name": "geocode",
  "description": "地名や住所を緯度・経度に変換します。地図上にマーカーを配置する際に使用します。",
  "inputSchema": {
    "type": "object",
    "properties": {
      "address": {
        "type": "string",
        "description": "変換したい地名または住所"
      }
    },
    "required": ["address"]
  }
}
```

#### 内部処理（Google Geocoding API呼び出し）

```
GET https://maps.googleapis.com/maps/api/geocode/json
  ?address={address}
  &language=ja
  &key={API_KEY}
```

#### レスポンス

```json
{
  "location": {
    "lat": 35.6812,
    "lng": 139.7671
  },
  "formatted_address": "日本、〒100-0005 東京都千代田区丸の内１丁目",
  "place_id": "ChIJC3Cf2PuLGGAR..."
}
```

---

## 4. Claudeシステムプロンプト設計

### 4.1 プロンプト概要

```
あなたはAIナビゲーションアシスタントです。
ユーザーの自然文指示に基づいて、最適なルートを探索してください。

## あなたの役割
- ユーザーの意図を正確に理解する
- 利用可能なツールの中から最適なものを選択する
- 必要に応じて複数のツールを組み合わせる
- 結果をユーザーにわかりやすく説明する

## 利用可能なツール
- route_search: ルート検索（メイン）
- distance_compare: 距離・時間の比較
- geocode: 地名の座標変換

## 判断ガイドライン
- 「渋滞を避けて」→ departure_time="now" を指定
- 「高速使わない」→ avoid=["highways"]
- 「一番早い」→ alternatives=true で複数取得し最短を選択
- 「比較して」→ alternatives=true または distance_compare を使用
- 「右折少なめ」→ alternatives=true で取得後、stepsのmaneuverを解析

## 応答フォーマット
必ず以下のJSON形式で応答してください:
{
  "selectedRoute": { ... },  // 選択したルート情報
  "reasoning": "選択理由の説明"
}
```

### 4.2 Claude API呼び出しパラメータ

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "system": "(上記システムプロンプト)",
  "tools": [
    "(route_searchのスキーマ)",
    "(distance_compareのスキーマ)",
    "(geocodeのスキーマ)"
  ],
  "messages": [
    {
      "role": "user",
      "content": "出発地: 東京駅、目的地: 横浜駅\n条件: 渋滞を避けて最短で"
    }
  ]
}
```

---

## 5. Google Maps API利用詳細

### 5.1 API別用途マッピング

| Google API | 呼び出し元MCPツール | 主な用途 |
|---|---|---|
| Directions API | route_search | ルート検索、polyline、ステップ案内 |
| Distance Matrix API | distance_compare | 複数ルートの距離・時間一括比較 |
| Geocoding API | geocode | 地名→座標変換 |

### 5.2 APIキー制限（推奨設定）

| 制限 | 設定値 |
|---|---|
| HTTPリファラー制限 | なし（サーバーサイドのためIP制限を使用） |
| IP制限 | Railwayのアウトバウンドip（デプロイ後に設定） |
| API制限 | Directions API, Distance Matrix API, Geocoding API のみ有効化 |
| 日次クォータ | 1,000リクエスト/日（PoC想定） |

### 5.3 レスポンスハンドリング

Google Maps APIのレスポンスは`status`フィールドで成否を判定する。

| status | 対応 |
|---|---|
| OK | 正常処理 |
| ZERO_RESULTS | Claudeに「ルートが見つからない」と返す |
| OVER_QUERY_LIMIT | 503エラー、リトライ促す |
| REQUEST_DENIED | APIキー設定エラー、500エラー |
| INVALID_REQUEST | パラメータ修正をClaudeに促す |
