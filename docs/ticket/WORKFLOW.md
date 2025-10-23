# Offlist ワークフローガイド

**作成日**: 2025-10-23
**対象**: 開発者、プロジェクトマネージャー
**目的**: nocode-ui-builder風のチケット駆動開発ワークフロー

---

## 📋 概要

このプロジェクトでは、**nocode-ui-builder**のワークフローを模倣したチケット駆動開発を採用しています。カスタムスラッシュコマンドとサブエージェントを活用して、効率的にMVP開発を進めます。

---

## 🎯 基本ワークフロー

### 開発サイクル

```
1. /next-ticket       → 次のタスクを開始
2. 実装・テスト        → コード作成と検証
3. /review-phase      → Phaseレビュー (任意)
4. /update-progress   → 進捗を自動更新
5. 繰り返し           → すべてのPhaseが完了するまで
6. /deploy-check      → デプロイ前の最終確認
```

---

## 🚀 カスタムコマンド一覧

### 1. `/next-ticket`
**次の未完了チケットを自動取得して作業開始**

**使用タイミング**:
- 開発開始時
- Phase完了後、次のPhaseに進むとき
- タスク完了後、次のタスクに進むとき

**動作**:
1. `PROGRESS.md` から未完了タスクを特定
2. 該当Phaseチケットファイルを読み込み
3. サブエージェント起動 (Explore または general-purpose)
4. タスク実行
5. `PROGRESS.md` 自動更新

**使用例**:
```
ユーザー: /next-ticket

アシスタント:
📋 次のチケット: Phase 1: Project Setup

⏳ Task 1.1: Next.js 14 プロジェクト初期化
[サブエージェント起動: general-purpose]

実行中...
✅ 完了

📝 PROGRESS.md を更新しました
次は /next-ticket で Task 1.2 に進めます
```

---

### 2. `/review-phase`
**現在Phaseの包括的レビュー実施**

**使用タイミング**:
- Phase完了後
- 問題が発生したとき
- デプロイ前

**動作**:
1. 現在Phaseを特定
2. サブエージェント (Explore) でコードベーススキャン
3. 設定ファイル、コンポーネント、データベース等を確認
4. レビューレポート生成 (✅ 完了 / ⚠️ 警告 / ❌ 問題)

**使用例**:
```
ユーザー: /review-phase

アシスタント:
🔍 Phase 1: Project Setup のレビューを開始します

[サブエージェント起動: Explore]

✅ package.json: 依存関係確認
✅ next.config.js: PWA設定確認
⚠️ tsconfig.json: strict mode が false

📊 Review Report
Status: ⚠️ Warning (1 issue)
推奨: tsconfig.json で strict: true に設定
```

---

### 3. `/create-ticket [type] [title]`
**新規チケット作成 (Bug / Feature / Enhancement)**

**使用タイミング**:
- バグ発見時
- 新機能追加時
- パフォーマンス改善時

**動作**:
1. チケットタイプを判別 (bug / feature / enhancement)
2. 最新チケット番号を取得して +1
3. テンプレートから新規チケット生成
4. 適切なディレクトリに保存

**使用例**:
```
ユーザー: /create-ticket bug "Install prompt not showing on iOS"

アシスタント:
🐛 Bug チケットを作成しました

📁 ファイル: docs/ticket/bug/bug-001-install-prompt-ios.md
🔢 チケット番号: #001
⚠️ 優先度: 🟡 High

次のアクション:
1. 詳細を記入 (再現手順、環境情報)
2. 優先度を調整
```

---

### 4. `/update-progress`
**PROGRESS.mdを現在の実装状況に基づいて自動更新**

**使用タイミング**:
- タスク完了後
- 1日の作業終了時
- デイリースタンドアップ前

**動作**:
1. サブエージェント (Explore) でコードベーススキャン
2. 実装済みファイル・機能を検出
3. Phaseステータスを判定 (✅ 完了 / ⏳ 進行中 / ⬜ 未着手)
4. `PROGRESS.md` を自動更新
5. 進捗サマリー表示

