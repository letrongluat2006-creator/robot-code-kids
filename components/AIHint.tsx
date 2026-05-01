'use client';
import { useState } from 'react';
import { Level, Block } from '@/lib/types';

export default function AIHint({ level, script }: { level: Level; script: Block[] }) {
  const [hint, setHint] = useState("");
  const [loading, setLoading] = useState(false);

  const getHint = async () => {
    setLoading(true);
    
    let message = "";

    if (script.length === 0) {
      message = `Con chưa có khối lệnh nào. Hãy thử kéo khối **🚶 Đi thẳng** trước nhé!`;
    } 
    else if (level.id <= 3) {
      message = `Hãy kéo **Đi thẳng** và **Quay phải / Quay trái** để robot thay đổi hướng nhé!`;
    } 
    else if (level.id <= 6) {
      message = `Thử dùng nhiều khối **Đi thẳng** liên tiếp hoặc quay hướng phù hợp.`;
    } 
    else {
      message = `Con đang ở level khó. Hãy quan sát mê cung, né tường và thử nhiều hướng khác nhau.`;
    }

    setHint(message);
    setLoading(false);
  };

  return (
    <div className="mt-6">
      <button
        onClick={getHint}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-lg"
      >
        {loading ? "🤖 Đang suy nghĩ..." : "💡 AI Gợi Ý Cho Con"}
      </button>

      {hint && (
        <div className="mt-4 bg-white p-6 rounded-2xl border-2 border-purple-200 text-xl leading-relaxed shadow">
          {hint}
        </div>
      )}
    </div>
  );
}