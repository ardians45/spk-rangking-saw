'use client';

import { useApp } from '@/context/AppContext';
import { 
  Settings, 
  Users, 
  ArrowRight,
  TrendingUp,
  BrainCircuit
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { data } = useApp();

  const stats = [
    { 
      label: 'Total Kriteria', 
      value: data.criteria.length, 
      icon: Settings, 
      color: 'text-indigo-400',
      bg: 'bg-indigo-400/10'
    },
    { 
      label: 'Total Alternatif', 
      value: data.alternatives.length, 
      icon: Users, 
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    },
    { 
      label: 'Total Penilaian', 
      value: data.assessments.length, 
      icon: TrendingUp, 
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10'
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-2"
        >
          Dashboard <span className="text-gradient">Utama</span>
        </motion.h2>
        <p className="text-slate-400">Selamat datang di Sistem Pendukung Keputusan Ranking SAW.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-400">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Apa itu SAW?</h3>
          </div>
          <p className="text-slate-400 leading-relaxed text-sm">
            Simple Additive Weighting (SAW) sering juga dikenal istilah metode penjumlahan terbobot. 
            Konsep dasar metode SAW adalah mencari penjumlahan terbobot dari rating kinerja pada setiap alternatif pada semua kriteria.
          </p>
          <Link 
            href="/ranking" 
            className="btn-primary w-full group"
          >
            Hitung Ranking Sekarang
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/criteria" className="btn-secondary text-sm">Tambah Kriteria</Link>
            <Link href="/alternatives" className="btn-secondary text-sm">Tambah Alternatif</Link>
            <Link href="/assessment" className="btn-secondary text-sm">Input Nilai</Link>
            <Link href="/ranking" className="btn-secondary text-sm">Lihat Ranking</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
