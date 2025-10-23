# Phase 1: プロジェクトセットアップ

**作成日**: 2025年10月23日
**Phase番号**: Phase 1 / 6
**所要時間**: 60分
**難易度**: 初級

---

## 目次

1. [Phase概要](#phase概要)
2. [前提条件](#前提条件)
3. [セットアップ手順](#セットアップ手順)
4. [設定ファイル詳細](#設定ファイル詳細)
5. [動作確認](#動作確認)
6. [トラブルシューティング](#トラブルシューティング)
7. [チェックリスト](#チェックリスト)
8. [次のステップ](#次のステップ)

---

## Phase概要

### 目的

Next.js 14 + PWA基盤を構築し、開発環境を整える。このPhaseでは以下を実現します:

- Next.js 14 (App Router) プロジェクトの初期化
- TypeScript 5+ の型安全な開発環境
- Tailwind CSS 3+ によるスタイリング基盤
- next-pwa によるPWA対応
- 統一されたディレクトリ構造
- バージョン管理（Git）の開始

### プロジェクトにおける位置づけ

```
Phase 1 (現在) → Phase 2 (PWA設定) → Phase 3 (IndexedDB) → ...
    ↓
  基盤構築
```

このPhaseは全ての土台となる重要なステップです。ここで正しく設定することで、後続のPhaseがスムーズに進みます。

### 所要時間の内訳

| タスク | 時間 |
|--------|------|
| Next.jsプロジェクト初期化 | 10分 |
| TypeScript設定 | 5分 |
| Tailwind CSS設定 | 10分 |
| next-pwaインストール・設定 | 15分 |
| ディレクトリ構造作成 | 10分 |
| Git初期化と動作確認 | 10分 |
| **合計** | **60分** |

---

## 前提条件

### 必須環境

| ツール | 必須バージョン | 確認コマンド |
|--------|--------------|------------|
| **Node.js** | 18.x 以上 | `node --version` |
| **npm** | 9.x 以上 | `npm --version` |
| **Git** | 2.x 以上 | `git --version` |

### 推奨ツール

- **エディタ**: Visual Studio Code
- **ブラウザ**: Chrome / Edge (DevTools用)
- **ターミナル**: PowerShell / Command Prompt / Git Bash

### バージョン確認

```bash
# Node.jsバージョン確認
node --version
# 出力例: v18.17.0 または v20.x.x

# npmバージョン確認
npm --version
# 出力例: 9.8.1

# Gitバージョン確認
git --version
# 出力例: git version 2.42.0
```

### Node.jsのインストール（必要な場合）

公式サイトからLTS版をダウンロード:
https://nodejs.org/

---

## セットアップ手順

### Step 1: Next.jsプロジェクト初期化

#### 1.1 プロジェクトフォルダへ移動

```bash
cd C:\Users\mitoi\Desktop\Projects\Offlist
```

#### 1.2 Next.jsプロジェクト作成

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

**コマンド解説:**

| オプション | 説明 |
|-----------|------|
| `.` | 現在のディレクトリに作成（既存フォルダ内） |
| `--typescript` | TypeScriptを使用 |
| `--tailwind` | Tailwind CSSをインストール |
| `--app` | App Routerを使用（Pages Routerではない） |
| `--no-src-dir` | srcディレクトリを作成しない |
| `--import-alias "@/*"` | `@/`エイリアスを設定 |

#### 1.3 対話的プロンプト

create-next-appから質問される場合、以下のように回答:

```
? Would you like to use ESLint? › Yes
? Would you like to use Turbopack? › No
? Would you like to customize the default import alias? › No
```

#### 1.4 生成されるファイル構造

```
Offlist/
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

### Step 2: 依存関係のインストール

#### 2.1 next-pwaのインストール

```bash
npm install next-pwa
```

#### 2.2 Dexie.jsのインストール（IndexedDB用）

```bash
npm install dexie
```

#### 2.3 開発用パッケージ（オプション）

```bash
npm install -D @types/node
```

#### 2.4 インストール確認

```bash
npm list next-pwa dexie
```

**期待される出力:**
```
Offlist@0.1.0 C:\Users\mitoi\Desktop\Projects\Offlist
├── dexie@x.x.x
└── next-pwa@x.x.x
```

---

### Step 3: next-pwa設定

#### 3.1 next.config.jsの編集

既存の`next.config.js`を以下の内容で置き換えます:

```javascript
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
```

**設定解説:**

| プロパティ | 値 | 説明 |
|-----------|---|------|
| `dest` | `'public'` | Service Workerの出力先 |
| `disable` | `process.env.NODE_ENV === 'development'` | 開発環境では無効化（高速化） |
| `register` | `true` | 自動でService Workerを登録 |
| `skipWaiting` | `true` | 新しいService Workerを即座に有効化 |

---

### Step 4: TypeScript設定

#### 4.1 tsconfig.jsonの確認

create-next-appで自動生成されたtsconfig.jsonを確認します:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 4.2 重要な設定項目

| プロパティ | 説明 |
|-----------|------|
| `"strict": true` | 厳格な型チェックを有効化 |
| `"paths": {"@/*": ["./*"]}` | `@/`でルートディレクトリを参照可能 |
| `"lib": ["dom", ...]` | DOM API + 最新ESの型定義 |

**型チェックの恩恵:**
- コンパイル時にエラー検出
- IDEの自動補完
- リファクタリングの安全性

---

### Step 5: Tailwind CSS設定

#### 5.1 tailwind.config.tsの編集

既存のファイルを以下の内容で置き換えます:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF', // iOS Blue
          dark: '#0051D5',
        },
        background: {
          DEFAULT: '#FFFFFF',
          secondary: '#F2F2F7',
        },
        text: {
          primary: '#000000',
          secondary: '#8E8E93',
        },
      },
      animation: {
        'slideUp': 'slideUp 0.3s ease-out',
        'fadeIn': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

**カスタマイズ内容:**

- **colors.primary**: iOS標準のブルー（#007AFF）
- **colors.background**: ホワイトとiOS風のセカンダリ背景
- **animations**: スライドアップとフェードインアニメーション

#### 5.2 globals.cssの編集

`app/globals.css`を以下の内容で置き換えます:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-background text-text-primary;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors;
  }

  .btn-secondary {
    @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors;
  }

  .input-field {
    @apply w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
  }

  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-200 p-4;
  }
}

@layer utilities {
  .safe-area-inset {
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}
```

**カスタムクラス解説:**

| クラス | 用途 |
|--------|------|
| `.btn-primary` | 主要なアクションボタン |
| `.btn-secondary` | 副次的なボタン |
| `.input-field` | テキスト入力フィールド |
| `.card` | カード型コンテナ |
| `.safe-area-inset` | iOSのノッチ対応 |

---

### Step 6: ディレクトリ構造の作成

#### 6.1 必要なフォルダを作成

```bash
# Windowsの場合
mkdir components
mkdir lib
mkdir public\icons
mkdir public\screenshots

# macOS/Linuxの場合
mkdir -p components lib public/icons public/screenshots
```

#### 6.2 完成後のディレクトリ構造

```
Offlist/
├── app/                      # Next.js App Router
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/               # Reactコンポーネント
│   └── (空 - 後で追加)
├── lib/                      # ユーティリティ・ロジック
│   └── (空 - Phase 3でIndexedDB設定を追加)
├── public/                   # 静的ファイル
│   ├── icons/               # PWAアイコン
│   ├── screenshots/         # PWAスクリーンショット
│   └── manifest.json        # (Phase 2で追加)
├── docs/                     # ドキュメント（既存）
│   ├── idea/
│   ├── implementation/
│   └── ticket/
├── .gitignore
├── next.config.js           # Next.js + PWA設定
├── package.json
├── tailwind.config.ts       # Tailwind設定
├── tsconfig.json            # TypeScript設定
└── README.md
```

---

### Step 7: Git初期化

#### 7.1 Gitリポジトリ初期化

```bash
git init
```

#### 7.2 .gitignoreの確認

create-next-appで自動生成された`.gitignore`に以下が含まれているか確認:

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# PWA files
**/public/sw.js
**/public/workbox-*.js
**/public/worker-*.js
**/public/sw.js.map
**/public/workbox-*.js.map
**/public/worker-*.js.map
```

#### 7.3 PWA関連を追加（重要）

`.gitignore`の末尾に以下を追加:

```gitignore
# PWA files
**/public/sw.js
**/public/workbox-*.js
**/public/worker-*.js
**/public/sw.js.map
**/public/workbox-*.js.map
**/public/worker-*.js.map
```

**理由:** next-pwaが自動生成するService Workerファイルはビルド時に生成されるため、バージョン管理の対象外にします。

#### 7.4 初回コミット

```bash
# ファイルをステージング
git add .

# コミット
git commit -m "feat: Initialize Next.js 14 + PWA project

- Setup Next.js 14 with App Router
- Configure TypeScript 5+
- Setup Tailwind CSS with custom theme
- Install next-pwa for PWA support
- Create project directory structure
- Configure Git with proper .gitignore"
```

---

## 設定ファイル詳細

### package.json

プロジェクト初期化後の`package.json`:

```json
{
  "name": "offlist",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.x.x",
    "react": "^18",
    "react-dom": "^18",
    "next-pwa": "^5.x.x",
    "dexie": "^3.x.x"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.0",
    "eslint": "^8",
    "eslint-config-next": "14.x.x"
  }
}
```

#### カスタムスクリプトの追加

`package.json`の`scripts`セクションに追加:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "type-check": "tsc --noEmit"
}
```

**スクリプト解説:**

| コマンド | 用途 |
|----------|------|
| `npm run dev` | 開発サーバー起動（http://localhost:3000） |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番サーバー起動 |
| `npm run lint` | ESLintでコード品質チェック |
| `npm run type-check` | TypeScript型チェック（ビルドなし） |

---

### next.config.js（完全版）

```javascript
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
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

const nextConfig = {
  reactStrictMode: true,

  // 本番ビルド最適化
  swcMinify: true,

  // 画像最適化
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = withPWA(nextConfig);
```

**追加設定の解説:**

- **runtimeCaching**: Service Workerのキャッシュ戦略
  - `NetworkFirst`: HTML（常に最新を取得、オフライン時はキャッシュ）
  - `CacheFirst`: 静的リソース（高速化優先）

- **swcMinify**: SWCによる高速ビルド
- **images.formats**: 次世代画像フォーマット対応

---

### app/layout.tsx（ルートレイアウト）

`app/layout.tsx`を以下の内容で置き換えます:

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Offlist - オフライン買い物リスト",
  description: "圏外でも使える買い物リストアプリ。スーパーの地下でもサクサク動作します。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Offlist",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="theme-color" content="#007AFF" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

**メタデータ解説:**

| プロパティ | 説明 |
|-----------|------|
| `manifest` | PWA manifest.jsonへのリンク |
| `appleWebApp.capable` | iOSでスタンドアロン表示を有効化 |
| `appleWebApp.statusBarStyle` | iOSステータスバーのスタイル |
| `theme-color` | ブラウザのテーマカラー（#007AFF = iOS Blue） |

---

### app/page.tsx（トップページ）

`app/page.tsx`を以下のシンプルな内容で置き換えます:

```typescript
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-4">
          Offlist
        </h1>
        <p className="text-center text-text-secondary mb-8">
          オフライン買い物リストアプリ
        </p>
        <div className="card">
          <p className="text-center">
            Phase 1: プロジェクトセットアップ完了
          </p>
          <p className="text-sm text-text-secondary text-center mt-2">
            開発サーバーが正常に動作しています
          </p>
        </div>
      </div>
    </main>
  );
}
```

---

## 動作確認

### Step 1: 開発サーバー起動

```bash
npm run dev
```

**期待される出力:**
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env

 ✓ Ready in 2.3s
```

### Step 2: ブラウザで確認

1. ブラウザで http://localhost:3000 にアクセス
2. 以下が表示されることを確認:
   - タイトル「Offlist」
   - 説明文「オフライン買い物リストアプリ」
   - カード内に「Phase 1: プロジェクトセットアップ完了」

### Step 3: Tailwind CSSの動作確認

ページが以下のスタイルで表示されているか確認:

- 背景が白色
- カードに影とボーダー
- iOS風のシンプルなデザイン

**確認方法:**
- Chrome DevToolsを開く（F12）
- 要素を検証（右クリック → 検証）
- Tailwindクラスが適用されているか確認

### Step 4: TypeScript型チェック

```bash
npm run type-check
```

**期待される出力:**
```
# エラーがなければ何も表示されない
```

エラーが表示された場合は、エラーメッセージを確認して修正してください。

### Step 5: ESLintチェック

```bash
npm run lint
```

**期待される出力:**
```
✔ No ESLint warnings or errors
```

---

## トラブルシューティング

### 問題1: `npm run dev`でエラー

#### エラー内容
```
Error: Cannot find module 'next-pwa'
```

#### 解決方法
```bash
npm install next-pwa
```

---

### 問題2: TypeScriptエラー

#### エラー内容
```
Cannot find module '@/components/...' or its corresponding type declarations
```

#### 解決方法

`tsconfig.json`の`paths`設定を確認:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

VSCodeを再起動してTypeScriptサーバーをリロード:
- `Ctrl + Shift + P` → "TypeScript: Restart TS Server"

---

### 問題3: Tailwindクラスが適用されない

#### 確認事項

1. `tailwind.config.ts`の`content`配列を確認:
```typescript
content: [
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
],
```

2. `globals.css`で`@tailwind`ディレクティブがあるか確認:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. 開発サーバーを再起動:
```bash
# Ctrl+Cで停止
npm run dev
```

---

### 問題4: ポート3000が使用中

#### エラー内容
```
Error: listen EADDRINUSE: address already in use :::3000
```

#### 解決方法

**オプション1: 他のプロセスを終了**
```bash
# Windowsの場合
netstat -ano | findstr :3000
taskkill /PID <プロセスID> /F

# macOS/Linuxの場合
lsof -ti:3000 | xargs kill -9
```

**オプション2: 別のポートを使用**
```bash
npm run dev -- -p 3001
```

---

### 問題5: Gitコミットできない

#### エラー内容
```
fatal: not a git repository
```

#### 解決方法
```bash
git init
```

---

## チェックリスト

### 必須項目

- [ ] Node.js 18.x以上がインストール済み
- [ ] Next.jsプロジェクトが作成された
- [ ] `npm install`が成功
- [ ] next-pwaとdexieがインストール済み
- [ ] `next.config.js`にPWA設定を追加
- [ ] `tailwind.config.ts`をカスタマイズ
- [ ] `app/globals.css`にカスタムクラスを追加
- [ ] ディレクトリ構造を作成（components, lib, public/icons）
- [ ] `.gitignore`にPWAファイルを追加
- [ ] `npm run dev`で開発サーバーが起動
- [ ] http://localhost:3000 でページが表示される
- [ ] Tailwind CSSのスタイルが適用されている
- [ ] `npm run type-check`でエラーなし
- [ ] `npm run lint`でエラーなし
- [ ] Gitで初回コミット完了

### 推奨項目

- [ ] VSCodeで`tsconfig.json`の@パスエイリアスが機能
- [ ] Chrome DevToolsでTailwindクラスが確認できる
- [ ] `package.json`のカスタムスクリプトを追加
- [ ] `app/layout.tsx`でPWAメタデータを設定
- [ ] `app/page.tsx`で動作確認用UIを表示

---

## 次のステップ

### Phase 2へ進む準備

Phase 1が完了したら、次はPWA機能の実装に進みます:

**Phase 2の内容:**
- manifest.json作成・カスタマイズ
- PWAアイコン作成（72x72〜512x512）
- Service Worker設定の詳細化
- インストールプロンプトコンポーネント
- オンライン/オフライン状態検知

**Phase 2ドキュメント:** `20251023_02-pwa-configuration.md`

### 今できること

Phase 2に進む前に、以下を試すことができます:

1. **Tailwindクラスで実験**
   - `app/page.tsx`を編集して、カスタムクラス（`.btn-primary`, `.card`など）を試す
   - ホットリロードで即座に反映される

2. **TypeScriptの型安全性を体験**
   - `app/page.tsx`でコンポーネントを作成
   - 型エラーをVSCodeで確認

3. **ディレクトリ構造の理解**
   - `components/`に簡単なコンポーネントを作成
   - `lib/`にユーティリティ関数を作成

---

## まとめ

### Phase 1で達成したこと

- Next.js 14 + TypeScript 5 + Tailwind CSS 3 の開発環境構築
- next-pwaによるPWA対応の基盤準備
- 統一されたプロジェクト構造
- Gitによるバージョン管理開始

### 重要ポイント

1. **next-pwa設定**: `next.config.js`でPWA機能を有効化
2. **Tailwindカスタム**: iOS風のカラーテーマとカスタムクラス
3. **型安全性**: TypeScriptの厳格モードで開発効率向上
4. **ディレクトリ構造**: スケーラブルな構成

### Phase 2への接続

Phase 1で構築した基盤の上に、Phase 2ではPWA機能を実装します。manifest.jsonやアイコン、インストールプロンプトを追加し、「ホーム画面へのインストール」を実現します。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
**関連ドキュメント**:
- [全体概要](./20251023_00-overview.md)
- [Phase 2: PWA設定](./20251023_02-pwa-configuration.md) (次のステップ)
