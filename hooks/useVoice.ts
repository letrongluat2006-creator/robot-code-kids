'use client';

export function useVoice() {
  const speak = (text: string, rate = 0.95, pitch = 1.15) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = rate;
      utterance.pitch = pitch;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakLevelIntro = (level: any) => {
    speak(`Chào bé! Đây là bài ${level.id}: ${level.name}. ${level.description}. Hãy kéo khối lệnh bên phải rồi bấm chạy nhé!`);
  };

  return { speak, speakLevelIntro };
}