'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { levels } from '@/data/levels';
import GameBoard from '../../../../components/GameBoard';
import BlockPanel from '../../../../components/BlockPanel';
import AIHint from '../../../../components/AIHint';
import { useProgress } from '../../../../hooks/useProgress';
import { useVoice } from '../../../../hooks/useVoice';
import { Block } from '../../../../lib/types';

export default function PlayPage() {
  const { levelId } = useParams();
  const router = useRouter();
  const { progress, saveProgress, getUnlockedLevels } = useProgress();
  const { speakLevelIntro } = useVoice();

  const level = levels.find(l => l.id === Number(levelId));
  const [script, setScript] = useState<Block[]>([]);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    if (level) speakLevelIntro(level);
  }, [level]);

  const handleComplete = (id: number, stars: number) => {
    saveProgress(id, stars);
    setShowCongrats(true);
    
    setTimeout(() => {
      const next = Number(levelId) + 1;
      if (next <= getUnlockedLevels()) {
        router.push(`/play/${next}`);
      } else {
        router.push('/');
      }
    }, 2800);
  };

  if (!level) return <div className="text-center text-4xl mt-20">Level không tồn tại</div>;

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bold">Level {level.id}: {level.name}</h1>
          <button 
            onClick={() => speakLevelIntro(level)} 
            className="bg-yellow-400 hover:bg-yellow-500 px-8 py-4 rounded-2xl text-2xl font-bold"
          >
            🔊 Nghe hướng dẫn
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <GameBoard 
            level={level} 
            script={script} 
            onComplete={handleComplete} 
          />
          
          <div>
            <BlockPanel onScriptChange={setScript} />
            <AIHint level={level} script={script} />
          </div>
        </div>
      </div>

      {showCongrats && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-16 text-center">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-6xl font-bold text-green-600">Hoàn thành tuyệt vời!</h2>
            <p className="text-3xl mt-6">Bé giỏi quá! 🤖✨</p>
          </div>
        </div>
      )}
    </div>
  );
}