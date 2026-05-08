'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { TrendingUp, Trophy, AlertCircle, Calculator, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RankingPage() {
  const { data } = useApp();

  const rankingResults = useMemo(() => {
    const { criteria, alternatives, assessments } = data;

    if (criteria.length === 0 || alternatives.length === 0 || assessments.length === 0) {
      return null;
    }

    // 1. Group assessments by criterion to find min/max
    const critValues: Record<string, number[]> = {};
    criteria.forEach(c => critValues[c.id] = []);
    assessments.forEach(a => {
      if (critValues[a.criterionId]) {
        critValues[a.criterionId].push(a.value);
      }
    });

    const critMinMax: Record<string, { min: number; max: number }> = {};
    criteria.forEach(c => {
      const values = critValues[c.id];
      critMinMax[c.id] = {
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
      };
    });

    // 2. Normalize and Calculate Preference
    const results = alternatives.map(alt => {
      let totalScore = 0;
      const normalizedValues: Record<string, number> = {};

      criteria.forEach(crit => {
        const assessment = assessments.find(a => a.alternativeId === alt.id && a.criterionId === crit.id);
        const x = assessment?.value ?? 0;
        const { min, max } = critMinMax[crit.id];

        let r = 0;
        if (crit.type === 'benefit') {
          r = max !== 0 ? x / max : 0;
        } else {
          r = x !== 0 ? min / x : 0;
        }

        normalizedValues[crit.id] = r;
        // Weight normalized score (Weight is usually % so divide by 100 or keep if relative)
        totalScore += (crit.weight / 100) * r;
      });

      return {
        id: alt.id,
        name: alt.name,
        score: totalScore,
        normalizedValues
      };
    });

    // 3. Sort by Score Descending
    return results.sort((a, b) => b.score - a.score);
  }, [data]);

  if (!rankingResults) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="p-4 bg-indigo-500/10 rounded-full">
          <AlertCircle className="w-12 h-12 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Data Perhitungan Belum Ada</h3>
        <p className="text-slate-400 text-center max-w-md">
          Pastikan Anda sudah mengisi data kriteria, alternatif, dan nilai penilaian secara lengkap.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Hasil <span className="text-gradient">Ranking SAW</span></h2>
          <p className="text-slate-400">Berikut adalah hasil perhitungan menggunakan metode Simple Additive Weighting.</p>
        </div>
        <div className="p-3 glass rounded-xl flex items-center gap-2 text-indigo-400">
          <Calculator className="w-5 h-5" />
          <span className="text-sm font-semibold uppercase tracking-wider">Metode SAW</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card !p-0 overflow-hidden"
          >
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider w-16">Rank</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Alternatif</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Skor Akhir (V)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rankingResults.map((res, index) => (
                  <tr key={res.id} className={`hover:bg-white/5 transition-colors ${index === 0 ? 'bg-indigo-500/5' : ''}`}>
                    <td className="px-6 py-4">
                      {index === 0 ? (
                        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium ml-3">{index + 1}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-white">{res.name}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-mono text-lg ${index === 0 ? 'text-indigo-400 font-bold' : 'text-slate-300'}`}>
                        {res.score.toFixed(4)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <div className="glass-card">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Detail Matriks Normalisasi (R)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-500">
                  <tr>
                    <th className="pb-2 pr-4">Alternatif</th>
                    {data.criteria.map(c => <th key={c.id} className="pb-2 px-2">{c.name}</th>)}
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  {rankingResults.map(res => (
                    <tr key={res.id} className="border-t border-white/5">
                      <td className="py-2 pr-4 font-medium text-slate-400">{res.name}</td>
                      {data.criteria.map(c => (
                        <td key={c.id} className="py-2 px-2 font-mono">
                          {res.normalizedValues[c.id]?.toFixed(3) ?? '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card border-indigo-500/20 bg-indigo-500/5"
          >
            <h3 className="text-lg font-bold text-white mb-4">Pemenang Ranking</h3>
            <div className="flex flex-col items-center p-6 bg-slate-900/50 rounded-2xl border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
               <Trophy className="w-16 h-16 text-yellow-500 mb-4 animate-bounce" />
               <p className="text-slate-400 text-sm uppercase tracking-widest mb-1">Peringkat 1</p>
               <h4 className="text-2xl font-black text-white text-center mb-2">{rankingResults[0].name}</h4>
               <div className="px-4 py-1 bg-indigo-500/20 rounded-full">
                  <span className="text-indigo-400 font-mono font-bold">{rankingResults[0].score.toFixed(4)}</span>
               </div>
            </div>
          </motion.div>

          <div className="glass-card text-xs text-slate-400 space-y-3">
            <h4 className="font-bold text-white uppercase flex items-center gap-2">
              <Info className="w-3 h-3" />
              Info Rumus
            </h4>
            <div className="space-y-2">
              <p><strong>Normalisasi Benefit:</strong> r_ij = x_ij / max(x_j)</p>
              <p><strong>Normalisasi Cost:</strong> r_ij = min(x_j) / x_ij</p>
              <p><strong>Preferensi (V_i):</strong> Σ (w_j * r_ij)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
