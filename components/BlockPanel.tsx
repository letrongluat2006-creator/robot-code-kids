'use client';
import { useState } from 'react';
import { Block, BlockType } from '@/lib/types';
import { useVoice } from '@/hooks/useVoice';
import { useSounds } from '@/hooks/useSounds';   // ← Đã thêm import này

const blockTemplates = [
  { type: 'moveForward' as BlockType, label: '🚶 Đi thẳng', color: 'bg-blue-500' },
  { type: 'turnLeft' as BlockType, label: '↩️ Quay trái', color: 'bg-amber-500' },
  { type: 'turnRight' as BlockType, label: '↪️ Quay phải', color: 'bg-amber-500' },
  { type: 'repeat' as BlockType, label: '🔄 Lặp lại', color: 'bg-purple-600' },
  { type: 'ifWall' as BlockType, label: '❓ Nếu gặp tường', color: 'bg-red-500' },
];

export default function BlockPanel({ onScriptChange }: { onScriptChange: (blocks: Block[]) => void }) {
  const [workspace, setWorkspace] = useState<Block[]>([]);
  const { speak } = useVoice();
  const { playSound } = useSounds();     // ← Đã sửa

  const addBlock = (type: BlockType) => {
    let newBlock: Block;

    if (type === 'repeat') {
      newBlock = { id: Date.now().toString(), type, value: 3, children: [] };
    } else if (type === 'ifWall') {
      newBlock = { id: Date.now().toString(), type, condition: 'wall', children: [] };
    } else {
      newBlock = { id: Date.now().toString(), type };
    }

    const updated = [...workspace, newBlock];
    setWorkspace(updated);
    onScriptChange(updated);

    const nameMap: any = {
      moveForward: "Đi thẳng",
      turnLeft: "Quay trái",
      turnRight: "Quay phải",
      repeat: "Lặp lại",
      ifWall: "Nếu gặp tường"
    };

    speak(`Đã thêm khối ${nameMap[type]}`, 1.1, 1.2);
    playSound('click');        // ← Âm thanh khi thêm block
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-2xl h-full">
      <h2 className="text-4xl font-bold text-purple-700 mb-8">📦 KHỐI LỆNH</h2>
      
      <div className="space-y-4">
        {blockTemplates.map(b => (
          <button 
            key={b.type} 
            onClick={() => addBlock(b.type)} 
            className={`${b.color} w-full py-6 text-white text-2xl font-bold rounded-2xl active:scale-95 transition-all`}
          >
            {b.label}
          </button>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-3xl font-bold mb-6 text-purple-600">📋 Code của bé</h3>
        <div className="min-h-[420px] bg-purple-50 border-4 border-dashed border-purple-300 rounded-3xl p-6 space-y-3 overflow-auto">
          {workspace.length === 0 && <p className="text-gray-400 text-center text-xl mt-20">Kéo khối lệnh vào đây...</p>}
          
          {workspace.map((block, i) => (
            <div key={block.id} className="bg-white p-5 rounded-2xl shadow text-xl border-l-4 border-purple-500">
              <div>#{i+1} {block.type === 'repeat' ? `🔄 Lặp ${block.value} lần` : block.type === 'ifWall' ? '❓ Nếu gặp tường' : blockTemplates.find(t => t.type === block.type)?.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}