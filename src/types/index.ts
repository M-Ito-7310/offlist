export type Category = 'food' | 'daily' | 'other';

export interface ShoppingItem {
  id: string; // UUID
  name: string; // アイテム名 (1-50文字)
  category: Category; // カテゴリー
  checked: boolean; // 購入済みフラグ
  quantity?: number; // 数量 (1-999)
  memo?: string; // メモ (0-100文字)
  createdAt: Date; // 作成日時
  updatedAt: Date; // 更新日時
}
