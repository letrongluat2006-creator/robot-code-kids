'use client';
import Link from 'next/link';
import { levels } from '@/data/levels';
import { useProgress } from '@/hooks/useProgress';

export default function Home() {
  const { progress } = useProgress();

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-7xl font-bold text-purple-600 mb-6">🤖 Robot Code</h1>
        <p className="text-3xl mb-12 text-gray-700">Học lập trình vui cùng Robot dễ thương!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {levels.map(level => {
            const stars = progress[level.id] || 0;
            return (
              <Link key={level.id} href={`/play/${level.id}`}>
                <div className="bg-white rounded-3xl p-8 hover:scale-105 transition-all shadow-xl h-full cursor-pointer">
                  <div className="text-6xl mb-4">Level {level.id}</div>
                  <h3 className="font-bold text-2xl mb-3">{level.name}</h3>
                  <p className="text-gray-600 mb-6">{level.description}</p>
                  <div className="flex justify-center gap-2 text-5xl">
                    {Array(3).fill(0).map((_, i) => (i < stars ? '⭐' : '☆'))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}