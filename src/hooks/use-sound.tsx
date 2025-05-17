'use client';

import { useCallback, useEffect, useState } from 'react';

type SoundType =
  | 'buy'
  | 'upgrade'
  | 'start'
  | 'complete'
  | 'manager'
  | 'levelUp';

export function useSound() {
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(true);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [sounds, setSounds] = useState<
    Record<SoundType, HTMLAudioElement | null>
  >({
    buy: null,
    upgrade: null,
    start: null,
    complete: null,
    manager: null,
    levelUp: null,
  });
  const [bgMusic, setBgMusic] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const soundFiles: Record<SoundType, string> = {
      buy: '/sounds/buy.mp3',
      upgrade: '/sounds/upgrade.mp3',
      start: '/sounds/start.mp3',
      complete: '/sounds/complete.mp3',
      manager: '/sounds/manager.mp3',
      levelUp: '/sounds/level-up.mp3',
    };

    const loadedSounds: Record<SoundType, HTMLAudioElement> = {} as Record<
      SoundType,
      HTMLAudioElement
    >;

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = 0.5;
      loadedSounds[key as SoundType] = audio;
    });

    const music = new Audio('/sounds/background-music.mp3');
    music.loop = true;
    music.volume = 0.3;
    setBgMusic(music);

    setSounds(loadedSounds);
    setSoundsLoaded(true);

    const savedMuted = localStorage.getItem('gameSoundMuted');
    const savedMusicMuted = localStorage.getItem('gameMusicMuted');

    if (savedMuted) setIsMuted(savedMuted === 'true');
    if (savedMusicMuted) setIsMusicMuted(savedMusicMuted === 'true');

    return () => {
      Object.values(loadedSounds).forEach((audio) => {
        audio.pause();
        audio.src = '';
      });

      if (music) {
        music.pause();
        music.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (!bgMusic) return;

    if (isMusicMuted) {
      bgMusic.pause();
    } else {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [bgMusic, isMusicMuted]);

  useEffect(() => {
    if (soundsLoaded) {
      localStorage.setItem('gameSoundMuted', isMuted.toString());
      localStorage.setItem('gameMusicMuted', isMusicMuted.toString());
    }
  }, [isMuted, isMusicMuted, soundsLoaded]);

  const playSound = useCallback(
    (type: SoundType) => {
      if (isMuted || !sounds[type]) return;

      const sound = sounds[type];
      if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
      }
    },
    [sounds, isMuted],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleMusic = useCallback(() => {
    setIsMusicMuted((prev) => !prev);
  }, []);

  return {
    playSound,
    toggleMute,
    toggleMusic,
    isMuted,
    isMusicMuted,
  };
}
