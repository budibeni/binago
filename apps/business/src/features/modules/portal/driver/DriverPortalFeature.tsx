'use client';

import React, { useState, useEffect } from 'react';
import {
  ClipboardList, Truck, UserCheck, AlertTriangle,
  MapPin, Clock, Camera, Map, Footprints,
  ChevronRight, User, Navigation, Layers, Info, X,
  Wrench, ShieldAlert, MessageSquareText, Power, MapPinned, Route,
  RefreshCcw, CheckCircle2, CircleHelp
} from 'lucide-react';
import { cn, applyPhotoWatermark } from '@adatrack/utils';
import { VehicleFinderMap } from '@adatrack/maps';
import { useBusinessLocale } from '@/components/BusinessShellLayout';
import { getDriverPortalTranslation } from './i18n';

export function DriverPortalFeature() {
  const locale = useBusinessLocale();
  const t = getDriverPortalTranslation(locale);
  const [activeTab, setActiveTab] = useState('vehicles');

  const TABS = [
    { id: 'history', label: t.tabs.history, icon: Clock },
    { id: 'vehicles', label: t.tabs.vehicles, icon: Map },
    { id: 'attendance', label: t.tabs.attendance, icon: UserCheck },
    { id: 'messages', label: t.tabs.messages, icon: MessageSquareText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'vehicles': return <VehiclesTab locale={locale} />;
      case 'history': return <HistoryTab locale={locale} />;
      case 'attendance': return <AttendanceTab locale={locale} />;
      case 'messages': return <MessagesTab locale={locale} />;
      default: return <VehiclesTab locale={locale} />;
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
function HistoryTab({ locale }: { locale: 'id' | 'en' }) {
  const t = getDriverPortalTranslation(locale);
  // Dummy 7-day history data
  const HISTORY = [
    {
      date: t.history.today,
      distance: '12.4 km',
      items: [
        { id: 1, time: '14:30', type: 'off', title: t.history.engineOff, loc: 'Kawasan Industri Jawilan, Banten', geofence: 'Pabrik Cikande' },
        { id: 2, time: '14:15', type: 'park', title: t.history.parkingStart, loc: 'Kawasan Industri Jawilan, Banten', geofence: 'Pabrik Cikande' },
        { id: 3, time: '07:30', type: 'on', title: t.history.engineOn, loc: 'Jl. Raya Serang KM 30, Banten' }, // No geofence
      ]
    },
    {
      date: t.history.yesterday,
      distance: '87.1 km',
      items: [
        { id: 4, time: '18:45', type: 'off', title: t.history.engineOff, loc: 'Pool Utama, Jakarta Barat', geofence: 'Pool Pusat' },
        { id: 5, time: '18:30', type: 'park', title: t.history.parkingStart, loc: 'Pool Utama, Jakarta Barat', geofence: 'Pool Pusat' },
        { id: 6, time: '12:15', type: 'off', title: t.history.engineOff, loc: 'Rest Area KM 42, Tol Jakarta-Cikampek' }, // No geofence
        { id: 61, time: '06:15', type: 'on', title: t.history.engineOn, loc: 'Pool Utama, Jakarta Barat', geofence: 'Pool Pusat' },
      ]
    },
    {
      date: '08 Okt 2026',
      distance: '142.5 km',
      items: [
        { id: 7, time: '17:00', type: 'off', title: t.history.engineOff, loc: 'Perumahan Griya Indah, Bogor' }, // No geofence
        { id: 8, time: '08:00', type: 'on', title: t.history.engineOn, loc: 'Pool Utama, Jakarta Barat', geofence: 'Pool Pusat' },
      ]
    },
    {
      date: '07 Okt 2026',
      distance: '45.0 km',
      items: [
        { id: 9, time: '16:30', type: 'off', title: t.history.engineOff, loc: 'Jl. Merdeka Raya No. 45, Depok' }, // No geofence
        { id: 10, time: '07:15', type: 'on', title: t.history.engineOn, loc: 'Pool Utama, Jakarta Barat', geofence: 'Pool Pusat' },
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
                          title={t.history.mapOpenTitle}
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
            {t.history.loadMore}
          </button>
        </div>

      </div>
    </div>
  );
}

// VehicleFinderControls dihapus – diganti dengan <VehicleFinderMap> dari @adatrack/maps

// ─── VEHICLES TAB ─────────────────────────────────────────────────────────────
function VehiclesTab({ locale }: { locale: 'id' | 'en' }) {
  const t = getDriverPortalTranslation(locale);
  const vehicleCoord = { lat: -6.3012106, lng: 106.3518623 };
  const VEHICLE_ADDRESS = 'M9W2+JGC, Jl. Kp. Bojot, Kec. Jawilan, Kabupaten Serang, Banten 42177';

  const [driverCoord, setDriverCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  const [showSosForm, setShowSosForm] = useState(false);
  const [sosCategory, setSosCategory] = useState('');
  const [sosDescription, setSosDescription] = useState('');

  const handleUserLocation = (coord: { lat: number; lng: number }) => {
    setDriverCoord(coord);
    // Hitung jarak Haversine antara pengemudi dan kendaraan
    const rad = Math.PI / 180;
    const dLat = (coord.lat - vehicleCoord.lat) * rad;
    const dLng = (coord.lng - vehicleCoord.lng) * rad;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(vehicleCoord.lat * rad) * Math.cos(coord.lat * rad) * Math.sin(dLng / 2) ** 2;
    setDistance(Math.round(6371e3 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
  };

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${vehicleCoord.lat},${vehicleCoord.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col w-full h-full animate-in fade-in duration-200">
      {/* MAP – fills all space except bottom card */}
      <div className="relative flex-1 min-h-0">
        <VehicleFinderMap
          targetCoord={vehicleCoord}
          targetLabel="B 1001 GHI"
          targetHeading={250}
          onUserLocationChange={handleUserLocation}
          className="w-full h-full"
        >

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
                  title={t.vehicles.infoClose}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Divider */}
              <div className="h-px w-full bg-border" />

              {/* Compact Specs Grid */}
              <div className="bg-muted rounded-xl p-3 grid grid-cols-3 gap-y-3 gap-x-2 border border-border">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{t.vehicles.group}</span>
                  <span className="text-[11px] font-semibold text-foreground truncate" title="Logistik Jakarta">Logistik JKT</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{t.vehicles.color}</span>
                  <span className="text-[11px] font-semibold text-foreground truncate">Putih</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{t.vehicles.assetNo}</span>
                  <span className="text-[11px] font-semibold text-foreground truncate">AST-09921</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{t.vehicles.capacity}</span>
                  <span className="text-[11px] font-semibold text-foreground truncate">7684 CC</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{t.vehicles.year}</span>
                  <span className="text-[11px] font-semibold text-foreground truncate">2022</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">{t.vehicles.engineStatus}</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-500 leading-none">{t.vehicles.statusActive}</span>
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
                {t.vehicles.reportSos}
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
                  {t.vehicles.emergencyReport}
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
                  <label className="text-[11px] font-semibold text-foreground">{t.vehicles.category} <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'kerusakan', label: t.vehicles.damage, icon: Wrench },
                      { id: 'kehilangan', label: t.vehicles.lost, icon: ShieldAlert },
                      { id: 'kecelakaan', label: t.vehicles.accident, icon: AlertTriangle },
                      { id: 'lainnya', label: t.vehicles.other, icon: CircleHelp },
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
                  <label className="text-[11px] font-semibold text-foreground">{t.vehicles.description}</label>
                  <textarea
                    value={sosDescription}
                    onChange={(e) => setSosDescription(e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg p-2.5 text-xs focus:ring-1 focus:ring-red-500 focus:bg-background outline-none resize-none h-24 placeholder:text-muted-foreground"
                    placeholder={t.vehicles.descPlaceholder}
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setShowSosForm(false)}
                    className="flex-1 h-8 rounded-lg bg-background border border-border hover:bg-muted text-foreground text-[11px] font-bold tracking-wide transition-all shadow-sm active:scale-[0.98]"
                  >
                    {t.vehicles.cancel}
                  </button>
                  <button
                    disabled={!sosCategory}
                    onClick={() => {
                      alert(t.vehicles.sosSuccess);
                      setShowSosForm(false);
                      setSosCategory('');
                      setSosDescription('');
                    }}
                    className="flex-1 h-8 rounded-lg bg-red-500 hover:bg-red-600 disabled:bg-muted disabled:text-muted-foreground text-white text-[11px] font-bold tracking-wide transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-1.5"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {t.vehicles.submit}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </VehicleFinderMap>
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
          title={t.vehicles.vehicleInfo}
        >
          <Info className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0 text-left">
          <p className="text-[11px] text-muted-foreground truncate">{VEHICLE_ADDRESS}</p>
          {distance !== null && (
            <p className="text-[10px] text-red-500 font-semibold mt-0 flex items-center gap-1">
              <Footprints className="w-3 h-3" />
              {distance < 1000 ? `${distance} ${t.vehicles.distMeters}` : `${(distance / 1000).toFixed(1)} ${t.vehicles.distKm}`}
            </p>
          )}
        </div>

        <div className="flex-none">
          <button
            onClick={openGoogleMaps}
            className="flex items-center justify-center h-8 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold text-xs transition-colors gap-1.5"
            title={t.vehicles.navGoogleMap}
          >
            <Navigation className="w-3.5 h-3.5" />
            {t.vehicles.navigation}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ATTENDANCE TAB ───────────────────────────────────────────────────────────
function AttendanceTab({ locale }: { locale: 'id' | 'en' }) {
  const t = getDriverPortalTranslation(locale);

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
          alert(t.attendance.errGpsDesc);
          setStep('select_type');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert(t.attendance.errNoGeo);
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
      alert(t.attendance.errCamera);
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
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Dapatkan ukuran tampilan aktual di layar
    const displayWidth = video.clientWidth;
    const displayHeight = video.clientHeight;
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Hitung crop tengah (object-cover)
    const displayRatio = displayWidth / displayHeight;
    const videoRatio = videoWidth / videoHeight;
    let drawWidth = videoWidth, drawHeight = videoHeight, offsetX = 0, offsetY = 0;
    if (videoRatio > displayRatio) {
      drawWidth = videoHeight * displayRatio;
      offsetX = (videoWidth - drawWidth) / 2;
    } else {
      drawHeight = videoWidth / displayRatio;
      offsetY = (videoHeight - drawHeight) / 2;
    }

    canvas.width = displayWidth;
    canvas.height = displayHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gambar video ke canvas (crop center)
    ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight, 0, 0, displayWidth, displayHeight);

    // Watermark label berdasarkan tipe absensi
    let title = t.attendance.typeStartEnd;
    if (attType === 'geofence') title = t.attendance.typeGeofence;
    if (attType === 'free') title = t.attendance.typeFree;

    const subtitle = detectedGeofence || undefined;
    const location = currentAddress || undefined;

    // Terapkan watermark standar ADATRACK
    await applyPhotoWatermark(ctx, canvas, { title, subtitle, location });

    setPhoto(canvas.toDataURL('image/jpeg', 0.92));
    setStep('review');
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
                <h3 className="font-extrabold text-sm text-foreground">{t.attendance.typeStartEnd}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{t.attendance.typeStartEndDesc}</p>
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
                <h3 className="font-extrabold text-sm text-foreground">{t.attendance.typeGeofence}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{t.attendance.typeGeofenceDesc}</p>
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
                <h3 className="font-extrabold text-sm text-foreground">{t.attendance.typeFree}</h3>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{t.attendance.typeFreeDesc}</p>
              </div>
            </button>
          </div>
        )}

        {step === 'locating' && (
          <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-muted border-t-blue-500 rounded-full animate-spin mx-auto" />
            <p className="text-[11px] font-bold text-muted-foreground animate-pulse">{t.attendance.verifyingLoc}</p>
          </div>
        )}

        {step === 'too_far' && (
          <div className="bg-card border border-border rounded-2xl p-5 text-center space-y-4 animate-in slide-in-from-bottom-4">
            <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-red-500 mb-2">
                {attType === 'vehicle' ? t.attendance.tooFarTitle : t.attendance.outOfGeofenceTitle}
              </h2>
              <p className="text-xs text-muted-foreground px-2 leading-relaxed">
                {attType === 'vehicle' ? (
                  <span dangerouslySetInnerHTML={{ __html: t.attendance.tooFarDescVehicle.replace('{distance}', `<strong class="text-foreground">${distance}</strong>`) }} />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: t.attendance.tooFarDescGeofence.replace('{distance}', `<strong class="text-foreground">${distance}</strong>`) }} />
                )}
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleSelectType(attType)}
                className="w-full py-2.5 mt-2 bg-muted text-foreground text-sm font-bold rounded-xl hover:bg-muted/80 transition-all"
              >
                {t.attendance.recheckLoc}
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
                {t.attendance.simDemo}
              </button>
              <button
                onClick={() => setStep('select_type')}
                className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-all"
              >
                {t.attendance.backToMenu}
              </button>
            </div>
          </div>
        )}

        {step === 'camera' && (
          <div className="flex flex-col h-full space-y-3 animate-in zoom-in-95 mt-4">
            <div className="text-center">
              <h2 className="text-sm font-extrabold text-foreground">{t.attendance.faceValidation}</h2>
              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                {attType === 'free' ? (
                  <span className="text-emerald-500 font-bold">{t.attendance.arrivedDest}</span>
                ) : (
                  <><span className="text-emerald-500">{distance}m ({t.attendance.safe})</span></>
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
                title={t.attendance.changeCam}
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
                {t.attendance.changeChoice}
              </button>
            </div>
          </div>
        )}

        {step === 'review' && photo && (
          <div className="flex flex-col h-full space-y-3 animate-in fade-in mt-4">
            <div className="text-center">
              <h2 className="text-sm font-extrabold text-foreground">{t.attendance.confirmAtt}</h2>
              <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
                {detectedGeofence
                  ? (attType === 'vehicle' ? `${t.attendance.vehicleLabel}: ${detectedGeofence}` : `${t.attendance.locationLabel}: ${detectedGeofence}`)
                  : t.attendance.makeSureFace}
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
                {t.attendance.retry}
              </button>
              <button
                onClick={handleSubmit}
                className="flex-[2] py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all"
              >
                {t.attendance.send}
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
              <p className="font-extrabold text-lg text-foreground mb-0.5">{t.attendance.successSent}</p>
              <p className="text-[11px] font-medium text-muted-foreground mt-1">Pukul {new Date().toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })} {locale === 'id' ? 'WIB' : ''}</p>
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
                {t.attendance.closeBack}
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
function MessagesTab({ locale }: { locale: 'id' | 'en' }) {
  const t = getDriverPortalTranslation(locale);
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
          <h2 className="text-sm font-extrabold text-foreground tracking-tight">{t.messages.inbox}</h2>
          <button className="text-[10px] font-bold text-blue-500 hover:text-blue-600 transition-colors">{t.messages.markAllRead}</button>
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
