
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Challenge, ActivityCategory, UserGoal } from './types';
import { INITIAL_USER, LEVEL_THRESHOLD, INITIAL_GOALS, AVATAR_SEEDS } from './constants';
import { generateNewChallenges } from './services/geminiService';
import ProfileHeader from './components/ProfileHeader';
import ChallengeCard from './components/ChallengeCard';
import LevelUpModal from './components/LevelUpModal';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('levelup_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });
  
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('levelup_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ level: number, rewards: string[] } | null>(null);

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
      
      let nextUser = {
        ...prev,
        totalXp: newTotalXp,
        level: newLevel,
        xp: newXp,
        history: [...prev.history, { ...challenge, completed: true, createdAt: Date.now() }]
      };

      // Check for level up rewards
      if (newLevel > oldLevel) {
        const rewards: string[] = [];
        
        // Unlock new avatar seed
        const nextAvatarIndex = newLevel % AVATAR_SEEDS.length;
        const newSeed = AVATAR_SEEDS[nextAvatarIndex];
        if (!prev.unlockedAvatars.includes(newSeed)) {
          nextUser.unlockedAvatars = [...prev.unlockedAvatars, newSeed];
          rewards.push(`New Appearance: ${newSeed.charAt(0).toUpperCase() + newSeed.slice(1)}`);
        }

        // Unlock new tiers
        if (newLevel === 3 && !prev.unlockedTiers.includes('Intermediate')) {
          nextUser.unlockedTiers = [...nextUser.unlockedTiers, 'Intermediate'];
          rewards.push('New Tier: Intermediate Missions');
        }
        if (newLevel === 7 && !prev.unlockedTiers.includes('Advanced')) {
          nextUser.unlockedTiers = [...nextUser.unlockedTiers, 'Advanced'];
          rewards.push('New Tier: Advanced Hero Missions');
        }
        if (newLevel === 15 && !prev.unlockedTiers.includes('Legendary')) {
          nextUser.unlockedTiers = [...nextUser.unlockedTiers, 'Legendary'];
          rewards.push('Ultimate Tier: Legendary Missions');
        }

        setLevelUpData({ level: newLevel, rewards: rewards.length ? rewards : ['Bonus Skill Point (Visual)'] });
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

  const handleUpdateAvatar = (seed: string) => {
    setUser(prev => ({ ...prev, currentAvatar: seed }));
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

      <div className="max-w-6xl mx-auto">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              L
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">LevelUp <span className="text-blue-500">Life</span></span>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </button>
        </nav>

        {showSettings && (
          <div className="mb-12 p-8 rounded-3xl bg-slate-900 border border-slate-700 animate-in fade-in slide-in-from-top-4">
            <h2 className="text-2xl font-black mb-6">Quest Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Core Focus Areas</p>
                <div className="flex flex-wrap gap-2">
                  {INITIAL_GOALS.map(goal => (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${user.goals.find(g => g.id === goal.id) ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                    >
                      {goal.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Identity</p>
                <input 
                  type="text" 
                  value={user.name} 
                  onChange={(e) => setUser(prev => ({...prev, name: e.target.value}))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Hero Name"
                />
              </div>
            </div>
          </div>
        )}

        <ProfileHeader user={user} onUpdateAvatar={handleUpdateAvatar} />

        {/* Challenge Section */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">Daily Directives</h2>
              <p className="text-slate-400">Personalized missions generated by AI based on your lifestyle.</p>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl font-bold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Syncing Reality...
                </span>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  Sync Missions
                </>
              )}
            </button>
          </div>

          {activeChallenges.length === 0 ? (
            <div className="p-20 border-2 border-dashed border-slate-800 rounded-3xl text-center">
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.268 17c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-500 mb-2">No active missions in your sector</h3>
              <p className="text-slate-600 mb-8">Tap 'Sync Missions' to receive directives matched to your rank.</p>
              <button onClick={handleGenerate} className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-2xl font-bold transition-all text-slate-400">Initialize Sync</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map(challenge => (
                <ChallengeCard 
                  key={challenge.id} 
                  challenge={challenge} 
                  onComplete={handleCompleteChallenge} 
                />
              ))}
            </div>
          )}
        </section>

        {/* History Section */}
        <section className="pb-20">
          <h2 className="text-2xl font-black text-white mb-8 border-b border-slate-800 pb-4 italic uppercase">Log History</h2>
          <div className="grid grid-cols-1 gap-4">
            {user.history.length === 0 ? (
              <p className="text-slate-600 italic">No missions logged in this timeline yet.</p>
            ) : (
              user.history.slice(-10).reverse().map((entry, idx) => (
                <div key={`${entry.id}-${idx}`} className="flex items-center gap-6 p-5 bg-slate-900/40 rounded-2xl border border-slate-800/50 hover:bg-slate-900/60 transition-colors">
                  <div className={`w-3 h-12 rounded-full shadow-lg ${entry.difficulty === 'Legendary' ? 'bg-red-500 shadow-red-500/20' : entry.difficulty === 'Advanced' ? 'bg-orange-500 shadow-orange-500/20' : 'bg-emerald-500 shadow-emerald-500/20'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-slate-200">{entry.title}</h4>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-800 text-slate-500 uppercase tracking-tighter">{entry.difficulty}</span>
                    </div>
                    <p className="text-xs text-slate-500">{new Date(entry.createdAt).toLocaleString()} • {entry.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-400 font-mono font-bold text-lg">+{entry.xpReward} XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default App;
