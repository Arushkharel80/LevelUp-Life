
import React from 'react';
import { Challenge, ActivityCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: (id: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onComplete }) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner': return 'text-slate-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-orange-500';
      case 'legendary': return 'text-red-500 font-bold';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className={`relative group p-6 rounded-2xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1 shadow-xl overflow-hidden ${challenge.completed ? 'opacity-50 grayscale pointer-events-none' : ''}`}>
      {/* Category Indicator */}
      <div className={`absolute top-0 right-0 h-1 w-full ${CATEGORY_COLORS[challenge.category] || 'bg-slate-500'}`} />
      
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border border-slate-600 ${CATEGORY_COLORS[challenge.category]} text-white shadow-sm`}>
          {challenge.category}
        </span>
        <span className="text-xs font-mono font-bold text-emerald-400">+{challenge.xpReward} XP</span>
      </div>

      <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{challenge.title}</h3>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{challenge.description}</p>
      
      <div className="flex items-center gap-4 mb-6 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {challenge.timeRequired}
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty}</span>
        </div>
      </div>

      <div className="p-3 bg-slate-900/50 rounded-lg mb-6 border border-slate-700/50">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mission Details</h4>
        <p className="text-xs text-slate-300 italic">"{challenge.taskDetails}"</p>
      </div>

      <button
        onClick={() => onComplete(challenge.id)}
        disabled={challenge.completed}
        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
      >
        {challenge.completed ? 'COMPLETED' : 'ACCEPT CHALLENGE'}
      </button>
    </div>
  );
};

export default ChallengeCard;
