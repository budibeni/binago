'use client';

import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { PlaybackPoint } from '../types';

export interface PlaybackControlsProps {
  pointsCount: number;
  currentIndex: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSeek: (index: number) => void;
  currentPoint: PlaybackPoint;
}

export function PlaybackControls({
  pointsCount,
  currentIndex,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onSeek,
  currentPoint,
}: PlaybackControlsProps) {
  
  const formatTime = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const progress = pointsCount > 1 ? (currentIndex / (pointsCount - 1)) * 100 : 0;

  return (
    <div className="bg-white border-t border-neutral-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-4 md:p-6 md:rounded-t-2xl flex flex-col gap-4 relative z-20">
      
      {/* Information Row */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex flex-col">
          <span className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-0.5">Waktu</span>
          <span className="font-semibold text-neutral-900">{formatTime(currentPoint.timestamp)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-neutral-500 text-xs font-medium uppercase tracking-wider mb-0.5">Kecepatan</span>
          <span className="font-semibold text-neutral-900">{currentPoint.speed} km/jam</span>
        </div>
      </div>

      {/* Progress Slider */}
      <div className="relative flex items-center w-full h-8 group">
        <div className="absolute left-0 right-0 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-red-600 transition-all duration-300 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <input 
          type="range" 
          min={0}
          max={pointsCount - 1}
          value={currentIndex}
          onChange={(e) => onSeek(parseInt(e.target.value, 10))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Progress Playback"
        />
        <div 
          className="absolute w-4 h-4 bg-white border-2 border-red-600 rounded-full shadow pointer-events-none transition-all duration-300 ease-linear"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={onReset}
          className="p-3 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
          aria-label="Ulangi"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {isPlaying ? (
          <button 
            onClick={onPause}
            className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
            aria-label="Jeda"
          >
            <Pause className="w-6 h-6 fill-current" />
          </button>
        ) : (
          <button 
            onClick={onPlay}
            className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md shadow-red-600/20 transition-all hover:scale-105 active:scale-95"
            aria-label="Putar"
          >
            <Play className="w-6 h-6 fill-current ml-1" />
          </button>
        )}
      </div>

    </div>
  );
}
