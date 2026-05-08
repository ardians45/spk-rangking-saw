'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Trash2, Edit2, Check, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Criterion } from '@/types';

export default function CriteriaPage() {
  const { data, updateCriteria } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Criterion, 'id'>>({
    name: '',
    weight: 0,
    type: 'benefit',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newCriterion: Criterion = {
      ...formData,
      id: crypto.randomUUID(),
    };
    updateCriteria([...data.criteria, newCriterion]);
    setFormData({ name: '', weight: 0, type: 'benefit' });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    updateCriteria(data.criteria.filter(c => c.id !== id));
  };

  const handleUpdate = (id: string, updated: Criterion) => {
    updateCriteria(data.criteria.map(c => c.id === id ? updated : c));
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Manajemen <span className="text-gradient">Kriteria</span></h2>
          <p className="text-slate-400">Atur kriteria, bobot, dan tipe (Benefit/Cost).</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Tambah Kriteria
        </button>
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAdd} className="glass-card grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Kriteria</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="input-field" 
                  placeholder="Contoh: Harga"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bobot (%)</label>
                <input 
                  required
                  type="number" 
                  value={formData.weight || ''}
                  onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})}
                  className="input-field" 
                  placeholder="Contoh: 20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tipe</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as 'benefit' | 'cost'})}
                  className="input-field"
                >
                  <option value="benefit">Benefit</option>
                  <option value="cost">Cost</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Simpan</button>
                <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary">Batal</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card overflow-hidden !p-0">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Bobot</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Tipe</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.criteria.map((criterion) => (
              <tr key={criterion.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  {editingId === criterion.id ? (
                    <input 
                      className="input-field py-1" 
                      value={criterion.name} 
                      onChange={e => handleUpdate(criterion.id, {...criterion, name: e.target.value})}
                    />
                  ) : (
                    <span className="font-medium text-white">{criterion.name}</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === criterion.id ? (
                    <input 
                      type="number"
                      className="input-field py-1" 
                      value={criterion.weight} 
                      onChange={e => handleUpdate(criterion.id, {...criterion, weight: parseFloat(e.target.value)})}
                    />
                  ) : (
                    <span className="text-slate-300">{criterion.weight}%</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === criterion.id ? (
                    <select 
                      className="input-field py-1" 
                      value={criterion.type} 
                      onChange={e => handleUpdate(criterion.id, {...criterion, type: e.target.value as 'benefit' | 'cost'})}
                    >
                      <option value="benefit">Benefit</option>
                      <option value="cost">Cost</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${criterion.type === 'benefit' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>
                      {criterion.type.toUpperCase()}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setEditingId(editingId === criterion.id ? null : criterion.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-indigo-400"
                    >
                      {editingId === criterion.id ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={() => handleDelete(criterion.id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.criteria.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <Info className="w-8 h-8 opacity-20" />
                    <p>Belum ada kriteria. Silakan tambah kriteria baru.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {data.criteria.length > 0 && (
        <div className="glass-card border-indigo-500/20 flex items-center gap-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Info className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-sm text-slate-400">
            Total Bobot: <span className={data.criteria.reduce((sum, c) => sum + c.weight, 0) === 100 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {data.criteria.reduce((sum, c) => sum + c.weight, 0)}%
            </span> (Idealnya berjumlah 100%)
          </p>
        </div>
      )}
    </div>
  );
}
