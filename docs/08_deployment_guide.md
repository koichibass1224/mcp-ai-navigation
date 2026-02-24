# 08. デプロイガイド

## MCP × Google Maps AIナビ PoC

---

## 1. 構成

| サービス | 役割 | プラットフォーム |
|----------|------|------------------|
| フロントエンド | React + Vite | Vercel（無料） |
| バックエンド | Express + MCP | Render.com（無料） |

---

## 2. バックエンド（Render.com）

### 2.1 デプロイ手順

1. https://render.com/ でアカウント作成（GitHub連携推奨）
2. 「New +」→「Web Service」
3. GitHubリポジトリを選択

### 2.2 設定値

| 項目 | 値 |
|------|-----|
| Name | `mcp-ai-navigation`（任意） |
| Region | Singapore または Oregon |
| Branch | `main` |
| **Root Directory** | `backend` |
| Runtime | `Node` |
| **Build Command** | `npm install --include=dev && npm run build` |
| **Start Command** | `npm start` |

### 2.3 環境変数

| Key | Value |
|-----|-------|
| `GOOGLE_MAPS_API_KEY` | `AIzaSy...`（Google Cloud Consoleで取得） |
| `NODE_ENV` | `production` |
| `ANTHROPIC_API_KEY` | `sk-ant-...`（AIモード使用時） |

### 2.4 つまづきポイント

#### ❌ Root Directoryにスペースが入る
```
Root directory "backend " does not exist
```
**解決**: Root Directoryを `backend`（スペースなし）に修正

#### ❌ TypeScriptビルドエラー
```
Error: Cannot find module '/opt/render/project/src/backend/dist/index.js'
```
**解決**: Build Commandに `npm run build` を追加
```
npm install && npm run build
```

#### ❌ 型定義が見つからない
```
error TS7016: Could not find a declaration file for module 'express'
```
**解決**: devDependenciesもインストールする
```
npm install --include=dev && npm run build
```
（本番環境ではdevDependenciesがインストールされないため）

---

## 3. フロントエンド（Vercel）

### 3.1 デプロイ手順（CLI）

```bash
cd frontend
vercel --prod
```

### 3.2 環境変数の設定

**重要**: Viteは**ビルド時**に環境変数を埋め込むため、Vercelに環境変数を設定してから再ビルドが必要。

```bash
# 環境変数を追加
vercel env add VITE_API_BASE_URL production
# 値を入力: https://mcp-ai-navigation.onrender.com

# キャッシュなしで再デプロイ
vercel --prod --force
```

### 3.3 つまづきポイント

#### ❌ バックエンドに接続できない（Failed to fetch）
```
API request failed: /api/route TypeError: Failed to fetch
```
**原因1**: 環境変数がビルドに含まれていない
**解決**: `vercel env add` で環境変数を追加し、`vercel --prod --force` で再デプロイ

**原因2**: 広告ブロッカー
**解決**: 一時的に無効化してテスト

#### ❌ CORS エラー
```
Access to fetch has been blocked by CORS policy
```
**解決**: バックエンドの CORS 設定を更新
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CORS_ORIGIN,
    /\.vercel\.app$/,  // Vercelの全サブドメインを許可
  ].filter(Boolean),
}))
```

---

## 4. 無料プランの制限

### Render.com
- **15分アイドルでスリープ**: 初回アクセス時に30秒〜1分の起動待ちが発生
- **月750時間**: 1サービスなら常時起動でギリギリ

### Vercel
- **実行時間10秒制限**: Serverless Functionsの場合（今回は静的サイトなので関係なし）
- **帯域幅100GB/月**: PoCなら十分

---

## 5. デプロイURL

| サービス | URL |
|----------|-----|
| バックエンド | https://mcp-ai-navigation.onrender.com |
| フロントエンド | https://frontend-xxx.vercel.app |
| API Health | https://mcp-ai-navigation.onrender.com/api/health |

---

## 6. カスタムドメイン設定（オプション）

### Vercel
1. 「Settings」→「Domains」
2. カスタムドメインを追加
3. DNSレコードを設定

### Render
1. 「Settings」→「Custom Domains」
2. カスタムドメインを追加
3. CNAME/Aレコードを設定

---

## 7. 再デプロイ手順

### 自動デプロイ
GitHubにpushすると自動的に両方再デプロイされる

### 手動デプロイ

**Render**:
```
Dashboard → サービス → Manual Deploy → Deploy latest commit
```

**Vercel**:
```bash
cd frontend && vercel --prod
```

---

## 8. トラブルシューティング

### バックエンドが応答しない
```bash
curl https://mcp-ai-navigation.onrender.com/api/health
```
- レスポンスがない → Renderダッシュボードでログ確認
- エラーレスポンス → 環境変数を確認

### フロントエンドが真っ白
- ブラウザのDevTools → Console でエラー確認
- 環境変数が正しいか確認（ビルドログで `VITE_API_BASE_URL` が表示されるか）

---

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2024-XX-XX | 初版作成 |
