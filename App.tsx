import React, { useState, useEffect, useRef } from 'react';
import { User, DrinkType } from './types';
import UserCard from './components/UserCard';
import PartyChart from './components/PartyChart';
import TaishoModal from './components/TaishoModal';
import { TAISHO_QUOTES } from './constants';
import { Users, RotateCcw, AlertTriangle } from 'lucide-react';

const STORAGE_KEY_DATA = 'kanpai_master_data';
const STORAGE_KEY_PARTY = 'kanpai_master_party_name';

const App: React.FC = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [partyName, setPartyName] = useState<string>('');
  
  // Inputs
  const [inputPartyName, setInputPartyName] = useState('');
  const [newUserName, setNewUserName] = useState('');
  
  // Modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  // Taisho Modal State
  const [showTaisho, setShowTaisho] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  
  // Logic Refs
  const prevTotalRef = useRef(0);

  // Load data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY_DATA);
    const savedParty = localStorage.getItem(STORAGE_KEY_PARTY);
    
    if (savedData) {
      try {
        const parsedUsers = JSON.parse(savedData);
        setUsers(parsedUsers);
        // Initialize ref to current count to avoid triggering on reload
        const initialTotal = parsedUsers.reduce((sum: number, u: User) => sum + u.drinks.length, 0);
        prevTotalRef.current = initialTotal;
      } catch (e) {
        console.error("Failed to load user data", e);
      }
    }
    
    if (savedParty) {
        setPartyName(savedParty);
    }
  }, []);

  // Save users on change and Check for Taisho Trigger
  useEffect(() => {
    // Save Data
    if (partyName || users.length > 0) {
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(users));
    }

    // Check Total Drinks for Taisho Trigger
    const currentTotal = users.reduce((sum, u) => sum + u.drinks.length, 0);
    const prevTotal = prevTotalRef.current;

    // Trigger only if count increased AND hit a multiple of 5 AND isn't 0
    if (currentTotal > prevTotal && currentTotal > 0 && currentTotal % 5 === 0) {
        const randomQuote = TAISHO_QUOTES[Math.floor(Math.random() * TAISHO_QUOTES.length)];
        setCurrentQuote(randomQuote);
        setShowTaisho(true);
    }

    // Update Ref
    prevTotalRef.current = currentTotal;

  }, [users, partyName]);

  // Save party name on change
  useEffect(() => {
      if (partyName) {
        localStorage.setItem(STORAGE_KEY_PARTY, partyName);
      }
  }, [partyName]);

  // Logic
  const startParty = (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputPartyName.trim()) return;
      setPartyName(inputPartyName.trim());
      setInputPartyName('');
  };

  const addUser = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newUserName.trim()) return;

    const newUser: User = {
      id: crypto.randomUUID(),
      name: newUserName.trim(),
      avatarSeed: Math.random().toString(36).substring(7),
      drinks: []
    };

    setUsers(prev => [...prev, newUser]);
    setNewUserName('');
    setShowAddUser(false);
  };

  const addDrink = (userId: string, type: DrinkType) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          drinks: [...user.drinks, { timestamp: Date.now(), type }]
        };
      }
      return user;
    }));
  };

  const removeLastDrink = (userId: string) => {
    setUsers(prev => prev.map(user => {
      if (user.id === userId && user.drinks.length > 0) {
        const newDrinks = [...user.drinks];
        newDrinks.pop();
        return {
          ...user,
          drinks: newDrinks
        };
      }
      return user;
    }));
  };

  const executeReset = () => {
    setUsers([]);
    setPartyName('');
    localStorage.removeItem(STORAGE_KEY_DATA);
    localStorage.removeItem(STORAGE_KEY_PARTY);
    setShowResetConfirm(false);
    prevTotalRef.current = 0;
  };

  // Determine Leader (Most drinks)
  const maxDrinks = Math.max(...users.map(u => u.drinks.length), 0);
  const leaderId = maxDrinks > 0 ? users.find(u => u.drinks.length === maxDrinks)?.id : null;

  // Initial Empty State (Start Screen)
  if (!partyName) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50">
            <div className="w-full max-w-sm bg-white rounded-[2rem] p-8 shadow-ios text-center animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">🍻</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Kanpai Master</h1>
                <p className="text-slate-500 mb-8 text-sm">今日は何の飲み会？<br/>名前をつけてスタートしましょう！</p>
                
                <form onSubmit={startParty} className="space-y-4">
                    <input 
                        type="text" 
                        value={inputPartyName}
                        onChange={(e) => setInputPartyName(e.target.value)}
                        placeholder="例：忘年会2024"
                        className="w-full bg-slate-50 border-none rounded-2xl px-4 py-4 text-slate-900 text-center font-bold text-lg placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                        autoFocus
                    />
                    <button 
                        type="submit"
                        disabled={!inputPartyName.trim()}
                        className="w-full bg-iosBlue text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        飲み会を始める
                    </button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 pb-32">
      {/* Header (Non-sticky) */}
      <header className="px-4 pt-10 pb-2">
        <div className="flex justify-between items-center max-w-3xl mx-auto mb-2">
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-2xl">🍻</span> Kanpai Master
            </h1>
            <button 
                onClick={() => setShowResetConfirm(true)} 
                className="w-10 h-10 rounded-full bg-slate-200/50 flex items-center justify-center text-slate-500 hover:bg-slate-300 transition-colors"
            >
                <RotateCcw size={18} strokeWidth={2.5} />
            </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        
        {/* Score Board Chart with Party Name */}
        <PartyChart users={users} partyName={partyName} />

        {/* Users Grid */}
        <div>
            <h3 className="text-slate-400 text-[10px] uppercase font-bold tracking-widest pl-2 mb-3">参戦者</h3>
            <div className="grid grid-cols-2 gap-3">
                {users.map(user => (
                    <UserCard 
                        key={user.id} 
                        user={user} 
                        onAddDrink={addDrink} 
                        onRemoveLastDrink={removeLastDrink}
                        isLeader={user.id === leaderId}
                    />
                ))}
                
                {/* Add User Button Card */}
                <button 
                    onClick={() => setShowAddUser(true)}
                    className="group border-2 border-dashed border-slate-300 hover:border-iosBlue/50 rounded-2xl p-4 flex flex-col items-center justify-center aspect-[3/4] transition-all hover:bg-white/50 active:scale-95"
                >
                    <div className="bg-white border border-slate-200 group-hover:border-iosBlue/30 p-3 rounded-full mb-2 transition-colors shadow-sm">
                        <Users size={20} className="text-slate-400 group-hover:text-iosBlue" />
                    </div>
                    <span className="text-slate-400 group-hover:text-iosBlue font-bold text-xs">参戦者を追加</span>
                </button>
            </div>
        </div>
      </main>

      {/* Taisho Modal */}
      {showTaisho && (
        <TaishoModal 
            quote={currentQuote} 
            onClose={() => setShowTaisho(false)} 
        />
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold mb-1 text-slate-900 text-center">New Member</h3>
                <p className="text-slate-400 text-sm text-center mb-6">新しい参戦者の名前を入力してください</p>
                
                <form onSubmit={addUser}>
                    <input 
                        type="text" 
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder="なまえ"
                        className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-slate-900 mb-6 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-bold text-center text-lg"
                        autoFocus
                    />
                    <div className="flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setShowAddUser(false)}
                            className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={!newUserName.trim()}
                            className="flex-1 bg-iosBlue text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95 transition-transform"
                        >
                            参戦
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                    <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 text-center">飲み会を終了する？</h3>
                <p className="text-slate-500 text-sm text-center mb-8">
                    飲み会名「{partyName}」のデータがリセットされ、最初の画面に戻ります。
                </p>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => setShowResetConfirm(false)}
                        className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        キャンセル
                    </button>
                    <button 
                        onClick={executeReset}
                        className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-500/30 active:scale-95 transition-transform"
                    >
                        終了する
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;