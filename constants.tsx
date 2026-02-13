
import { ActivityCategory, UserGoal, UserProfile, ShopItem } from './types';

export const INITIAL_GOALS: UserGoal[] = [
  { id: '1', label: 'Improve physical strength', category: ActivityCategory.FITNESS },
  { id: '2', label: 'Read more books', category: ActivityCategory.GROWTH },
  { id: '3', label: 'Master coding skills', category: ActivityCategory.PRODUCTIVITY },
  { id: '4', label: 'Practice mindfulness', category: ActivityCategory.WELLNESS },
];

export const AVATAR_SEEDS = [
  'adventurer', 'knight', 'mage', 'rogue', 'monk', 
  'cyberpunk', 'steampunk', 'paladin', 'druid', 'scholar'
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'aura_blue', name: 'Azure Pulse', description: 'A cool blue cosmic glow.', cost: 150, type: 'aura', value: 'shadow-[0_0_20px_rgba(59,130,246,0.6)] border-blue-400' },
  { id: 'aura_gold', name: 'Golden Zenith', description: 'The radiance of a champion.', cost: 500, type: 'aura', value: 'shadow-[0_0_25px_rgba(234,179,8,0.7)] border-yellow-400' },
  { id: 'aura_void', name: 'Void Walker', description: 'The mysterious dark energy.', cost: 1000, type: 'aura', value: 'shadow-[0_0_30px_rgba(168,85,247,0.6)] border-purple-600' },
  { id: 'skin_robot', name: 'Cyber Droid', description: 'Exchange your soul for silicon.', cost: 300, type: 'skin', value: 'bottts' },
  { id: 'skin_cat', name: 'Neko Warrior', description: 'Unleash the inner feline.', cost: 200, type: 'skin', value: 'avataaars' },
];

export const INITIAL_USER: UserProfile = {
  name: 'Player 1',
  level: 1,
  xp: 0,
  gems: 100,
  totalXp: 0,
  goals: INITIAL_GOALS.slice(0, 2),
  preferences: ['Outdoor activities', 'Mental health', 'Reading'],
  history: [],
  unlockedAvatars: [AVATAR_SEEDS[0]],
  currentAvatar: AVATAR_SEEDS[0],
  unlockedTiers: ['Beginner'],
  aura: '',
  unlockedAuras: []
};

export const LEVEL_THRESHOLD = 1000;

export const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  [ActivityCategory.FITNESS]: 'bg-red-500',
  [ActivityCategory.PRODUCTIVITY]: 'bg-blue-500',
  [ActivityCategory.GROWTH]: 'bg-emerald-500',
  [ActivityCategory.WELLNESS]: 'bg-purple-500',
  [ActivityCategory.CREATIVITY]: 'bg-amber-500',
};
