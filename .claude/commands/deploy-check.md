# Deploy Check Command

デプロイ前の包括的チェックリストを実行します。

## タスク

1. **ビルドチェック**
   - `npm run build` を実行
   - ビルドエラー・警告の確認
   - ビルド成果物 (`.next/`, `out/` 等) の生成確認
   - ビルドサイズのレポート表示

   ```bash
   npm run build
   ```

   **合格基準**:
   - ✅ ビルドが成功 (exit code 0)
   - ✅ エラーが0件
   - ⚠️ 警告が5件以下 (許容範囲)
   - ❌ エラーまたは警告が多数 → 修正必要

2. **TypeScriptチェック**
   - TypeScript型チェックを実行
   - 型エラーの検出

   ```bash
   npx tsc --noEmit
   ```

   **合格基準**:
   - ✅ 型エラー 0件
   - ❌ 型エラーあり → 修正必要

3. **Lintチェック**
   - ESLintを実行
   - コード品質の確認

   ```bash
   npm run lint
   ```

   **合格基準**:
   - ✅ Lintエラー 0件
   - ⚠️ 警告のみ (許容範囲)
   - ❌ エラーあり → 修正必要

4. **Lighthouse PWAテスト**
   - 開発サーバーまたはビルド済みアプリを起動
   - Lighthouse PWAスコアを測定

   **測定項目**:
   - **PWA Score**: 95点以上が目標
   - **Performance**: 90点以上が目標
   - **Accessibility**: 90点以上推奨
   - **Best Practices**: 90点以上推奨
   - **SEO**: 90点以上推奨

   **PWA必須項目**:
   - ✅ manifest.json が存在
   - ✅ Service Workerが登録済み
   - ✅ HTTPS (Vercel自動対応)
   - ✅ レスポンシブデザイン
   - ✅ オフライン動作

   ```bash
   # 開発サーバー起動
   npm run dev

   # 別ターミナルでLighthouse実行
   npx lighthouse http://localhost:3000 --view
   ```

5. **PWA機能確認**
   - インストールプロンプトの表示確認
   - ホーム画面に追加可能か
   - オフライン動作確認 (DevTools → Network → Offline)
   - Service Workerの動作確認 (DevTools → Application → Service Workers)

   **確認項目**:
   - [ ] インストールプロンプトが表示される
   - [ ] ホーム画面に追加できる
   - [ ] オフラインでページが表示される
   - [ ] オフラインでデータ操作が可能
   - [ ] Service Workerが正常に動作

6. **IndexedDB動作確認**
   - DevTools → Application → IndexedDB
   - データベースの存在確認
   - データの追加・取得・更新・削除動作確認

   **確認項目**:
   - [ ] IndexedDBが初期化されている
   - [ ] アイテムを追加できる
   - [ ] アイテムを取得できる
   - [ ] アイテムを更新できる
   - [ ] アイテムを削除できる

7. **クロスブラウザ確認**
   - 主要ブラウザでの動作確認

   **対象ブラウザ**:
   - ✅ Chrome (Desktop)
   - ✅ Firefox (Desktop)
   - ✅ Safari (Desktop)
   - ✅ Chrome (Android) - 実機またはエミュレータ
   - ✅ Safari (iOS) - 実機またはシミュレータ

8. **Vercel設定確認**
   - `vercel.json` の存在確認 (オプション)
   - 環境変数の設定確認 (必要な場合)
   - ビルドコマンドの確認 (`package.json` の `build` script)

9. **デプロイチェックレポート生成**

   レポートフォーマット:
   ```markdown
   # Deploy Check Report

   **Date**: [日時]
   **Status**: ✅ Ready / ⚠️ Warning / ❌ Not Ready

   ## Build Check
   - Status: ✅ Pass
   - Build Time: 45s
   - Bundle Size: 250KB
   - Warnings: 2 (acceptable)

   ## TypeScript Check
   - Status: ✅ Pass
   - Type Errors: 0

   ## Lint Check
   - Status: ✅ Pass
   - Lint Errors: 0
   - Warnings: 3

   ## Lighthouse PWA Score
   - PWA: 98 / 100 ✅
   - Performance: 92 / 100 ✅
   - Accessibility: 95 / 100 ✅
   - Best Practices: 100 / 100 ✅
   - SEO: 100 / 100 ✅

   ## PWA Features
   - [x] Install prompt
   - [x] Offline mode
   - [x] Service Worker
   - [x] IndexedDB

   ## Cross-Browser
   - [x] Chrome Desktop
   - [x] Firefox Desktop
   - [x] Safari Desktop
   - [ ] Chrome Android (not tested)
   - [ ] Safari iOS (not tested)

   ## Overall Status
   ✅ Ready to Deploy

   ## Recommendations
   1. Test on real Android/iOS devices before production launch
   2. Monitor Lighthouse scores after deployment
   3. Set up error tracking (Sentry, etc.) - optional

   ## Next Steps
   1. Run `vercel` to deploy
   2. Test deployed app on production URL
   3. Run `/update-progress` to mark Phase 6 complete
   ```

## 使用例

```
ユーザー: /deploy-check

アシスタント:
🔍 デプロイ前チェックを開始します...

⏳ ビルドチェック実行中...
✅ Build: Success (42s, 245KB)

⏳ TypeScriptチェック実行中...
✅ TypeScript: 0 errors

⏳ Lintチェック実行中...
✅ Lint: 0 errors, 2 warnings

⏳ Lighthouse PWAテスト実行中...
✅ PWA Score: 98/100
✅ Performance: 91/100
✅ Accessibility: 95/100

⏳ PWA機能確認...
✅ Install prompt: Working
✅ Offline mode: Working
✅ Service Worker: Registered

---
📊 Deploy Check Report

**Overall Status**: ✅ Ready to Deploy

**Summary**:
- Build: ✅ Pass
- TypeScript: ✅ Pass
- Lint: ✅ Pass (2 warnings)
- Lighthouse PWA: ✅ 98/100
- PWA Features: ✅ All working

**Recommendations**:
1. Test on real devices (iOS/Android) after deployment
2. Monitor performance metrics post-launch

**Next Steps**:
1. Run `vercel` to deploy to production
2. Test on production URL
3. Mark Phase 6 complete with `/update-progress`

デプロイを開始しますか? (y/n)
```

## エラーハンドリング

### ビルドエラー
```
❌ Build Failed

Error: Module not found: 'dexie'
→ Run: npm install dexie

修正後、再度 /deploy-check を実行してください
```

### Lighthouse低スコア
```
⚠️ Lighthouse PWA Score: 75/100 (目標: 95+)

**Issues**:
- manifest.json が見つからない
- Service Workerが未登録
- レスポンシブデザイン未対応

**Action**: Phase 2 (PWA Configuration) を再確認してください
```

## 注意事項

- このコマンドは Phase 6 (Deployment) の最終確認として使用
- すべてのチェックが ✅ になるまでデプロイしない
- Lighthouseテストは初回実行時にキャッシュがないため低スコアになる可能性あり (2回目以降で正確なスコア)
- 実機テストは手動で実施 (自動化困難)
