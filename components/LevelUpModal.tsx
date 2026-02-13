
import React from 'react';

interface LevelUpModalProps {
  level: number;
  rewards: string[];
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ level, rewards, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border-2 border-yellow-500/50 p-8 rounded-3xl max-w-md w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.2)] animate-in zoom-in-95 duration-300">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.4)] animate-bounce">
            <span className="text-4xl font-black text-slate-900">!</span>
          </div>
        </div>
        
        <h2 className="text-4xl font-black text-white mb-2 italic uppercase">Level Up!</h2>
        <p className="text-yellow-500 font-bold mb-8">You have reached Level {level}</p>
        
        <div className="bg-slate-800/50 rounded-2xl p-6 mb-8 border border-slate-700">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Rewards Unlocked</h3>
          <ul className="space-y-3">
            {rewards.map((reward, i) => (
              <li key={i} className="flex items-center gap-3 text-emerald-400 font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
                {reward}
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black rounded-xl transition-all shadow-lg hover:shadow-yellow-500/20 uppercase italic tracking-wider"
        >
          Claim & Continue
        </button>
      </div>
    </div>
  );
};

export default LevelUpModal;
