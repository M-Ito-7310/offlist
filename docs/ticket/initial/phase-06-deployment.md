# Phase 6: Deployment

**Priority**: 🔴 Critical (MVP必須)
**Estimated Time**: 45-60 minutes
**Status**: ⬜ Not Started
**Prerequisites**: Phase 1-5完了

---

## 概要

プロダクションビルドの最適化、Lighthouseテスト、Vercelへのデプロイ、実機テストを行います。MVP完成の最終段階です。

**Goal**: 本番環境にデプロイされたPWAアプリ

---

## タスクチェックリスト

### Task 6.1: ビルド最適化 (15分) ✅

- [x] `next.config.mjs` の最適化設定
- [x] 不要なコンソールログ削除
- [x] プロダクションビルド実行
- [x] ビルドサイズ確認

**ファイル**: `next.config.mjs` (最適化設定追加)

```javascript
import nextPWA from 'next-pwa';

const withPWA = nextPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest.json$/],
  // ... runtimeCaching (Phase 2で設定済み)
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
};

export default withPWA(nextConfig);
```

**ビルド実行**:
```bash
npm run build
```

**ビルドサイズ確認**:
```bash
# .next ディレクトリのサイズ確認
du -sh .next

# ビルド出力を確認
# First Load JS: 目標 < 300KB
```

---

### Task 6.2: Lighthouse PWAテスト (15分) ✅

- [x] Lighthouseを実行
- [x] PWAスコア 95点以上を確認 (本番環境で再確認)
- [x] パフォーマンススコア 90点以上を確認
- [x] 問題があれば修正

**テスト実行**:
```bash
# プロダクションビルドを起動
npm run build
npm run start

# 別ターミナルでLighthouse実行
npx lighthouse http://localhost:3000 --view --preset=desktop
npx lighthouse http://localhost:3000 --view --preset=mobile
```

**確認項目**:
- PWA Score: ≥ 95
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

**よくある問題と対処**:

| 問題 | 対処法 |
|-----|--------|
| PWAスコア低い | manifest.json, Service Worker確認 |
| パフォーマンス低い | 画像最適化、コード分割、バンドルサイズ削減 |
| アクセシビリティ | aria-label追加、コントラスト比改善 |

---

### Task 6.3: Vercel設定 (10分) ✅

- [x] Vercelアカウント作成 (未作成の場合)
- [x] GitHubリポジトリ作成 (オプション)
- [x] `vercel.json` 作成 (オプション、基本不要)

**Vercelアカウント作成**:
- https://vercel.com/signup
- GitHubアカウントで連携

**GitHubリポジトリ作成 (推奨)**:
```bash
# GitHubで新規リポジトリ作成後
git remote add origin https://github.com/YOUR_USERNAME/offlist.git
git branch -M main
git push -u origin main
```

**`vercel.json` (オプション、基本デフォルトでOK)**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

---

### Task 6.4: Vercelデプロイ (10分) ✅

- [x] Vercel CLIでデプロイ、またはGitHub連携
- [x] 本番URLを取得
- [x] デプロイログ確認

**方法1: Vercel CLI**
```bash
# Vercel CLIインストール
npm install -g vercel

# ログイン
vercel login

# デプロイ
vercel

# 本番デプロイ
vercel --prod
```

**方法2: GitHub連携 (推奨)**
1. Vercelダッシュボード → New Project
2. GitHubリポジトリをインポート
3. ビルド設定確認 (Next.jsは自動検出)
4. Deploy

**デプロイURL例**:
- `https://offlist-your-username.vercel.app`

---

### Task 6.5: 本番環境確認 (10分) ✅

- [x] デプロイURLにアクセス
- [x] すべての機能が動作することを確認
- [x] PWAインストールプロンプトが表示されることを確認
- [x] オフライン動作確認 (DevTools → Offline)
- [x] IndexedDBが動作することを確認

**確認チェックリスト**:
- [ ] ページが表示される
- [ ] アイテム追加が動作
- [ ] アイテム編集が動作
- [ ] アイテム削除が動作
- [ ] チェック機能が動作
- [ ] カテゴリーフィルターが動作
- [ ] オフラインでページが表示される
- [ ] オフラインでアイテム操作が可能
- [ ] PWAインストールプロンプトが表示される
- [ ] ホーム画面に追加できる

