# Phase 6: Vercelデプロイ・テスト実装ガイド

**作成日**: 2025年10月23日
**Phase**: 6/6 (MVP最終フェーズ)
**所要時間**: 60分
**前提条件**: Phase 1-5完了

---

## 目次

1. [Phase概要](#phase概要)
2. [ビルド最適化](#ビルド最適化)
3. [ローカルビルドテスト](#ローカルビルドテスト)
4. [Lighthouseテスト](#lighthouseテスト)
5. [Vercelアカウント準備](#vercelアカウント準備)
6. [Vercelデプロイ設定](#vercelデプロイ設定)
7. [本番デプロイ](#本番デプロイ)
8. [PWA動作確認](#pwa動作確認)
9. [実機テスト（iOS）](#実機テストios)
10. [実機テスト（Android）](#実機テストandroid)
11. [オフライン動作テスト詳細](#オフライン動作テスト詳細)
12. [チェックリスト](#チェックリスト)
13. [トラブルシューティング](#トラブルシューティング)
14. [デモ準備](#デモ準備)
15. [次のステップ](#次のステップ)

---

## Phase概要

### このPhaseの目的

Phase 6は、OfflistをVercelにデプロイし、本番環境で完全に動作するPWAとして公開します。実機でのオフラインテストを徹底し、デモ準備を整えます。

### Vercelを選ぶ理由

| 理由 | 詳細 |
|------|------|
| **Next.js最適化** | Vercelが開発元、最高のパフォーマンス |
| **無料枠が充実** | 個人プロジェクトなら無料で十分 |
| **HTTPS自動** | SSL証明書が自動付与（PWA必須要件） |
| **CDN配信** | 世界中で高速表示 |
| **GitHub連携** | プッシュするだけで自動デプロイ |
| **プレビューURL** | PR毎にプレビュー環境が自動作成 |

### デプロイの重要性

> **「機内モードでも動く」というデモは、本番URLでこそ信頼される**

ローカル開発環境でのデモは「仕込み」と思われる可能性があります。公開URLからアクセスし、実機で機内モードテストを行うことで、技術の信頼性を証明します。

### 所要時間

| タスク | 時間 |
|--------|------|
| ビルド最適化 | 15分 |
| Lighthouseテスト | 10分 |
| Vercelデプロイ | 15分 |
| 実機テスト（iOS/Android） | 15分 |
| デモ準備 | 5分 |
| **合計** | **60分** |

---

## ビルド最適化

### 1. next.config.jsの本番設定

**ファイル:** `next.config.js`

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  sw: 'sw.js',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlist-pages',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 24時間
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(?:js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'offlist-static',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30日
        },
      },
    },
  ],
});

module.exports = withPWA({
  reactStrictMode: true,

  // 本番最適化
  swcMinify: true, // SWCコンパイラでミニファイ

  // 画像最適化
  images: {
    formats: ['image/avif', 'image/webp'], // 次世代フォーマット
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ヘッダー最適化
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400', // 1日
          },
        ],
      },
      {
        source: '/:path*.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1年
          },
        ],
      },
    ];
  },

  // セキュリティヘッダー
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
});
```

### 2. 画像最適化（next/image）

**既存の`<img>`タグを`<Image>`に変更:**

```typescript
// Before
<img src="/icons/icon-96x96.png" alt="Offlist" />

// After
import Image from 'next/image';

<Image
  src="/icons/icon-96x96.png"
  alt="Offlist"
  width={96}
  height={96}
  priority // 初期ロードで必要な画像
/>
```

### 3. バンドルサイズ削減

#### バンドルアナライザーのインストール

```bash
npm install @next/bundle-analyzer
```

#### next.config.js に追加

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withPWA({
    // 既存の設定
  })
);
```

#### バンドルサイズ分析

```bash
ANALYZE=true npm run build
```

ブラウザで自動的に分析結果が開かれます。

### 4. 環境変数設定

**ファイル:** `.env.local`（ローカル開発用）

```bash
# アプリケーション設定
NEXT_PUBLIC_APP_NAME="Offlist"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NEXT_PUBLIC_APP_URL="https://offlist.vercel.app"

# PWA設定
NEXT_PUBLIC_PWA_ENABLED=true

# デバッグモード（本番はfalse）
NEXT_PUBLIC_DEBUG=false
```

**注意:** `.env.local`は`.gitignore`に含めて、Gitにコミットしないこと。

**ファイル:** `.env.production`（本番用）

```bash
NEXT_PUBLIC_APP_URL="https://offlist.vercel.app"
NEXT_PUBLIC_DEBUG=false
```

### 5. package.jsonの最適化

**package.json:**

```json
{
  "name": "offlist",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "analyze": "ANALYZE=true npm run build"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "next-pwa": "^5.6.0",
    "dexie": "^3.2.0",
    "dexie-react-hooks": "^1.1.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "@next/bundle-analyzer": "^14.0.0"
  }
}
```

---

## ローカルビルドテスト

### 1. ビルド実行

```bash
npm run build
```

**成功時の出力例:**

```
> offlist@1.0.0 build
> next build

✓ Creating an optimized production build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (5/5)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                   1.5 kB         85.2 kB
└ ○ /_not-found                         0 B            0 B

○  (Static)  automatically rendered as static HTML (uses no initial props)

PWA: Service Worker has been generated successfully
```

**重要チェックポイント:**

- ✅ `Service Worker has been generated successfully`が表示される
- ✅ エラーなくビルド完了
- ✅ バンドルサイズが適切（First Load JS < 100kB推奨）

### 2. 本番モードで起動

```bash
npm run start
```

ブラウザで`http://localhost:3000`にアクセス。

### 3. 本番モードでの動作確認

#### Service Worker登録確認

**Chrome DevTools:**
1. `Application` タブを開く
2. `Service Workers` → `sw.js`が登録されている
3. `Status: activated and is running`

#### IndexedDB確認

**Chrome DevTools:**
1. `Application` タブ
2. `Storage` → `IndexedDB` → `OfflistDB`
3. アイテムを追加し、データが保存されるか確認

#### オフライン動作テスト（ローカル）

**Chrome DevTools:**
1. `Network` タブ
2. `Offline`にチェック
3. ページをリロード → 正常に表示される
4. アイテムの追加・編集・削除が動作する

### 4. ビルドエラーの対処

#### TypeScriptエラー

```
Type error: Property 'XXX' does not exist on type 'YYY'
```

**対処:**
- 型定義を修正
- `tsconfig.json`の`strict`設定を確認

#### PWAエラー

```
PWA: Failed to generate service worker
```

**対処:**
- `next-pwa`の設定を確認
- `public`ディレクトリに`manifest.json`が存在するか確認

#### メモリ不足エラー

```
FATAL ERROR: Reached heap limit Allocation failed
```

**対処:**

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

---

## Lighthouseテスト

### 1. Chrome DevToolsでLighthouse実行

**手順:**

1. Chrome で`http://localhost:3000`（または本番URL）にアクセス
2. `F12`で DevTools を開く
3. `Lighthouse`タブをクリック
4. 設定:
   - **Mode:** Navigation
   - **Device:** Mobile
   - **Categories:** すべてチェック（Performance, Accessibility, Best Practices, SEO, PWA）
5. `Analyze page load`をクリック

### 2. テスト項目と目標スコア

| カテゴリ | 目標スコア | 重要度 |
|----------|-----------|--------|
| **PWA** | **95-100点** | 最優先 |
| **Performance** | **90点以上** | 高 |
| **Accessibility** | **90点以上** | 中 |
| **Best Practices** | **90点以上** | 中 |
| **SEO** | **90点以上** | 低（買い物リストアプリのため） |

### 3. PWAチェックリスト（Lighthouse）

Lighthouseが確認する項目:

- ✅ **HTTPS配信**: Vercelで自動対応
- ✅ **Service Worker登録**: next-pwaで自動
- ✅ **オフライン動作**: 完全動作すること
- ✅ **manifest.json存在**: PWA設定ファイル
- ✅ **アイコン192x192以上**: 必須
- ✅ **start_urlが200を返す**: `/`がアクセス可能
- ✅ **viewport meta tag**: レスポンシブ対応
- ✅ **theme_color設定**: ステータスバー色

### 4. スコア改善のヒント

#### PWAスコアが低い場合

**問題:** `manifest.json`が見つからない

**対処:**
```html
<!-- app/layout.tsx -->
<head>
  <link rel="manifest" href="/manifest.json" />
</head>
```

**問題:** アイコンサイズ不足

**対処:**
- 192x192と512x512のアイコンを必ず用意
- `manifest.json`で正しく指定

#### Performanceスコアが低い場合

**問題:** First Contentful Paint (FCP) が遅い

**対処:**
- `next/image`を使う
- フォントを`next/font`で最適化
- 初期ロードのJSサイズを削減

**問題:** Cumulative Layout Shift (CLS) が高い

**対処:**
- 画像に`width`と`height`を指定
- フォント読み込みを最適化

#### Accessibilityスコアが低い場合

**問題:** ボタンにアクセシブルな名前がない

**対処:**
```jsx
// Before
<button onClick={handleDelete}>
  <TrashIcon />
</button>

// After
<button onClick={handleDelete} aria-label="Delete item">
  <TrashIcon />
</button>
```

**問題:** コントラスト比不足

**対処:**
- 文字色と背景色のコントラスト比を4.5:1以上に

### 5. Lighthouse レポートの保存

レポートを保存しておくと、改善の証跡になります。

**手順:**
1. Lighthouseテスト完了
2. 右上の`⬇ Save report`をクリック
3. `lighthouse-report-YYYYMMDD.html`として保存

---

## Vercelアカウント準備

### 1. Vercelアカウント作成

**手順:**

1. https://vercel.com にアクセス
2. `Sign Up`をクリック
3. **GitHub アカウントでサインアップ**（推奨）
   - `Continue with GitHub`をクリック
   - GitHubで認証
4. 無料プラン（Hobby）で十分

### 2. GitHub連携

Vercelアカウント作成時にGitHubで認証した場合、自動的に連携されます。

**連携確認:**
1. Vercelダッシュボード → `Settings`
2. `Connected Git Accounts` → GitHub が接続済み

### 3. Vercel CLI インストール（オプション）

CLI経由でデプロイしたい場合:

```bash
npm install -g vercel
```

**ログイン:**

```bash
vercel login
```

メールアドレスを入力し、確認メールのリンクをクリック。

**プロジェクトリンク:**

```bash
vercel link
```

---

## Vercelデプロイ設定

### 1. GitHubリポジトリのプッシュ

#### Gitリポジトリ初期化（まだの場合）

```bash
git init
git add .
git commit -m "Initial commit: Offlist PWA shopping list app"
```

#### GitHubリポジトリ作成

1. https://github.com にアクセス
2. `New repository`をクリック
3. リポジトリ名: `offlist`
4. `Public`（公開） または `Private`（非公開）
5. `Create repository`

#### リモートリポジトリにプッシュ

```bash
git remote add origin https://github.com/YOUR_USERNAME/offlist.git
git branch -M main
git push -u origin main
```

### 2. Vercelでプロジェクトインポート

**手順:**

1. https://vercel.com/dashboard にアクセス
2. `Add New...` → `Project`をクリック
3. `Import Git Repository`
4. GitHub の`offlist`リポジトリを選択
5. `Import`をクリック

### 3. ビルド設定

Vercelが自動検出しますが、念のため確認:

| 項目 | 値 |
|------|-----|
| **Framework Preset** | Next.js |
| **Root Directory** | `./`（デフォルト） |
| **Build Command** | `npm run build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |

### 4. 環境変数設定（必要な場合）

**設定手順:**

1. `Environment Variables`セクションを展開
2. キーと値を入力:

```
NEXT_PUBLIC_APP_URL = https://offlist.vercel.app
NEXT_PUBLIC_DEBUG = false
```

3. `Production`, `Preview`, `Development`のどれに適用するか選択（基本はすべて）

### 5. デプロイ実行

`Deploy`ボタンをクリック。

**デプロイプロセス:**

1. **Building** (1-2分)
   - 依存関係インストール
   - Next.jsビルド
   - Service Worker生成

2. **Deploying** (10-30秒)
   - ビルド成果物をCDNに配信

3. **Ready** (完了)
   - 本番URLが発行される

---

## 本番デプロイ

### 1. デプロイログ確認

**手順:**

1. Vercelダッシュボード → プロジェクト → `Deployments`
2. 最新のデプロイをクリック
3. `Building`ログを確認

**成功時のログ:**

```
Installing dependencies...
npm install

Building application...
npm run build

✓ Creating an optimized production build
✓ PWA: Service Worker has been generated successfully

Uploading...
✓ Deployment ready

https://offlist-xyz123.vercel.app
```

### 2. 本番URLの取得

デプロイ成功後、以下のURLが発行されます:

- **プレビューURL**: `https://offlist-xyz123.vercel.app`（デプロイごとに変わる）
- **本番URL**: `https://offlist.vercel.app`（固定）

**本番URLの確認:**

1. Vercelダッシュボード → プロジェクト
2. `Domains`タブ
3. `offlist.vercel.app`が表示される

### 3. カスタムドメイン設定（オプション）

独自ドメインを使いたい場合:

**手順:**

1. Vercelダッシュボード → プロジェクト → `Settings` → `Domains`
2. `Add Domain`をクリック
3. ドメイン名を入力（例: `offlist.com`）
4. DNSレコードを設定（Vercelが指示してくれる）
5. SSL証明書が自動発行される（数分）

### 4. 継続的デプロイ

Gitにプッシュするだけで自動デプロイされます:

```bash
git add .
git commit -m "Add new feature"
git push origin main
```

**Vercel側の動作:**

1. GitHubのプッシュを検知
2. 自動的にビルド開始
3. 成功したら本番URLに自動反映

---

## PWA動作確認

### 1. 本番URLでのLighthouseテスト

**手順:**

1. Chrome で本番URL（`https://offlist.vercel.app`）にアクセス
2. `F12` → `Lighthouse`
3. **Mode: Navigation, Device: Mobile**
4. `Analyze page load`

**目標:**
- ✅ PWA: 95-100点
- ✅ Performance: 90点以上

### 2. Service Worker登録確認

**Chrome DevTools:**

1. `Application`タブ
2. `Service Workers`
   - ✅ `sw.js`が登録されている
   - ✅ Status: `activated and is running`
   - ✅ Source: `https://offlist.vercel.app/sw.js`

### 3. manifest.json確認

**Chrome DevTools:**

1. `Application`タブ
2. `Manifest`
   - ✅ Name: `Offlist - オフライン買い物リスト`
   - ✅ Short name: `Offlist`
   - ✅ Start URL: `/`
   - ✅ Display: `standalone`
   - ✅ Icons: 192x192, 512x512が表示される

### 4. キャッシュ確認

**Chrome DevTools:**

1. `Application`タブ
2. `Cache Storage`
   - ✅ `offlist-pages`キャッシュ
   - ✅ `offlist-static`キャッシュ
   - ✅ HTML, CSS, JSファイルがキャッシュされている

---

## 実機テスト（iOS）

### 1. Safari でアクセス

**手順:**

1. iPhoneで Safari を起動
2. 本番URL `https://offlist.vercel.app`にアクセス
3. ページが正常に表示されることを確認

### 2. ホーム画面に追加

**手順（スクリーンショット付き）:**

#### ステップ1: 共有ボタンをタップ

![iOS Safari - Share button](https://via.placeholder.com/300x600?text=Safari+Share+Button)

1. Safari下部の**共有ボタン**（四角と矢印のアイコン）をタップ

#### ステップ2: ホーム画面に追加

![iOS - Add to Home Screen](https://via.placeholder.com/300x600?text=Add+to+Home+Screen)

2. メニューから**「ホーム画面に追加」**をタップ

#### ステップ3: アイコン名の確認

![iOS - Confirm icon name](https://via.placeholder.com/300x600?text=Confirm+Icon+Name)

3. アイコン名が「Offlist」になっていることを確認
4. 右上の**「追加」**をタップ

#### ステップ4: ホーム画面にアイコンが追加される

![iOS Home Screen](https://via.placeholder.com/300x600?text=Home+Screen+Icon)

5. ホーム画面にOfflistアイコンが表示される

### 3. アプリとしての起動確認

**手順:**

1. ホーム画面の**Offlistアイコン**をタップ
2. アプリが全画面で起動する（Safari のURLバーなし）
3. スプラッシュスクリーンが表示される（一瞬）

**確認ポイント:**

- ✅ Safariのナビゲーションバーが非表示
- ✅ ステータスバーのみ表示（時計、バッテリーなど）
- ✅ `standalone`モードで動作

### 4. オフライン動作テスト（機内モード）

**手順:**

1. **機内モードをON:**
   - コントロールセンターを開く（画面右上から下にスワイプ）
   - **飛行機アイコン**をタップ
   - 「機内モード」と表示される

2. **Offlistアプリを起動:**
   - ホーム画面の Offlistアイコンをタップ
   - アプリが正常に起動する

3. **アイテム追加:**
   - 「牛乳」を追加
   - リストに即座に反映される

4. **アイテム編集:**
   - 「牛乳」を長押し → 編集
   - 「低脂肪牛乳」に変更
   - 変更が保存される

5. **アイテム削除:**
   - スワイプ → 削除
   - リストから消える

6. **アプリを完全終了して再起動:**
   - アプリを閉じる（ホームボタンまたはスワイプアップ）
   - 再度アプリを開く
   - **データが残っている**（IndexedDBの永続化確認）

**成功基準:**

- ✅ 機内モードでアプリ起動
- ✅ アイテムの追加・編集・削除が動作
- ✅ アプリ終了→再起動後もデータが残る

### 5. iOS固有の注意点

#### インストールプロンプトが表示されない

iOSは`beforeinstallprompt`イベントに非対応のため、手動インストール説明を表示します。

**対処コード:**

```typescript
// components/InstallPrompt.tsx

const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

if (isIOS && !isStandalone) {
  return (
    <div className="ios-install-prompt">
      <p>このアプリをホーム画面に追加するには:</p>
      <ol>
        <li>画面下の共有ボタン（<ShareIcon />）をタップ</li>
        <li>「ホーム画面に追加」をタップ</li>
      </ol>
    </div>
  );
}
```

---

## 実機テスト（Android）

### 1. Chrome でアクセス

**手順:**

1. Android端末で Chrome を起動
2. 本番URL `https://offlist.vercel.app`にアクセス
3. ページが正常に表示されることを確認

### 2. インストールプロンプト確認

**手順:**

#### 自動プロンプト（初回訪問時）

![Android - Install prompt](https://via.placeholder.com/300x600?text=Android+Install+Prompt)

1. ページ表示後、数秒で画面下部に**インストールバナー**が表示される
2. 「Offlist - オフラインでも使える買い物リストアプリ」
3. **「インストール」**ボタンをタップ

#### 手動インストール（メニューから）

![Android - Chrome menu](https://via.placeholder.com/300x600?text=Chrome+Menu)

1. Chrome右上の**⋮**（メニュー）をタップ
2. **「アプリをインストール」**をタップ
3. 確認ダイアログで**「インストール」**

### 3. ホーム画面に追加

**手順:**

#### インストール完了

![Android - Installation complete](https://via.placeholder.com/300x600?text=Installation+Complete)

1. 「Offlistがインストールされました」と表示される
2. **「開く」**をタップするか、ホーム画面に戻る

#### ホーム画面アイコン

![Android Home Screen](https://via.placeholder.com/300x600?text=Android+Home+Screen)

3. ホーム画面にOfflistアイコンが追加される
4. 他のアプリと同様にアイコンが表示される

### 4. オフライン動作テスト（機内モード）

**手順:**

1. **機内モードをON:**
   - 画面上部から下にスワイプ（クイック設定）
   - **飛行機アイコン**をタップ
   - 「機内モード ON」と表示される

2. **Offlistアプリを起動:**
   - ホーム画面の Offlistアイコンをタップ
   - アプリが正常に起動する

3. **完全なオフライン動作確認:**
   - アイテムを追加（「パン」）
   - アイテムを編集（「食パン」に変更）
   - チェックを付ける
   - アイテムを削除

4. **アプリ終了→再起動:**
   - アプリを閉じる（最近のアプリから削除）
   - 再度アプリを開く
   - データが残っている

**成功基準:**

- ✅ 機内モードでアプリ起動
- ✅ すべての機能が動作（追加・編集・削除・チェック）
- ✅ アプリ終了後もデータ永続化

### 5. Android固有の特徴

#### Maskableアイコン

Android 8以降では、アイコンがアダプティブアイコンとして表示されます。

**確認:**
- ホーム画面でアイコンが円形または角丸で表示される
- アイコンの中央80%にロゴが収まっている

#### インストール解除

**手順:**
1. Offlistアイコンを長押し
2. 「アンインストール」をタップ
3. 確認ダイアログで「OK」

---

## オフライン動作テスト詳細

### テストシナリオ1: 完全オフライン

**目的:** ネットワーク接続なしでアプリが完全動作することを証明

**手順:**

1. **準備:**
   - 本番URLにアクセス
   - ホーム画面に追加
   - アプリを起動し、データを1-2件追加
   - アプリを終了

2. **機内モードON:**
   - 完全にネットワークを切断

3. **テスト:**
   - アプリを起動
   - 新しいアイテムを5件追加
   - 各アイテムを編集
   - 各アイテムにチェック
   - 3件のアイテムを削除

4. **永続化確認:**
   - アプリを完全終了
   - 再起動
   - データが残っている

**成功基準:**
- ✅ 起動成功
- ✅ すべての操作が動作
- ✅ データが永続化

### テストシナリオ2: ネットワーク切り替え

**目的:** オンライン⇔オフラインの切り替えに対応

**手順:**

1. **オンライン状態:**
   - アプリ起動
   - アイテム「卵」を追加

2. **オフラインに切り替え:**
   - 機内モードON
   - アイテム「バター」を追加
   - 「卵」を編集

3. **オンラインに戻す:**
   - 機内モードOFF
   - アプリをリロード
   - データがすべて残っている

**成功基準:**
- ✅ オフライン時の操作が反映される
- ✅ オンライン復帰後もデータ維持

### テストシナリオ3: 長期間オフライン

**目的:** 数日間機内モードでもデータが保持される

**手順:**

1. **1日目:**
   - アプリでアイテムを10件追加
   - 機内モードON

2. **2日目:**
   - 機内モードのまま
   - アプリを起動
   - データが残っている
   - 新しいアイテムを追加

3. **3日目:**
   - 機内モードのまま
   - アプリを起動
   - すべてのデータが残っている

**成功基準:**
- ✅ IndexedDBデータが永続化
- ✅ 数日後も完全動作

### テストシナリオ4: ブラウザキャッシュクリア

**目的:** キャッシュクリアしてもデータが残る

**手順:**

1. **データ追加:**
   - アイテムを5件追加

2. **キャッシュクリア:**
   - Chrome → 設定 → プライバシー → 閲覧履歴の削除
   - **「キャッシュされた画像とファイル」のみチェック**
   - **「Cookieとサイトデータ」はチェックしない**

3. **確認:**
   - アプリを起動
   - データが残っている

**成功基準:**
- ✅ キャッシュクリア後もデータ維持

**注意:** 「Cookieとサイトデータ」を削除すると、IndexedDBも削除されます。

---

## チェックリスト

### ビルド・デプロイ

- [ ] `npm run build`成功
- [ ] エラーなくビルド完了
- [ ] Service Worker生成確認
- [ ] GitHubにプッシュ成功
- [ ] Vercelデプロイ成功
- [ ] 本番URLアクセス可能

### PWA動作確認

- [ ] Lighthouse PWAスコア95点以上
- [ ] Lighthouse Performanceスコア90点以上
- [ ] manifest.json読み込み成功
- [ ] Service Worker登録成功
- [ ] アイコン192x192, 512x512表示
- [ ] キャッシュストレージに保存

### iOS実機テスト

- [ ] Safari でアクセス成功
- [ ] ホーム画面に追加成功
- [ ] アイコンが正しく表示
- [ ] `standalone`モードで起動
- [ ] 機内モードでアプリ起動
- [ ] アイテム追加・編集・削除動作
- [ ] アプリ終了→再起動でデータ保持

### Android実機テスト

- [ ] Chrome でアクセス成功
- [ ] インストールプロンプト表示
- [ ] ホーム画面に追加成功
- [ ] アイコンが正しく表示
- [ ] `standalone`モードで起動
- [ ] 機内モードでアプリ起動
- [ ] アイテム追加・編集・削除動作
- [ ] アプリ終了→再起動でデータ保持

### オフライン動作

- [ ] 機内モードで起動成功
- [ ] アイテム追加動作
- [ ] アイテム編集動作
- [ ] アイテム削除動作
- [ ] チェック機能動作
- [ ] カテゴリーフィルター動作
- [ ] データ永続化確認

### デモ準備

- [ ] デモシナリオ作成
- [ ] QRコード生成
- [ ] 本番URLをスマホに送信
- [ ] デモ用サンプルデータ準備

---

## トラブルシューティング

### ビルドエラー

#### 問題: TypeScriptエラー

```
Type error: Property 'XXX' does not exist
```

**原因:** 型定義が不正確

**対処:**

1. 型定義を確認
```typescript
interface ShoppingItem {
  id: string;
  name: string;
  category: 'food' | 'daily' | 'other';
  checked: boolean;
  createdAt: Date;
}
```

2. `tsconfig.json`を確認
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

#### 問題: next-pwaエラー

```
PWA: Failed to generate service worker
```

**原因:** 設定ミスまたは`public`ディレクトリの問題

**対処:**

1. `next.config.js`の設定確認
```javascript
const withPWA = require('next-pwa')({
  dest: 'public', // ← 正しい
  disable: process.env.NODE_ENV === 'development',
});
```

2. `public/manifest.json`が存在するか確認
```bash
ls public/manifest.json
```

3. キャッシュをクリア
```bash
rm -rf .next
npm run build
```

### Service Workerが登録されない

#### 問題: DevToolsで「Service Worker: None」

**原因1:** HTTPSでない

**対処:**
- ローカル開発: `localhost`は例外的にHTTPで動作
- 本番: Vercelは自動的にHTTPS

**原因2:** Service Worker ファイルが生成されていない

**対処:**

1. ビルドログを確認
```bash
npm run build
# ↓ 以下のメッセージがあるか確認
# PWA: Service Worker has been generated successfully
```

2. `public/sw.js`が存在するか確認
```bash
ls public/sw.js
```

**原因3:** スコープの問題

**対処:**

Service Workerは`/`スコープで登録されているか確認:

```javascript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  scope: '/', // ← 追加
  sw: 'sw.js',
});
```

### iOS Safariでインストールできない

#### 問題: 「ホーム画面に追加」が表示されない

**原因:** manifest.jsonがリンクされていない

**対処:**

```html
<!-- app/layout.tsx -->
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="apple-mobile-web-app-title" content="Offlist" />
  <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
</head>
```

#### 問題: インストールしてもブラウザで開く

**原因:** `display: standalone`が設定されていない

**対処:**

```json
// manifest.json
{
  "display": "standalone"
}
```

### オフライン動作しない

#### 問題: 機内モードでページが表示されない

**原因1:** Service Workerが動作していない

**対処:**

1. DevToolsでService Worker確認
```
Application → Service Workers → Status: activated
```

2. キャッシュを確認
```
Application → Cache Storage → offlist-pages
```

**原因2:** ネットワークタイムアウト設定が短い

**対処:**

```javascript
// next.config.js
runtimeCaching: [
  {
    urlPattern: /^https?.*/,
    handler: 'NetworkFirst',
    options: {
      networkTimeoutSeconds: 10, // ← タイムアウトを長めに
    },
  },
],
```

#### 問題: IndexedDBデータが消える

**原因:** ブラウザのストレージクリアまたは容量不足

**対処:**

1. ストレージ使用量を確認
```javascript
if (navigator.storage && navigator.storage.estimate) {
  navigator.storage.estimate().then(estimate => {
    console.log(`使用量: ${estimate.usage} / ${estimate.quota}`);
  });
}
```

2. 容量不足の場合、古いデータを削除
```typescript
// 30日以上前のチェック済みアイテムを削除
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

await db.items
  .where('checked').equals(true)
  .and(item => item.createdAt < thirtyDaysAgo)
  .delete();
```

### Lighthouseスコアが低い

#### PWAスコアが95点未満

**問題:** アイコンサイズ不足

**対処:**
- 192x192と512x512のアイコンを必ず用意
- `manifest.json`で正しく指定

**問題:** オフライン動作しない

**対処:**
- Service Workerのキャッシュ戦略を確認
- NetworkFirstまたはCacheFirstを使用

#### Performanceスコアが90点未満

**問題:** First Contentful Paint (FCP) が遅い

**対処:**

1. 画像最適化
```jsx
import Image from 'next/image';

<Image src="/icon.png" width={96} height={96} priority />
```

2. フォント最適化
```jsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

3. コード分割
```jsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

---

## デモ準備

### 1. デモシナリオ（3分以内）

**タイムライン:**

| 時間 | アクション | セリフ |
|------|-----------|--------|
| **0:00-0:30** | 導入 | 「Offlistという買い物リストアプリを作りました。ただの買い物リストですが、PWA技術を使っています」 |
| **0:30-1:30** | インストール | 「スマホでこのURLにアクセスして…ホーム画面に追加します。ほら、アイコンが並びましたね」 |
| **1:30-2:30** | クライマックス | **「ここで、スマホを機内モードにしてみてください」** → アプリを起動 → 「圏外なのに…ほら、動くでしょう?」 |
| **2:30-3:00** | ビジネス展開 | 「これがPWAです。ECサイトなら、オフラインでも商品閲覧可能。iOS/Android両開発より低コストです」 |

### 2. デモ用サンプルデータ

デモ前にいくつかアイテムを追加しておくと、リストの様子が伝わりやすい:

```
食品:
- 牛乳
- 卵
- パン

日用品:
- トイレットペーパー
- 洗剤

その他:
- 電池
```

### 3. QRコード生成（簡単アクセス）

参加者がスマホで簡単にアクセスできるよう、QRコードを用意:

**オンラインツール:**
- https://www.qr-code-generator.com/
- https://qr.io/

**手順:**
1. 本番URL `https://offlist.vercel.app`を入力
2. QRコード生成
3. ダウンロード（PNG）
4. プレゼンテーション資料に貼り付け

**または、コマンドラインで生成:**

```bash
npm install -g qrcode
qrcode "https://offlist.vercel.app" -o qrcode.png
```

### 4. プレゼンテーション資料

**スライド構成（3-5枚）:**

#### スライド1: タイトル

```
Offlist
オフラインファーストPWA買い物リストアプリ

[QRコード]
https://offlist.vercel.app
```

#### スライド2: 課題

```
スーパーの地下で…

「あれ、リストが見られない!」

→ 電波がないと使えないアプリ
```

#### スライド3: 解決策

```
PWA (Progressive Web App)

✅ オフラインで完全動作
✅ インストール不要
✅ iOS/Android両対応
```

#### スライド4: デモ（機内モード）

```
[スクリーンショット]

機内モードでも動く!
```

#### スライド5: ビジネス活用

```
PWA活用例:

🛒 EC: オフラインでも商品閲覧
📅 イベント: 当日のタイムテーブル
📊 企業アプリ: 低コストでアプリ化

iOS/Android両開発より
開発期間 1/3、コスト 1/2
```

### 5. デモ時の注意点

#### 事前準備

- ✅ スマホをフル充電
- ✅ 本番URLにアクセス確認
- ✅ ホーム画面にインストール済み
- ✅ サンプルデータ入力済み
- ✅ QRコードを表示可能

#### リハーサル

デモ前に2-3回リハーサル:

1. **タイミング確認:** 3分以内に収まるか
2. **機内モード切り替え:** スムーズにできるか
3. **予想質問への回答:** 「どうやって作ったか?」「費用は?」など

#### トラブル対策

**問題:** Wi-Fiが不安定

**対処:** モバイルデータ通信に切り替え

**問題:** アプリがクラッシュ

**対処:** 事前に複数デバイスで動作確認

---

## 次のステップ

### Phase 7以降（クラウド同期、ユーザー認証など）

MVP完成後、以下の拡張を検討:

#### Phase 7: ユーザー認証

**技術:**
- NextAuth.js
- Google/GitHub OAuth

**目的:**
- 複数デバイスでの利用
- アカウント管理

**所要時間:** 2-3時間

#### Phase 8: クラウド同期

**技術:**
- Neon PostgreSQL
- Prisma ORM

**目的:**
- オフライン→オンライン時の自動同期
- 複数デバイス間のデータ共有

**所要時間:** 4-6時間

**同期戦略:**

```
オフライン時:
  IndexedDB に保存

オンライン復帰時:
  1. ローカルの変更をサーバーに送信
  2. サーバーの最新データを取得
  3. 競合があれば解決（最終更新優先）
  4. IndexedDBとサーバーDBを同期
```

#### Phase 9: 複数リスト管理

**機能:**
- 「週末用」「平日用」などリストの分類
- リスト間のアイテム移動
- リストごとの色分け

**所要時間:** 2-3時間

#### Phase 10: 共有機能

**技術:**
- WebSocket（リアルタイム同期）
- Pusher または Supabase Realtime

**機能:**
- 家族やチームとのリスト共有
- リアルタイム同期

**所要時間:** 4-6時間

### メンテナンス計画

#### 定期的なアップデート

**月次:**
- 依存関係の更新
```bash
npm outdated
npm update
```

**四半期ごと:**
- Next.js メジャーバージョンアップデート
- Lighthouseテスト再実施

#### セキュリティ対策

**npm audit実行:**
```bash
npm audit
npm audit fix
```

**dependabotを有効化:**

GitHubリポジトリで自動的に依存関係の脆弱性を検出・修正。

**手順:**
1. GitHub リポジトリ → `Settings`
2. `Security & analysis`
3. `Dependabot alerts` → Enable

### ユーザーフィードバック収集

#### Google Analytics（オプション）

**インストール:**
```bash
npm install @next/third-parties
```

**設定:**
```jsx
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

#### フィードバックフォーム

**簡易版:**
```jsx
// components/Feedback.tsx
export function Feedback() {
  return (
    <a
      href="https://forms.gle/XXXXX"
      target="_blank"
      className="text-blue-500 underline"
    >
      フィードバックを送る
    </a>
  );
}
```

### パフォーマンス監視

#### Vercel Analytics

**有効化:**
1. Vercelダッシュボード → プロジェクト
2. `Analytics`タブ
3. `Enable Analytics`

**メリット:**
- Core Web Vitals監視
- ページビュー解析
- デバイス・地域別データ

---

## まとめ

### Phase 6で達成したこと

- ✅ Vercelへの本番デプロイ成功
- ✅ Lighthouse PWAスコア95点以上達成
- ✅ iOS/Android実機でのオフライン動作確認
- ✅ デモ準備完了

### MVPの完成

**Phase 1-6を完了し、Offlistは完全に動作するPWAとして公開されました。**

**核心的価値:**
> 「機内モードでも完璧に動く」という驚きの体験を、誰でもスマホ1台で確認できる

### デモでのアピールポイント

1. **インストールの手軽さ:** 「App Store不要、ブラウザだけで完結」
2. **オフライン動作:** 「機内モードにしてください…ほら、動くでしょう?」
3. **ビジネス展開:** 「これがあなたのサービスでも実現できます」

### 最終チェック

デプロイ前に最後の確認:

```bash
# ビルド成功
npm run build

# Lighthouseテスト（PWA 95点以上）
# Chrome DevTools → Lighthouse

# 実機テスト
# iOS: Safari → ホーム画面に追加 → 機内モード
# Android: Chrome → インストール → 機内モード

# すべてOKなら…
git add .
git commit -m "Production ready: Offlist PWA v1.0"
git push origin main
```

---

**おめでとうございます! OfflistのMVPが完成しました。**

**次のアクション:**
1. 交流会やSNSでデモ
2. ユーザーフィードバック収集
3. Phase 7以降の拡張を検討

---

**ドキュメント作成日**: 2025年10月23日
**Phase**: 6/6
**ステータス**: MVP完成
**バージョン**: 1.0
