'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Truck, UserCheck, AlertTriangle,
  MapPin, Clock, Camera, Map, LocateFixed, Footprints,
  ChevronRight, User, Navigation, Layers, Crosshair, Info, X,
  Wrench, ShieldAlert, MessageSquareText, Power, MapPinned, Route,
  RefreshCcw, CheckCircle2
} from 'lucide-react';
import { cn } from '@adatrack/utils';
import { MapProvider, MapContainer, MapMarker, BasemapSwitcher, useMapActions, useInternalMap } from '@adatrack/maps';
import type { BasemapId } from '@adatrack/maps';

const TABS = [
  { id: 'history', label: 'Riwayat', icon: Clock },
  { id: 'vehicles', label: 'Kendaraan', icon: Map },
  { id: 'attendance', label: 'Absensi', icon: UserCheck },
  { id: 'messages', label: 'Pesan', icon: MessageSquareText },
];

// Nav bar height constant – used to offset content so map/content never gets hidden behind nav
const NAV_H = 'pb-[52px]';

export function DriverPortalFeature() {
  const [activeTab, setActiveTab] = useState('vehicles');

  const renderContent = () => {
    switch (activeTab) {
      case 'vehicles': return <VehiclesTab />;
      case 'history': return <HistoryTab />;
      case 'attendance': return <AttendanceTab />;
      case 'messages': return <MessagesTab />;
      default: return <VehiclesTab />;
    }
  };

  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden bg-background">

      {/* ── CONTENT AREA – fills all space above nav ── */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* ── BOTTOM NAV – always on top, never covered ── */}
      <nav
        className="flex-none z-50 bg-card border-t border-border flex items-stretch"
        style={{ minHeight: 52, paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-1 transition-colors relative',
                isActive ? 'text-red-500' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-red-500 rounded-full" />
              )}
              <Icon className="w-[18px] h-[18px] mt-0.5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn('text-[10px] leading-none mt-0.5', isActive ? 'font-bold' : 'font-medium')}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ─── HISTORY TAB ──────────────────────────────────────────────────────────────
function HistoryTab() {
  // Dummy 7-day history data
  const HISTORY = [
    {
      date: 'Hari Ini',
      distance: '12.4 km',
      items: [
        { id: 1, time: '14:30', type: 'off', title: 'Mesin OFF', loc: 'Kawasan Industri Jawilan, Banten', geofence: 'Pabrik Cikande' },
        { id: 2, time: '14:15', type: 'park', title: 'Mulai Parkir', loc: 'Kawasan Industri Jawilan, Banten', geofence: 'Pabrik Cikande' },
        { id: 3, time: '07:30', type: 'on', title: 'Mesin ON', loc: 'Jl. Raya Serang KM 30, Banten' }, // No geofence
      ]
    },
    {
      date: 'Kemarin',
      distance: '87.1 km',
      items: [
        { id: 4, time: '18:45', type: 'off', title: 'Mesin OFF', loc: 'Pool Utama, Jakarta Barat', geofence: 'Pool Pusat' },
        { id: 5, time: '18:30', type: 'park', title: 'Mulai Parkir', loc: 'Pool Utama, Jakarta Barat', geofence: 'Pool Pusat' },
        { id: 6, time: '12:15', type: 'off', title: 'Mesin OFF', loc: 'Rest Area KM 42, Tol Jakarta-Cikampek' }, // No geofence
        { id: 61, time: '06:15', type: 'on', title: 'Mesin ON', loc: 'Pool Utama, Jakarta Barat', geofence: 'Pool Pusat' },
      ]
    },
    {
      date: '08 Okt 2026',
      distance: '142.5 km',
      items: [
        { id: 7, time: '17:00', type: 'off', title: 'Mesin OFF', loc: 'Perumahan Griya Indah, Bogor' }, // No geofence
        { id: 8, time: '08:00', type: 'on', title: 'Mesin ON', loc: 'Pool Utama, Jakarta Barat', geofence: 'Pool Pusat' },
      ]
    },
    {
      date: '07 Okt 2026',
      distance: '45.0 km',
      items: [
        { id: 9, time: '16:30', type: 'off', title: 'Mesin OFF', loc: 'Jl. Merdeka Raya No. 45, Depok' }, // No geofence
        { id: 10, time: '07:15', type: 'on', title: 'Mesin ON', loc: 'Pool Utama, Jakarta Barat', geofence: 'Pool Pusat' },
      ]
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-100 dark:bg-gray-900">
      <div className="px-4 py-4 md:px-6 md:py-5 space-y-3 max-w-screen-md mx-auto animate-in fade-in duration-200 pb-24">

        <div className="space-y-3">
          {HISTORY.map((day, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 border border-border rounded-2xl overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
                <h3 className="text-[11px] font-extrabold text-foreground uppercase tracking-wider">{day.date}</h3>
                <span className="flex items-center gap-1 text-[9px] font-extrabold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded leading-none flex-none">
                  <Route className="w-2.5 h-2.5" strokeWidth={3} />
                  {day.distance}
                </span>
              </div>

              {/* Card Body – Timeline */}
              <div className="px-4 py-3">
                <div className="relative pl-6 border-l-2 border-border ml-2 space-y-4">
                  {day.items.map((item) => {
                    let Icon = MapPin;
                    let iconColor = "text-muted-foreground";

                    if (item.type === 'on') {
                      Icon = Power;
                      iconColor = "text-green-500";
                    } else if (item.type === 'off') {
                      Icon = Power;
                      iconColor = "text-red-500";
                    } else if (item.type === 'park') {
                      Icon = MapPinned;
                      iconColor = "text-blue-500";
                    }

                    return (
                      <div key={item.id} className="relative py-1">
                        {/* Timeline Dot/Icon */}
                        <div className={cn(
                          "absolute -left-[35px] top-1.5 w-5 h-5 rounded-full flex items-center justify-center bg-white dark:bg-gray-800",
                          iconColor
                        )}>
                          <Icon className="w-3.5 h-3.5" strokeWidth={3} />
                        </div>

                        {/* Content (Clickable) */}
                        <button
                          onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(item.loc)}`, '_blank')}
                          className="w-full text-left bg-transparent p-0 flex flex-col hover:opacity-75 transition-opacity"
                          title="Buka di Google Maps"
                        >
                          <div className="flex items-center gap-2 mb-0.5 w-full">
                            <h4 className="font-bold text-xs text-foreground leading-none">{item.title}</h4>
                            {item.geofence && (
                              <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded leading-none flex-none">
                                {item.geofence}
                              </span>
                            )}
                            <span className="ml-auto text-[10px] font-semibold text-muted-foreground flex-none">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground leading-snug line-clamp-1 w-full">
                            {item.loc}
                          </p>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-1 text-center">
          <button className="text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 border border-border rounded-lg bg-transparent">
            Muat Lebih Banyak
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── VEHICLE FINDER CONTROLS (inside MapProvider context) ─────────────────────
function VehicleFinderControls({
  driverCoord,
  setDriverCoord,
  vehicleCoord,
  basemap,
  setBasemap,
}: {
  driverCoord: { lat: number; lng: number } | null;
  setDriverCoord: (c: { lat: number; lng: number }) => void;
  vehicleCoord: { lat: number; lng: number };
  basemap: BasemapId;
  setBasemap: (b: BasemapId) => void;
}) {
  const { panTo, fitBounds } = useMapActions();
  const map = useInternalMap();

  // 1. Auto-request geolocation on mount (triggers browser permission prompt)
  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDriverCoord({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.warn('Geolocation denied:', err.message),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. When driverCoord is ready → fit bounds to show both markers
  const fittedRef = React.useRef(false);
  useEffect(() => {
    if (!driverCoord || fittedRef.current) return;

    // Beri waktu sejenak agar container map sudah 100% dirender ukurannya
    const timer = setTimeout(() => {
      fitBounds([
        Math.min(vehicleCoord.lng, driverCoord.lng),
        Math.min(vehicleCoord.lat, driverCoord.lat),
        Math.max(vehicleCoord.lng, driverCoord.lng),
        Math.max(vehicleCoord.lat, driverCoord.lat),
      ] as [number, number, number, number], {
        padding: 100,
        maxZoom: 17,
        duration: 1500
      });
      fittedRef.current = true;
    }, 800);

    return () => clearTimeout(timer);
  }, [driverCoord, vehicleCoord, fitBounds]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLocateMe = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setDriverCoord(coords);
          panTo(coords);
        },
        () => alert('Gagal mendapatkan lokasi. Aktifkan izin GPS di browser Anda.'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Browser Anda tidak mendukung fitur lokasi.');
    }
  };

  const handleLocateVehicle = () => {
    panTo(vehicleCoord);
  };

  const handleFitBoth = () => {
    if (driverCoord) {
      fitBounds([
        Math.min(vehicleCoord.lng, driverCoord.lng),
        Math.min(vehicleCoord.lat, driverCoord.lat),
        Math.max(vehicleCoord.lng, driverCoord.lng),
        Math.max(vehicleCoord.lat, driverCoord.lat),
      ] as [number, number, number, number], { padding: 80 });
    } else {
      // Jika lokasi driver belum ada, coba minta lokasi lalu fit
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setDriverCoord(coords);
            fitBounds([
              Math.min(vehicleCoord.lng, coords.lng),
              Math.min(vehicleCoord.lat, coords.lat),
              Math.max(vehicleCoord.lng, coords.lng),
              Math.max(vehicleCoord.lat, coords.lat),
            ] as [number, number, number, number], { padding: 80 });
          },
          () => panTo(vehicleCoord), // Fallback: pan ke kendaraan saja
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } else {
        panTo(vehicleCoord);
      }
    }
  };

  const Sep = () => <div className="w-px bg-border shrink-0 self-stretch my-0.5" />;

  const IconBtn = ({ icon: Icon, title, onClick }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="flex items-center justify-center w-7 h-7 rounded-md transition-all duration-150 shrink-0 text-foreground-muted hover:bg-surface hover:text-foreground"
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <>
      <div className="absolute top-4 right-4 z-20 flex items-center bg-background rounded-xl border border-border shadow-lg p-0.5 gap-0.5 flex-row pointer-events-auto h-8">
        <div className="flex items-center justify-center h-full">
          <BasemapSwitcher
            value={basemap}
            onChange={setBasemap}
            compact
            className="flex items-center h-full text-foreground-muted"
          />
        </div>
        <Sep />
        <IconBtn
          icon={Crosshair}
          title="Fokus ke semua"
          onClick={handleFitBoth}
        />
        <Sep />
        <IconBtn
          icon={MapPin}
          title="Fokus ke target"
          onClick={handleLocateVehicle}
        />
        <Sep />
        <IconBtn
          icon={LocateFixed}
          title="Fokus ke posisi saya"
          onClick={handleLocateMe}
        />
      </div>
    </>
  );
}

// ─── VEHICLES TAB ─────────────────────────────────────────────────────────────
function VehiclesTab() {
  const vehicleCoord = { lat: -6.3012106, lng: 106.3518623 };
  const VEHICLE_ADDRESS = 'M9W2+JGC, Jl. Kp. Bojot, Kec. Jawilan, Kabupaten Serang, Banten 42177';

  const [driverCoord, setDriverCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [basemap, setBasemap] = useState<BasemapId>('standard');
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  const [showSosForm, setShowSosForm] = useState(false);
  const [sosCategory, setSosCategory] = useState('');
  const [sosDescription, setSosDescription] = useState('');

  useEffect(() => {
    if (!driverCoord) return;
    const rad = Math.PI / 180;
    const dLat = (driverCoord.lat - vehicleCoord.lat) * rad;
    const dLng = (driverCoord.lng - vehicleCoord.lng) * rad;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(vehicleCoord.lat * rad) * Math.cos(driverCoord.lat * rad) * Math.sin(dLng / 2) ** 2;
    setDistance(Math.round(6371e3 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
  }, [driverCoord]);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${vehicleCoord.lat},${vehicleCoord.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-200">
      {/* MAP – fills all space except bottom card */}
      <div className="relative flex-1 min-h-0 bg-slate-900">
        <MapProvider>
          <MapContainer
            viewport={{ center: vehicleCoord, zoom: 17 }}
            basemap={basemap}
            className="w-full h-full"
          >
            {/* ── Vehicle marker: exact same style as /tracking EntityMarker ── */}
            <MapMarker id="v1" position={vehicleCoord} heading={0}>
              <div className="relative flex flex-col items-center pointer-events-auto">
                {/* Signal ping */}
                <div
                  className="absolute top-3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full blur-[2px] animate-ping opacity-10"
                  style={{ backgroundColor: '#ef4444', animationDuration: '3s' }}
                />
                {/* Arrow – rotated 250° like the dummy heading */}
                <div className="relative transition-transform duration-300 z-10" style={{ transform: 'rotate(250deg)' }}>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 drop-shadow-md"
                    style={{ fill: '#ef4444', stroke: '#ffffff', strokeWidth: 1.25, strokeLinejoin: 'round' }}
                  >
                    <path d="M12 2L21 21L12 17L3 21L12 2Z" />
                  </svg>
                </div>
                {/* Label pill */}
                <div className="mt-0.5 px-1.5 py-[2px] whitespace-nowrap rounded shadow text-[9px] font-bold tracking-wider uppercase leading-none bg-black text-white border border-black/20">
                  B 1001 GHI
                </div>
              </div>
            </MapMarker>

            {/* ── Driver location marker: sleek blue dot ── */}
            {driverCoord && (
              <MapMarker id="driver-pos" position={driverCoord} heading={0}>
                <div className="flex flex-col items-center pointer-events-none mt-1">
                  {/* Glowing Location Dot */}
                  <div className="relative flex items-center justify-center w-8 h-8">
                    {/* Ping animation */}
                    <div className="absolute w-10 h-10 bg-blue-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
                    {/* Outer soft glow */}
                    <div className="absolute w-5 h-5 bg-blue-500/20 rounded-full" />
                    {/* Core blue dot with thick white border */}
                    <div className="relative w-3.5 h-3.5 bg-blue-500 rounded-full border-[2.5px] border-white shadow-sm z-10" />
                  </div>
                  {/* Label pill (Matched to Vehicle) */}
                  <div className="px-1.5 py-[2px] whitespace-nowrap rounded shadow text-[9px] font-bold tracking-wider uppercase leading-none bg-black text-white border border-black/20">
                    Saya
                  </div>
                </div>
              </MapMarker>
            )}
          </MapContainer>

          {/* Controls inside MapProvider for map context access */}
          <VehicleFinderControls
            driverCoord={driverCoord}
            setDriverCoord={setDriverCoord}
            vehicleCoord={vehicleCoord}
            basemap={basemap}
            setBasemap={setBasemap}
          />
        </MapProvider>

        {/* ── VEHICLE INFO OVERLAY (FLOATING COMPACT CARD) ── */}
        {showVehicleInfo && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:w-96 z-50 animate-in slide-in-from-bottom-4 fade-in duration-200">
            <div className="bg-background w-full rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-border p-4 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex flex-col items-start gap-1.5">
                  <div className="px-2.5 py-1 rounded shadow-sm text-xs font-bold tracking-wider uppercase leading-none bg-black text-white border border-black/20">
                    B 1001 GHI
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Hino • Truk Engkel Box</p>
                </div>
                <button
                  onClick={() => setShowVehicleInfo(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Tutup"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-border" />

              {/* Compact Specs Grid */}
              <div className="bg-muted rounded-xl p-3 grid grid-cols-3 gap-y-3 gap-x-2 border border-border">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Grup</span>
                  <span className="text-[11px] font-semibold text-foreground truncate" title="Logistik Jakarta">Logistik JKT</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Warna</span>
                  <span className="text-[11px] font-semibold text-foreground truncate">Putih</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">No. Aset</span>
                  <span className="text-[11px] font-semibold text-foreground truncate">AST-09921</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Kapasitas</span>
                  <span className="text-[11px] font-semibold text-foreground truncate">7684 CC</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Tahun</span>
                  <span className="text-[11px] font-semibold text-foreground truncate">2022</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Status Mesin</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-500 leading-none">AKTIF</span>
                  </div>
                </div>
              </div>

              {/* SOS Button */}
              <button
                onClick={() => {
                  setShowVehicleInfo(false);
                  setShowSosForm(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white text-[11px] font-bold tracking-wide transition-all shadow-sm shadow-red-500/20 active:scale-[0.98]"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                LAPORKAN DARURAT
              </button>
            </div>
          </div>
        )}
        {/* ── SOS FORM OVERLAY ── */}
        {showSosForm && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:w-96 z-[200] animate-in slide-in-from-bottom-4 fade-in duration-200">
            <div className="bg-background w-full rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-border p-4 pb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Laporan Darurat
                </h3>
                <button
                  onClick={() => setShowSosForm(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Kategori Insiden */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground">Kategori <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'kerusakan', label: 'Kerusakan', icon: Wrench },
                      { id: 'kehilangan', label: 'Kehilangan', icon: ShieldAlert },
                      { id: 'kecelakaan', label: 'Kecelakaan', icon: AlertTriangle },
                      { id: 'lainnya', label: 'Lainnya', icon: CircleHelp },
                    ].map(cat => {
                      const Icon = cat.icon;
                      const isActive = sosCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSosCategory(cat.id)}
                          className={cn(
                            "flex flex-col items-center justify-center gap-1 py-1.5 rounded-lg border transition-all",
                            isActive
                              ? "bg-red-500 text-white border-red-500 shadow-sm"
                              : "bg-muted border-border text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[9px] font-bold tracking-wider uppercase">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-foreground">Deskripsi</label>
                  <textarea
                    value={sosDescription}
                    onChange={(e) => setSosDescription(e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-red-500 focus:bg-background outline-none resize-none h-24 placeholder:text-muted-foreground"
                    placeholder="Detail kejadian singkat..."
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setShowSosForm(false)}
                    className="flex-1 h-8 rounded-lg bg-background border border-border hover:bg-muted text-foreground text-[11px] font-bold tracking-wide transition-all shadow-sm active:scale-[0.98]"
                  >
                    BATAL
                  </button>
                  <button
                    disabled={!sosCategory}
                    onClick={() => {
                      alert('Laporan Darurat Terkirim!');
                      setShowSosForm(false);
                      setSosCategory('');
                      setSosDescription('');
                    }}
                    className="flex-1 h-8 rounded-lg bg-red-500 hover:bg-red-600 disabled:bg-muted disabled:text-muted-foreground text-white text-[11px] font-bold tracking-wide transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    KIRIM
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM CARD ── */}
      <div className="flex-none w-full bg-card border-t border-border px-3 py-2 flex items-center gap-2 relative z-50">
        <button
          onClick={() => {
            setShowVehicleInfo(!showVehicleInfo);
            if (!showVehicleInfo) setShowSosForm(false); // hide SOS when toggling on Vehicle Info
          }}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-none transition-all shadow-sm",
            showVehicleInfo
              ? "bg-amber-500 text-white hover:bg-amber-600 ring-2 ring-amber-500/20 ring-offset-1"
              : "bg-amber-400 text-white hover:bg-amber-500"
          )}
          title="Info Kendaraan"
        >
          <Info className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-[11px] text-muted-foreground truncate">{VEHICLE_ADDRESS}</p>
          {distance !== null && (
            <p className="text-[10px] text-red-500 font-semibold mt-0 flex items-center gap-1">
              <Footprints className="w-3 h-3" />
              {distance < 1000 ? `${distance} m dari Anda` : `${(distance / 1000).toFixed(1)} km dari Anda`}
            </p>
          )}
        </div>

        <div className="flex-none">
          <button
            onClick={openGoogleMaps}
            className="flex items-center justify-center h-8 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold text-xs transition-colors gap-1.5"
            title="Navigasi ke Google Maps"
          >
            <Navigation className="w-3.5 h-3.5" />
            Navigasi
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ATTENDANCE TAB ───────────────────────────────────────────────────────────
function AttendanceTab() {
  const vehicleCoord = { lat: -6.3012106, lng: 106.3518623 }; // Hardcoded vehicle coord
  const geofenceCoord = { lat: -6.3020000, lng: 106.3500000 }; // Mock Geofence

  type Step = 'select_type' | 'locating' | 'too_far' | 'camera' | 'review' | 'done';
  type AttendanceType = 'vehicle' | 'geofence' | 'free' | null;

  const [step, setStep] = useState<Step>('select_type');
  const [attType, setAttType] = useState<AttendanceType>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [detectedGeofence, setDetectedGeofence] = useState<string | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [photo, setPhoto] = useState<string | null>(null);

  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleSelectType = (type: AttendanceType) => {
    setAttType(type);
    if (type === 'free') {
      // Murni mengambil GPS tanpa batasan jarak
      setCurrentAddress('-6.2088, 106.8456 (Jl. Merdeka No. 1)');
      setStep('camera');
      return;
    }
    setStep('locating');
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const targetCoord = type === 'vehicle' ? vehicleCoord : geofenceCoord;

          // Haversine formula
          const rad = Math.PI / 180;
          const dLat = (lat - targetCoord.lat) * rad;
          const dLng = (lng - targetCoord.lng) * rad;
          const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(targetCoord.lat * rad) * Math.cos(lat * rad) * Math.sin(dLng / 2) ** 2;
          const dist = Math.round(6371e3 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

          setDistance(dist);
          setCurrentAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)} (Jl. Pahlawan, Tangerang)`);

          if (dist <= 200) {
            if (type === 'geofence') setDetectedGeofence('Pool Utama Balaraja');
            else if (type === 'vehicle') setDetectedGeofence('B 1234 CD');
            else setDetectedGeofence(null);
            setStep('camera');
          } else {
            setDetectedGeofence(null);
            setStep('too_far');
          }
        },
        () => {
          alert('Gagal mendapatkan lokasi GPS. Pastikan izin lokasi aktif.');
          setStep('select_type');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('Browser Anda tidak mendukung Geolocation.');
      setStep('select_type');
    }
  };

  const initCamera = async () => {
    stopCamera();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error(err);
      alert('Gagal mengakses kamera. Periksa izin browser.');
    }
  };

  useEffect(() => {
    if (step === 'camera') {
      initCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [step, facingMode]);

  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Dapatkan ukuran tampilan aktual di layar
      const displayWidth = video.clientWidth;
      const displayHeight = video.clientHeight;

      // Dapatkan resolusi asli video dari kamera
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      // Hitung rasio untuk melakukan crop tengah (meniru object-cover)
      const displayRatio = displayWidth / displayHeight;
      const videoRatio = videoWidth / videoHeight;

      let drawWidth = videoWidth;
      let drawHeight = videoHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (videoRatio > displayRatio) {
        // Video lebih lebar (landscape) -> potong kiri-kanan
        drawWidth = videoHeight * displayRatio;
        offsetX = (videoWidth - drawWidth) / 2;
      } else {
        // Video lebih tinggi -> potong atas-bawah
        drawHeight = videoWidth / displayRatio;
        offsetY = (videoHeight - drawHeight) / 2;
      }

      // Atur ukuran canvas sama dengan tampilan di layar
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Gambar video yang sudah di-crop ke canvas
        ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight, 0, 0, displayWidth, displayHeight);

        // Watermark Data
        const timestamp = new Date().toLocaleString('id-ID', {
          day: 'numeric', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', second: '2-digit'
        }) + ' WIB';

        let typeStr = 'Mulai / Selesai Tugas';
        if (attType === 'geofence') typeStr = 'Absen Geofence';
        if (attType === 'free') typeStr = 'Tiba Di Tujuan';

        let infoStr = '';
        if (detectedGeofence && attType === 'vehicle') infoStr = detectedGeofence;
        else if (detectedGeofence && attType === 'geofence') infoStr = detectedGeofence;

        const coordStr = currentAddress || 'Lokasi tidak diketahui';

        const line1 = infoStr ? `${typeStr} • ${infoStr}` : typeStr;
        const line2 = `Lokasi: ${coordStr}`;
        const line3 = `Waktu: ${timestamp}`;

        // Watermark Styling
        const fontSize = Math.max(10, Math.floor(canvas.width / 26));
        const padding = Math.floor(fontSize * 1.2);
        const lineHeight = fontSize * 1.5;
        const rectHeight = (lineHeight * 3) + (padding * 1.5);

        // Draw Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, canvas.height - rectHeight, canvas.width, rectHeight);

        // Draw Texts
        ctx.textBaseline = 'top';
        let y = canvas.height - rectHeight + padding;
        const maxWidth = canvas.width - (padding * 2);

        // Line 1: Type & Info
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = '#4ade80'; // Emerald 400
        ctx.fillText(line1, padding, y, maxWidth);

        // Line 2: Coords
        y += lineHeight;
        ctx.font = `${Math.floor(fontSize * 0.9)}px sans-serif`;
        ctx.fillStyle = '#e4e4e7'; // Zinc 200
        ctx.fillText(line2, padding, y, maxWidth);

        // Line 3: Timestamp
        y += lineHeight;
        ctx.fillStyle = '#fde047'; // Yellow 300
        ctx.fillText(line3, padding, y, maxWidth);

        // Logo ADATRACK dari SVG Asli
        const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 170" width="1024" height="170">
          <g fill="#dc2626">
            <path d="M 89.013 43.678 C 83.453 44.847, 80.240 48.393, 73.315 61 C 71.654 64.025, 69.328 68.188, 68.147 70.250 C 66.966 72.313, 65.047 75.688, 63.883 77.750 C 62.719 79.813, 61.013 82.625, 60.092 84 C 59.172 85.375, 57.128 88.975, 55.549 92 C 53.971 95.025, 49.213 103.575, 44.975 111 C 33.719 130.720, 32.670 132.936, 34.295 133.560 C 35.040 133.846, 39.855 133.949, 44.994 133.790 L 54.338 133.500 57.990 127.500 C 59.999 124.200, 63.162 118.575, 65.019 115 C 66.876 111.425, 69.138 107.375, 70.045 106 C 70.952 104.625, 73.113 100.912, 74.847 97.750 C 86.419 76.644, 94.246 63.745, 95.481 63.743 C 96.021 63.742, 97.192 65.037, 98.084 66.621 C 98.975 68.204, 102.471 74.123, 105.852 79.774 C 109.233 85.424, 112 90.339, 112 90.695 C 112 91.051, 112.610 92.053, 113.356 92.921 C 114.102 93.790, 116.287 97.425, 118.212 101 C 125.267 114.104, 128.346 119.559, 130.153 122.154 C 131.169 123.614, 132 125.086, 132 125.424 C 132 125.763, 133.131 127.831, 134.513 130.020 L 137.025 134 147.513 134 C 159.551 134, 159.651 133.899, 155.125 126.316 C 153.544 123.667, 150.207 117.900, 147.709 113.500 C 145.211 109.100, 142.071 103.700, 140.732 101.500 C 139.392 99.300, 132.077 86.551, 124.475 73.168 C 108.601 45.225, 107.444 43.939, 97.755 43.463 C 94.315 43.294, 90.381 43.391, 89.013 43.678" />
            <path d="M 172.947 44.750 C 172.532 50.618, 172.835 70.168, 173.349 70.682 C 173.727 71.061, 175.716 69.795, 177.768 67.870 C 183.904 62.116, 184.625 61.999, 213.797 62.015 C 243.183 62.032, 245.636 62.412, 252.263 67.975 C 258.534 73.240, 260.402 78.018, 260.290 88.500 C 260.174 99.334, 258.748 103.134, 252.710 108.700 C 245.722 115.141, 241.239 116, 214.596 116 L 192 116 192 97 L 192 78 182.533 78 L 173.066 78 172.783 103.750 C 172.627 117.912, 172.826 130.512, 173.225 131.750 L 173.950 134 205.887 134 C 229.731 134, 239.757 133.630, 245.452 132.540 C 265.679 128.671, 278.740 114.054, 280.587 93.225 C 282.588 70.648, 271.190 53.148, 249.782 45.928 C 244.559 44.167, 240.979 44, 208.532 44 C 188.989 44, 172.976 44.337, 172.947 44.750" />
            <path d="M 339.500 43.930 C 335.830 44.818, 332.625 46.762, 331.309 48.898 C 329.471 51.882, 315.271 77.457, 311.543 84.500 C 307.947 91.292, 305.696 95.328, 291.538 120.365 C 287.435 127.620, 285.188 132.588, 285.753 133.153 C 286.261 133.661, 291.088 133.947, 296.480 133.788 L 306.283 133.500 309.914 127.500 C 311.911 124.200, 315.510 117.675, 317.912 113 C 320.314 108.325, 322.603 104.050, 323 103.500 C 323.687 102.545, 326.977 96.497, 335.780 80 C 343.642 65.267, 344.380 64, 345.104 64 C 345.896 64, 348.031 67.363, 352.720 76 C 354.363 79.025, 357.123 83.882, 358.853 86.794 C 360.584 89.706, 362 92.214, 362 92.369 C 362 92.523, 364.630 97.341, 367.845 103.075 C 376.572 118.641, 378.742 122.531, 381.613 127.750 C 383.051 130.363, 384.738 132.831, 385.363 133.235 C 385.988 133.639, 390.887 133.976, 396.250 133.985 C 407.546 134.002, 407.965 133.519, 403.207 125.946 C 400.549 121.715, 394.211 110.751, 388.786 101 C 386.319 96.564, 384.076 92.613, 379.846 85.250 C 378.661 83.188, 376.116 78.575, 374.191 75 C 366.912 61.487, 359.760 49.420, 357.741 47.248 C 354.295 43.541, 346.769 42.172, 339.500 43.930" />
            <path d="M 685.881 40.750 C 682 48.862, 676.448 60.450, 673.543 66.500 C 670.637 72.550, 667.118 79.975, 665.723 83 C 664.328 86.025, 660.052 95.025, 656.221 103 C 646.227 123.806, 642 133.048, 642 134.089 C 642 136.055, 645.697 134.734, 658.339 128.250 C 665.578 124.537, 671.725 121.270, 672 120.989 C 672.275 120.709, 677.347 118.009, 683.271 114.989 L 694.042 109.500 702.271 113.845 C 740.539 134.053, 746 136.627, 746 134.452 C 746 134.150, 743.924 129.538, 741.387 124.202 C 738.850 118.866, 734.633 109.775, 732.016 104 C 729.399 98.225, 724.275 87.341, 720.629 79.813 C 716.983 72.285, 714 65.916, 714 65.659 C 714 64.103, 694.690 26, 693.901 26 C 693.370 26, 689.761 32.638, 685.881 40.750" />
          </g>
          <g fill="#ffffff">
            <path d="M 403.337 45.564 C 402.196 48.539, 403.882 57.326, 406.002 59.449 C 407.889 61.339, 409.464 61.525, 426.013 61.813 L 443.975 62.126 444.237 97.813 L 444.500 133.500 453.750 133.788 L 463 134.075 463 98.038 L 463 62 479.032 62 C 501.381 62, 504 60.696, 504 49.566 L 504 44 453.969 44 C 409.504 44, 403.870 44.174, 403.337 45.564" />
            <path d="M 518 49.512 C 518 56.160, 519.040 58.452, 522.980 60.490 C 525.413 61.748, 531.439 62, 559.050 62 L 592.200 62 595.600 65.400 C 598.554 68.354, 599 69.452, 599 73.765 C 599 79.041, 596.862 82.907, 592.672 85.204 C 591.135 86.046, 580.151 86.473, 555.119 86.662 C 535.659 86.809, 519.459 87.207, 519.119 87.548 C 518.232 88.434, 518.059 131.477, 518.937 132.898 C 519.436 133.705, 522.511 133.990, 528.585 133.791 L 537.500 133.500 537.776 118.852 C 538.044 104.641, 538.119 104.188, 540.276 103.683 C 541.499 103.397, 549.700 103.291, 558.500 103.448 L 574.500 103.734 580.500 111.745 C 583.800 116.152, 588.750 122.849, 591.501 126.629 L 596.501 133.500 607.751 133.783 C 615.145 133.969, 619 133.704, 619 133.012 C 619 132.036, 612.562 123.304, 600.838 108.376 L 596.028 102.252 600.472 101.008 C 606.316 99.372, 612.441 94.009, 615.743 87.638 C 617.959 83.361, 618.413 81.159, 618.448 74.500 C 618.519 61.129, 613.257 52.862, 601 47.090 L 595.500 44.500 556.750 44.196 L 518 43.892 518 49.512" />
            <path d="M 689.274 125.274 C 686.950 127.048, 682.342 130.525, 679.035 133 C 669.045 140.474, 671.196 141.876, 685.173 137.002 L 693.770 134.003 703.419 137.496 C 711.656 140.478, 713.154 140.763, 713.659 139.446 C 713.985 138.598, 713.566 137.363, 712.728 136.702 C 711.890 136.041, 707.365 132.463, 702.672 128.750 C 697.979 125.037, 693.995 122.011, 693.820 122.024 C 693.644 122.038, 691.598 123.500, 689.274 125.274" />
            <path d="M 799.265 45.542 C 781.678 50.278, 770.478 63.204, 767.848 81.800 C 764.333 106.658, 777.869 128.303, 799.799 132.891 C 803.011 133.563, 817.144 134, 835.669 134 L 866.240 134 865.804 127.961 C 865.478 123.455, 864.806 121.361, 863.158 119.711 C 861.013 117.563, 860.156 117.485, 833.225 116.982 C 802.042 116.399, 799.629 115.897, 793.293 108.681 C 782.666 96.577, 786.327 71.024, 799.634 64.419 C 803.087 62.705, 806.525 62.447, 831.834 62 L 860.167 61.500 863.084 58.234 C 865.554 55.468, 866 54.130, 866 49.484 L 866 44 835.250 44.066 C 812.104 44.115, 803.205 44.480, 799.265 45.542" />
            <path d="M 880 89 L 880 134 889.500 134 L 899 134 899 112.930 L 899 91.860 908.425 99.680 C 913.608 103.981, 925.066 113.463, 933.887 120.750 L 949.925 134 963.462 134 C 970.908 134, 976.973 133.662, 976.941 133.250 C 976.879 132.458, 976.570 132.200, 943.280 105.099 L 922.060 87.825 938.280 75.157 C 947.201 68.190, 959.337 58.750, 965.250 54.179 C 971.163 49.608, 976 45.448, 976 44.934 C 976 44.401, 970.308 44.007, 962.750 44.015 L 949.500 44.030 940.500 51.093 C 935.550 54.978, 924.632 63.633, 916.237 70.328 C 907.842 77.023, 900.530 82.650, 899.987 82.833 C 899.360 83.045, 899 76.025, 899 63.583 L 899 44 889.500 44 L 880 44 880 89" />
          </g>
        </svg>`;

        const img = new Image();
        img.src = 'data:image/svg+xml;base64,' + btoa(svgStr);
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        // Gambar Logo (Pojok Kanan Atas)
        const logoWidth = Math.floor(canvas.width * 0.25); // 25% dari lebar canvas
        const logoHeight = Math.floor(logoWidth * (170 / 1024));
        const topY = padding;
        const rightPad = padding;

        // Kembalikan efek bayangan (drop shadow) agar lebih natural dan tidak menutupi foto
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 6;

        ctx.drawImage(img, canvas.width - rightPad - logoWidth, topY, logoWidth, logoHeight);

        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.font = `bold italic ${Math.floor(fontSize * 0.75)}px sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Verified GPS', canvas.width - rightPad, topY + logoHeight + (padding * 0.3));

        // Reset shadow
        ctx.shadowBlur = 0;

        setPhoto(canvas.toDataURL('image/jpeg'));
        setStep('review');
      }
    }
  };

  const handleSubmit = () => {
    setStep('done');
  };

  return (
    <div className="h-full overflow-y-auto bg-background relative flex flex-col">
      <div className="p-4 w-full max-w-sm mx-auto flex-1 flex flex-col justify-center animate-in fade-in duration-200 pb-20">

        {step === 'select_type' && (
          <div className="space-y-4 pt-2">
            <button
              onClick={() => handleSelectType('vehicle')}
              className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 transition-all text-left"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center flex-none">
                <Truck className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-foreground">Mulai / Selesai Tugas</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">Wajib berada di dekat kendaraan (&lt; 200m).</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectType('geofence')}
              className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 transition-all text-left"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center flex-none">
                <MapPinned className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-foreground">Absen Geofence</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">Wajib berada di dalam zona lokasi yang terdaftar.</p>
              </div>
            </button>

            <button
              onClick={() => handleSelectType('free')}
              className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-4 transition-all text-left"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center flex-none">
                <MapPin className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-foreground">Laporan Tiba di Tujuan</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">Absen lokasi bebas tanpa syarat jarak Geofence.</p>
              </div>
            </button>
          </div>
        )}

        {step === 'locating' && (
          <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-muted border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="text-[11px] font-bold text-muted-foreground animate-pulse">Memverifikasi lokasi...</p>
          </div>
        )}

        {step === 'too_far' && (
          <div className="bg-card border border-border rounded-2xl p-5 text-center space-y-4 animate-in slide-in-from-bottom-4">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-red-500 mb-2">
                {attType === 'vehicle' ? 'Terlalu Jauh' : 'Di Luar Geofence'}
              </h2>
              <p className="text-xs text-muted-foreground px-2 leading-relaxed">
                {attType === 'vehicle' ? (
                  <>Jarak Anda dengan kendaraan saat ini adalah <strong className="text-foreground">{distance} meter</strong>. Anda harus berada dalam radius 200 meter untuk bisa absen.</>
                ) : (
                  <>Lokasi Anda saat ini berada <strong className="text-foreground">{distance} meter</strong> dari Geofence terdekat. Anda harus masuk ke area Geofence.</>
                )}
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleSelectType(attType)}
                className="w-full py-2.5 mt-2 bg-muted text-foreground text-sm font-bold rounded-xl hover:bg-muted/80 transition-all"
              >
                Cek Ulang Lokasi
              </button>
              <button
                onClick={() => {
                  if (attType === 'geofence') setDetectedGeofence('Pool Utama Balaraja');
                  else if (attType === 'vehicle') setDetectedGeofence('B 1234 CD');
                  setCurrentAddress('-6.3012, 106.3518 (Jl. Raya Serang)');
                  setStep('camera');
                }}
                className="w-full py-2 text-xs font-semibold text-blue-500 hover:text-blue-600 transition-all"
              >
                Simulasikan Jarak Dekat (Demo Mode)
              </button>
              <button
                onClick={() => setStep('select_type')}
                className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
              >
                Kembali ke Menu
              </button>
            </div>
          </div>
        )}

        {step === 'camera' && (
          <div className="flex flex-col h-full space-y-3 animate-in zoom-in-95 mt-4">
            <div className="text-center">
              <h2 className="text-sm font-extrabold text-foreground">Validasi Wajah</h2>
              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                {attType === 'free' ? (
                  <span className="text-emerald-500 font-bold">Tiba Di Tujuan</span>
                ) : (
                  <><span className="text-emerald-500">{distance}m (Aman)</span></>
                )}
                {detectedGeofence && <> • <span className="text-blue-500 font-bold">{detectedGeofence}</span></>}
                <br />
                <span className="text-[9px] font-normal">{currentAddress}</span>
              </p>
            </div>
            <div className="relative flex-1 bg-black rounded-xl overflow-hidden min-h-[300px]">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                autoPlay
                muted
              />
              <button
                onClick={() => setFacingMode(prev => prev === 'user' ? 'environment' : 'user')}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 backdrop-blur text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                title="Ganti Kamera"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            </div>
            <div className="pt-1 pb-4 flex flex-col items-center gap-3">
              <button
                onClick={handleCapture}
                className="w-14 h-14 bg-red-500/20 rounded-full flex items-center justify-center border-4 border-red-500/50 hover:bg-red-500/30 transition-all"
              >
                <div className="w-10 h-10 bg-red-600 rounded-full" />
              </button>
              <button
                onClick={() => { setStep('select_type'); setPhoto(null); setDetectedGeofence(null); setCurrentAddress(null); }}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Ganti Pilihan Absen
              </button>
            </div>
          </div>
        )}

        {step === 'review' && photo && (
          <div className="flex flex-col h-full space-y-3 animate-in fade-in mt-4">
            <div className="text-center">
              <h2 className="text-sm font-extrabold text-foreground">Konfirmasi Absensi</h2>
              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                {detectedGeofence
                  ? (attType === 'vehicle' ? `Kendaraan: ${detectedGeofence}` : `Lokasi: ${detectedGeofence}`)
                  : 'Pastikan wajah terlihat jelas.'}
                <br />
                <span className="text-[9px] font-normal text-muted-foreground/70">{currentAddress}</span>
              </p>
            </div>
            <div className="flex-1 bg-black rounded-xl overflow-hidden border border-border min-h-[300px] flex items-center justify-center">
              <img src={photo} alt="Selfie Absensi" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex gap-2 pb-4">
              <button
                onClick={() => setStep('camera')}
                className="flex-1 py-3 bg-muted text-foreground text-xs font-bold rounded-xl hover:bg-muted/80 transition-all"
              >
                Ulangi
              </button>
              <button
                onClick={handleSubmit}
                className="flex-[2] py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                Kirim
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="bg-card border border-border rounded-2xl p-5 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-emerald-500" />
            </div>
            <div>
              <p className="font-extrabold text-lg text-foreground mb-0.5">Berhasil Dikirim</p>
              <p className="text-[11px] font-medium text-muted-foreground mt-1">Pukul {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
              {detectedGeofence && (
                <div className="inline-block px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[9px] font-bold mt-1">
                  {detectedGeofence}
                </div>
              )}
              {currentAddress && (
                <div className="text-[9px] text-muted-foreground leading-tight px-4 mt-2">
                  <MapPin className="w-2.5 h-2.5 inline-block mr-0.5" /> {currentAddress}
                </div>
              )}
            </div>
            <div className="pt-2">
              <button
                onClick={() => { setStep('select_type'); setPhoto(null); setDetectedGeofence(null); setCurrentAddress(null); }}
                className="w-full py-2.5 bg-muted text-foreground rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-muted/80 transition-colors"
              >
                Tutup & Kembali
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}


// ─── MESSAGES TAB ─────────────────────────────────────────────────────────────
function MessagesTab() {
  const MESSAGES = [
    {
      id: 1,
      type: 'service',
      title: 'Peringatan Jadwal Servis',
      content: 'Kendaraan Anda (B 1234 CD) telah mendekati batas jarak tempuh servis 10.000 KM. Silakan jadwalkan perawatan secepatnya.',
      date: 'Hari ini, 09:15',
      read: false
    },
    {
      id: 2,
      type: 'announcement',
      title: 'Pengumuman Perusahaan',
      content: 'Mengingatkan kembali kepada seluruh pengemudi untuk mematuhi batas kecepatan maksimal 80 KM/jam di jalan tol. Keselamatan adalah prioritas utama.',
      date: 'Kemarin, 14:30',
      read: false
    },
    {
      id: 3,
      type: 'alert',
      title: 'Peringatan Batas Kecepatan',
      content: 'Anda terdeteksi melaju di atas batas kecepatan 90 KM/jam pada ruas Tol Dalam Kota. Harap kurangi kecepatan Anda segera.',
      date: '08 Okt 2026',
      read: true
    },
    {
      id: 4,
      type: 'announcement',
      title: 'Pembaruan Sistem ADATRACK',
      content: 'Aplikasi portal pengemudi telah diperbarui. Kini Anda dapat melihat rincian riwayat perjalanan langsung dari ponsel Anda tanpa hambatan.',
      date: '05 Okt 2026',
      read: true
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="px-6 py-5 md:px-8 md:py-6 space-y-4 max-w-screen-md mx-auto animate-in fade-in duration-200 pb-24">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-extrabold text-foreground tracking-tight">Kotak Masuk</h2>
          <button className="text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors">Tandai Semua Dibaca</button>
        </div>

        <div className="space-y-3">
          {MESSAGES.map((msg) => {
            let Icon = Info;
            let iconColor = "text-blue-500";
            let bgIconColor = "bg-blue-500/10";

            if (msg.type === 'service') {
              Icon = Wrench;
              iconColor = "text-amber-500";
              bgIconColor = "bg-amber-500/10";
            } else if (msg.type === 'alert') {
              Icon = AlertTriangle;
              iconColor = "text-red-500";
              bgIconColor = "bg-red-500/10";
            } else if (msg.type === 'announcement') {
              Icon = MessageSquareText;
              iconColor = "text-blue-500";
              bgIconColor = "bg-blue-500/10";
            }

            return (
              <button
                key={msg.id}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group",
                  msg.read ? "bg-transparent border-border/60 hover:bg-muted/30" : "bg-card border-border shadow-sm hover:shadow-md"
                )}
              >
                {!msg.read && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />
                )}
                <div className="flex items-start gap-3.5">
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-none mt-0.5", bgIconColor, iconColor)}>
                    <Icon className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 pr-4">
                    <h3 className={cn("text-xs leading-none mb-1.5", msg.read ? "font-bold text-foreground/80" : "font-extrabold text-foreground")}>
                      {msg.title}
                    </h3>
                    <p className={cn("text-[11px] leading-snug line-clamp-2", msg.read ? "text-muted-foreground/80" : "text-muted-foreground")}>
                      {msg.content}
                    </p>
                    <div className="mt-2 text-[9px] font-bold text-muted-foreground/60 tracking-wider">
                      {msg.date}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
