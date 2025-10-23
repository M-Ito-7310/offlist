# Phase 1: Project Setup

**Priority**: 🔴 Critical (MVP必須)
**Estimated Time**: 45-60 minutes
**Status**: ⬜ Not Started

---

## 概要

Next.js 14 + PWA の基盤を構築します。このPhaseでは、プロジェクトの初期化、必須ライブラリのインストール、基本設定を完了させます。

**Goal**: 開発可能な状態のNext.jsプロジェクトとPWA基本設定の完成

---

## タスクチェックリスト

### Task 1.1: Next.js 14 プロジェクト初期化 (10分)

- [ ] Next.js 14プロジェクトを作成
- [ ] TypeScript, ESLint, Tailwind CSSを選択
- [ ] App Routerを選択
- [ ] `src/` ディレクトリを使用

**コマンド**:
```bash
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir
```

**検証**:
```bash
ls -la
# package.json, next.config.js, tsconfig.json, tailwind.config.ts の存在確認
```

**参考**: [Next.js Installation](https://nextjs.org/docs/getting-started/installation)

---

### Task 1.2: 依存関係のインストール (5分)

- [ ] next-pwa をインストール
- [ ] Dexie.js をインストール (IndexedDB用)
- [ ] UUID生成ライブラリをインストール

**コマンド**:
```bash
npm install next-pwa
npm install dexie
npm install uuid
npm install --save-dev @types/uuid
```

**検証**:
```bash
cat package.json | grep "next-pwa\|dexie\|uuid"
```

---

### Task 1.3: PWA基本設定 (next.config.js) (15分)

- [ ] `next.config.js` を `next.config.mjs` に変更
- [ ] next-pwaの設定を追加
- [ ] Service Worker設定
- [ ] Static Export設定 (Vercelデプロイ用)

**ファイル**: `next.config.mjs`

```javascript
import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // 開発時は無効化
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'export', // Static Export (必要に応じて有効化)
};

export default withPWA(nextConfig);
```

**検証**:
```bash
npm run dev
# http://localhost:3000 にアクセスして動作確認
```

---

### Task 1.4: Tailwind CSS カスタマイズ (10分)

- [ ] iOS/Android風のカラーパレットを設定
- [ ] フォント設定をカスタマイズ
- [ ] レスポンシブブレークポイントを確認

**ファイル**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#007AFF', // iOS Blue
          dark: '#0A84FF',
        },
        success: '#34C759', // iOS Green
        warning: '#FF9500', // iOS Orange
        danger: '#FF3B30', // iOS Red
        background: {
          light: '#F2F2F7',
          dark: '#000000',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1C1C1E',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

**検証**:
```bash
# src/app/page.tsx で Tailwind クラスを使用
# className="bg-primary text-white" などを試す
```

---

### Task 1.5: TypeScript設定最適化 (5分)

- [ ] `tsconfig.json` の設定を確認
- [ ] strict mode を有効化
- [ ] パスエイリアスを設定 (`@/` で `src/` を参照)

**ファイル**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
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
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**検証**:
```bash
npx tsc --noEmit
# エラーが出ないことを確認
```

---

### Task 1.6: ディレクトリ構造作成 (5分)

- [ ] 必要なディレクトリを作成
- [ ] 空の `.gitkeep` ファイルで構造を保持

**コマンド**:
```bash
mkdir -p src/components
mkdir -p src/lib
mkdir -p src/types
mkdir -p public/icons

touch src/components/.gitkeep
touch src/lib/.gitkeep
touch src/types/.gitkeep
touch public/icons/.gitkeep
```

**検証**:
```bash
tree -L 2 src
# src/
# ├── app/
# ├── components/
# ├── lib/
# └── types/
```

---

### Task 1.7: Git初期化 (5分)

- [ ] Gitリポジトリを初期化
- [ ] `.gitignore` の確認
- [ ] 初回コミット

**コマンド**:
```bash
git init
git add .
git commit -m "Initial commit: Next.js 14 + PWA setup"
```

**検証**:
```bash
git log --oneline
# Initial commit が確認できる
```

---

### Task 1.8: 動作確認 (5分)

- [ ] 開発サーバーが起動できる
- [ ] ブラウザでアクセス可能
- [ ] Tailwind CSSが適用されている
- [ ] TypeScriptエラーがない

**コマンド**:
```bash
npm run dev
```

**確認項目**:
- ブラウザで `http://localhost:3000` にアクセス
- Next.jsのデフォルトページが表示される
- DevToolsでエラーがない
- Tailwindのクラスが効いている

---

## 成果物

- ✅ Next.js 14プロジェクト
- ✅ PWA基本設定完了
- ✅ Tailwind CSSカスタマイズ完了
- ✅ TypeScript設定完了
- ✅ ディレクトリ構造完成
- ✅ Git初期化完了

---

## 検証コマンド

```bash
# 全体チェック
npm run dev  # 開発サーバー起動
npm run build  # ビルドチェック
npm run lint  # Lintチェック
npx tsc --noEmit  # 型チェック
```

---

## 次のPhase

Phase 2: PWA Configuration (manifest.json, Service Worker, アイコン作成)

**コマンド**: `/next-ticket` で Phase 2 に進む

---

## トラブルシューティング

### `create-next-app` が失敗する
```bash
# Node.jsバージョン確認 (18.x以上必要)
node --version

# npmキャッシュクリア
npm cache clean --force
```

### next-pwaでエラー
```bash
# 最新版を再インストール
npm uninstall next-pwa
npm install next-pwa@latest
```

### TypeScriptエラー
```bash
# node_modulesを再インストール
rm -rf node_modules package-lock.json
npm install
```

---

**関連ドキュメント**:
- [docs/idea/01-project-overview.md](../../idea/01-project-overview.md)
- [docs/idea/02-architecture.md](../../idea/02-architecture.md)
- [docs/implementation/20251023_00-overview.md](../../implementation/20251023_00-overview.md)

**作成日**: 2025-10-23
**最終更新**: 2025-10-23