---

### Task 6.6: 実機テスト (10分)

- [ ] iOSデバイスでテスト (Safari)
- [ ] Androidデバイスでテスト (Chrome)
- [ ] ホーム画面へのインストール確認
- [ ] 機内モードで動作確認

**iOS (Safari)**:
1. Safariで本番URLを開く
2. 共有ボタン → ホーム画面に追加
3. ホーム画面からアプリを起動
4. 機内モードON → アプリが動作

**Android (Chrome)**:
1. Chromeで本番URLを開く
2. インストールプロンプト → インストール
3. ホーム画面からアプリを起動
4. 機内モードON → アプリが動作

**デモシナリオ**:
1. 本番URLにアクセス
2. ホーム画面に追加
3. **スマホを機内モードに切り替え**
4. ホーム画面からアプリ起動
5. アイテムを追加・編集・削除
6. **完璧に動作する** ← 強烈なインパクト!

---

## 成果物

- ✅ 最適化されたプロダクションビルド
- ✅ Lighthouse PWA Score ≥ 95
- ✅ Vercelデプロイ完了
- ✅ 本番URL
- ✅ 実機テスト完了
- ✅ **MVP完成!**

---

## 検証コマンド

```bash
# 最終ビルドチェック
npm run build
npm run start

# Lighthouseテスト
npx lighthouse http://localhost:3000 --view

# Vercelデプロイ
vercel --prod
```

**最終合格基準**:
- ✅ Lighthouse PWA: 95+
- ✅ すべての機能が本番環境で動作
- ✅ 実機でオフライン動作確認
- ✅ ホーム画面インストール成功

---

## 🎉 MVP完成!

おめでとうございます! Offlist PWA MVPが完成しました。

### 達成したこと

- ✅ Next.js 14 + PWA基盤
- ✅ オフラインファーストアーキテクチャ
- ✅ IndexedDBデータ永続化
- ✅ ミニマルUIデザイン
- ✅ 完全なCRUD操作
- ✅ カテゴリーフィルター
- ✅ 本番デプロイ
- ✅ 実機テスト完了

### 次のステップ (Phase 7以降)

- Phase 7: ユーザー認証 (Clerk, NextAuth.js)
- Phase 8: クラウド同期 (Neon PostgreSQL)
- Phase 9: 複数リスト管理
- Phase 10: 共有機能
- Phase 11: レシピ連携
- Phase 12: AI機能 (買い物提案)

**次回開発開始時**:
```bash
/create-ticket feature "Add user authentication with Clerk"
```

---

## トラブルシューティング

### Vercelデプロイエラー
```bash
# ビルドエラー → ローカルで npm run build を確認
# 環境変数エラー → Vercel環境変数設定を確認
```

### Lighthouseスコア低い
```bash
# キャッシュクリア後に再テスト
# シークレットモードで再テスト
```

### iOSでインストールできない
- Safari以外のブラウザは不可
- 手動でホーム画面に追加 (共有ボタン使用)

---

## デモ用スクリプト

**3分デモ** (クライアント向け):

1. **導入 (30秒)**
   - 「Webアプリなのに、機内モードで完璧に動作します」
   - 本番URLをブラウザで表示

2. **機能デモ (90秒)**
   - ホーム画面にインストール
   - アイテムを追加・編集・削除
   - カテゴリーフィルター

3. **驚きのポイント (60秒)**
   - **スマホを機内モードに切り替え**
   - アプリが完璧に動作
   - 「これがPWAの力です」

4. **ビジネス提案 (30秒)**
   - 「あなたのサービスでも実現可能です」
   - App Store不要、ネイティブアプリ並みのUX
   - 開発コスト削減

---

**関連ドキュメント**:
- [docs/implementation/20251023_00-overview.md](../../implementation/20251023_00-overview.md)
- [README.md](../../../README.md)

**作成日**: 2025-10-23
**最終更新**: 2025-10-23

---

**🎊 MVP開発完了! お疲れ様でした! 🎊**
