'use client';
import { useEffect, useState } from 'react';

export function useProgress() {
  const [progress, setProgress] = useState<Record<number, number>>({});

  useEffect(() => {
    const saved = localStorage.getItem('robotCodeProgress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const saveProgress = (levelId: number, stars: number) => {
    const newProgress = { ...progress, [levelId]: Math.max(stars, progress[levelId] || 0) };
    setProgress(newProgress);
    localStorage.setItem('robotCodeProgress', JSON.stringify(newProgress));
  };

  const getUnlockedLevels = () => Math.min(Object.keys(progress).length + 3, 10);

  return { progress, saveProgress, getUnlockedLevels };
}