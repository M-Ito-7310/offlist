# Review Phase Command

現在のPhaseの包括的なレビューを実施します。

## タスク

1. **現在Phase特定**
   - `docs/ticket/initial/PROGRESS.md` を確認し、現在進行中または最後に完了したPhaseを特定

2. **Phaseチケット読み込み**
   - 該当する `docs/ticket/initial/phase-XX-*.md` を読み込み
   - すべてのタスクチェックリストと検証条件を確認

3. **サブエージェント起動(Explore)**
   - コードベース全体をスキャンし、実装状況を確認
   - 設定ファイル、コンポーネント、データベース定義などを探索

4. **レビュー項目実行**

   ### Phase 1: Project Setup レビュー
   - `package.json` の依存関係チェック
   - `next.config.js` / `next.config.mjs` のPWA設定確認
   - `tailwind.config.ts` の設定確認
   - TypeScript設定ファイル (`tsconfig.json`) の型チェック
   - `npm run dev` で開発サーバー起動確認

   ### Phase 2: PWA Configuration レビュー
   - `public/manifest.json` の存在と内容確認
   - Service Worker設定の確認
   - PWAアイコン (72x72〜512x512) の存在確認
   - インストールプロンプトコンポーネントの実装確認
   - オフライン状態検知ロジックの確認

   ### Phase 3: IndexedDB Setup レビュー
   - `src/lib/db.ts` (または類似ファイル) のスキーマ定義確認
   - Dexie.js の依存関係確認
   - CRUD操作関数の実装確認
   - エラーハンドリングの実装確認
   - DevToolsでIndexedDBテーブル確認

   ### Phase 4: UI Components レビュー
   - `src/components/` 配下のコンポーネント存在確認
   - AddItemForm, ShoppingItem, CategoryFilter等の実装確認
   - Tailwind CSSスタイルの適用確認
   - レスポンシブデザインのチェック
   - アクセシビリティ基本チェック (aria-label等)

   ### Phase 5: Shopping Features レビュー
   - アイテム追加機能の動作確認
   - アイテム編集・削除機能の動作確認
   - チェック機能の動作確認
   - カテゴリーフィルターの動作確認
   - アニメーション実装の確認
   - オフライン動作テスト

   ### Phase 6: Deployment レビュー
   - `npm run build` の成功確認
   - ビルドエラー・警告のチェック
   - Lighthouseスコアレポート確認 (PWA 95+, Performance 90+)
   - Vercel設定ファイル (`vercel.json`) 確認
   - デプロイURL動作確認
   - 実機テスト結果確認

5. **問題点の洗い出し**
   - 未実装機能のリストアップ
   - 設定ミスや警告の特定
   - パフォーマンス問題の検出
   - セキュリティ懸念の確認

6. **レビューレポート生成**
   - ✅ 完了項目
   - ⚠️ 警告項目
   - ❌ 未完了・問題項目
   - 📋 推奨アクション

   レポートフォーマット:
   ```markdown
   # Phase X Review Report

   **Phase**: [Phase名]
   **Review Date**: [日時]
   **Status**: ✅ Pass / ⚠️ Warning / ❌ Fail

   ## Summary
   [概要: 3-5行]

   ## Completed Items (✅)
   - Item 1
   - Item 2

   ## Warnings (⚠️)
   - Warning 1: [詳細]

   ## Issues (❌)
   - Issue 1: [詳細と対応策]

   ## Recommendations
   1. [推奨アクション1]
   2. [推奨アクション2]

   ## Next Steps
   - [ ] Action 1
   - [ ] Action 2
   ```

7. **チケット更新**
   - 問題が見つかった場合、該当Phaseのチケットにコメント追加
   - バグの場合は `docs/ticket/bug/` に新規チケット作成を提案

## 使用例

```
ユーザー: /review-phase

アシスタント:
🔍 Phase 1: Project Setup のレビューを開始します

[サブエージェント起動: Explore]

✅ package.json: next@14.x, typescript@5.x 確認
✅ next.config.js: PWA設定確認
✅ tailwind.config.ts: カスタムカラー設定確認
⚠️ tsconfig.json: strict mode が false (推奨: true)
✅ npm run dev: 起動成功

---
📊 Review Report

**Status**: ⚠️ Warning (1 issue)

**Completed**: 4/5 items
**Warnings**: 1 (TypeScript strict mode)

**Recommendations**:
1. tsconfig.json で "strict": true に設定
2. 型エラーがないか確認後、次のPhaseに進む

次のアクション: /next-ticket で Phase 2 に進む
```

## 注意事項

- レビューは現在のPhaseのみに集中し、過去・未来のPhaseは対象外
- 重大な問題が見つかった場合は、次のPhaseに進む前に修正を推奨
- レビュー結果は `docs/reviews/phase-XX-review-YYYYMMDD.md` に保存してもよい
