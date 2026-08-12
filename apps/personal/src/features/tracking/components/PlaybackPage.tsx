'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { PlaybackMap } from './PlaybackMap';
import { PlaybackControls } from './PlaybackControls';
import { PlaybackData } from '../types';

export interface PlaybackPageProps {
  playbackData: PlaybackData;
  onBack: () => void;
}

export function PlaybackPage({ playbackData, onBack }: PlaybackPageProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const points = playbackData.points;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle Playback Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= points.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000); // 1 second per point for dummy
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, points.length]);

  const handlePlay = () => {
    if (currentIndex >= points.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handleSeek = (index: number) => {
    setCurrentIndex(index);
  };

  if (points.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-neutral-100">
        <p className="text-neutral-500 mb-4">Data perjalanan tidak tersedia.</p>
        <button 
          onClick={onBack}
          className="px-4 py-2 bg-white rounded-lg border shadow-sm font-medium hover:bg-neutral-50"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-neutral-100 overflow-hidden">
      {/* Playback Header overlay on top of map */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-4">
        <div className="pointer-events-auto inline-flex">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-md border border-neutral-200/60 rounded-xl shadow-sm text-sm font-medium hover:bg-white hover:shadow transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative min-h-0">
        <PlaybackMap 
          data={playbackData} 
          currentIndex={currentIndex} 
        />
      </div>

      {/* Controls Area */}
      <div className="w-full max-w-xl mx-auto md:absolute md:bottom-6 md:left-1/2 md:transform md:-translate-x-1/2">
        <PlaybackControls 
          pointsCount={points.length}
          currentIndex={currentIndex}
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onSeek={handleSeek}
          currentPoint={points[currentIndex]}
        />
      </div>
    </div>
  );
}
