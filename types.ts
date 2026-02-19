export type DrinkType = 'beer' | 'wine' | 'sake' | 'shochu' | 'cocktail' | 'highball' | 'sour' | 'other';

export interface DrinkRecord {
  timestamp: number;
  type: DrinkType;
}

export interface User {
  id: string;
  name: string;
  avatarSeed: string; // Changed to string for better compatibility with DiceBear seeds
  drinks: DrinkRecord[];
}

export const DRINK_TYPES: { type: DrinkType; label: string; icon: string; color: string }[] = [
  { type: 'beer', label: 'ビール', icon: '🍺', color: 'bg-amber-400' },
  { type: 'highball', label: 'ハイボール', icon: '🥃', color: 'bg-amber-700' },
  { type: 'sour', label: 'サワー', icon: '🍋', color: 'bg-yellow-300' },
  { type: 'shochu', label: '焼酎', icon: '🥔', color: 'bg-stone-300' },
  { type: 'wine', label: 'ワイン', icon: '🍷', color: 'bg-rose-700' },
  { type: 'sake', label: '日本酒', icon: '🍶', color: 'bg-cyan-100' },
  { type: 'cocktail', label: 'カクテル', icon: '🍸', color: 'bg-pink-400' },
  { type: 'other', label: 'その他', icon: '🍹', color: 'bg-green-400' },
];