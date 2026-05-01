'use client';

export function useSounds() {
  const playSound = (type: 'move' | 'turn' | 'win' | 'error' | 'click') => {
    let url = '';

    switch (type) {
      case 'move':
        url = 'https://freesound.org/data/previews/276/276951_5121236-lq.mp3'; // tiếng bước
        break;
      case 'turn':
        url = 'https://freesound.org/data/previews/387/387186_5121236-lq.mp3'; // tiếng bíp
        break;
      case 'win':
        url = 'https://freesound.org/data/previews/269/269026_5121236-lq.mp3'; // tiếng thắng
        break;
      case 'error':
        url = 'https://freesound.org/data/previews/341/341695_5121236-lq.mp3'; // tiếng lỗi
        break;
      case 'click':
        url = 'https://freesound.org/data/previews/320/320186_5121236-lq.mp3';
        break;
    }

    const audio = new Audio(url);
    audio.volume = 0.6;
    audio.play().catch(() => {});
  };

  return { playSound };
}