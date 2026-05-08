'use client';

import { useState, useEffect } from 'react';
import { AppData, Criterion, Alternative, Assessment } from '@/types';

const STORAGE_KEY = 'spk_saw_data';

const initialData: AppData = {
  criteria: [],
  alternatives: [],
  assessments: [],
};

export function useStorage() {
  const [data, setData] = useState<AppData>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse storage data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const updateCriteria = (criteria: Criterion[]) => setData(prev => ({ ...prev, criteria }));
  const updateAlternatives = (alternatives: Alternative[]) => setData(prev => ({ ...prev, alternatives }));
  const updateAssessments = (assessments: Assessment[]) => setData(prev => ({ ...prev, assessments }));

  return {
    data,
    isLoaded,
    updateCriteria,
    updateAlternatives,
    updateAssessments,
  };
}
