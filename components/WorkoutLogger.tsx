
import React, { useState, useEffect, useRef } from 'react';
import { Workout, Exercise, Set, Routine } from '../types';
import { EXERCISE_CATEGORIES, INITIAL_EXERCISES } from '../constants';

interface WorkoutLoggerProps {
  onSave: (workout: Workout) => void;
  onCancel: () => void;
  routines: Routine[];
}

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ onSave, onCancel, routines }) => {
  const [name, setName] = useState('PROTO_' + Date.now().toString().slice(-4));
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [showRoutineSelector, setShowRoutineSelector] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [totalSeconds, setTotalSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTotalSeconds(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timerSeconds !== null && timerSeconds > 0) {
      const interval = setInterval(() => setTimerSeconds(s => s! - 1), 1000);
      return () => clearInterval(interval);
    } else if (timerSeconds === 0) {
      setTimerSeconds(null);
      if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
    }
  }, [timerSeconds]);

  const addExercise = () => {
    setExercises([...exercises, {
      id: Math.random().toString(36).substr(2, 9),
      name: INITIAL_EXERCISES[0],
      category: EXERCISE_CATEGORIES[0],
      sets: [{ id: Math.random().toString(36).substr(2, 9), reps: 10, weight: 20, completed: false, restTime: '60s' }]
    }]);
  };

  const updateSet = (exerciseId: string, setId: string, field: keyof Set, value: any) => {
    setExercises(exercises.map(ex => ex.id === exerciseId ? {
      ...ex,
      sets: ex.sets.map(s => {
        if (s.id === setId) {
          if (field === 'completed' && value === true && !s.completed) setTimerSeconds(60);
          return { ...s, [field]: value };
        }
        return s;
      })
    } : ex));
  };

  return (
    <div className="bg-black border border-cyan-500/50 rounded-[40px] flex flex-col max-h-[90vh] shadow-[0_0_50px_rgba(0,242,255,0.2)] overflow-hidden relative">
      
      {timerSeconds !== null && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-cyan-500 text-black px-8 py-2 rounded-full font-black shadow-[0_0_20px_#00f2ff] animate-pulse">
          RECARGA: {timerSeconds}s
        </div>
      )}

      <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Bio Registro</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-cyan-400 font-mono text-sm tracking-widest">{Math.floor(totalSeconds / 60)}m {totalSeconds % 60}s</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Link</span>
          </div>
        </div>
        <button onClick={onCancel} className="text-slate-500 hover:text-white transition-colors p-3 bg-white/5 rounded-2xl">✕</button>
      </div>

      <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-gradient-to-b from-transparent to-black/50">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Identificador de Sesión</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white font-black italic focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
          />
        </div>

        <div className="space-y-6">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-white/5 p-6 rounded-[32px] border border-white/5 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] rounded-full -z-10 group-hover:bg-cyan-500/10 transition-all"></div>
              
              <div className="flex justify-between items-center">
                <select
                  value={ex.name}
                  onChange={(e) => setExercises(exercises.map(item => item.id === ex.id ? { ...item, name: e.target.value } : item))}
                  className="bg-black border border-white/10 rounded-xl p-3 text-white font-black text-sm italic focus:ring-1 focus:ring-cyan-500 outline-none w-2/3"
                >
                  {INITIAL_EXERCISES.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
                <button 
                  onClick={() => setExercises(exercises.filter(item => item.id !== ex.id))}
                  className="text-fuchsia-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors"
                >
                  Eliminar
                </button>
              </div>

              <div className="space-y-3">
                {ex.sets.map((set, idx) => (
                  <div key={set.id} className={`grid grid-cols-5 gap-3 items-center p-3 rounded-2xl border transition-all ${set.completed ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-black/40 border-white/5'}`}>
                    <span className="text-center font-black italic text-slate-600">#{idx + 1}</span>
                    <input
                      type="number"
                      value={set.weight}
                      onChange={(e) => updateSet(ex.id, set.id, 'weight', Number(e.target.value))}
                      className="bg-black/60 border border-white/5 rounded-lg p-2 text-center text-white font-bold text-xs focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSet(ex.id, set.id, 'reps', Number(e.target.value))}
                      className="bg-black/60 border border-white/5 rounded-lg p-2 text-center text-white font-bold text-xs focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                    <button 
                      onClick={() => updateSet(ex.id, set.id, 'completed', !set.completed)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2 mx-auto ${
                        set.completed ? 'bg-cyan-500 border-cyan-500 text-black' : 'border-slate-800 text-transparent'
                      }`}
                    >
                      {set.completed ? '⚡' : ''}
                    </button>
                    <button onClick={() => {/* delete set */}} className="text-slate-700 hover:text-fuchsia-500">×</button>
                  </div>
                ))}
                <button
                  onClick={() => {/* add set logic */}}
                  className="w-full py-3 border border-dashed border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white hover:border-cyan-500/30 transition-all"
                >
                  + Nueva Serie
                </button>
              </div>
            </div>
          ))}
          
          <button
            onClick={addExercise}
            className="w-full py-6 border-2 border-dashed border-white/5 hover:border-cyan-500/30 bg-white/5 rounded-[32px] text-slate-500 hover:text-cyan-400 font-black uppercase tracking-[0.2em] transition-all"
          >
            Añadir Protocolo
          </button>
        </div>
      </div>

      <div className="p-8 border-t border-white/10 bg-white/5 backdrop-blur-md">
        <button
          onClick={() => {/* handleSave */}}
          className="w-full py-5 bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 text-white rounded-[24px] font-black italic uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(0,242,255,0.3)] active:scale-[0.98]"
        >
          Confirmar Transmisión
        </button>
      </div>
    </div>
  );
};

export default WorkoutLogger;
