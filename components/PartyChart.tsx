import React from 'react';
import { User } from '../types';
import { Trophy } from 'lucide-react';

interface PartyChartProps {
  users: User[];
  partyName: string;
}

const PartyChart: React.FC<PartyChartProps> = ({ users, partyName }) => {
  // Calculate total
  const totalDrinks = users.reduce((sum, u) => sum + u.drinks.length, 0);

  // Sort by count desc for ranking
  const sortedData = [...users].sort((a, b) => b.drinks.length - a.drinks.length);
  
  // Get max for bar calculation
  const maxVal = sortedData[0]?.drinks.length || 1;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-rose-600 rounded-[2rem] p-6 text-white shadow-2xl shadow-orange-500/25 min-h-[200px] flex flex-col justify-center">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-yellow-300 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-purple-600 rounded-full blur-[80px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Total Counter & Title */}
      <div className="relative z-10 text-center mb-8 pt-2">
        <h2 className="text-orange-50 text-xl font-black tracking-widest uppercase mb-1 drop-shadow-md break-words px-2">
            {partyName}
        </h2>
        {/* Added pl-4 to container and pr-2 to text to prevent clipping while maintaining visual center */}
        <div className="flex items-center justify-center gap-4 pl-4">
            <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-orange-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] font-mono tracking-tighter py-2 pr-2">
                {totalDrinks}
            </span>
            <span className="text-2xl text-orange-100 font-bold self-end mb-4">杯</span>
        </div>
      </div>
      
      {/* Ranking List */}
      <div className="relative z-10 space-y-3">
        {users.length === 0 ? (
           <div className="text-center text-white/60 text-sm font-bold py-4 bg-black/10 rounded-xl">
             まだ記録がありません<br/>下のボタンから参戦者を追加👇
           </div>
        ) : (
            sortedData.map((user, index) => {
                const isTop = index === 0 && user.drinks.length > 0;
                const barWidth = Math.max((user.drinks.length / maxVal) * 100, 0);
                
                return (
                    <div key={user.id} className="relative">
                        <div className="flex items-center gap-3 mb-1.5 relative z-10">
                            {/* Rank Badge */}
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm flex-shrink-0
                                ${isTop ? 'bg-yellow-400 text-yellow-900 ring-2 ring-yellow-200/50' : 'bg-white/20 text-white'}`}>
                                {isTop ? <Trophy size={12} /> : index + 1}
                            </div>
                            
                            {/* Name */}
                            <span className={`text-sm font-bold truncate flex-1 ${isTop ? 'text-yellow-300' : 'text-white'}`}>
                                {user.name}
                            </span>
                            
                            {/* Count - Increased right padding to pr-3 and added flex-shrink-0 to prevent clipping */}
                            <div className="font-mono text-xl font-bold text-white flex items-baseline pr-3 flex-shrink-0">
                                <span>{user.drinks.length}</span>
                                <span className="text-xs text-orange-200 font-normal ml-2">杯</span>
                            </div>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                            <div 
                                className={`h-full rounded-full transition-all duration-500 ease-out relative
                                    ${isTop ? 'bg-gradient-to-r from-yellow-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-gradient-to-r from-indigo-300 to-purple-300'}`}
                                style={{ width: `${user.drinks.length > 0 ? barWidth : 0}%` }}
                            >
                                {/* Shiny effect on bar - Only for TOP */}
                                {isTop && (
                                    <div className="absolute inset-0 bg-white/20" style={{ transform: 'skewX(-20deg) translateX(-100%)', animation: 'shine 2s infinite' }}></div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })
        )}
      </div>
      
      <style>{`
        @keyframes shine {
            100% { transform: skewX(-20deg) translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default PartyChart;