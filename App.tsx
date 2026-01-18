
import React, { useState, useEffect } from 'react';
import { View, Workout, Routine, WeightRecord } from './types';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import WorkoutLogger from './components/WorkoutLogger';
import ProgressCharts from './components/ProgressCharts';
import Recommendations from './components/Recommendations';
import RoutinesView from './components/RoutinesView';
import WeightTracker from './components/WeightTracker';
import ExerciseLibrary from './components/ExerciseLibrary';

const WorkoutLogEntry: React.FC<{ workout: Workout }> = ({ workout }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
      isExpanded 
      ? 'bg-slate-900/40 border-cyan-500/50 shadow-[0_0_20px_rgba(0,242,255,0.1)]' 
      : 'bg-black/40 border-white/10 hover:border-cyan-500/30'
    }`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-6 flex justify-between items-center group"
      >
        <div>
          <h3 className={`text-xl font-black uppercase tracking-tighter transition-colors ${isExpanded ? 'text-cyan-400' : 'text-white'}`}>
            {workout.name}
          </h3>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{new Date(workout.date).toLocaleString()}</p>
        </div>
        <div className={`text-xl transition-all duration-500 ${isExpanded ? 'rotate-180 text-cyan-400' : 'text-slate-600'}`}>
          ▼
        </div>
      </button>
      
      {isExpanded && (
        <div className="p-6 pt-0 border-t border-white/5 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="space-y-4 mt-6">
            {workout.exercises.map(ex => (
              <div key={ex.id} className="p-4 rounded-xl bg-black/40 border border-white/5">
                <p className="font-black text-cyan-400 mb-3 text-sm uppercase italic tracking-wider">{ex.name}</p>
                <div className="flex flex-wrap gap-2">
                  {ex.sets.map((set, i) => (
                    <div key={set.id} className="bg-slate-900/80 px-3 py-2 rounded-lg text-[10px] text-slate-400 border border-white/5 flex items-center gap-2">
                      <span className="text-magenta-500 font-black">S{i+1}</span>
                      <span className="text-white font-bold">{set.weight} <span className="text-[8px] opacity-50">KG</span></span>
                      <span className="opacity-20">|</span>
                      <span className="text-cyan-400 font-bold">{set.reps} <span className="text-[8px] opacity-50">REPS</span></span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [showLogger, setShowLogger] = useState(false);

  useEffect(() => {
    const savedWorkouts = localStorage.getItem('titan_workouts');
    const savedRoutines = localStorage.getItem('titan_routines');
    const savedWeight = localStorage.getItem('titan_weight_history');
    if (savedWorkouts) try { setWorkouts(JSON.parse(savedWorkouts)); } catch (e) {}
    if (savedRoutines) try { setRoutines(JSON.parse(savedRoutines)); } catch (e) {}
    if (savedWeight) try { setWeightRecords(JSON.parse(savedWeight)); } catch (e) {}
  }, []);

  const saveWorkout = (workout: Workout) => {
    const updated = [...workouts, workout];
    setWorkouts(updated);
    localStorage.setItem('titan_workouts', JSON.stringify(updated));
    setShowLogger(false);
  };

  return (
    <div className="min-h-screen pb-32 md:pt-24 relative overflow-x-hidden">
      {/* Dynamic Background elements */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[120px] rounded-full -z-10 animate-pulse"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/10 blur-[120px] rounded-full -z-10 animate-pulse" style={{animationDelay: '1s'}}></div>

      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="max-w-5xl mx-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-fuchsia-500 uppercase italic">
              {currentView === View.DASHBOARD && "Estado Central"}
              {currentView === View.PROGRESS && "Bio Evolución"}
              {currentView === View.RECS && "Cyber Coach"}
              {currentView === View.LOG && "Archivo Log"}
              {currentView === View.ROUTINES && "Protocolos"}
              {currentView === View.WEIGHT && "Masa Crítica"}
              {currentView === View.EXERCISES && "Biblioteca"}
            </h1>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
              Sincronizado: {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <button 
            onClick={() => setShowLogger(true)}
            className="group relative px-8 py-4 bg-transparent text-white font-black text-xs uppercase tracking-widest transition-all overflow-hidden"
          >
            <div className="absolute inset-0 border border-cyan-500/50 rounded-xl group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all"></div>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-50"></div>
            <span className="relative flex items-center gap-2">INICIAR SESIÓN <span className="text-cyan-400">⚡</span></span>
          </button>
        </header>

        {showLogger && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl animate-in zoom-in-95 duration-300">
              <WorkoutLogger 
                onSave={saveWorkout} 
                onCancel={() => setShowLogger(false)} 
                routines={routines}
              />
            </div>
          </div>
        )}

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {currentView === View.DASHBOARD && <Dashboard workouts={workouts} />}
          {currentView === View.PROGRESS && <ProgressCharts workouts={workouts} />}
          {currentView === View.RECS && <Recommendations workouts={workouts} />}
          {currentView === View.WEIGHT && (
            <WeightTracker 
              records={weightRecords} 
              onAddRecord={(w) => {/* logic */}} 
              onDeleteRecord={(id) => {/* logic */}} 
            />
          )}
          {currentView === View.EXERCISES && <ExerciseLibrary />}
          {currentView === View.ROUTINES && (
            <RoutinesView 
              routines={routines} 
              onSaveRoutine={(r) => {/* logic */}} 
              onDeleteRoutine={(id) => {/* logic */}} 
            />
          )}
          {currentView === View.LOG && (
            <div className="space-y-6">
              {workouts.length === 0 ? (
                <div className="bg-slate-900/40 p-16 rounded-3xl border border-dashed border-white/10 text-center">
                  <p className="text-slate-500 font-bold uppercase tracking-widest">Sin registros en el mainframe.</p>
                </div>
              ) : (
                [...workouts].reverse().map(workout => (
                  <WorkoutLogEntry key={workout.id} workout={workout} />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Button - Mobile Electric */}
      <div className="md:hidden fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => setShowLogger(true)}
          className="w-16 h-16 bg-cyan-500 rounded-full shadow-[0_0_30px_rgba(0,242,255,0.6)] flex items-center justify-center text-black text-3xl font-bold active:scale-90 transition-transform"
        >
          ⚡
        </button>
      </div>
    </div>
  );
};

export default App;
