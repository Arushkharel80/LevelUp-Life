
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { LEVEL_THRESHOLD, AVATAR_SEEDS } from '../constants';

interface ProfileHeaderProps {
  user: UserProfile;
  onUpdateAvatar: (seed: string) => void;
  onUpdateAura: (aura: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onUpdateAvatar, onUpdateAura }) => {
  const [showPicker, setShowPicker] = useState<'avatar' | 'aura' | null>(null);
  const progressPercent = (user.xp / LEVEL_THRESHOLD) * 100;

  return (
    <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl mb-12">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Avatar Area */}
        <div className="relative">
          <button 
            onClick={() => setShowPicker(showPicker === 'avatar' ? null : 'avatar')}
            className={`group relative w-32 h-32 rounded-3xl bg-blue-600 flex items-center justify-center border-4 border-slate-700 rotate-3 overflow-hidden transition-all hover:rotate-0 hover:scale-105 ${user.aura || 'shadow-[0_0_30px_rgba(37,99,235,0.4)]'}`}
          >
            <img src={`https://picsum.photos/seed/${user.currentAvatar}/200/200`} alt="Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">Customize</span>
            </div>
          </button>
          <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-slate-900 text-sm font-black px-4 py-2 rounded-xl shadow-lg border-2 border-slate-900">
            LVL {user.level}
          </div>

          {showPicker === 'avatar' && (
            <div className="absolute top-full left-0 mt-4 z-20 p-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-64 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Outfits</h4>
                <button onClick={() => setShowPicker('aura')} className="text-[10px] text-blue-400 font-bold hover:underline">Switch to Auras</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {user.unlockedAvatars.map(seed => (
                  <button 
                    key={seed}
                    onClick={() => {
                      onUpdateAvatar(seed);
                      setShowPicker(null);
                    }}
                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${user.currentAvatar === seed ? 'border-blue-500' : 'border-transparent hover:border-slate-500'}`}
                  >
                    <img src={`https://picsum.photos/seed/${seed}/50/50`} alt={seed} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {showPicker === 'aura' && (
            <div className="absolute top-full left-0 mt-4 z-20 p-4 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-64 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Auras</h4>
                <button onClick={() => setShowPicker('avatar')} className="text-[10px] text-blue-400 font-bold hover:underline">Switch to Avatars</button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => { onUpdateAura(''); setShowPicker(null); }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${user.aura === '' ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700'}`}
                >
                  None
                </button>
                {user.unlockedAuras.map(auraId => (
                  <button 
                    key={auraId}
                    onClick={() => {
                      onUpdateAura(auraId);
                      setShowPicker(null);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${user.aura === auraId ? 'border-blue-500 bg-blue-500/20' : 'border-slate-700'}`}
                  >
                    {auraId.replace('aura_', '').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Info & Progress */}
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black text-white tracking-tight">{user.name}</h1>
                <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">
                  <span className="text-sm">💎</span>
                  <span className="text-sm font-black text-blue-400">{user.gems}</span>
                </div>
              </div>
              <p className="text-slate-400 font-medium">Class: {user.unlockedTiers.includes('Legendary') ? 'Grandmaster' : user.unlockedTiers.includes('Advanced') ? 'Hero' : 'Initiate'}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Ranking</span>
              <p className="text-2xl font-black text-blue-400">#{(10000 / (user.level || 1)).toFixed(0).toLocaleString()}</p>
            </div>
          </div>

          <div className="relative h-6 w-full bg-slate-700 rounded-full overflow-hidden border-2 border-slate-700 p-1">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          
          <div className="flex justify-between mt-3 text-sm font-bold">
            <span className="text-blue-400">{user.xp} XP</span>
            <span className="text-slate-500">{LEVEL_THRESHOLD - user.xp} XP to next level</span>
          </div>
        </div>

        {/* Mini Stats */}
        <div className="grid grid-cols-2 gap-4 md:border-l md:border-slate-700 md:pl-8">
          <div className="text-center">
            <p className="text-3xl font-black text-white">{user.history.length}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Completions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-emerald-400">{user.totalXp}</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase">Total XP</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
