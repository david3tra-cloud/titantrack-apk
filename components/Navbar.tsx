
import React, { useState } from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const [showMore, setShowMore] = useState(false);

  const allItems = [
    { id: View.DASHBOARD, label: 'Estatus', icon: '🔋' },
    { id: View.LOG, label: 'Log', icon: '📁' },
    { id: View.ROUTINES, label: 'Proto', icon: '📀' },
    { id: View.EXERCISES, label: 'Wiki', icon: '📘' },
    { id: View.PROGRESS, label: 'Bio', icon: '📊' },
    { id: View.WEIGHT, label: 'Masa', icon: '⚖️' },
    { id: View.RECS, label: 'AI', icon: '🧠' },
  ];

  const primaryMobileItems = allItems.slice(0, 4);
  const secondaryItems = allItems.slice(4);

  const handleNavClick = (view: View) => {
    onViewChange(view);
    setShowMore(false);
  };

  return (
    <>
      {/* Desktop Electric Nav */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-black/40 backdrop-blur-2xl border-b border-white/5 hidden md:block">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.5)] rotate-3">
              <span className="text-black font-black text-xl italic">T</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">Titan</span>
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] leading-none mt-1">Grid v4.0</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {allItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-5 py-2 rounded-xl transition-all duration-300 group ${
                  currentView === item.id 
                  ? 'text-cyan-400' 
                  : 'text-slate-500 hover:text-white'
                }`}
              >
                {currentView === item.id && (
                  <div className="absolute inset-0 bg-cyan-500/5 rounded-xl border border-cyan-500/20 shadow-[inset_0_0_10px_rgba(0,242,255,0.1)]"></div>
                )}
                <span className="relative flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Grid Nav */}
      <nav className="fixed bottom-0 left-0 w-full z-40 bg-black/80 backdrop-blur-3xl border-t border-white/5 md:hidden">
        <div className="flex justify-around items-center h-24 px-4">
          {primaryMobileItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center justify-center gap-2 w-full transition-all duration-500 ${
                currentView === item.id ? 'text-cyan-400' : 'text-slate-600'
              }`}
            >
              <span className={`text-2xl transition-transform ${currentView === item.id ? 'scale-125' : ''}`}>{item.icon}</span>
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
              {currentView === item.id && <div className="w-4 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#00f2ff]"></div>}
            </button>
          ))}
          
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex flex-col items-center justify-center gap-2 w-full transition-all ${
              showMore ? 'text-fuchsia-400' : 'text-slate-600'
            }`}
          >
            <span className="text-2xl">⚡</span>
            <span className="text-[8px] font-black uppercase tracking-widest">Grid</span>
          </button>
        </div>

        {showMore && (
          <div className="absolute bottom-full left-0 w-full p-4 animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.8)] p-6 grid grid-cols-3 gap-4">
              {secondaryItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex flex-col items-center gap-3 p-5 rounded-3xl transition-all border ${
                    currentView === item.id 
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' 
                    : 'bg-black/40 border-white/5 text-slate-500'
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-center">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      
      {showMore && (
        <div className="fixed inset-0 bg-black/80 z-30 md:hidden" onClick={() => setShowMore(false)} />
      )}
    </>
  );
};

export default Navbar;
