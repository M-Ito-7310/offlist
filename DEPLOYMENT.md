# Offlist - デプロイメント情報

## 🌐 本番環境

**本番URL**: https://offlist.kaleidofuture.com/

**Vercel URL**: https://offlist-livid.vercel.app/ (リダイレクト)

### QRコード（スマホでアクセス）

実機でテストする際は、スマホのカメラで以下のQRコードをスキャンしてください：

```
https://offlist.kaleidofuture.com/
```

QRコード生成: https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://offlist.kaleidofuture.com/

---

## 📱 実機テスト手順

### iOS (Safari)

1. **QRコードをスキャン** または URLを直接入力
2. Safariでアプリを開く
3. **共有ボタン** (四角に↑) をタップ
4. **「ホーム画面に追加」** を選択
5. 「追加」をタップ
6. ホーム画面からアプリを起動
7. **機内モードON** にして動作確認

### Android (Chrome)

1. **QRコードをスキャン** または URLを直接入力
2. Chromeでアプリを開く
3. **インストールプロンプト** が表示されたら「インストール」
   - 表示されない場合: メニュー → 「ホーム画面に追加」
4. ホーム画面からアプリを起動
5. **機内モードON** にして動作確認

---

## ✅ テストチェックリスト

### 基本機能

- [ ] アプリが正常に表示される
- [ ] アイテムを追加できる
- [ ] アイテムを編集できる
- [ ] アイテムを削除できる
- [ ] アイテムをチェックできる
- [ ] カテゴリーフィルターが動作する

### PWA機能

- [ ] ホーム画面にインストールできる
- [ ] インストール後、スタンドアロンで起動する
- [ ] 機内モードでも完全に動作する
- [ ] IndexedDBにデータが永続化される
- [ ] オフラインインジケーターが表示される

### パフォーマンス

- [ ] 初回読み込みが高速（2秒以内）
- [ ] ページ遷移がスムーズ
- [ ] アニメーションが滑らか
- [ ] タップ反応が即座

---

## 🚀 デプロイメント履歴

### 2025-10-24 - Initial Deployment (MVP v1.0)

**デプロイ方法**: Vercel CLI + GitHub連携

**環境**:
- Framework: Next.js 14.2.33
- Hosting: Vercel
- Repository: https://github.com/M-Ito-7310/offlist

**Lighthouse スコア** (本番環境):
- Performance: **100/100** ✅
- Accessibility: 77/100
- Best Practices: **100/100** ✅
- SEO: **100/100** ✅

**ビルドサイズ**:
- First Load JS: 121 kB
- Total Pages: 2

**機能**:
- オフラインファースト PWA
- IndexedDB データ永続化
- カテゴリー別フィルター
- CRUD 操作完全実装
- レスポンシブデザイン

---

## 🔄 自動デプロイ

GitHubの`master`ブランチにプッシュすると、Vercelが自動的に本番環境にデプロイします。

```bash
git add .
git commit -m "Update feature"
git push origin master
```

デプロイ状況: https://vercel.com/m-ito-7310s-projects/offlist

---

## 🛠 ローカル開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build
npm run start
```

---

## 📊 モニタリング

- **Vercel Analytics**: https://vercel.com/m-ito-7310s-projects/offlist/analytics
- **Vercel Logs**: https://vercel.com/m-ito-7310s-projects/offlist/logs
- **GitHub Repository**: https://github.com/M-Ito-7310/offlist

---

## 🎯 次のステップ（Phase 7以降）

MVP完成後の拡張機能：

1. **Phase 7**: ユーザー認証 (Clerk / NextAuth.js)
2. **Phase 8**: クラウド同期 (Neon PostgreSQL)
3. **Phase 9**: 複数リスト管理
4. **Phase 10**: リスト共有機能
5. **Phase 11**: レシピ連携
6. **Phase 12**: AI買い物提案

---

**作成日**: 2025-10-24
**最終更新**: 2025-10-24
