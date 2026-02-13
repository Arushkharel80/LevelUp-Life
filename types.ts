
export enum ActivityCategory {
  FITNESS = 'Fitness',
  PRODUCTIVITY = 'Productivity',
  GROWTH = 'Personal Growth',
  WELLNESS = 'Wellness',
  CREATIVITY = 'Creativity'
}

export interface UserGoal {
  id: string;
  label: string;
  category: ActivityCategory;
  isCustom?: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  taskDetails: string;
  timeRequired: string;
  xpReward: number;
  gemReward: number;
  category: ActivityCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Legendary';
  completed: boolean;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  gems: number;
  totalXp: number;
  goals: UserGoal[];
  preferences: string[];
  history: Challenge[];
  unlockedAvatars: string[];
  currentAvatar: string;
  unlockedTiers: string[];
  aura: string; // Current cosmetic aura
  unlockedAuras: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'aura' | 'skin' | 'booster';
  value: string;
}
