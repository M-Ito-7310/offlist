# Update Progress Command

PROGRESS.mdを現在の実装状況に基づいて自動更新します。

## タスク

1. **コードベーススキャン**
   - サブエージェント (Explore, thoroughness: "medium") を起動
   - プロジェクト全体をスキャンし、実装済みファイル・機能を特定

2. **Phase別実装状況確認**

   ### Phase 1: Project Setup
   確認項目:
   - `package.json` の存在と依存関係 (next, react, typescript, tailwindcss, next-pwa)
   - `next.config.js` / `next.config.mjs` のPWA設定
   - `tailwind.config.ts` / `tailwind.config.js` の存在
   - `tsconfig.json` の存在
   - `.gitignore` の存在
   - `npm run dev` で起動可能か

   ### Phase 2: PWA Configuration
   確認項目:
   - `public/manifest.json` の存在
   - PWAアイコン (`public/icons/icon-*.png` または類似パス)
   - Service Worker設定 (`next.config.js` 内)
   - インストールプロンプトコンポーネント (`src/components/InstallPrompt.tsx` 等)
   - オフライン検知コンポーネント (`src/components/OfflineIndicator.tsx` 等)

   ### Phase 3: IndexedDB Setup
   確認項目:
   - `package.json` に `dexie` 依存関係
   - `src/lib/db.ts` または類似ファイルでのスキーマ定義
   - CRUD操作関数 (addItem, getItems, updateItem, deleteItem 等)
   - TypeScript型定義 (`src/types/` または `src/lib/types.ts`)

   ### Phase 4: UI Components
   確認項目:
   - `src/components/AddItemForm.tsx` または類似コンポーネント
   - `src/components/ShoppingItem.tsx` または類似コンポーネント
   - `src/components/CategoryFilter.tsx` または類似コンポーネント
   - `src/app/layout.tsx` のレイアウト実装
   - `src/app/page.tsx` のメインページ実装

   ### Phase 5: Shopping Features
   確認項目:
   - アイテム追加機能の実装
   - アイテム編集機能の実装
   - アイテム削除機能の実装
   - チェック機能の実装
   - カテゴリーフィルターの実装
   - アニメーション (Tailwind transition等)

   ### Phase 6: Deployment
   確認項目:
   - `vercel.json` の存在 (オプション)
   - `npm run build` の成功
   - `.vercel/` ディレクトリ (デプロイ済みの場合)
   - Lighthouse テストレポート (存在する場合)

3. **チケットファイル読み込み**
   - 各 `docs/ticket/initial/phase-XX-*.md` を読み込み
   - 各タスクチェックリストと実装状況を照合

4. **チェックボックス更新**
   - 実装済みタスク: `[x]` に変更
   - 未実装タスク: `[ ]` のまま
   - 部分的実装: `[~]` (オプション表記)

5. **PROGRESS.md更新**
   - `docs/ticket/initial/PROGRESS.md` を読み込み
   - 各Phaseのステータスを更新:
     - ✅ 完了 (すべてのタスクが実装済み)
     - ⏳ 進行中 (一部タスクが実装済み)
     - ⬜ 未着手 (タスクが未実装)

   - 進捗率を計算:
     - 全体進捗: X / 6 Phases completed
     - 累計時間: 実装済みPhaseの合計時間

6. **更新サマリー表示**
   ```markdown
   📊 進捗更新完了

   **Phase 1**: ✅ 完了 (5/5 tasks)
   **Phase 2**: ⏳ 進行中 (2/4 tasks)
   **Phase 3**: ⬜ 未着手 (0/5 tasks)
   **Phase 4**: ⬜ 未着手 (0/8 tasks)
   **Phase 5**: ⬜ 未着手 (0/7 tasks)
   **Phase 6**: ⬜ 未着手 (0/5 tasks)

   **全体進捗**: 1.5 / 6 Phases (25%)
   **累計時間**: 1.5 hours / 6-8 hours

   次のアクション: /next-ticket で Phase 2 の残りタスクを進める
   ```

## 使用例

```
ユーザー: /update-progress

アシスタント:
🔍 コードベースをスキャンしています...
[サブエージェント起動: Explore]

✅ Phase 1: package.json, next.config.js, tailwind.config.ts 確認
⏳ Phase 2: manifest.json 確認、アイコン未実装
⬜ Phase 3: dexie未インストール

📝 PROGRESS.md を更新しました

---
📊 進捗サマリー

**完了**: Phase 1 (60分)
**進行中**: Phase 2 (20/60分相当)
**残り**: Phase 3-6

**全体進捗**: 1.3 / 6 Phases (22%)
**推定残り時間**: 5-6 hours

次のアクション: /next-ticket でPhase 2の残りタスクを完了
```

## 更新ロジック

### Phaseステータス判定
- **✅ 完了**: すべての必須タスクが実装済み (チェックボックス 100%)
- **⏳ 進行中**: 1つ以上のタスクが実装済み (チェックボックス 1-99%)
- **⬜ 未着手**: タスクが1つも実装されていない (チェックボックス 0%)

### ファイル存在チェック
- 必須ファイルが存在 → タスク完了とみなす
- 設定ファイルに必須項目が含まれる → タスク完了とみなす
- コンポーネントが実装済み (export されている) → タスク完了とみなす

### エラーハンドリング
- ファイルが見つからない場合: 未実装として扱う
- 解析エラーが発生: 警告を表示し、手動確認を促す

## 注意事項

- このコマンドは現在の実装状況を**自動検出**して更新
- 手動でチェックボックスを編集している場合、上書きされる可能性あり
- 正確な進捗を維持するため、定期的に実行を推奨 (各Phase完了後、デイリー)
- 誤検出があった場合は、手動で `PROGRESS.md` を修正可能
