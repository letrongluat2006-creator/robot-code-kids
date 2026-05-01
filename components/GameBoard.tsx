'use client';
import { useSounds } from '@/hooks/useSounds';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoice } from '@/hooks/useVoice';
import { runScript } from './ExecutionEngine';
import { Level, Direction, Block } from '@/lib/types';

export default function GameBoard({ 
  level, 
  script, 
  onComplete 
}: { 
  level: Level; 
  script: Block[]; 
  onComplete: (id: number, stars: number) => void;
}) {
  const [robot, setRobot] = useState({ pos: level.start, dir: level.startDir as Direction });
  const [isRunning, setIsRunning] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showStars, setShowStars] = useState(false);
  const { speak } = useVoice();

  const { playSound } = useSounds();

  const handleRun = async () => {
    setIsRunning(true);
    setFeedback("");
    playSound('click');
    speak("Bắt đầu chạy chương trình nào!", 1, 1.1);

    const result = await runScript(script, level, (newPos, newDir) => {
      setRobot({ pos: newPos, dir: newDir });
      playSound('move');   // tiếng mỗi bước
    });

    setFeedback(result.message);
    
    if (result.success) {
      playSound('win');
      speak("Tuyệt vời! Robot đã đến cờ rồi!", 0.9, 1.3);
      setShowStars(true);
      setTimeout(() => {
        onComplete(level.id, 3);
        setShowStars(false);
      }, 2000);
    } else {
      playSound('error');
      speak("Ôi, robot đụng tường rồi. Thử lại nhé!", 1, 1);
    }
    setIsRunning(false);
  };
  return (
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-3xl shadow-2xl">
      <div className="relative w-[520px] h-[520px] mx-auto bg-white rounded-3xl overflow-hidden border-8 border-blue-400">
        {level.grid.flat().map((cell, idx) => {
          const x = idx % level.grid[0].length;
          const y = Math.floor(idx / level.grid[0].length);
          return (
            <div 
              key={idx} 
              className={`absolute w-13 h-13 flex items-center justify-center text-4xl ${cell === '#' ? 'bg-gray-800' : 'bg-emerald-100'}`} 
              style={{ left: x * 52, top: y * 52 }}
            >
              {cell === 'S' && '🚩'} 
              {cell === 'E' && '🏁'}
            </div>
          );
        })}

        <motion.div 
          className="absolute text-7xl drop-shadow-2xl" 
          animate={{ 
            left: robot.pos.x * 52 + 6, 
            top: robot.pos.y * 52 + 6, 
            rotate: getRotation(robot.dir) 
          }} 
          transition={{ duration: 0.4 }}
        >
          🤖
        </motion.div>
      </div>

      <button 
        onClick={handleRun} 
        disabled={isRunning} 
        className="mt-8 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-4xl py-8 rounded-3xl font-bold shadow-xl hover:brightness-110 disabled:opacity-70"
      >
        {isRunning ? "🤖 Đang chạy..." : "▶️ CHẠY CODE NÀO!"}
      </button>

      {feedback && <p className="text-center mt-6 text-3xl font-bold text-purple-700">{feedback}</p>}

      <AnimatePresence>
        {showStars && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ y: -250, opacity: [0,1,0], scale: [0.5,1.8,0.8] }} 
                transition={{ duration: 2, delay: i * 0.1 }} 
                className="text-6xl absolute"
              >
                ⭐
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getRotation(dir: Direction) {
  return { up: -90, down: 90, left: 180, right: 0 }[dir];
}