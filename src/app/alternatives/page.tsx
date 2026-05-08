'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Trash2, Edit2, Check, Info, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alternative } from '@/types';

export default function AlternativesPage() {
  const { data, updateAlternatives } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newName, setNewName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newAlternative: Alternative = {
      id: crypto.randomUUID(),
      name: newName,
    };
    updateAlternatives([...data.alternatives, newAlternative]);
    setNewName('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    updateAlternatives(data.alternatives.filter(a => a.id !== id));
    // Note: In a real app, you'd also want to clean up assessments for this alternative
  };

  const handleUpdate = (id: string, name: string) => {
    updateAlternatives(data.alternatives.map(a => a.id === id ? { ...a, name } : a));
    setEditingId(null);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Manajemen <span className="text-gradient">Alternatif</span></h2>
          <p className="text-slate-400">Daftar entitas atau pilihan yang akan di-ranking.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Tambah Alternatif
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
            <form onSubmit={handleAdd} className="glass-card flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nama Alternatif</label>
                <input 
                  required
                  type="text" 
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="input-field" 
                  placeholder="Contoh: Kandidat A"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">Simpan</button>
                <button type="button" onClick={() => setIsAdding(false)} className="btn-secondary">Batal</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.alternatives.map((alt) => (
          <motion.div
            layout
            key={alt.id}
            className="glass-card group flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              {editingId === alt.id ? (
                <input 
                  autoFocus
                  className="bg-transparent border-b border-indigo-500 outline-none text-white font-medium"
                  value={alt.name}
                  onBlur={() => setEditingId(null)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                  onChange={e => handleUpdate(alt.id, e.target.value)}
                />
              ) : (
                <span className="font-semibold text-white">{alt.name}</span>
              )}
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setEditingId(alt.id)}
                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-indigo-400"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(alt.id)}
                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}

        {data.alternatives.length === 0 && (
          <div className="col-span-full py-12 glass-card text-center text-slate-500 border-dashed">
             <div className="flex flex-col items-center gap-2">
                <Info className="w-8 h-8 opacity-20" />
                <p>Belum ada alternatif. Silakan tambah data pilihan Anda.</p>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}
