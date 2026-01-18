
import React, { useState, useEffect } from 'react';
import { Workout, Recommendation } from '../types';
import { getPersonalizedRecommendations } from '../services/geminiService';

interface RecommendationsProps {
  workouts: Workout[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ workouts }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (workouts.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const recs = await getPersonalizedRecommendations(workouts);
      setRecommendations(recs);
    } catch (err) {
      setError("No se pudieron cargar las recomendaciones en este momento.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workouts.length > 0 && recommendations.length === 0) {
      fetchRecommendations();
    }
  }, [workouts]);

  const getCategoryColor = (cat: string) => {
    switch(cat) {
      case 'strength': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'recovery': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'nutrition': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'technique': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-900/40 to-slate-800 p-6 rounded-2xl border border-blue-500/30">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-blue-400">✧</span> AI Personal Coach
          </h2>
          <p className="text-slate-400 mt-1">Análisis basado en tus últimos entrenamientos</p>
        </div>
        <button 
          onClick={fetchRecommendations}
          disabled={loading || workouts.length === 0}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl font-semibold transition-all shadow-lg"
        >
          {loading ? 'Analizando...' : 'Actualizar Tips'}
        </button>
      </div>

      {workouts.length === 0 && (
        <div className="bg-slate-800 p-12 rounded-2xl border border-slate-700 text-center">
          <p className="text-slate-400 text-lg">Registra algunos entrenamientos para que la IA pueda darte consejos personalizados.</p>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-40 bg-slate-800 rounded-2xl animate-pulse border border-slate-700"></div>
          ))}
        </div>
      )}

      {error && <p className="text-red-400 text-center">{error}</p>}

      {!loading && recommendations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all flex flex-col justify-between">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase border mb-3 ${getCategoryColor(rec.category)}`}>
                  {rec.category}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{rec.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
