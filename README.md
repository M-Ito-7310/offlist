# Offlist - オフラインファースト買い物リストPWA

**オフラインでも完璧に動作する、次世代の買い物リストアプリ**

[![Lighthouse Performance](https://img.shields.io/badge/Performance-100-brightgreen)](https://offlist.kaleidofuture.com/)
[![Lighthouse Best Practices](https://img.shields.io/badge/Best%20Practices-100-brightgreen)](https://offlist.kaleidofuture.com/)
[![Lighthouse SEO](https://img.shields.io/badge/SEO-100-brightgreen)](https://offlist.kaleidofuture.com/)

## 🌐 Live Demo

**本番環境**: https://offlist.kaleidofuture.com/

**QRコード** (スマホでアクセス):

![QR Code](https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://offlist.kaleidofuture.com/)

---

## ✨ 特徴

### 🚀 オフラインファースト
- **機内モードでも完璧に動作**
- Service Workerによる完全なオフライン対応
- IndexedDBでローカルデータ永続化

### 📱 Progressive Web App (PWA)
- ホーム画面にインストール可能
- ネイティブアプリのようなUX
- App Store不要

### ⚡ 高速パフォーマンス
- Lighthouse Performance: **100/100**
- First Load JS: 121 KB
- First Contentful Paint: 793ms

### 🎨 ミニマルデザイン
- シンプルで使いやすいUI
- レスポンシブデザイン
- スムーズなアニメーション

---

## 🛠 技術スタック

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: IndexedDB (Dexie.js)
- **PWA**: next-pwa
- **Deployment**: Vercel
- **Repository**: GitHub

---

## 📦 機能

- ✅ アイテムの追加・編集・削除
- ✅ チェック機能（購入済み管理）
- ✅ カテゴリーフィルター
- ✅ オフライン完全対応
- ✅ データ永続化
- ✅ インストールプロンプト
- ✅ オフライン状態インジケーター

---

## 🚀 ローカル開発

### 必要要件

- Node.js 18以上
- npm / yarn / pnpm / bun

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/M-Ito-7310/offlist.git
cd offlist

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### ビルド

```bash
# プロダクションビルド
npm run build

# プロダクションサーバー起動
npm run start
```

---

## 📱 実機テスト

### iOS (Safari)

1. https://offlist.kaleidofuture.com/ を開く
2. 共有ボタン → 「ホーム画面に追加」
3. ホーム画面からアプリを起動
4. 機内モードONで動作確認 ✈️

### Android (Chrome)

1. https://offlist.kaleidofuture.com/ を開く
2. インストールプロンプト → 「インストール」
3. ホーム画面からアプリを起動
4. 機内モードONで動作確認 ✈️

---

## 📊 パフォーマンス

### Lighthouse スコア

| カテゴリー | スコア |
|-----------|--------|
| Performance | 100 |
| Best Practices | 100 |
| SEO | 100 |
| Accessibility | 77 |

### メトリクス

- **FCP** (First Contentful Paint): 793ms
- **LCP** (Largest Contentful Paint): 1,657ms
- **TBT** (Total Blocking Time): 5ms
- **CLS** (Cumulative Layout Shift): 0

---

## 📂 プロジェクト構造

```
offlist/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # メインページ
│   │   ├── layout.tsx    # ルートレイアウト
│   │   └── globals.css   # グローバルスタイル
│   ├── components/       # Reactコンポーネント
│   │   ├── AddItemForm.tsx
│   │   ├── ShoppingItem.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── EditItemModal.tsx
│   │   ├── Header.tsx
│   │   ├── InstallPrompt.tsx
│   │   └── OfflineIndicator.tsx
│   └── lib/
│       └── db.ts         # IndexedDB (Dexie.js)
├── public/
│   ├── manifest.json     # PWA Manifest
│   ├── icons/            # PWAアイコン
│   └── sw.js            # Service Worker (自動生成)
├── docs/
│   └── ticket/initial/   # 開発チケット・進捗管理
├── DEPLOYMENT.md         # デプロイメント情報
└── next.config.mjs       # Next.js設定 (PWA含む)
```

---

## 🎯 ロードマップ

### ✅ Phase 1-6: MVP Complete

- [x] プロジェクトセットアップ
- [x] PWA設定
- [x] IndexedDB統合
- [x] UIコンポーネント
- [x] ショッピング機能
- [x] デプロイメント

### 🔮 Phase 7以降: 拡張機能

- [ ] **Phase 7**: ユーザー認証 (Clerk / NextAuth.js)
- [ ] **Phase 8**: クラウド同期 (Neon PostgreSQL)
- [ ] **Phase 9**: 複数リスト管理
- [ ] **Phase 10**: リスト共有機能
- [ ] **Phase 11**: レシピ連携
- [ ] **Phase 12**: AI買い物提案

---

## 📄 ドキュメント

- [DEPLOYMENT.md](DEPLOYMENT.md) - デプロイメント情報・実機テスト手順
- [docs/ticket/initial/PROGRESS.md](docs/ticket/initial/PROGRESS.md) - 開発進捗管理
- [docs/implementation/](docs/implementation/) - 実装詳細ドキュメント

---

## 🤝 コントリビューション

コントリビューションを歓迎します！

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチをプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

---

## 📜 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

---

## 👤 作成者

**M-Ito-7310**

- GitHub: [@M-Ito-7310](https://github.com/M-Ito-7310)
- Website: https://kaleidofuture.com/

---

## 🙏 謝辞

- [Next.js](https://nextjs.org/) - Reactフレームワーク
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [Dexie.js](https://dexie.org/) - IndexedDBラッパー
- [next-pwa](https://github.com/shadowwalker/next-pwa) - PWAプラグイン
- [Vercel](https://vercel.com/) - ホスティングプラットフォーム

---

**Made with ❤️ and ☕ in 8 hours**

**🤖 Developed with [Claude Code](https://claude.com/claude-code)**
