import React, { useState } from 'react';
import { User, DRINK_TYPES, DrinkType } from '../types';
import { Plus, Beer, RotateCcw, X, Crown } from 'lucide-react';

interface UserCardProps {
  user: User;
  onAddDrink: (userId: string, type: DrinkType) => void;
  onRemoveLastDrink: (userId: string) => void;
  isLeader: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, onAddDrink, onRemoveLastDrink, isLeader }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [animatingIcon, setAnimatingIcon] = useState<string | null>(null);
  
  const lastDrink = user.drinks.length > 0 ? user.drinks[user.drinks.length - 1] : null;
  const lastDrinkInfo = lastDrink ? DRINK_TYPES.find(d => d.type === lastDrink.type) : null;

  // Avatar
  const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${user.avatarSeed}&backgroundColor=e5e7eb`;

  const handleQuickAdd = () => {
    const typeToAdd = lastDrink ? lastDrink.type : 'beer';
    const drinkInfo = DRINK_TYPES.find(d => d.type === typeToAdd);
    
    // Trigger Animation
    setAnimatingIcon(drinkInfo?.icon || '🍺');
    onAddDrink(user.id, typeToAdd);

    // Reset Animation
    setTimeout(() => {
        setAnimatingIcon(null);
    }, 1000);
  };

  return (
    <>
      <div 
        className={`relative bg-white rounded-2xl p-3 shadow-ios transition-all duration-200 border flex flex-col items-center
        ${isLeader ? 'border-yellow-400 ring-2 ring-yellow-400/20 shadow-lg shadow-yellow-500/10' : 'border-transparent'} 
        ${animatingIcon ? 'scale-95 ring-4 ring-blue-100' : ''}`}
      >
        
        {/* Leader Badge */}
        {isLeader && (
            <div className="absolute -top-2 -left-2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-1 rounded-full shadow-sm flex items-center gap-1 z-10 animate-bounce">
                <Crown size={10} fill="currentColor" />
                TOP
            </div>
        )}

        {/* Animation Overlay */}
        {animatingIcon && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none overflow-hidden rounded-2xl">
                <div className="text-6xl animate-float-up filter drop-shadow-lg transform transition-transform">
                    {animatingIcon}
                </div>
                <div className="absolute inset-0 bg-white/30 animate-pulse rounded-2xl"></div>
            </div>
        )}

        {/* Avatar Area */}
        <div className="relative mb-2 mt-1">
            <img 
              src={avatarUrl} 
              alt={user.name}
              className={`w-16 h-16 rounded-full bg-slate-50 object-cover border-2 ${isLeader ? 'border-yellow-400' : 'border-slate-100'}`}
            />
            {lastDrinkInfo && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full w-7 h-7 flex items-center justify-center text-sm border border-slate-100 shadow-sm animate-in zoom-in">
                {lastDrinkInfo.icon}
              </div>
            )}
        </div>
        
        {/* Name & Status */}
        <div className="w-full text-center mb-1">
            <h3 className="font-bold text-sm text-slate-900 truncate px-1">{user.name}</h3>
            <p className="text-[10px] text-slate-400 truncate h-4 font-medium">
               {lastDrinkInfo ? lastDrinkInfo.label : '-'}
            </p>
        </div>

        {/* Count */}
        <div className="flex items-baseline justify-center mb-3">
            <span className={`text-4xl font-bold leading-none tracking-tighter transition-colors duration-300 ${animatingIcon ? 'text-iosBlue scale-110' : isLeader ? 'text-yellow-500' : 'text-slate-900'}`}>
                {user.drinks.length}
            </span>
            <span className="text-xs text-slate-400 font-medium ml-2">杯</span>
        </div>

        {/* Bottom Row: Actions */}
        <div className="flex gap-2 w-full h-10">
            {/* Quick Add Button */}
            <button 
                onClick={handleQuickAdd}
                className="flex-1 bg-iosBlue hover:bg-blue-600 active:scale-90 transition-all text-white font-bold rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
            >
                <Plus size={24} strokeWidth={3} />
            </button>

            {/* Menu Toggle */}
            <button
                onClick={() => setShowMenu(true)}
                className="w-10 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-600 rounded-xl flex items-center justify-center transition-colors"
            >
                <Beer size={18} />
            </button>
        </div>
      </div>

      {/* iOS Style Action Sheet / Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={() => setShowMenu(false)} />
            
            <div className="relative bg-[#F2F2F7] rounded-t-[2rem] p-6 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-6" />
                
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="font-bold text-xl text-slate-900">{user.name}</h3>
                        <p className="text-slate-500 text-sm">飲み物を選択してください</p>
                    </div>
                    <button 
                        onClick={() => setShowMenu(false)}
                        className="bg-slate-200 p-2 rounded-full text-slate-500 hover:bg-slate-300 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-6">
                    {DRINK_TYPES.map((dt) => (
                        <button
                            key={dt.type}
                            onClick={() => {
                                onAddDrink(user.id, dt.type);
                                setShowMenu(false);
                            }}
                            className="flex flex-col items-center gap-2 group"
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-105 group-active:scale-95 transition-all border border-slate-100">
                                {dt.icon}
                            </div>
                            <span className="text-xs font-bold text-slate-600">{dt.label}</span>
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => {
                        onRemoveLastDrink(user.id);
                        setShowMenu(false);
                    }}
                    className="w-full bg-white text-rose-500 py-4 rounded-xl font-bold text-sm shadow-sm active:bg-rose-50 flex items-center justify-center gap-2 border border-slate-100"
                >
                    <RotateCcw size={16} />
                    直前の1杯を取り消す
                </button>
            </div>
        </div>
      )}

      {/* Inline Animation Styles */}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(20px) scale(0.5); opacity: 0; }
          40% { transform: translateY(-10px) scale(1.2) rotate(-10deg); opacity: 1; }
          100% { transform: translateY(-60px) scale(1); opacity: 0; }
        }
        .animate-float-up {
          animation: float-up 0.8s cubic-bezier(0, 0, 0.2, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default UserCard;