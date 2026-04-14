'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus, Volume2, VolumeX } from 'lucide-react';

const PRESETS = [30, 60, 90, 120, 180];

interface RestTimerProps {
  defaultSeconds?: number;
  onComplete?: () => void;
}

export function RestTimer({ defaultSeconds = 90, onComplete }: RestTimerProps) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  useEffect(() => {
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVcQNpHW+NueaUAkP4nH4tt1NwwxjsPg5Xg8Nzt2s9Tj9YMzLDl0v+Pndj04KjNuv+PscUAoM2u65O9wPyYvZ7Xi7XBAKjNpvuTvcD8mMFq35fFwPycxXbrl8nE/KDFdu+XzcT8pMl+75/NxPykzYLzm83E/KjRivefzcT8rNWO+6PNxPyw2ZL/p83E/LTdmwOrzcT8uOGbB6/NxPy84Z8Hs83E/MDhnyezzcT8xOGjK7fNxPzI4aMvt83E/MjhpzO7zcT80OGnN7/NxPzU4as3v83E/Nzlqz/DzcT84OWvP8fNxPzo5bNDy83E/Ozlt0fLzcT88OW7S9fNxPz07b9P283E/PjtvyfbzcT8+O2/J9/NxPz88cMr383E/QD5yy/jzcT9BP3LL+fNxP0I/csz683E/Q0Fzy/rzcT9DQnTN+vNxP0RDdc7783E/RUR1zvz0cT9FRnbP/vRxP0ZHd9D/9HE/Rkd30f/1cT9HR3jS//ZxP0dIeNP/9nE/R0l50//3cT9ISnrU//dxP0hKe9X/93E/SUt71v/4cT9JTJzX//lxP0pNndj/+XE/S06e2P/6cT9LT57Z//txP0xPn9r/+3E/TU+g2v/8cT9OT6Hb//xxP05Qodz//HE/T1Gi3f/9cT9PUaLd//5xP09Sot7//3E/T1Oi3v//cT9PVKPe//9xP09Uot//gHE/T1Wj3/+BcT9PVaPg/4FxP09Wo+D/gXE/T1ek4f+AcT9PV6Th/4FxP09YpOL/gXE/T1ml4/+BcT9PW6bj/4FxP09bpuT/gXE/T12n5P+BcT9PXqfl/4FxP09fp+X/gHE/T1+o5v+AcT9PYKjm/4BxP09hqef/gHE/T2Gp5/+AcT9PYqrn/4BxP09jquj/gHE/T2Or6P+AcT9PZ6vp/4BxP09nq+r/gHE/T2ir6v+AcT9Paavr/4BxP09oq+v/gHE/T2ms7P+AcT9Paazt/4BxP09qrO3/gHE/T2ut7v+AcT9PbK3v/4BxP09sre//gHE/T2yt7/+AcT9PbK3w/4BxP09trfD/gHE/T26u8P+AcT9Pbq7x/4BxP09vr/H/gHE/T2+v8v+AcT9PcK/y/4BxP09wr/L/gHE/T3Cv8v+AcT9PcK/z/4BxP09wr/P/gHE/T3Cv9P+AcT9PcK/0/4BxP09wsPX/gHE/T3Cw9f+AcT9PcLD2/4BxP09wsff/gHE/T3Cx9/+AcT9PcLI');

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playSound();
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, playSound, onComplete]);

  const handlePreset = (seconds: number) => {
    setSeconds(seconds);
    setTimeLeft(seconds);
    setIsRunning(false);
  };

  const adjustTime = (delta: number) => {
    const newTime = Math.max(5, Math.min(600, timeLeft + delta));
    setSeconds(newTime);
    setTimeLeft(newTime);
  };

  const reset = () => {
    setTimeLeft(seconds);
    setIsRunning(false);
  };

  const toggle = () => {
    if (timeLeft === 0) {
      reset();
    }
    setIsRunning(!isRunning);
  };

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = seconds > 0 ? ((seconds - timeLeft) / seconds) * 100 : 0;
  const isAlmostDone = timeLeft <= 5 && timeLeft > 0;

  return (
    <div className="bg-[#111] border border-[#333] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white tracking-wider">REST TIMER</h3>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg transition-colors ${
            soundEnabled ? 'text-[#B8956A]' : 'text-gray-600'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="#222"
              strokeWidth="8"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke={isAlmostDone ? '#ef4444' : '#B8956A'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-5xl font-bold font-mono ${
                isAlmostDone && isRunning ? 'text-red-500 animate-pulse' : 'text-white'
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={() => adjustTime(-15)}
            className="p-2 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#B8956A] transition-colors"
          >
            <Minus className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={toggle}
            className={`p-4 rounded-full transition-colors ${
              isRunning
                ? 'bg-yellow-600 hover:bg-yellow-500'
                : 'bg-[#B8956A] hover:bg-[#c9a67a]'
            }`}
          >
            {isRunning ? (
              <Pause className="w-8 h-8 text-[#0A0A0A]" />
            ) : (
              <Play className="w-8 h-8 text-[#0A0A0A] fill-[#0A0A0A]" />
            )}
          </button>
          <button
            onClick={() => adjustTime(15)}
            className="p-2 bg-[#1A1A1A] border border-[#333] rounded-lg hover:border-[#B8956A] transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <button
          onClick={reset}
          className="text-gray-500 hover:text-white transition-colors flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="text-sm">Reset</span>
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePreset(preset)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              seconds === preset && timeLeft === preset
                ? 'bg-[#B8956A] text-[#0A0A0A]'
                : 'bg-[#1A1A1A] border border-[#333] text-gray-400 hover:border-[#B8956A] hover:text-white'
            }`}
          >
            {preset >= 60 ? `${preset / 60}m` : `${preset}s`}
          </button>
        ))}
      </div>
    </div>
  );
}