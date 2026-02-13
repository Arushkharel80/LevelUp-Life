
import { ActivityCategory, UserGoal, UserProfile } from './types';

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

export const INITIAL_USER: UserProfile = {
  name: 'Player 1',
  level: 1,
  xp: 0,
  totalXp: 0,
  goals: INITIAL_GOALS.slice(0, 2),
  preferences: ['Outdoor activities', 'Mental health', 'Reading'],
  history: [],
  unlockedAvatars: [AVATAR_SEEDS[0]],
  currentAvatar: AVATAR_SEEDS[0],
  unlockedTiers: ['Beginner']
};

export const LEVEL_THRESHOLD = 1000;

export const CATEGORY_COLORS: Record<ActivityCategory, string> = {
  [ActivityCategory.FITNESS]: 'bg-red-500',
  [ActivityCategory.PRODUCTIVITY]: 'bg-blue-500',
  [ActivityCategory.GROWTH]: 'bg-emerald-500',
  [ActivityCategory.WELLNESS]: 'bg-purple-500',
  [ActivityCategory.CREATIVITY]: 'bg-amber-500',
};
