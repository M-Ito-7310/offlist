# Ticket System

## チケット管理システム概要

Offlistプロジェクトでは、タスクを**チケット形式**で管理します。nocode-ui-builderのチケットシステムを参考に、以下の4つのカテゴリーで分類します。

## チケットカテゴリー

### 1. initial/
**初期開発フェーズのチケット**

MVP開発のPhase 1-6のタスクを管理します。

**ファイル形式:**
- `phase-01-project-setup.md`
- `phase-02-pwa-config.md`
- `phase-03-offline-storage.md`
- `phase-04-core-features.md`
- `phase-05-ui-polish.md`
- `phase-06-deployment.md`

**内容:**
- Phaseの目的
- タスク一覧（チェックボックス形式）
- 成果物
- テストケース

---

### 2. bug/
**バグ修正チケット**

リリース後に発見されたバグを管理します。

**ファイル命名規則:** `bug-XXX-brief-description.md`

**例:**
- `bug-001-install-prompt-not-showing.md`
- `bug-002-indexeddb-data-loss.md`

**テンプレート:**
```markdown
# Bug #XXX: [バグの簡潔な説明]

## 優先度
- 🔴 Critical / 🟡 High / 🔵 Medium / ⚪ Low

## 現象
[バグの詳細説明]

## 再現手順
1. ...
2. ...
3. ...

## 期待される動作
[本来の正しい動作]

## 実際の動作
[現在の誤った動作]

## 環境
- ブラウザ:
- OS:
- デバイス:

## 解決策
[修正方法]

## ステータス
- [ ] 調査中
- [ ] 修正中
- [ ] テスト中
- [ ] 完了
```

---

### 3. feature/
**新機能追加チケット**

Phase 7以降の機能拡張を管理します。

**ファイル命名規則:** `feature-XXX-brief-description.md`

**例:**
- `feature-001-cloud-sync.md`
- `feature-002-multiple-lists.md`
- `feature-003-recipe-integration.md`

**テンプレート:**
```markdown
# Feature #XXX: [機能名]

## 優先度
- 🔴 Must Have / 🟡 Should Have / 🔵 Nice to Have

## 概要
[機能の説明]

## ユーザーストーリー
「〇〇として、〇〇したい。なぜなら〇〇だから。」

## 要件
### 必須要件
- [ ] ...
- [ ] ...

### オプション要件
- [ ] ...

## UI/UX設計
[ワイヤーフレームまたは説明]

## 技術設計
[実装方法の概要]

## テストケース
- [ ] ...
- [ ] ...

## ステータス
- [ ] 設計中
- [ ] 実装中
- [ ] テスト中
- [ ] 完了
```

---

### 4. enhancement/
**改善・最適化チケット**

既存機能の改善やパフォーマンス最適化を管理します。

**ファイル命名規則:** `enhancement-XXX-brief-description.md`

**例:**
- `enhancement-001-improve-load-time.md`
- `enhancement-002-better-animations.md`

**テンプレート:**
```markdown
# Enhancement #XXX: [改善内容]

## 優先度
- 🔴 High / 🟡 Medium / 🔵 Low

## 現状
[現在の状態]

## 問題点
[改善が必要な理由]

## 改善案
[具体的な改善内容]

## 期待される効果
- パフォーマンス: ...
- ユーザー体験: ...

## 実装方法
[技術的な実装詳細]

## ステータス
- [ ] 提案
- [ ] 承認
- [ ] 実装中
- [ ] 完了
```

---

## チケット管理フロー

### 1. チケット作成
新しいタスク・バグ・機能要望が発生したら、適切なカテゴリーにチケットを作成

### 2. 優先度設定
🔴 Critical/Must Have → 🟡 High/Should Have → 🔵 Medium/Nice to Have → ⚪ Low

### 3. ステータス更新
チェックボックスで進捗を管理

### 4. 完了
すべてのタスクが完了したらチケットをクローズ

---

## PROGRESS.md

各カテゴリー内に`PROGRESS.md`を配置し、全チケットの進捗を一覧表示します。

**例: initial/PROGRESS.md**
```markdown
# 初期開発進捗

## Phase 1: プロジェクトセットアップ
- ✅ Next.jsプロジェクト初期化
- ✅ PWA設定
- ⏳ テスト実行

## Phase 2: PWA設定
- ⏳ manifest.json作成
- ⬜ Service Worker設定
- ⬜ アイコン作成

...
```

---

## ベストプラクティス

1. **チケットは小さく**: 1つのチケットは1-2時間で完了するサイズ
2. **明確な成果物**: 「〇〇を実装する」ではなく「〇〇が動作する」
3. **テスト条件を明記**: 「どうなったら完了か」を明確に
4. **定期的な更新**: 毎日ステータスを更新

---

**このシステムの目的**: タスクの見える化、進捗管理の効率化

**作成日**: 2025年10月23日
**バージョン**: 1.0
