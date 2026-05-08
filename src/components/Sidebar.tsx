'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  ClipboardList, 
  TrendingUp,
  BrainCircuit,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Settings, label: 'Kriteria', href: '/criteria' },
  { icon: Users, label: 'Alternatif', href: '/alternatives' },
  { icon: ClipboardList, label: 'Penilaian', href: '/assessment' },
  { icon: TrendingUp, label: 'Ranking', href: '/ranking' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        <h1 className="font-bold text-xl tracking-tight text-gradient">SPK SAW</h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-indigo-400" : "group-hover:text-white"
              )} />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6">
        <div className="glass-card p-4 text-xs text-slate-400">
          <p>Full Client-Side</p>
          <p>Local Storage Saved</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 glass rounded-lg text-white"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop Sidebar */}
      <aside className="w-64 glass border-r border-white/10 hidden md:flex flex-col sticky top-0 h-screen">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <aside 
            className="w-64 glass h-full flex flex-col" 
            onClick={e => e.stopPropagation()}
          >
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