**使用例**:
```
ユーザー: /update-progress

アシスタント:
🔍 コードベースをスキャンしています...

✅ Phase 1: 完了 (5/5 tasks)
⏳ Phase 2: 進行中 (2/6 tasks)
⬜ Phase 3: 未着手 (0/5 tasks)

📝 PROGRESS.md を更新しました

全体進捗: 1.3 / 6 Phases (22%)
```

---

### 5. `/deploy-check`
**デプロイ前の包括的チェックリスト実行**

**使用タイミング**:
- Phase 6 (Deployment) 開始前
- 本番デプロイ前
- 重要なマイルストーン前

**動作**:
1. `npm run build` 実行
2. TypeScript型チェック (`tsc --noEmit`)
3. ESLint実行
4. Lighthouse PWAテスト
5. PWA機能確認 (manifest, Service Worker, offline)
6. デプロイチェックレポート生成

**使用例**:
```
ユーザー: /deploy-check

アシスタント:
🔍 デプロイ前チェックを開始します...

✅ Build: Success (42s)
✅ TypeScript: 0 errors
✅ Lint: 0 errors
✅ Lighthouse PWA: 98/100

📊 Deploy Check Report
Overall Status: ✅ Ready to Deploy

次のステップ:
1. vercel --prod でデプロイ
2. 実機テスト実施
```

---

### 6. `/phase-summary`
**全Phase進捗サマリー表示**

**使用タイミング**:
- プロジェクト状況を把握したいとき
- ステークホルダーへの報告前
- 開発ペースを確認したいとき

**動作**:
1. `PROGRESS.md` 読み込み
2. 各Phaseチケットを解析
3. 統計情報収集 (完了率、残り時間等)
4. ビジュアルプログレスバー表示
5. 推奨アクション提示

**使用例**:
```
ユーザー: /phase-summary

アシスタント:
📊 全Phase進捗サマリー

████░░░░░░░░░░░░░░░░  23% (7/36 tasks)

✅ Phase 1: 100% (5/5)
⏳ Phase 2: 40% (2/5)
⬜ Phase 3-6: 0%

推奨アクション:
1. /next-ticket で Phase 2 続行
2. /review-phase で Phase 1 レビュー
```

---

## 📂 ディレクトリ構造

```
docs/
├── ticket/
│   ├── README.md                    # チケットシステム概要
│   ├── WORKFLOW.md                  # このファイル
│   ├── initial/                     # MVP開発チケット
│   │   ├── PROGRESS.md              # 進捗管理
│   │   ├── phase-01-project-setup.md
│   │   ├── phase-02-pwa-config.md
│   │   ├── phase-03-indexeddb-setup.md
│   │   ├── phase-04-ui-components.md
│   │   ├── phase-05-shopping-features.md
│   │   └── phase-06-deployment.md
│   ├── bug/                         # バグ修正チケット
│   ├── feature/                     # 新機能チケット
│   └── enhancement/                 # 改善チケット
└── .claude/
    └── commands/
        ├── next-ticket.md
        ├── review-phase.md
        ├── create-ticket.md
        ├── update-progress.md
        ├── deploy-check.md
        └── phase-summary.md
```

---

## 🤖 サブエージェント活用

### Explore Agent
**用途**: コードベース探索、ファイル検索、実装状況確認

**使用場面**:
- `/review-phase` - 実装状況スキャン
- `/update-progress` - ファイル存在確認
- Phase開始時の事前調査

**特徴**:
- 高速なファイルパターン検索
- 複数ファイルの横断検索
- コードベース全体の構造理解

---

### General-Purpose Agent
**用途**: 実装、テスト、デプロイ作業

**使用場面**:
- `/next-ticket` - タスク実装
- `/deploy-check` - ビルド・テスト実行
- バグ修正、機能実装

**特徴**:
- コード生成・編集
- コマンド実行
- 複雑な多段階タスク実行

