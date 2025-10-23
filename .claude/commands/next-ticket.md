# Next Ticket Command

次の未完了チケットを自動的に取得し、作業を開始します。

## タスク

1. **チケット検索**
   - `docs/ticket/initial/PROGRESS.md` を読み込み、現在の進捗状況を確認
   - 最初の未完了(⬜)または進行中(⏳)のPhaseを特定

2. **チケット詳細取得**
   - 該当するPhaseの詳細チケットファイル(`docs/ticket/initial/phase-XX-*.md`)を読み込み
   - 未完了のタスクチェックリストを特定

3. **サブエージェント起動**
   - タスクの性質に応じて適切なサブエージェントを起動:
     - **コードベース探索が必要な場合**: `Explore` agent (thoroughness: "medium")
     - **実装・設定・テストが必要な場合**: `general-purpose` agent

4. **タスク実行**
   - チケットに記載された手順に従って作業を実行
   - 各タスクのチェックボックスを完了時に更新
   - 検証コマンドがある場合は実行してテスト

5. **進捗更新**
   - タスク完了後、`docs/ticket/initial/PROGRESS.md` を自動更新
   - Phase内のすべてのタスクが完了した場合、✅マークに変更

6. **完了報告**
   - 完了したタスクのサマリーを表示
   - 次のタスク/Phaseの簡単なプレビューを提示
   - 続けて作業する場合は `/next-ticket` の再実行を促す

## 使用例

```
ユーザー: /next-ticket

アシスタント:
📋 次のチケット: Phase 1: Project Setup

⏳ タスク 1.1: Next.js 14 プロジェクト初期化
[サブエージェント起動: general-purpose]

✅ 完了: npx create-next-app@14 実行成功
✅ 完了: TypeScript設定確認
✅ 完了: 動作確認 (npm run dev)

📝 PROGRESS.md を更新しました

次のタスク: Task 1.2 - Tailwind CSS設定
続けて作業する場合は /next-ticket を実行してください
```

## 注意事項

- すべてのPhaseが完了している場合は、その旨を報告し `/phase-summary` で全体サマリーを表示
- エラーが発生した場合は、該当チケットに詳細を記録し、ユーザーに報告
- 各タスクは独立して実行可能にし、中断・再開が容易な設計を維持
