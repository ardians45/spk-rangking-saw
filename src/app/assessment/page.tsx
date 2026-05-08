'use client';

import { useApp } from '@/context/AppContext';
import { Info, Save, AlertCircle } from 'lucide-react';
import { Assessment } from '@/types';

export default function AssessmentPage() {
  const { data, updateAssessments } = useApp();

  const getValue = (altId: string, critId: string) => {
    return data.assessments.find(a => a.alternativeId === altId && a.criterionId === critId)?.value ?? '';
  };

  const handleUpdate = (altId: string, critId: string, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    
    const exists = data.assessments.find(a => a.alternativeId === altId && a.criterionId === critId);
    
    let newAssessments: Assessment[];
    if (exists) {
      newAssessments = data.assessments.map(a => 
        (a.alternativeId === altId && a.criterionId === critId) ? { ...a, value: numValue } : a
      );
    } else {
      newAssessments = [...data.assessments, { alternativeId: altId, criterionId: critId, value: numValue }];
    }
    
    updateAssessments(newAssessments);
  };

  if (data.criteria.length === 0 || data.alternatives.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="p-4 bg-orange-500/10 rounded-full">
          <AlertCircle className="w-12 h-12 text-orange-400" />
        </div>
        <h3 className="text-xl font-bold text-white">Data Belum Lengkap</h3>
        <p className="text-slate-400 text-center max-w-md">
          Silakan isi <span className="text-indigo-400">Kriteria</span> dan <span className="text-indigo-400">Alternatif</span> terlebih dahulu sebelum melakukan penilaian.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Penilaian <span className="text-gradient">Alternatif</span></h2>
        <p className="text-slate-400">Masukkan nilai untuk setiap kriteria pada masing-masing alternatif.</p>
      </header>

      <div className="glass-card overflow-x-auto !p-0">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-900/50 backdrop-blur-md z-10">
                Alternatif \ Kriteria
              </th>
              {data.criteria.map(crit => (
                <th key={crit.id} className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[150px]">
                  {crit.name}
                  <span className="block text-[10px] opacity-50 lowercase mt-1">({crit.type})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.alternatives.map((alt) => (
              <tr key={alt.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-semibold text-white sticky left-0 bg-slate-900/50 backdrop-blur-md z-10 border-r border-white/5">
                  {alt.name}
                </td>
                {data.criteria.map(crit => (
                  <td key={crit.id} className="px-4 py-2">
                    <input 
                      type="number"
                      value={getValue(alt.id, crit.id)}
                      onChange={e => handleUpdate(alt.id, crit.id, e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/5 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-white"
                      placeholder="0"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="glass-card flex items-center gap-4 bg-emerald-500/5 border-emerald-500/20">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <Save className="w-5 h-5 text-emerald-400" />
        </div>
        <p className="text-sm text-slate-400">
          Data tersimpan secara otomatis di Local Storage browser Anda.
        </p>
      </div>
    </div>
  );
}
