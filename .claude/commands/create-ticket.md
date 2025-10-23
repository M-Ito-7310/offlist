# Create Ticket Command

新規チケットを作成します (Bug / Feature / Enhancement)。

## タスク

1. **チケットタイプ判別**
   - ユーザーからのコマンド引数を解析: `/create-ticket [type] [title]`
   - `type`: `bug`, `feature`, `enhancement` のいずれか
   - `title`: チケットのタイトル (簡潔な説明)

2. **チケット番号割り当て**
   - 該当カテゴリー内の既存チケットをスキャン
   - 最新の番号を特定し、+1 した番号を割り当て
   - 例: bug-001, bug-002, ... または feature-001, feature-002, ...

3. **チケットファイル生成**
   - カテゴリー別テンプレートを使用:
     - Bug: `docs/ticket/README.md` のBugテンプレート
     - Feature: `docs/ticket/README.md` のFeatureテンプレート
     - Enhancement: `docs/ticket/README.md` のEnhancementテンプレート

   - ファイル名: `[type]-[number]-[brief-slug].md`
     - 例: `bug-001-install-prompt-not-showing.md`
     - 例: `feature-001-cloud-sync.md`

4. **テンプレート内容カスタマイズ**
   - タイトルを自動挿入
   - 作成日時を記録
   - 優先度をデフォルト値に設定 (Bug: 🟡 High, Feature: 🔵 Nice to Have, Enhancement: 🟡 Medium)

5. **チケット保存**
   - 適切なディレクトリに保存:
     - Bug: `docs/ticket/bug/`
     - Feature: `docs/ticket/feature/`
     - Enhancement: `docs/ticket/enhancement/`

6. **確認メッセージ表示**
   - 作成されたチケットのパスを表示
   - 次のアクションを提案 (優先度設定、詳細記入など)

## 使用例

### Bug チケット作成

```
ユーザー: /create-ticket bug "Install prompt not showing on iOS Safari"

アシスタント:
🐛 Bug チケットを作成しました

📁 ファイル: docs/ticket/bug/bug-001-install-prompt-ios.md
🔢 チケット番号: #001
📋 タイトル: Install prompt not showing on iOS Safari
⚠️ 優先度: 🟡 High (デフォルト)

次のアクション:
1. チケットを開いて詳細を記入してください
2. 再現手順、期待動作、実際の動作を追記
3. 環境情報 (iOS version, Safari version) を記載
4. 必要に応じて優先度を調整 (🔴 Critical / 🟡 High / 🔵 Medium / ⚪ Low)
```

### Feature チケット作成

```
ユーザー: /create-ticket feature "Add cloud synchronization"

アシスタント:
✨ Feature チケットを作成しました

📁 ファイル: docs/ticket/feature/feature-001-cloud-sync.md
🔢 チケット番号: #001
📋 タイトル: Add cloud synchronization
⚠️ 優先度: 🔵 Nice to Have (デフォルト)

次のアクション:
1. ユーザーストーリーを記入 (「〇〇として、〇〇したい。なぜなら〇〇だから」)
2. 必須要件とオプション要件を定義
3. UI/UX設計を追加
4. 技術設計 (Neon PostgreSQL, JWT認証など) を記載
```

### Enhancement チケット作成

```
ユーザー: /create-ticket enhancement "Improve load time by code splitting"

アシスタント:
🔧 Enhancement チケットを作成しました

📁 ファイル: docs/ticket/enhancement/enhancement-001-code-splitting.md
🔢 チケット番号: #001
📋 タイトル: Improve load time by code splitting
⚠️ 優先度: 🟡 Medium (デフォルト)

次のアクション:
1. 現状のロード時間を計測・記録
2. 問題点を明確化 (バンドルサイズ、初回ロード時間など)
3. 改善案を具体的に記載 (dynamic import, lazy loading など)
4. 期待される効果を定量的に記述 (目標: 2秒以下)
```

## チケットテンプレート

### Bug Template

```markdown
# Bug #XXX: [Title]

**Created**: [Date]
**Status**: 調査中

## 優先度
🟡 High

## 現象
[バグの詳細説明]

## 再現手順
1.
2.
3.

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

### Feature Template

```markdown
# Feature #XXX: [Title]

**Created**: [Date]
**Status**: 設計中

## 優先度
🔵 Nice to Have

## 概要
[機能の説明]

## ユーザーストーリー
「〇〇として、〇〇したい。なぜなら〇〇だから。」

## 要件
### 必須要件
- [ ]
- [ ]

### オプション要件
- [ ]

## UI/UX設計
[ワイヤーフレームまたは説明]

## 技術設計
[実装方法の概要]

## テストケース
- [ ]
- [ ]

## ステータス
- [ ] 設計中
- [ ] 実装中
- [ ] テスト中
- [ ] 完了
```

### Enhancement Template

```markdown
# Enhancement #XXX: [Title]

**Created**: [Date]
**Status**: 提案

## 優先度
🟡 Medium

## 現状
[現在の状態]

## 問題点
[改善が必要な理由]

## 改善案
[具体的な改善内容]

## 期待される効果
- パフォーマンス:
- ユーザー体験:

## 実装方法
[技術的な実装詳細]

## ステータス
- [ ] 提案
- [ ] 承認
- [ ] 実装中
- [ ] 完了
```

## 注意事項

- チケットタイトルは簡潔に (50文字以内推奨)
- ファイル名のslugは小文字・ハイフン区切りで生成 (`install-prompt-not-showing`)
- 優先度は後から変更可能なので、まずはデフォルト値で作成
- 詳細な内容はチケット作成後に手動で追記
