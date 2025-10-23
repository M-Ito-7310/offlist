# Phase 4: UIコンポーネント実装

**作成日**: 2025年10月23日
**Phase**: 4/6
**所要時間**: 2時間
**前提条件**: Phase 1-3完了（Next.js、PWA、IndexedDB設定済み）

---

## 目次

1. [Phase概要](#phase概要)
2. [UIデザインコンセプト](#uiデザインコンセプト)
3. [ディレクトリ構造](#ディレクトリ構造)
4. [スタイルガイド](#スタイルガイド)
5. [レイアウトコンポーネント](#レイアウトコンポーネント)
6. [共通UIコンポーネント](#共通uiコンポーネント)
7. [AddItemFormコンポーネント](#additemformコンポーネント)
8. [ShoppingItemコンポーネント](#shoppingitemコンポーネント)
9. [CategoryFilterコンポーネント](#categoryfilterコンポーネント)
10. [レスポンシブデザイン](#レスポンシブデザイン)
11. [アクセシビリティ](#アクセシビリティ)
12. [チェックリスト](#チェックリスト)
13. [次のステップ](#次のステップ)

---

## Phase概要

### 目的

Phase 4では、Offlistアプリケーションの**ミニマルデザインUI**を構築します。iOS/Android標準アプリのようなシンプルで直感的なインターフェースを目指し、モバイルファーストで実装します。

### コンポーネント設計思想

1. **単一責任の原則**: 各コンポーネントは1つの明確な役割を持つ
2. **再利用性**: ボタン、入力フィールドなど共通UIは独立したコンポーネント化
3. **型安全性**: TypeScriptの型定義を徹底
4. **パフォーマンス**: 不要な再レンダリングを防ぐメモ化
5. **アクセシビリティ**: ARIA属性とキーボード操作対応

### 実装するコンポーネント一覧

| コンポーネント | 役割 | 優先度 |
|--------------|------|--------|
| Layout | ヘッダー・フッター・コンテナ | 高 |
| Button | 汎用ボタン（Primary/Secondary/Danger） | 高 |
| Input | テキスト入力フィールド | 高 |
| Select | ドロップダウン選択 | 高 |
| AddItemForm | アイテム追加フォーム | 高 |
| ShoppingItem | 個別アイテム表示 | 高 |
| CategoryFilter | カテゴリータブ | 高 |
| Modal | 編集ダイアログ | 中 |
| Toast | 通知メッセージ | 中 |
| ConfirmDialog | 削除確認ダイアログ | 中 |

---

## UIデザインコンセプト

### デザイン原則

**ミニマリズム**: iOS「リマインダー」、Android「Google Keep」風のシンプルさ

**特徴:**
- 余白を十分に取る（視覚的な余裕）
- 色数を最小限に（白・グレー・アクセントカラー1-2色）
- 影やグラデーションは控えめ
- フラットデザイン
- タイポグラフィ重視

**インスピレーション:**
- Apple Human Interface Guidelines
- Material Design（簡素化版）

---

## ディレクトリ構造

### プロジェクト全体構造

```
offlist/
├── app/
│   ├── layout.tsx           # ルートレイアウト
│   ├── page.tsx             # メインページ（買い物リスト）
│   └── globals.css          # グローバルスタイル
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # ヘッダーコンポーネント
│   │   ├── Footer.tsx       # フッターコンポーネント
│   │   └── Container.tsx    # コンテナコンポーネント
│   ├── ui/
│   │   ├── Button.tsx       # ボタンコンポーネント
│   │   ├── Input.tsx        # 入力フィールド
│   │   ├── Select.tsx       # ドロップダウン
│   │   ├── Modal.tsx        # モーダルダイアログ
│   │   ├── Toast.tsx        # トースト通知
│   │   └── ConfirmDialog.tsx # 確認ダイアログ
│   ├── shopping/
│   │   ├── AddItemForm.tsx  # アイテム追加フォーム
│   │   ├── ShoppingItem.tsx # 個別アイテム
│   │   ├── ShoppingList.tsx # アイテムリスト
│   │   └── CategoryFilter.tsx # カテゴリーフィルター
│   └── pwa/
│       ├── InstallPrompt.tsx # インストールプロンプト
│       └── OnlineStatus.tsx  # オンライン状態表示
├── lib/
│   ├── db.ts                # IndexedDB操作（Phase 3）
│   └── types.ts             # 型定義
└── public/
    └── icons/               # PWAアイコン
```

### 命名規則

- **コンポーネント**: PascalCase（例: `AddItemForm.tsx`）
- **ユーティリティ**: camelCase（例: `formatDate.ts`）
- **定数**: UPPER_SNAKE_CASE（例: `MAX_ITEM_LENGTH`）

---

## スタイルガイド

### カラーパレット

Tailwind CSSのデフォルトカラーを基本とし、カスタムカラーを最小限に。

```typescript
// tailwind.config.ts で定義
const colors = {
  primary: {
    DEFAULT: '#3B82F6', // blue-500
    hover: '#2563EB',   // blue-600
    light: '#DBEAFE',   // blue-100
  },
  danger: {
    DEFAULT: '#EF4444', // red-500
    hover: '#DC2626',   // red-600
    light: '#FEE2E2',   // red-100
  },
  success: {
    DEFAULT: '#10B981', // green-500
    hover: '#059669',   // green-600
    light: '#D1FAE5',   // green-100
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};
```

**使用ガイドライン:**
- **背景**: gray-50（ライトモード）
- **カード**: white（白背景 + 薄い影）
- **プライマリボタン**: primary（青系）
- **削除ボタン**: danger（赤系）
- **成功メッセージ**: success（緑系）

### フォント設定

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans text-gray-900 bg-gray-50;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
```

**フォントファミリー:**
- **システムフォント優先**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **日本語**: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic'

### スペーシング規則

Tailwindの8pxベーススケールを使用。

| 用途 | Tailwindクラス | 実際のサイズ |
|------|---------------|-------------|
| 要素間の余白（小） | `gap-2` | 8px |
| 要素間の余白（中） | `gap-4` | 16px |
| 要素間の余白（大） | `gap-6` | 24px |
| パディング（小） | `p-2` | 8px |
| パディング（中） | `p-4` | 16px |
| パディング（大） | `p-6` | 24px |
| マージン（セクション） | `mb-8` | 32px |

### タイポグラフィスケール

| 用途 | Tailwindクラス | サイズ |
|------|---------------|--------|
| ページタイトル | `text-2xl font-bold` | 24px |
| セクション見出し | `text-lg font-semibold` | 18px |
| 本文 | `text-base` | 16px |
| 補足テキスト | `text-sm text-gray-500` | 14px |
| 小さい注釈 | `text-xs text-gray-400` | 12px |

---

## レイアウトコンポーネント

### 1. ルートレイアウト（app/layout.tsx）

Next.js 14のApp Routerルートレイアウト。

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Offlist - オフライン買い物リスト',
  description: 'オフラインでも使えるPWA買い物リストアプリ',
  manifest: '/manifest.json',
  themeColor: '#3B82F6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Offlist',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
```

**ポイント:**
- `manifest.json`をリンク（PWA設定）
- `themeColor`でツールバー色を指定
- `appleWebApp`でiOS対応

---

### 2. ヘッダーコンポーネント

```tsx
// components/layout/Header.tsx
'use client';

import { OnlineStatus } from '@/components/pwa/OnlineStatus';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* タイトル */}
        <h1 className="text-2xl font-bold text-gray-900">
          Offlist
        </h1>

        {/* オンライン状態インジケーター */}
        <OnlineStatus />
      </div>
    </header>
  );
}
```

**スタイルの意図:**
- `sticky top-0`: スクロール時に固定
- `border-b`: 下部に控えめな線
- `max-w-2xl mx-auto`: 最大幅を制限し中央揃え
- `z-10`: 他の要素より前面に表示

---

### 3. フッターコンポーネント

```tsx
// components/layout/Footer.tsx
'use client';

interface FooterProps {
  onClearCompleted: () => void;
  completedCount: number;
}

export function Footer({ onClearCompleted, completedCount }: FooterProps) {
  return (
    <footer className="bg-white border-t border-gray-200 sticky bottom-0 z-10">
      <div className="max-w-2xl mx-auto px-4 py-3">
        <button
          onClick={onClearCompleted}
          disabled={completedCount === 0}
          className="text-sm text-red-600 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          完了済みを削除 {completedCount > 0 && `(${completedCount})`}
        </button>
      </div>
    </footer>
  );
}
```

**ポイント:**
- 完了アイテム数を表示
- 0件の場合は無効化（`disabled`）

---

### 4. コンテナコンポーネント

```tsx
// components/layout/Container.tsx
interface ContainerProps {
  children: React.ReactNode;
}

export function Container({ children }: ContainerProps) {
  return (
    <main className="max-w-2xl mx-auto px-4 py-6 min-h-screen">
      {children}
    </main>
  );
}
```

**シンプルなラッパー:**
- 最大幅を制限（`max-w-2xl`）
- 中央揃え（`mx-auto`）
- 最小高さを画面全体に（`min-h-screen`）

---

## 共通UIコンポーネント

### 1. Buttonコンポーネント

再利用可能な汎用ボタン。

```tsx
// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-danger text-white hover:bg-danger-hover focus:ring-danger',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**使用例:**

```tsx
<Button variant="primary" size="lg">追加</Button>
<Button variant="danger" isLoading>削除中...</Button>
<Button variant="ghost" size="sm">キャンセル</Button>
```

**設計ポイント:**
- **variant**: 用途に応じたスタイル
- **size**: 3サイズ対応
- **isLoading**: ローディングスピナー表示
- **forwardRef**: ref転送でアクセシビリティ対応

---

### 2. Inputコンポーネント

```tsx
// components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full px-4 py-2 text-base border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'placeholder:text-gray-400',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
```

**使用例:**

```tsx
<Input
  label="商品名"
  placeholder="商品名を入力..."
  error="商品名を入力してください"
/>
```

---

### 3. Selectコンポーネント

```tsx
// components/ui/Select.tsx
import { SelectHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'w-full px-4 py-2 text-base border rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'bg-white cursor-pointer',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
```

---

### 4. Modalコンポーネント

```tsx
// components/ui/Modal.tsx
'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Escキーで閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="閉じる"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* コンテンツ */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
```

**特徴:**
- **Portal**: `document.body`に直接レンダリング
- **Escキー対応**: キーボードで閉じられる
- **背景クリック**: モーダル外をクリックで閉じる
- **スクロール制御**: モーダル表示中は背景をスクロール不可

---

### 5. ConfirmDialogコンポーネント

```tsx
// components/ui/ConfirmDialog.tsx
'use client';

import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '確認',
  cancelText = 'キャンセル',
  variant = 'primary',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-700 mb-6">{message}</p>

      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onClose}>
          {cancelText}
        </Button>
        <Button
          variant={variant}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
```

---

## AddItemFormコンポーネント

買い物リストにアイテムを追加するフォーム。

```tsx
// components/shopping/AddItemForm.tsx
'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Category } from '@/lib/types';

interface AddItemFormProps {
  onAdd: (name: string, category: Category) => Promise<void>;
}

const CATEGORY_OPTIONS = [
  { value: 'food', label: '🍎 食品' },
  { value: 'daily', label: '🧴 日用品' },
  { value: 'other', label: '📦 その他' },
];

export function AddItemForm({ onAdd }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('food');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション
    if (!name.trim()) {
      setError('商品名を入力してください');
      return;
    }

    if (name.length > 50) {
      setError('商品名は50文字以内で入力してください');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await onAdd(name.trim(), category);

      // 成功時にフォームをクリア
      setName('');
      setCategory('food');
    } catch (err) {
      setError('アイテムの追加に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* 商品名入力 */}
        <div className="flex-1">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="商品名を入力..."
            error={error}
            maxLength={50}
            autoComplete="off"
          />
        </div>

        {/* カテゴリー選択 */}
        <div className="w-full sm:w-40">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            options={CATEGORY_OPTIONS}
          />
        </div>

        {/* 追加ボタン */}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          追加
        </Button>
      </div>
    </form>
  );
}
```

**設計ポイント:**

1. **バリデーション**:
   - 空欄チェック
   - 文字数制限（50文字）
   - エラーメッセージ表示

2. **ローディング状態**:
   - `isLoading`でボタンを無効化
   - スピナー表示

3. **レスポンシブ**:
   - モバイル: 縦並び（`flex-col`）
   - デスクトップ: 横並び（`sm:flex-row`）

4. **UX**:
   - 成功時に自動クリア
   - Enterキーで送信可能

---

## ShoppingItemコンポーネント

個別の買い物アイテムを表示・操作するコンポーネント。

```tsx
// components/shopping/ShoppingItem.tsx
'use client';

import { useState } from 'react';
import { ShoppingItem as Item } from '@/lib/types';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { clsx } from 'clsx';

interface ShoppingItemProps {
  item: Item;
  onToggle: (id: string) => void;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export function ShoppingItem({ item, onToggle, onEdit, onDelete }: ShoppingItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const categoryEmojis = {
    food: '🍎',
    daily: '🧴',
    other: '📦',
  };

  return (
    <>
      <div
        className={clsx(
          'bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all duration-200',
          'hover:shadow-md',
          item.checked && 'opacity-60'
        )}
      >
        <div className="flex items-center gap-3">
          {/* チェックボックス */}
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => onToggle(item.id)}
            className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
            aria-label={`${item.name}を${item.checked ? '未完了' : '完了'}にする`}
          />

          {/* アイテム情報 */}
          <div
            className="flex-1 cursor-pointer"
            onClick={() => onEdit(item)}
          >
            {/* 商品名 */}
            <p className={clsx(
              'text-base font-medium',
              item.checked && 'line-through text-gray-500'
            )}>
              {item.name}
            </p>

            {/* カテゴリーバッジ */}
            <div className="flex items-center gap-1 mt-1">
              <span className="text-sm">
                {categoryEmojis[item.category]}
              </span>
              <span className="text-xs text-gray-500">
                {item.category === 'food' && '食品'}
                {item.category === 'daily' && '日用品'}
                {item.category === 'other' && 'その他'}
              </span>
            </div>
          </div>

          {/* 削除ボタン */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-gray-400 hover:text-red-600 transition-colors p-2"
            aria-label="削除"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onDelete(item.id)}
        title="アイテムを削除"
        message={`「${item.name}」を削除しますか?`}
        confirmText="削除"
        cancelText="キャンセル"
        variant="danger"
      />
    </>
  );
}
```

**特徴:**

1. **チェック機能**:
   - チェックボックスで購入済みマーク
   - チェック時に取り消し線とグレーアウト

2. **編集**:
   - アイテム全体をクリックで編集モーダル

3. **削除**:
   - ×ボタンをクリック
   - 確認ダイアログ表示

4. **アニメーション**:
   - ホバーで影を強調
   - チェック時に透明度変化

---

## CategoryFilterコンポーネント

カテゴリー別のフィルタリングタブ。

```tsx
// components/shopping/CategoryFilter.tsx
'use client';

import { Category } from '@/lib/types';
import { clsx } from 'clsx';

interface CategoryFilterProps {
  selected: Category | 'all';
  onSelect: (category: Category | 'all') => void;
  counts: {
    all: number;
    food: number;
    daily: number;
    other: number;
  };
}

const CATEGORIES = [
  { value: 'all' as const, label: 'すべて', emoji: '📋' },
  { value: 'food' as const, label: '食品', emoji: '🍎' },
  { value: 'daily' as const, label: '日用品', emoji: '🧴' },
  { value: 'other' as const, label: 'その他', emoji: '📦' },
];

export function CategoryFilter({ selected, onSelect, counts }: CategoryFilterProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
      <div className="flex gap-2 overflow-x-auto">
        {CATEGORIES.map((category) => {
          const isSelected = selected === category.value;
          const count = counts[category.value];

          return (
            <button
              key={category.value}
              onClick={() => onSelect(category.value)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors',
                isSelected
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
              {count > 0 && (
                <span className={clsx(
                  'px-2 py-0.5 rounded-full text-xs font-semibold',
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

**設計ポイント:**

1. **タブデザイン**:
   - 選択中は青背景（`bg-primary`）
   - 未選択はグレー背景（`bg-gray-100`）

2. **アイテム数表示**:
   - 各カテゴリーのアイテム数をバッジで表示
   - 0件の場合は非表示

3. **レスポンシブ**:
   - 横スクロール対応（`overflow-x-auto`）
   - モバイルでタブが収まらない場合にスワイプ

---

## レスポンシブデザイン

### モバイルファースト設計

Tailwind CSSのブレークポイントを活用。

**ブレークポイント:**

| サイズ | Tailwindプレフィックス | 最小幅 |
|--------|---------------------|--------|
| モバイル | （デフォルト） | 0px |
| タブレット | `sm:` | 640px |
| デスクトップ（小） | `md:` | 768px |
| デスクトップ（大） | `lg:` | 1024px |

### 実装例

```tsx
// モバイルファーストのレイアウト
<div className="
  flex flex-col gap-2        /* モバイル: 縦並び */
  sm:flex-row sm:gap-4       /* タブレット以上: 横並び */
  lg:gap-6                   /* デスクトップ: より大きい余白 */
">
  {/* コンテンツ */}
</div>
```

### タッチ操作最適化

**ボタンサイズ:**
- 最小サイズ: 44x44px（Apple Human Interface Guidelines準拠）
- タップ可能な要素間のスペース: 8px以上

```tsx
// タッチに最適化されたボタン
<button className="min-h-[44px] min-w-[44px] p-2">
  削除
</button>
```

---

## アクセシビリティ

### ARIA属性

```tsx
// 適切なARIAラベル
<button aria-label="アイテムを削除">
  <svg>...</svg>
</button>

// ロール指定
<div role="dialog" aria-modal="true">
  {/* モーダルコンテンツ */}
</div>

// ライブリージョン
<div role="status" aria-live="polite">
  アイテムを追加しました
</div>
```

### キーボード操作対応

**サポートするキー:**

| キー | 動作 |
|------|------|
| `Tab` | フォーカス移動 |
| `Enter` | ボタンクリック、フォーム送信 |
| `Space` | チェックボックストグル |
| `Escape` | モーダル・ダイアログを閉じる |
| `矢印キー` | リスト内の移動（将来実装） |

**実装例:**

```tsx
// フォーカス可能な要素
<button
  className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
>
  クリック
</button>
```

### カラーコントラスト

WCAG 2.1レベルAA準拠（コントラスト比4.5:1以上）。

**テキストカラー:**
- 通常テキスト: `text-gray-900` on `bg-white` → 21:1
- 補足テキスト: `text-gray-600` on `bg-white` → 7:1
- 無効化テキスト: `text-gray-400` on `bg-white` → 3:1（WCAG AAレベル）

---

## チェックリスト

### 実装確認

- [ ] 全コンポーネントがレンダリング成功
- [ ] TypeScriptの型エラーなし
- [ ] Tailwind CSSクラスが正しく適用
- [ ] レスポンシブデザインが機能

### デザイン確認

- [ ] ミニマルデザインが実現
- [ ] カラーパレットが統一
- [ ] スペーシングが一貫
- [ ] フォントが適切

### モバイル確認

- [ ] モバイルで操作快適
- [ ] タッチ領域が44x44px以上
- [ ] 横スクロールが発生しない
- [ ] フォーム入力がスムーズ

### アクセシビリティ確認

- [ ] ARIA属性が適切
- [ ] キーボード操作が可能
- [ ] フォーカス状態が視認可能
- [ ] カラーコントラストが十分

### パフォーマンス確認

- [ ] 不要な再レンダリングがない
- [ ] アニメーションが60fps
- [ ] 初回ロードが2秒以内

---

## 次のステップ

### Phase 5への準備

Phase 4でUIコンポーネントを完成させたら、Phase 5で以下を実装します:

1. **状態管理**: React HooksでアイテムのCRUD操作
2. **IndexedDB統合**: Phase 3で作成したDB操作関数を接続
3. **編集機能**: モーダルでアイテム編集
4. **フィルター機能**: カテゴリーと完了状態でフィルタリング
5. **アニメーション**: 追加・削除時のスムーズな遷移

**次のドキュメント**: `20251023_05-shopping-list-features.md`

---

## まとめ

Phase 4では、以下のUIコンポーネントを実装しました:

**レイアウト:**
- Header（ヘッダー）
- Footer（フッター）
- Container（コンテナ）

**共通UI:**
- Button（ボタン）
- Input（入力フィールド）
- Select（ドロップダウン）
- Modal（モーダル）
- ConfirmDialog（確認ダイアログ）

**機能コンポーネント:**
- AddItemForm（アイテム追加フォーム）
- ShoppingItem（個別アイテム）
- CategoryFilter（カテゴリーフィルター）

**デザイン原則:**
- ミニマルデザイン
- モバイルファースト
- アクセシビリティ重視
- 型安全性

これらのコンポーネントは、Phase 5で状態管理とIndexedDBと統合され、完全に機能する買い物リストアプリになります。

---

**ドキュメント作成者**: AI Agent (Claude)
**最終更新日**: 2025年10月23日
**バージョン**: 1.0
