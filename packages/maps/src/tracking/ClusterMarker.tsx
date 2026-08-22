import React from 'react';
import { MapMarker } from '../core/MapMarker';
import { cn } from '@adatrack/utils';

export interface ClusterMarkerProps {
  id: string;
  position: { lat: number; lng: number };
  count: number;
  onClick: () => void;
}

export function ClusterMarker({ id, position, count, onClick }: ClusterMarkerProps) {
  // Ukuran dinamis berdasarkan jumlah (minimal 32px, maksimal 56px)
  const size = Math.min(32 + count, 56);

  // Tentukan warna berdasarkan jumlah
  // Mengikuti referensi gambar: hijau untuk jumlah kecil, kuning/orange untuk jumlah besar
  const isSmall = count < 10;

  const baseColor = isSmall
    ? "bg-[#8BC34A] text-white ring-[#8BC34A]/40" // Hijau seperti gambar
    : "bg-[#FFCA28] text-[#333] ring-[#FFCA28]/40"; // Kuning seperti gambar

  return (
    <MapMarker id={id} position={position} heading={0}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={cn(
          "flex items-center justify-center rounded-full cursor-pointer pointer-events-auto",
          "font-semibold shadow-sm transition-transform hover:scale-110 ring-4",
          baseColor
        )}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          fontSize: size < 40 ? '12px' : '14px'
        }}
      >
        {count}
      </div>
    </MapMarker>
  );
}
