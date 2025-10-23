# Phase Summary Command

全Phase (Phase 1-6) の進捗サマリーを表示します。

## タスク

1. **PROGRESS.md読み込み**
   - `docs/ticket/initial/PROGRESS.md` を読み込み
   - 各Phaseの現在のステータスを取得

2. **各Phaseチケット読み込み**
   - `docs/ticket/initial/phase-XX-*.md` を順次読み込み
   - 各Phaseのタスクチェックリストを解析
   - 完了率を計算 (completed tasks / total tasks)

3. **統計情報収集**
   - 完了Phase数
   - 進行中Phase数
   - 未着手Phase数
   - 全体完了率
   - 累計実装時間
   - 推定残り時間

4. **Phase別詳細サマリー生成**

   各Phaseについて以下を表示:
   - Phaseステータス (✅ 完了 / ⏳ 進行中 / ⬜ 未着手)
   - 完了率 (X / Y tasks)
   - 実装済み機能のリスト
   - 未実装機能のリスト
   - 推定残り時間

5. **ビジュアル進捗表示**

   プログレスバー形式:
   ```
   Phase 1: ████████████████████ 100% (5/5) ✅
   Phase 2: ████████░░░░░░░░░░░░  40% (2/5) ⏳
   Phase 3: ░░░░░░░░░░░░░░░░░░░░   0% (0/6) ⬜
   Phase 4: ░░░░░░░░░░░░░░░░░░░░   0% (0/8) ⬜
   Phase 5: ░░░░░░░░░░░░░░░░░░░░   0% (0/7) ⬜
   Phase 6: ░░░░░░░░░░░░░░░░░░░░   0% (0/5) ⬜

   Overall: ████░░░░░░░░░░░░░░░░  23% (7/36 tasks)
   ```

6. **マイルストーン表示**

   - MVP達成状況 (Phase 1-6 すべて完了で達成)
   - 現在のPhase
   - 次のマイルストーン
   - デプロイ可能状況

7. **推奨アクション提示**

   現在の状況に応じて次のアクションを提案:
   - Phase未着手 → `/next-ticket` で開始
   - Phase進行中 → `/next-ticket` で続行
   - Phaseエラーあり → `/review-phase` で問題確認
   - すべて完了 → `/deploy-check` でデプロイ準備

8. **サマリーレポート出力**

   レポートフォーマット:
   ```markdown
   # Offlist Project: Phase Summary

   **Generated**: [日時]
   **Project Status**: 🚧 In Progress / ✅ MVP Complete

   ---

   ## Overall Progress

   **MVP Completion**: 23% (1.4 / 6 Phases)
   **Total Tasks**: 7 / 36 completed
   **Time Spent**: ~1.5 hours
   **Estimated Remaining**: 5-6.5 hours

   ```
   ████░░░░░░░░░░░░░░░░  23%
   ```

   ---

   ## Phase Breakdown

   ### ✅ Phase 1: Project Setup (60 min) - 100% Complete
   **Status**: Complete
   **Tasks**: 5 / 5 ✅

   **Completed**:
   - [x] Next.js 14 project initialization
   - [x] TypeScript configuration
   - [x] Tailwind CSS setup
   - [x] next-pwa installation
   - [x] Git initialization

   ---

   ### ⏳ Phase 2: PWA Configuration (60 min) - 40% Complete
   **Status**: In Progress
   **Tasks**: 2 / 5 ⏳
   **Estimated Remaining**: 36 min

   **Completed**:
   - [x] manifest.json creation
   - [x] PWA configuration in next.config.js

   **Remaining**:
   - [ ] PWA icons (72x72 ~ 512x512)
   - [ ] Install prompt component
   - [ ] Offline status indicator

   ---

   ### ⬜ Phase 3: IndexedDB Setup (60 min) - 0% Complete
   **Status**: Not Started
   **Tasks**: 0 / 6 ⬜

   **Pending**:
   - [ ] Dexie.js installation
   - [ ] Database schema definition
   - [ ] CRUD operations (add, get, update, delete)
   - [ ] TypeScript types
   - [ ] Error handling
   - [ ] DevTools verification

   ---

   ### ⬜ Phase 4: UI Components (120 min) - 0% Complete
   **Status**: Not Started
   **Tasks**: 0 / 8 ⬜

   ---

   ### ⬜ Phase 5: Shopping Features (120 min) - 0% Complete
   **Status**: Not Started
   **Tasks**: 0 / 7 ⬜

   ---

   ### ⬜ Phase 6: Deployment (60 min) - 0% Complete
   **Status**: Not Started
   **Tasks**: 0 / 5 ⬜

   ---

   ## Milestones

   - [x] **Project Initialized** (Phase 1 complete)
   - [~] **PWA Foundation** (Phase 2 in progress)
   - [ ] **Data Layer** (Phase 3)
   - [ ] **UI Complete** (Phase 4)
   - [ ] **Feature Complete** (Phase 5)
   - [ ] **Production Ready** (Phase 6)
   - [ ] **MVP Launch** (All phases complete)

   ---

   ## Current Status

   **Current Phase**: Phase 2 (PWA Configuration)
   **Next Milestone**: Complete Phase 2 PWA setup
   **Blockers**: None
   **Health**: 🟢 On Track

   ---

   ## Recommended Actions

   1. **Continue Phase 2**: Run `/next-ticket` to implement PWA icons
   2. **Review Progress**: Run `/update-progress` to sync latest changes
   3. **Code Review**: Run `/review-phase` after Phase 2 completion

   ---

   ## Quick Stats

   | Metric | Value |
   |--------|-------|
   | Phases Complete | 1 / 6 |
   | Tasks Complete | 7 / 36 |
   | Completion Rate | 23% |
   | Time Invested | 1.5 hours |
   | Remaining Time | 5-6.5 hours |
   | Target Completion | 6-8 hours total |
   | On Schedule | ✅ Yes |

   ---

   **Next Command**: `/next-ticket` to continue Phase 2
   ```

## 使用例

```
ユーザー: /phase-summary

アシスタント:
📊 全Phase進捗サマリーを生成します...

🔍 PROGRESS.md を読み込み中...
🔍 Phase 1-6 チケットを解析中...

---

# Offlist Project: Phase Summary

**Project Status**: 🚧 In Progress (23% complete)

## Overall Progress
████░░░░░░░░░░░░░░░░  23% (7/36 tasks)

**Time**: 1.5h / 6-8h (estimated)

## Phase Status
✅ Phase 1: Project Setup (100%)
⏳ Phase 2: PWA Configuration (40%)
⬜ Phase 3: IndexedDB Setup (0%)
⬜ Phase 4: UI Components (0%)
⬜ Phase 5: Shopping Features (0%)
⬜ Phase 6: Deployment (0%)

## Current Focus
**Phase 2**: PWA Configuration
- Remaining: PWA icons, Install prompt, Offline indicator
- Estimated: 36 minutes

## Recommended Actions
1. Run `/next-ticket` to continue Phase 2
2. Run `/review-phase` after Phase 2 completion
3. Run `/update-progress` daily to sync progress

**Health**: 🟢 On Track for MVP (6-8 hours target)
```

## 注意事項

- このコマンドは **読み取り専用** (ファイル変更なし)
- プロジェクト全体の鳥瞰図を提供
- 定期的に実行して進捗を把握
- `/update-progress` と組み合わせると効果的