---

## 📝 チケット管理ベストプラクティス

### 1. チケットは小さく分割
- 1チケット = 1-2時間で完了
- 明確な成果物を定義
- 依存関係を明記

### 2. ステータスを常に最新に保つ
- タスク完了時: `[ ]` → `[x]`
- Phase完了時: ⬜ → ✅
- 定期的に `/update-progress` 実行

### 3. レビューを習慣化
- Phase完了ごとに `/review-phase`
- 問題の早期発見
- コード品質の維持

### 4. 進捗を可視化
- 毎日 `/phase-summary` で確認
- チーム共有時は `PROGRESS.md` を参照
- マイルストーン達成を祝う

---

## 🎯 典型的な開発フロー例

### Day 1: Phase 1-2 (基盤構築)

```bash
# 朝
/phase-summary          # 全体確認
/next-ticket            # Phase 1 開始

# Phase 1 タスク実行中...
/next-ticket            # 次のタスク
/next-ticket            # 次のタスク
...

# Phase 1 完了後
/review-phase           # レビュー実施
/update-progress        # 進捗更新

# Phase 2 開始
/next-ticket            # Phase 2 開始
...

# 夕方
/update-progress        # 1日の進捗更新
/phase-summary          # 全体確認
```

---

### Day 2: Phase 3-5 (実装)

```bash
# 朝
/phase-summary
/next-ticket            # Phase 3 開始

# IndexedDB実装...
/next-ticket
/review-phase

# UI実装...
/next-ticket            # Phase 4 開始
/next-ticket
...

# 機能統合...
/next-ticket            # Phase 5 開始
...

# 夕方
/update-progress
/phase-summary
```

---

### Day 3: Phase 6 (デプロイ)

```bash
# 朝
/phase-summary
/deploy-check           # デプロイ前チェック

# 問題があれば修正
/review-phase

# 再チェック
/deploy-check

# デプロイ
/next-ticket            # Phase 6 開始
# Vercelデプロイ実施

# 完了!
/phase-summary
```

---

## 🐛 トラブルシューティング

### コマンドが動作しない
- `.claude/commands/` ディレクトリが存在するか確認
- コマンドファイル (`.md`) が存在するか確認
- ファイル内容が正しいフォーマットか確認

### サブエージェントが起動しない
- コマンド内で `Task` ツールが正しく呼ばれているか確認
- `subagent_type` が正しいか確認 (`Explore` または `general-purpose`)

### PROGRESS.mdが更新されない
- `/update-progress` を手動実行
- `PROGRESS.md` のフォーマットが正しいか確認

---

## 📚 関連ドキュメント

- [README.md](../README.md) - チケットシステム概要
- [docs/implementation/20251023_00-overview.md](../implementation/20251023_00-overview.md) - プロジェクト全体概要
- [docs/idea/](../idea/) - 設計思想・アーキテクチャ

---

## 💡 Tips

1. **コマンドを活用**: 手動作業を減らし、自動化を活用
2. **定期的なレビュー**: 小さな問題を早期発見
3. **進捗の可視化**: モチベーション維持とペース管理
4. **チケットを細かく**: 達成感を得やすく、進捗が明確
5. **サブエージェントに任せる**: 反復作業はエージェントに委譲

---

## 🎊 MVP完成後

MVP完了後は Phase 7 以降の拡張機能開発に進みます。

**次のステップ**:
1. MVP動作確認・実機テスト
2. クライアント・ステークホルダーへのデモ
3. フィードバック収集
4. Phase 7 以降の計画

**Phase 7以降のチケット作成**:
```bash
/create-ticket feature "Add user authentication with Clerk"
/create-ticket feature "Add cloud sync with Neon PostgreSQL"
/create-ticket enhancement "Improve load time with code splitting"
```

---

**作成日**: 2025-10-23
**最終更新**: 2025-10-23
**バージョン**: 1.0

---

**開発を始める準備ができました! `/next-ticket` でスタートしましょう! 🚀**
