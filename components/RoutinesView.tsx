
import React, { useState } from 'react';
import { Routine, RoutineExercise } from '../types';
import { INITIAL_EXERCISES } from '../constants';
import { generateRoutine } from '../services/geminiService';

interface RoutinesViewProps {
  routines: Routine[];
  onSaveRoutine: (routine: Routine) => void;
  onDeleteRoutine: (id: string) => void;
}

const RoutinesView: React.FC<RoutinesViewProps> = ({ routines, onSaveRoutine, onDeleteRoutine }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'ai' | 'manual'>('list');
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedRoutines, setExpandedRoutines] = useState<Record<string, boolean>>({});
  
  // AI Form State
  const [aiDays, setAiDays] = useState('3 días');
  const [aiObjective, setAiObjective] = useState('Crecimiento muscular');
  const [aiLevel, setAiLevel] = useState('Intermedio');
  const [aiEquipment, setAiEquipment] = useState('');

  // Manual Form State
  const [manualName, setManualName] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualExercises, setManualExercises] = useState<RoutineExercise[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleRoutine = (id: string) => {
    setExpandedRoutines(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const startManual = (existingRoutine?: Routine) => {
    if (existingRoutine) {
      setManualName(existingRoutine.name);
      setManualDesc(existingRoutine.description || '');
      setManualExercises(existingRoutine.exercises);
      setEditingId(existingRoutine.id);
    } else {
      setManualName('');
      setManualDesc('');
      setManualExercises([]);
      setEditingId(null);
    }
    setActiveTab('manual');
  };

  const addManualExercise = () => {
    setManualExercises([...manualExercises, {
      id: Math.random().toString(36).substr(2, 9),
      name: INITIAL_EXERCISES[0],
      sets: 3,
      reps: '10-12',
      restTime: '60s'
    }]);
  };

  const updateManualExercise = (id: string, field: keyof RoutineExercise, value: any) => {
    setManualExercises(manualExercises.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
  };

  const handleSaveManual = () => {
    if (!manualName || manualExercises.length === 0) return alert("Nombre y al menos un ejercicio requerido");
    onSaveRoutine({
      id: editingId || Math.random().toString(36).substr(2, 9),
      name: manualName,
      description: manualDesc,
      exercises: manualExercises
    });
    setActiveTab('list');
  };

  const handleAiGenerate = async () => {
    setIsGenerating(true);
    try {
      const newRoutine = await generateRoutine({
        daysPerWeek: aiDays,
        objective: aiObjective,
        level: aiLevel,
        equipment: aiEquipment
      });
      onSaveRoutine(newRoutine);
      setActiveTab('list');
    } catch (err) {
      alert("Error generando rutina. Revisa tu conexión.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
        {(['list', 'ai', 'manual'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'list' ? 'Mis Rutinas' : tab === 'ai' ? '✨ IA Generador' : '✍️ Manual'}
          </button>
        ))}
      </div>

      {activeTab === 'list' && (
        <div className="grid grid-cols-1 gap-4">
          {routines.length === 0 ? (
            <div className="bg-slate-800 p-12 rounded-2xl text-center border border-slate-700">
              <p className="text-slate-400">No tienes rutinas guardadas.</p>
            </div>
          ) : (
            routines.map(r => {
              const isExpanded = expandedRoutines[r.id];
              return (
                <div key={r.id} className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden transition-all duration-300">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 cursor-pointer" onClick={() => toggleRoutine(r.id)}>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {r.name}
                          <span className={`text-slate-500 text-xs transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">{r.description || 'Sin descripción'}</p>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <button 
                          onClick={(e) => { e.stopPropagation(); startManual(r); }} 
                          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDeleteRoutine(r.id); }} 
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Ejercicios de la rutina</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {r.exercises.map(ex => (
                            <div key={ex.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-white">{ex.name}</p>
                                <p className="text-xs text-blue-400 font-medium">{ex.sets} series x {ex.reps} reps</p>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Descanso</span>
                                <span className="bg-slate-800 px-2 py-1 rounded text-xs text-emerald-400 font-mono">{ex.restTime || '60s'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => toggleRoutine(r.id)}
                          className="w-full mt-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          Cerrar detalles ▲
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">✨ Generar con Inteligencia Artificial</h3>
            <p className="text-sm text-slate-400">Configura tus preferencias y deja que la IA diseñe tu entrenamiento ideal incluyendo tiempos de descanso óptimos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Días por semana</label>
              <select
                value={aiDays}
                onChange={(e) => setAiDays(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              >
                {['2 días', '3 días', '4 días', '5 días', '6 días'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Objetivo</label>
              <select
                value={aiObjective}
                onChange={(e) => setAiObjective(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              >
                {['Adelgazar', 'Tonificar', 'Crecimiento muscular', 'Fuerza', 'Resistencia'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Nivel</label>
              <select
                value={aiLevel}
                onChange={(e) => setAiLevel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
              >
                {['Principiante', 'Intermedio', 'Avanzado'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">Equipo disponible (Opcional)</label>
              <input
                type="text"
                value={aiEquipment}
                onChange={(e) => setAiEquipment(e.target.value)}
                placeholder="Ej: Solo mancuernas, Calistenia..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleAiGenerate}
            disabled={isGenerating}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <span className="animate-spin text-xl">⏳</span>
            ) : (
              <span>✨ Generar Rutina Personalizada</span>
            )}
          </button>
        </div>
      )}

      {activeTab === 'manual' && (
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nombre de la rutina"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white text-lg font-bold outline-none"
            />
            <input
              type="text"
              placeholder="Descripción (opcional)"
              value={manualDesc}
              onChange={(e) => setManualDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none"
            />
          </div>

          <div className="space-y-3">
            <h4 className="text-slate-400 font-bold uppercase text-xs tracking-widest px-1">Ejercicios</h4>
            {manualExercises.map((ex, idx) => (
              <div key={ex.id} className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-4">
                <div className="flex gap-4 items-center">
                  <select
                    value={ex.name}
                    onChange={(e) => updateManualExercise(ex.id, 'name', e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white text-sm"
                  >
                    {INITIAL_EXERCISES.map(name => <option key={name} value={name}>{name}</option>)}
                  </select>
                  <button 
                    onClick={() => setManualExercises(manualExercises.filter(item => item.id !== ex.id))}
                    className="text-red-400 hover:text-red-300 p-2"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Series</span>
                    <input
                      type="number"
                      value={ex.sets}
                      onChange={(e) => updateManualExercise(ex.id, 'sets', Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-center text-white text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Reps</span>
                    <input
                      type="text"
                      value={ex.reps}
                      placeholder="8-12"
                      onChange={(e) => updateManualExercise(ex.id, 'reps', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-center text-white text-sm"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase">Descanso</span>
                    <input
                      type="text"
                      value={ex.restTime}
                      placeholder="60s"
                      onChange={(e) => updateManualExercise(ex.id, 'restTime', e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-center text-emerald-400 text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addManualExercise}
              className="w-full py-3 border border-dashed border-slate-600 rounded-xl text-slate-400 hover:text-white hover:border-slate-400 transition-all text-sm"
            >
              + Añadir Ejercicio
            </button>
          </div>

          <button
            onClick={handleSaveManual}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg"
          >
            {editingId ? 'Actualizar Rutina' : 'Guardar Rutina'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoutinesView;
