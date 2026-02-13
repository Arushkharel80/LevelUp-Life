
import React from 'react';
import { SHOP_ITEMS } from '../constants';
import { ShopItem, UserProfile } from '../types';

interface ShopModalProps {
  user: UserProfile;
  onPurchase: (item: ShopItem) => void;
  onClose: () => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ user, onPurchase, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Hyper-Shop</h2>
            <p className="text-slate-400 text-xs">Spend your earned Gems on legendary upgrades.</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-xl">💎</span>
            <span className="text-xl font-black text-blue-400">{user.gems}</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {SHOP_ITEMS.map(item => {
            const isOwned = item.type === 'aura' ? user.unlockedAuras.includes(item.id) : user.unlockedAvatars.includes(item.value);
            const canAfford = user.gems >= item.cost;

            return (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-800 border border-slate-700 hover:border-blue-500/50 transition-all flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-white">{item.name}</h3>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-900 text-slate-500 uppercase">{item.type}</span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-xs">💎</span>
                    <span className={`font-bold ${canAfford ? 'text-blue-400' : 'text-red-400'}`}>{item.cost}</span>
                  </div>
                  <button
                    disabled={isOwned || !canAfford}
                    onClick={() => onPurchase(item)}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${isOwned ? 'bg-slate-700 text-slate-500 cursor-default' : canAfford ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                  >
                    {isOwned ? 'Owned' : 'Purchase'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 bg-slate-800 border-t border-slate-700">
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-900 hover:bg-slate-950 border border-slate-700 text-slate-400 font-bold rounded-xl transition-all uppercase tracking-widest text-sm"
          >
            Back to Reality
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopModal;
