
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
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  taskDetails: string;
  timeRequired: string;
  xpReward: number;
  category: ActivityCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Legendary';
  completed: boolean;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  level: number;
  xp: number;
  totalXp: number;
  goals: UserGoal[];
  preferences: string[];
  history: Challenge[];
  unlockedAvatars: string[];
  currentAvatar: string;
  unlockedTiers: string[]; // e.g., ['Beginner', 'Intermediate']
}

export interface Quest {
  id: string;
  title: string;
  type: 'Daily' | 'Weekly';
  description: string;
  requirement: number;
  progress: number;
  xpReward: number;
}
