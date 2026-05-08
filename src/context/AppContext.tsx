'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useStorage } from '@/hooks/useStorage';
import { AppData, Criterion, Alternative, Assessment } from '@/types';

interface AppContextType {
  data: AppData;
  isLoaded: boolean;
  updateCriteria: (criteria: Criterion[]) => void;
  updateAlternatives: (alternatives: Alternative[]) => void;
  updateAssessments: (assessments: Assessment[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const storage = useStorage();

  return (
    <AppContext.Provider value={storage}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
