import React, { useEffect, useState } from 'react';

interface TaishoModalProps {
  quote: string;
  onClose: () => void;
}

const TaishoModal: React.FC<TaishoModalProps> = ({ quote, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 perspective-1000">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-sm bg-[#FAF8F5] rounded-xl overflow-visible shadow-2xl border-4 border-slate-900 transform transition-all duration-[1000ms] cubic-bezier(0.34, 1.56, 0.64, 1) ${mounted ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-12 opacity-0'}`}
      >
        
        {/* Header pattern */}
        <div className="h-6 bg-slate-900 w-full flex items-center justify-center overflow-hidden">
            <div className="w-full h-[1px] bg-slate-700/50"></div>
        </div>
        
        <div className="p-8 pb-10 flex flex-col items-center text-center relative z-10">
          
          {/* Character Icon - Animated Entry */}
          <div className={`relative mb-8 transform transition-all duration-1000 delay-300 ${mounted ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-12 opacity-0'}`}>
             <div className="w-28 h-28 bg-indigo-900 rounded-full flex items-center justify-center text-white shadow-xl border-[6px] border-white relative z-10 overflow-hidden">
                 <span className="text-7xl relative top-1">👴</span>
             </div>
          </div>
          
          {/* Quote Area */}
          <div className={`mb-10 relative transition-all duration-[1500ms] delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="text-8xl text-slate-200/50 absolute -top-8 -left-6 font-serif select-none leading-none">“</span>
            <p className="text-2xl font-serif font-bold text-slate-800 leading-loose tracking-widest relative z-10 drop-shadow-sm">
              {quote}
            </p>
            <span className="text-8xl text-slate-200/50 absolute -bottom-12 -right-6 font-serif transform rotate-180 select-none leading-none">“</span>
          </div>

          {/* Button */}
          <button 
            onClick={onClose}
            className={`group bg-orange-700 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full shadow-lg active:scale-95 transition-all duration-700 delay-[1200ms] flex items-center gap-2 border-2 border-orange-800/20 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <span className="tracking-widest text-lg">心に刻む</span>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-lg">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-orange-100/50 rounded-full blur-2xl"></div>
            <div className="absolute top-10 -left-10 w-24 h-24 bg-slate-200/50 rounded-full blur-xl"></div>
        </div>

      </div>
    </div>
  );
};

export default TaishoModal;