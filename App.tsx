
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Challenge, ActivityCategory, UserGoal, ShopItem } from './types';
import { INITIAL_USER, LEVEL_THRESHOLD, INITIAL_GOALS, AVATAR_SEEDS, SHOP_ITEMS } from './constants';
import { generateNewChallenges } from './services/geminiService';
import ProfileHeader from './components/ProfileHeader';
import ChallengeCard from './components/ChallengeCard';
import LevelUpModal from './components/LevelUpModal';
import ShopModal from './components/ShopModal';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('levelup_user');
    const parsed = saved ? JSON.parse(saved) : INITIAL_USER;
    // Ensure new fields exist for legacy users
    return {
      ...INITIAL_USER,
      ...parsed,
      unlockedAuras: parsed.unlockedAuras || [],
      gems: parsed.gems ?? 100,
    };
  });
  
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('levelup_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: number, rewards: string[] } | null>(null);
  const [newGoalLabel, setNewGoalLabel] = useState('');

  // Persistence
  useEffect(() => {
    localStorage.setItem('levelup_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('levelup_challenges', JSON.stringify(activeChallenges));
  }, [activeChallenges]);

  const handleCompleteChallenge = useCallback((id: string) => {
    const challenge = activeChallenges.find(c => c.id === id);
    if (!challenge) return;

    setUser(prev => {
      const oldLevel = prev.level;
      const newTotalXp = prev.totalXp + challenge.xpReward;
      const newLevel = Math.floor(newTotalXp / LEVEL_THRESHOLD) + 1;
      const newXp = newTotalXp % LEVEL_THRESHOLD;
      const newGems = prev.gems + (challenge.gemReward || Math.floor(challenge.xpReward * 0.1));
      
      let nextUser = {
        ...prev,
        totalXp: newTotalXp,
        level: newLevel,
        xp: newXp,
        gems: newGems,
        history: [...prev.history, { ...challenge, completed: true, createdAt: Date.now() }]
      };

      if (newLevel > oldLevel) {
        const rewards: string[] = [];
        const nextAvatarIndex = newLevel % AVATAR_SEEDS.length;
        const newSeed = AVATAR_SEEDS[nextAvatarIndex];
        if (!prev.unlockedAvatars.includes(newSeed)) {
          nextUser.unlockedAvatars = [...prev.unlockedAvatars, newSeed];
          rewards.push(`Unlocked Outfit: ${newSeed.toUpperCase()}`);
        }
        rewards.push(`Level Multiplier Bonus: 50 Gems!`);
        nextUser.gems += 50;

        setLevelUpData({ level: newLevel, rewards });
      }
      
      return nextUser;
    });

    setActiveChallenges(prev => prev.filter(c => c.id !== id));
  }, [activeChallenges]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const newChallenges = await generateNewChallenges(user);
    if (newChallenges.length > 0) {
      setActiveChallenges(newChallenges);
    }
    setIsGenerating(false);
  };

  const handleAddGoal = () => {
    if (!newGoalLabel.trim()) return;
    const newGoal: UserGoal = {
      id: Math.random().toString(36).substr(2, 9),
      label: newGoalLabel.trim(),
      category: ActivityCategory.GROWTH,
      isCustom: true
    };
    setUser(prev => ({ ...prev, goals: [...prev.goals, newGoal] }));
    setNewGoalLabel('');
  };

  const toggleGoal = (goal: UserGoal) => {
    setUser(prev => {
      const exists = prev.goals.find(g => g.id === goal.id);
      if (exists) {
        return { ...prev, goals: prev.goals.filter(g => g.id !== goal.id) };
      } else {
        return { ...prev, goals: [...prev.goals, goal] };
      }
    });
  };

  const handleUpdateAvatar = (seed: string) => setUser(prev => ({ ...prev, currentAvatar: seed }));
  const handleUpdateAura = (auraId: string) => {
    const item = SHOP_ITEMS.find(i => i.id === auraId);
    setUser(prev => ({ ...prev, aura: item ? item.value : '' }));
  };

  const handlePurchase = (item: ShopItem) => {
    if (user.gems < item.cost) return;
    setUser(prev => {
      const next = { ...prev, gems: prev.gems - item.cost };
      if (item.type === 'aura') {
        next.unlockedAuras = [...prev.unlockedAuras, item.id];
      } else if (item.type === 'skin') {
        next.unlockedAvatars = [...prev.unlockedAvatars, item.value];
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {levelUpData && (
        <LevelUpModal 
          level={levelUpData.level} 
          rewards={levelUpData.rewards} 
          onClose={() => setLevelUpData(null)} 
        />
      )}

      {showShop && (
        <ShopModal 
          user={user} 
          onPurchase={handlePurchase} 
          onClose={() => setShowShop(false)} 
        />
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              L
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">LevelUp <span className="text-blue-500">Life</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowShop(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              <span className="text-xl">💎</span>
              <span className="font-black text-blue-400">{user.gems}</span>
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-3 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </button>
          </div>
        </nav>

        {showSettings && (
          <div className="mb-12 p-8 rounded-3xl bg-slate-900 border border-slate-700 animate-in fade-in slide-in-from-top-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-xl font-black mb-4 uppercase tracking-wider text-slate-400">Mission Objectives</h2>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newGoalLabel}
                      onChange={(e) => setNewGoalLabel(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                      placeholder="Add custom goal (e.g. Learn Guitar)"
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={handleAddGoal} className="px-4 py-2 bg-blue-600 rounded-xl font-bold">+</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.goals.map(goal => (
                      <div key={goal.id} className="flex items-center gap-1 bg-slate-800 border border-blue-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300">
                        {goal.label}
                        <button onClick={() => toggleGoal(goal)} className="ml-2 text-slate-500 hover:text-red-400">×</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black mb-4 uppercase tracking-wider text-slate-400">Protocol Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Operative Handle</label>
                    <input 
                      type="text" 
                      value={user.name} 
                      onChange={(e) => setUser(prev => ({...prev, name: e.target.value}))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <ProfileHeader 
          user={user} 
          onUpdateAvatar={handleUpdateAvatar} 
          onUpdateAura={handleUpdateAura} 
        />

        {/* Challenge Section */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">Active Directives</h2>
              <p className="text-slate-400">Synced to your personalized goals.</p>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              {isGenerating ? 'Syncing...' : 'Get New Missions'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeChallenges.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onComplete={handleCompleteChallenge} 
              />
            ))}
            {activeChallenges.length === 0 && !isGenerating && (
              <div className="col-span-full p-12 bg-slate-900/30 border-2 border-dashed border-slate-800 rounded-3xl text-center">
                <p className="text-slate-500 font-bold italic">Radar sweep complete. No active threats. Initiate mission sync for new directives.</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Logs */}
        <section className="pb-20">
          <h2 className="text-2xl font-black text-white mb-8 border-b border-slate-800 pb-4 italic uppercase">Completion Log</h2>
          <div className="space-y-3">
            {user.history.slice(-5).reverse().map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{entry.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-black">{entry.category}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-xs font-mono font-bold text-emerald-400">+{entry.xpReward} XP</span>
                  <span className="text-xs font-mono font-bold text-blue-400">+{entry.gemReward} 💎</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
