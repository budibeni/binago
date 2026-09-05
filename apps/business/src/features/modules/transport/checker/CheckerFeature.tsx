'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@adatrack/ui';
import { Bus, MapPin, Users, Search, LogIn, LogOut, Info, RefreshCw, CheckCircle2, ChevronRight, Map } from 'lucide-react';
import { checkerService } from '@/data/modules/transport/services/checkerService';
import { passengerEventService } from '@/data/modules/transport/services/passengerEventService';
import { geofenceService } from '@/data/services';
import type { Checker } from './types/checker';
import type { PassengerEvent, PassengerEventType } from '../passenger-events/types/passengerEvent';
import type { Departure } from '../departures/types/departure';

const CURRENT_CHECKER_ID = 'chk-001';

type CheckerMode = 'NONE' | 'POINT' | 'ONBOARD';

export function CheckerFeature() {
  const [checker, setChecker] = useState<Checker | undefined>();
  
  // State Flow
  const [mode, setMode] = useState<CheckerMode>('NONE');
  const [isRecording, setIsRecording] = useState(false);
  
  // Selection State
  const [selectedGeofenceId, setSelectedGeofenceId] = useState<string | null>(null);
  const [selectedDeparture, setSelectedDeparture] = useState<Departure | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  
  // Data State
  const [allGeofences, setAllGeofences] = useState<Record<string, any>[]>([]);
  const [busesAtGeofence, setBusesAtGeofence] = useState<Record<string, any>[]>([]);
  const [activeDepartures, setActiveDepartures] = useState<Departure[]>([]);
  
  // Search State
  const [geofenceSearch, setGeofenceSearch] = useState('');
  
  // Form State
  const [updateMode, setUpdateMode] = useState<PassengerEventType>('BOARDING');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [eventHistory, setEventHistory] = useState<PassengerEvent[]>([]);

  useEffect(() => {
    const chk = checkerService.getCheckerById(CURRENT_CHECKER_ID);
    if (chk) setChecker(chk);
    
    setAllGeofences(geofenceService.getGeofences());
    setActiveDepartures(checkerService.getActiveDeparturesForManualSelect());
  }, []);

  // --- Handlers ---
  const handleSelectGeofence = (geoId: string) => {
    setSelectedGeofenceId(geoId);
    setSelectedDeparture(null);
    const buses = checkerService.getBusesAtGeofence(geoId);
    setBusesAtGeofence(buses);
  };

  const handleSelectDeparture = (departure: Departure) => {
    setSelectedDeparture(departure);
    setQuantity('');
    setNote('');
    setError('');
    
    const history = passengerEventService.getEventsByDepartureId(departure.id);
    setEventHistory(history.reverse());
  };

  const handleRefreshBuses = () => {
    if (selectedGeofenceId) {
      const buses = checkerService.getBusesAtGeofence(selectedGeofenceId);
      setBusesAtGeofence(buses);
    }
  };

  const handleSaveEvent = () => {
    if (!selectedDeparture || !checker) return;
    
    // Determine active geofence based on mode
    const activeGeofenceId = mode === 'POINT' ? selectedGeofenceId : selectedStopId;
    
    if (!activeGeofenceId) {
      setError('Lokasi saat ini belum dipilih');
      return;
    }
    
    if (typeof quantity !== 'number' || quantity <= 0) {
      setError('Jumlah harus lebih besar dari 0');
      return;
    }

    try {
      passengerEventService.recordEvent(
        selectedDeparture.id,
        activeGeofenceId,
        updateMode,
        quantity,
        checker.id,
        note
      );
      
      const history = passengerEventService.getEventsByDepartureId(selectedDeparture.id);
      setEventHistory(history.reverse());
      setQuantity('');
      setNote('');
      setError('');
      
      if (mode === 'POINT' && selectedGeofenceId) {
        handleRefreshBuses();
      }
    } catch (e: Error | unknown) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  // --- Filtered Data ---
  const filteredGeofences = allGeofences.filter(g => g.name.toLowerCase().includes(geofenceSearch.toLowerCase()));
  
  const getSelectedGeofenceName = () => {
    if (!selectedGeofenceId) return '';
    return geofenceService.getGeofenceById(selectedGeofenceId)?.name || '';
  };

  // --- RENDERERS ---

  if (mode === 'NONE') {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-foreground mb-3">Pilih Mode Operasional</h1>
          <p className="text-foreground-muted">Pilih mode sesuai lokasi dan tugas Anda saat ini</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Point Mode Card */}
          <Card className="p-8 border-2 hover:border-danger hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center group" onClick={() => setMode('POINT')}>
            <div className="w-24 h-24 rounded-full bg-danger text-white flex items-center justify-center mb-6 shadow-md shadow-danger/30 group-hover:scale-110 transition-transform">
              <MapPin className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-danger mb-4">POINT / TERMINAL MODE</h2>
            <p className="text-foreground-muted mb-8 text-sm">Saya bertugas di terminal / halte untuk mencatat penumpang bus yang datang.</p>
            <Button className="w-full bg-danger hover:bg-danger/90">
              Pilih Point Mode <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>

          {/* Onboard Mode Card */}
          <Card className="p-8 border-2 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center text-center group" onClick={() => setMode('ONBOARD')}>
            <div className="w-24 h-24 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-600/30 group-hover:scale-110 transition-transform">
              <Bus className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-emerald-600 mb-4">ONBOARD MODE</h2>
            <p className="text-foreground-muted mb-8 text-sm">Saya berada di dalam bus untuk mencatat penumpang selama perjalanan.</p>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
              Pilih Onboard Mode <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>

        {/* How it works */}
        <Card className="p-6 bg-blue-50/50 border-blue-100">
          <h3 className="font-bold text-blue-900 mb-6 flex items-center gap-2"><Info className="w-5 h-5"/> Cara Kerja Checker</h3>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">1</div>
              <div>
                <p className="font-bold text-sm text-blue-950">Pilih Mode</p>
                <p className="text-xs text-blue-800">Sesuai tugas Anda</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-300 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-400 text-white flex items-center justify-center font-bold text-xs">2</div>
              <div>
                <p className="font-bold text-sm text-blue-950">Pilih Konteks</p>
                <p className="text-xs text-blue-800">Lokasi / departure aktif</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-blue-300 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-300 text-white flex items-center justify-center font-bold text-xs">3</div>
              <div>
                <p className="font-bold text-sm text-blue-950">Catat Event</p>
                <p className="text-xs text-blue-800">Naik / turun penumpang</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // --- POINT MODE - SELECTION ---
  if (mode === 'POINT' && !isRecording) {
    return (
      <div className="w-full flex flex-col gap-6 max-w-[1400px] mx-auto pb-20">
        
        {/* Stepper Header */}
        <div className="flex items-center gap-2 md:gap-6 border-b pb-6 overflow-x-auto">
          <div className="flex items-center gap-3 opacity-50 whitespace-nowrap cursor-pointer" onClick={() => setMode('NONE')}>
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">1</div>
            <div><p className="font-bold text-sm">Pilih Mode</p></div>
          </div>
          <div className="h-px bg-border flex-1 min-w-[30px]"></div>
          <div className={`flex items-center gap-3 whitespace-nowrap ${!selectedGeofenceId ? 'text-danger' : 'opacity-50'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${!selectedGeofenceId ? 'bg-danger text-white' : 'bg-success text-white'}`}>
              {!selectedGeofenceId ? '2' : <CheckCircle2 className="w-4 h-4"/>}
            </div>
            <div><p className="font-bold text-sm">Pilih Lokasi / Point</p></div>
          </div>
          <div className="h-px bg-border flex-1 min-w-[30px]"></div>
          <div className={`flex items-center gap-3 whitespace-nowrap ${selectedGeofenceId ? 'text-danger' : 'opacity-50'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedGeofenceId ? 'bg-danger text-white' : 'bg-muted'}`}>3</div>
            <div><p className="font-bold text-sm">Pilih Departure</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Lokasi */}
          <Card className="p-0 border-border overflow-hidden flex flex-col h-[600px]">
            <div className="p-5 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground text-lg mb-1">Pilih Lokasi / Point (Geofence)</h3>
              <p className="text-xs text-foreground-muted">Pilih lokasi atau titik tempat Anda bertugas hari ini.</p>
            </div>
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
                <Input placeholder="Cari lokasi..." value={geofenceSearch} onChange={(e) => setGeofenceSearch(e.target.value)} className="pl-9 bg-background" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              {filteredGeofences.map(geo => (
                <div 
                  key={geo.id} 
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all mb-2 ${selectedGeofenceId === geo.id ? 'bg-danger/5 border border-danger shadow-sm' : 'hover:bg-muted/50 border border-transparent'}`}
                  onClick={() => handleSelectGeofence(geo.id)}
                >
                  <MapPin className={`w-5 h-5 flex-shrink-0 ${selectedGeofenceId === geo.id ? 'text-danger' : 'text-blue-500'}`} />
                  <div>
                    <h4 className={`font-bold text-sm ${selectedGeofenceId === geo.id ? 'text-danger' : 'text-foreground'}`}>{geo.name}</h4>
                    <p className="text-xs text-foreground-muted mt-0.5">{geo.description || 'Titik Pemberhentian'}</p>
                  </div>
                  {selectedGeofenceId === geo.id && <CheckCircle2 className="w-5 h-5 text-danger ml-auto" />}
                </div>
              ))}
            </div>
          </Card>

          {/* Col 2: Departures at Location */}
          <Card className={`p-0 border-border overflow-hidden flex flex-col h-[600px] transition-all ${!selectedGeofenceId ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="p-5 border-b border-border bg-muted/30 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-foreground text-lg mb-1">Keberangkatan di Lokasi</h3>
                <p className="text-xs text-foreground-muted">Pilih keberangkatan (departure) yang akan Anda periksa.</p>
              </div>
              {selectedGeofenceId && <Badge variant="secondary">{busesAtGeofence.length} Keberangkatan</Badge>}
            </div>
            
            {!selectedGeofenceId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <MapPin className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm font-medium text-foreground-muted">Pilih lokasi di sebelah kiri terlebih dahulu</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                {busesAtGeofence.map((bus, i) => {
                  const currentOnboard = passengerEventService.getCurrentOnboard(bus.activeDeparture.id);
                  const isSelected = selectedDeparture?.id === bus.activeDeparture.id;
                  return (
                    <div 
                      key={i} 
                      className={`p-4 border rounded-xl mb-3 cursor-pointer transition-all ${isSelected ? 'border-danger bg-danger/5 ring-1 ring-danger' : 'border-border hover:border-danger/40'}`}
                      onClick={() => setSelectedDeparture(bus.activeDeparture)}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-danger animate-pulse' : 'bg-transparent'}`}></div>
                          <span className="font-black text-foreground">{bus.coreVehicle?.plateNumber}</span>
                        </div>
                        <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 shadow-sm text-[10px]">ONGOING</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-[10px] uppercase text-foreground-muted font-bold tracking-wider mb-1">Route</p>
                          <p className="text-xs font-medium text-foreground truncate">{bus.activeDeparture.route?.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase text-foreground-muted font-bold tracking-wider mb-1">Tujuan Akhir</p>
                          <p className="text-xs font-medium text-foreground truncate">{bus.activeDeparture.route?.destination?.name || 'Selesai'}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-border/50">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-danger">{currentOnboard}</span>
                          <span className="text-xs text-foreground-muted font-medium">/ {bus.coreVehicle?.passengerCapacity} pnp</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-danger' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                  );
                })}
                {busesAtGeofence.length === 0 && (
                  <div className="flex flex-col items-center justify-center text-center py-16">
                    <Bus className="w-12 h-12 text-muted-foreground/30 mb-4" />
                    <p className="text-sm font-medium text-foreground">Tidak ada keberangkatan</p>
                    <p className="text-xs text-foreground-muted mt-1">Belum ada bus yang tercatat beroperasi di titik ini saat ini.</p>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Col 3: Konteks & Action */}
          <Card className={`p-0 border-border overflow-hidden flex flex-col h-[600px] transition-all ${!selectedDeparture ? 'opacity-50 pointer-events-none' : 'border-danger shadow-md shadow-danger/10'}`}>
            <div className="p-5 border-b border-border bg-gradient-to-r from-danger/10 to-transparent">
              <h3 className="font-bold text-foreground text-lg mb-1 flex items-center gap-2">
                <div className="w-1.5 h-5 bg-danger rounded-full"></div>
                Detail Konteks Pemeriksaan
              </h3>
            </div>
            
            {!selectedDeparture ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm font-medium text-foreground-muted">Pilih keberangkatan di sebelah kiri untuk melanjutkan</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-6 relative">
                <div className="space-y-6 flex-1">
                  <div>
                    <p className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider mb-2">Lokasi / Point</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-danger mt-0.5" />
                      <div>
                        <p className="font-bold text-base text-foreground">{getSelectedGeofenceName()}</p>
                        <p className="text-sm text-foreground-muted">Titik Pemeriksaan Aktif</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-px bg-border"></div>
                  
                  <div>
                    <p className="text-[11px] font-bold text-foreground-muted uppercase tracking-wider mb-2">Departure Dipilih</p>
                    <div className="bg-background border border-border p-4 rounded-xl">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-black text-lg text-foreground">{selectedDeparture.vehicle?.coreVehicle?.plateNumber}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-0">ONGOING</Badge>
                      </div>
                      <p className="text-xs font-medium text-foreground-muted mb-4">{selectedDeparture.route?.name}</p>
                      
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-foreground-muted"/>
                          <span className="font-bold text-foreground">{passengerEventService.getCurrentOnboard(selectedDeparture.id)} <span className="font-normal text-foreground-muted">/ {selectedDeparture.vehicle?.coreVehicle?.passengerCapacity}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-auto">
                  <Button 
                    className="w-full h-14 text-base font-bold bg-danger hover:bg-danger/90 text-white shadow-lg shadow-danger/30"
                    onClick={() => {
                      setIsRecording(true);
                      handleSelectDeparture(selectedDeparture);
                    }}
                  >
                    LANJUT KE PENCATATAN
                  </Button>
                  <p className="text-center text-[10px] text-foreground-muted mt-3 font-medium">Anda akan mencatat naik turun penumpang</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  // --- POINT MODE - RECORDING ---
  if (mode === 'POINT' && isRecording) {
    return (
      <div className="w-full max-w-[1400px] mx-auto pb-20">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-border pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-danger/10 text-danger rounded-xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground">Point / Terminal Mode</h1>
              <p className="text-sm font-medium text-foreground-muted">Lokasi: {getSelectedGeofenceName()}</p>
            </div>
          </div>
          <Button variant="outline" className="border-danger/30 text-danger hover:bg-danger/10 hover:border-danger font-bold" onClick={() => setIsRecording(false)}>
            <RefreshCw className="w-4 h-4 mr-2" /> Ganti Lokasi / Bus
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Col 1: Keberangkatan Relevan (Buses at Location) */}
          <Card className="lg:col-span-3 p-0 border-border overflow-hidden h-[700px] flex flex-col shadow-sm">
            <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
              <h3 className="font-bold text-foreground text-sm">Keberangkatan Relevan</h3>
              <button onClick={handleRefreshBuses} className="text-xs font-bold text-foreground-muted flex items-center gap-1 hover:text-danger">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <div className="p-3 bg-background border-b border-border text-xs text-foreground-muted font-medium flex justify-between">
              <span>Tanggal: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-3">
              {busesAtGeofence.map((bus, i) => {
                const currentOnboard = passengerEventService.getCurrentOnboard(bus.activeDeparture.id);
                const isSelected = selectedDeparture?.id === bus.activeDeparture.id;
                return (
                  <div 
                    key={i} 
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-danger bg-danger/5 ring-1 ring-danger' : 'border-border hover:border-danger/30 bg-background'}`}
                    onClick={() => handleSelectDeparture(bus.activeDeparture)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-black text-base text-foreground">{bus.coreVehicle?.plateNumber}</div>
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">ONGOING</Badge>
                    </div>
                    <div className="text-xs font-medium text-foreground-muted truncate mb-3">{bus.activeDeparture.route?.name}</div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-foreground-muted">Onboard:</span>
                      <span className="font-bold text-foreground">{currentOnboard} <span className="text-foreground-muted font-normal">/ {bus.coreVehicle?.passengerCapacity}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Col 2: Detail Keberangkatan & Riwayat */}
          <div className="lg:col-span-5 flex flex-col gap-6 h-[700px]">
            <Card className="p-6 border-border shadow-sm shrink-0">
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Detail Keberangkatan</h3>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-0">ONGOING</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6">
                <div>
                  <p className="text-[11px] font-bold text-foreground-muted uppercase mb-1">Vehicle</p>
                  <p className="font-black text-foreground">{selectedDeparture?.vehicle?.coreVehicle?.plateNumber}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground-muted uppercase mb-1">Route</p>
                  <p className="font-bold text-sm text-foreground truncate">{selectedDeparture?.route?.name}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground-muted uppercase mb-1">Point Aktif</p>
                  <p className="font-bold text-sm text-foreground truncate">{getSelectedGeofenceName()}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground-muted uppercase mb-1">Kapasitas</p>
                  <p className="font-bold text-sm text-foreground"><span className="text-lg">{selectedDeparture?.vehicle?.coreVehicle?.passengerCapacity}</span> penumpang</p>
                </div>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-[11px] font-bold text-foreground-muted uppercase mb-2">Onboard Saat Ini</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-foreground">{passengerEventService.getCurrentOnboard(selectedDeparture?.id)}</span>
                  <span className="text-sm font-bold text-foreground-muted">penumpang</span>
                </div>
              </div>
            </Card>

            <Card className="p-0 border-border overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
              <div className="p-5 border-b border-border flex justify-between items-center bg-background">
                <h3 className="font-bold text-foreground text-sm uppercase tracking-wider">Riwayat Event Terakhir</h3>
                <span className="text-[10px] font-bold text-danger cursor-pointer hover:underline">Lihat Semua</span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-muted/10">
                {eventHistory.length === 0 ? (
                   <p className="text-sm text-foreground-muted text-center py-8 font-medium">Belum ada riwayat penumpang untuk jadwal ini.</p>
                ) : (
                  eventHistory.map(evt => {
                    const geo = geofenceService.getGeofenceById(evt.geofenceId);
                    const isBoarding = evt.type === 'BOARDING';
                    return (
                      <div key={evt.id} className="flex gap-4 relative">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full z-10 ${isBoarding ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                          <div className="w-px h-full bg-border -mt-1 -mb-1"></div>
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-foreground-muted">{new Date(evt.recordedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                              <Badge className={`border-0 text-[9px] px-1.5 py-0 rounded ${isBoarding ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'}`}>
                                {isBoarding ? 'BOARDING' : 'ALIGHTING'}
                              </Badge>
                            </div>
                            <span className={`font-black ${isBoarding ? 'text-emerald-500' : 'text-orange-500'}`}>
                              {isBoarding ? '+' : '-'}{evt.quantity}
                            </span>
                          </div>
                          <div className="flex justify-between items-end mt-2">
                            <div>
                              <p className="text-xs font-bold text-foreground">{geo?.name || evt.geofenceId}</p>
                              {evt.note && <p className="text-[10px] text-foreground-muted italic mt-0.5">"{evt.note}"</p>}
                            </div>
                            <p className="text-[10px] font-medium text-foreground-muted">{checker?.name}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </Card>
          </div>

          {/* Col 3: Catat Penumpang */}
          <Card className="lg:col-span-4 p-6 border-border shadow-md border-t-4 border-t-danger h-[700px] flex flex-col">
            <h3 className="font-black text-foreground text-lg mb-6">Catat Penumpang</h3>
            
            <div className="flex gap-3 mb-8">
              <button
                className={`flex-1 py-4 px-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${updateMode === 'BOARDING' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-border text-foreground-muted hover:border-emerald-200 hover:bg-emerald-50'}`}
                onClick={() => setUpdateMode('BOARDING')}
              >
                <div className="flex items-center gap-1 mb-1">
                  <LogIn className={`w-4 h-4 ${updateMode === 'BOARDING' ? 'text-emerald-600' : ''}`} />
                  <span className="text-sm font-black tracking-wide uppercase">Boarding</span>
                </div>
                <span className="text-[10px] font-bold opacity-80">+ Penumpang Masuk</span>
              </button>
              
              <button
                className={`flex-1 py-4 px-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1.5 transition-all ${updateMode === 'ALIGHTING' ? 'border-danger bg-danger/5 text-danger shadow-sm' : 'border-border text-foreground-muted hover:border-danger/30 hover:bg-danger/5'}`}
                onClick={() => setUpdateMode('ALIGHTING')}
              >
                <div className="flex items-center gap-1 mb-1">
                  <LogOut className={`w-4 h-4 ${updateMode === 'ALIGHTING' ? 'text-danger' : ''}`} />
                  <span className="text-sm font-black tracking-wide uppercase">Alighting</span>
                </div>
                <span className="text-[10px] font-bold opacity-80">- Penumpang Turun</span>
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <label className="block text-xs font-bold text-foreground mb-2">Jumlah Penumpang</label>
                <div className="flex items-center">
                  <button 
                    className="w-14 h-14 bg-muted hover:bg-muted/80 rounded-l-xl border border-border flex items-center justify-center text-foreground font-black text-xl transition-colors"
                    onClick={() => setQuantity(prev => (typeof prev === 'number' && prev > 1) ? prev - 1 : 1)}
                  >
                    -
                  </button>
                  <Input 
                    type="number"
                    min="1"
                    placeholder="0"
                    className="flex-1 h-14 text-2xl font-black text-center border-y border-x-0 border-border rounded-none focus-visible:ring-0 focus-visible:border-danger bg-background"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value, 10) : '')}
                  />
                  <button 
                    className="w-14 h-14 bg-muted hover:bg-muted/80 rounded-r-xl border border-border flex items-center justify-center text-foreground font-black text-xl transition-colors"
                    onClick={() => setQuantity(prev => (typeof prev === 'number' ? prev + 1 : 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-2">Catatan (opsional)</label>
                <textarea 
                  className="w-full h-32 p-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-danger text-sm resize-none custom-scrollbar"
                  placeholder="Catatan tambahan..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={100}
                ></textarea>
                <div className="text-right mt-1 text-[10px] text-foreground-muted font-bold">{note.length}/100</div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-danger/10 text-danger text-sm border border-danger/20 flex items-start gap-2 font-medium">
                <div className="mt-0.5"><Info className="w-4 h-4" /></div>
                <span>{error}</span>
              </div>
            )}

            <Button 
              className="w-full h-14 text-base font-black bg-danger hover:bg-danger/90 text-white shadow-lg shadow-danger/30 transition-all rounded-xl mt-auto" 
              onClick={handleSaveEvent}
              disabled={!quantity || quantity <= 0}
            >
              <Users className="w-5 h-5 mr-2" />
              CATAT EVENT
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // --- ONBOARD MODE ---
  if (mode === 'ONBOARD') {
    return (
      <div className="w-full flex flex-col gap-6 max-w-[1400px] mx-auto pb-20">
        
        {/* Stepper Header */}
        <div className="flex items-center gap-2 md:gap-4 border-b pb-6 overflow-x-auto">
          <div className="flex items-center gap-2 opacity-50 whitespace-nowrap cursor-pointer" onClick={() => setMode('NONE')}>
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">1</div>
            <div><p className="font-bold text-sm">Pilih Mode</p></div>
          </div>
          <div className="h-px bg-border flex-1 min-w-[20px]"></div>
          <div className={`flex items-center gap-2 whitespace-nowrap ${!selectedDeparture ? 'text-emerald-600' : 'opacity-50'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${!selectedDeparture ? 'bg-emerald-600 text-white' : 'bg-success text-white'}`}>
              {!selectedDeparture ? '2' : <CheckCircle2 className="w-4 h-4"/>}
            </div>
            <div><p className="font-bold text-sm">Pilih Active Departure</p></div>
          </div>
          <div className="h-px bg-border flex-1 min-w-[20px]"></div>
          <div className={`flex items-center gap-2 whitespace-nowrap ${selectedDeparture && !isRecording ? 'text-emerald-600' : 'opacity-50'}`}>
             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedDeparture && !isRecording ? 'bg-emerald-600 text-white' : (isRecording ? 'bg-success text-white' : 'bg-muted')}`}>
               {isRecording ? <CheckCircle2 className="w-4 h-4"/> : '3'}
             </div>
             <div><p className="font-bold text-sm">Pilih Lokasi Saat Ini</p></div>
          </div>
          <div className="h-px bg-border flex-1 min-w-[20px]"></div>
          <div className={`flex items-center gap-2 whitespace-nowrap ${isRecording ? 'text-emerald-600' : 'opacity-50'}`}>
             <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isRecording ? 'bg-emerald-600 text-white' : 'bg-muted'}`}>4</div>
             <div><p className="font-bold text-sm">Catat Event</p></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Col 1: Pilih Departure */}
          <Card className="lg:col-span-3 p-0 border-border overflow-hidden flex flex-col h-[700px] shadow-sm">
            <div className="p-5 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground text-sm mb-1">Pilih Active Departure</h3>
              <p className="text-xs text-foreground-muted">Pilih keberangkatan yang sedang Anda ikuti.</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
              {activeDepartures.map(dep => {
                const isSelected = selectedDeparture?.id === dep.id;
                const currentOnboard = passengerEventService.getCurrentOnboard(dep.id);
                return (
                  <div 
                    key={dep.id} 
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${isSelected ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500 shadow-sm' : 'border-border hover:border-emerald-500/40 bg-background'}`}
                    onClick={() => {
                      handleSelectDeparture(dep);
                      setIsRecording(false);
                      setSelectedStopId(null);
                    }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-sm text-foreground">{dep.vehicle?.coreVehicle?.plateNumber}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] font-bold text-foreground-muted mb-3 truncate">{dep.route?.name}</p>
                    <div className="flex justify-between items-center text-xs pt-3 border-t border-border/50">
                      <span className="text-foreground-muted font-medium">Onboard:</span>
                      <span className="font-bold text-foreground">{currentOnboard} <span className="font-normal text-foreground-muted">/ {dep.vehicle?.coreVehicle?.passengerCapacity}</span></span>
                    </div>
                  </div>
                )
              })}
              {activeDepartures.length === 0 && (
                <div className="text-center py-10 text-foreground-muted">
                  <Bus className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm font-medium">Tidak ada keberangkatan aktif</p>
                </div>
              )}
            </div>
          </Card>

          {/* Col 2: Konteks Perjalanan (Timeline) */}
          <Card className={`lg:col-span-5 p-0 border-border overflow-hidden flex flex-col h-[700px] shadow-sm transition-all ${!selectedDeparture ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="p-5 border-b border-border bg-gradient-to-r from-emerald-500/10 to-transparent">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <div className="w-1.5 h-4 bg-emerald-500 rounded-full"></div>
                Konteks Perjalanan Aktif
              </h3>
            </div>
            
            {!selectedDeparture ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <Map className="w-16 h-16 text-muted-foreground/20 mb-4" />
                <p className="text-sm font-medium text-foreground-muted text-center">Pilih keberangkatan di sebelah kiri untuk melihat rute perjalanan</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex justify-between items-start mb-6 pb-6 border-b border-border">
                  <div>
                    <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider mb-1">Departure</p>
                    <div className="flex items-center gap-2 mb-1">
                       <p className="font-black text-sm text-foreground">{new Date().toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} - {selectedDeparture.vehicle?.coreVehicle?.plateNumber}</p>
                       <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">ONGOING</Badge>
                    </div>
                    
                    <div className="flex gap-6 mt-4">
                      <div>
                        <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider mb-1">Vehicle</p>
                        <p className="font-bold text-sm text-foreground">{selectedDeparture.vehicle?.coreVehicle?.plateNumber}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider mb-1">Route</p>
                        <p className="font-bold text-sm text-foreground">{selectedDeparture.route?.name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider mb-1">Onboard Saat Ini</p>
                    <p className="text-3xl font-black text-foreground">{passengerEventService.getCurrentOnboard(selectedDeparture.id)} <span className="text-sm text-foreground-muted font-bold">/ {selectedDeparture.vehicle?.coreVehicle?.passengerCapacity}</span></p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                  <p className="text-sm font-black text-foreground mb-4">Rute Perjalanan</p>
                  
                  <div className="space-y-0 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {/* Render route stops - using allGeofences as dummy stops for the timeline */}
                    {allGeofences.slice(0, 6).map((geo, idx, arr) => {
                      const isOrigin = idx === 0;
                      const isDest = idx === arr.length - 1;
                      const isSelected = selectedStopId === geo.id;
                      
                      return (
                        <div key={geo.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 cursor-pointer z-10 transition-colors ${isSelected ? 'border-emerald-500 text-emerald-600' : 'border-border text-foreground-muted hover:border-emerald-300'}`} onClick={() => { setSelectedStopId(geo.id); setIsRecording(true); }}>
                            <span className="text-[10px] font-bold">{idx + 1}</span>
                          </div>
                          
                          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-3 cursor-pointer" onClick={() => { setSelectedStopId(geo.id); setIsRecording(true); }}>
                            <div className={`flex flex-col ${isSelected ? '' : ''}`}>
                              <div className="flex justify-between items-center mb-1">
                                <span className={`font-bold text-sm ${isSelected ? 'text-emerald-600' : 'text-foreground'}`}>{geo.name}</span>
                                {isOrigin && <Badge variant="secondary" className="text-[9px] bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">ORIGIN</Badge>}
                                {isDest && <Badge variant="secondary" className="text-[9px] bg-purple-100 text-purple-700 hover:bg-purple-100 border-0">DESTINATION</Badge>}
                                {isSelected && !isOrigin && !isDest && <MapPin className="w-3.5 h-3.5 text-emerald-500" />}
                              </div>
                              <span className="text-[10px] font-bold text-foreground-muted">Est: 08:{(idx * 15).toString().padStart(2, '0')}</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Col 3: Select Stop & Log Form */}
          <Card className={`lg:col-span-4 p-6 border-border shadow-md border-t-4 border-t-emerald-500 h-[700px] flex flex-col transition-all ${!selectedDeparture ? 'opacity-50 pointer-events-none' : ''}`}>
            
            <div className="mb-6 pb-6 border-b border-border">
              <h3 className="font-black text-foreground text-sm mb-1">Pilih Lokasi Saat Ini</h3>
              <p className="text-[10px] text-foreground-muted font-bold mb-4">Tentukan lokasi/titik saat Anda mencatat event.</p>
              
              <Select value={selectedStopId || ''} onValueChange={(val) => { setSelectedStopId(val); setIsRecording(true); }}>
                <SelectTrigger className={`w-full h-12 font-bold ${selectedStopId ? 'border-emerald-500 ring-1 ring-emerald-500/20' : 'border-border'}`}>
                  <SelectValue placeholder="Pilih Halte / Terminal..." />
                </SelectTrigger>
                <SelectContent>
                  {allGeofences.map(g => (
                    <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className={`flex-1 flex flex-col transition-all ${!isRecording ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
              <h3 className="font-black text-foreground text-sm mb-4">Catat Event</h3>
              
              <div className="flex gap-2 mb-6">
                <button
                  className={`flex-1 py-3 px-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${updateMode === 'BOARDING' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-border text-foreground-muted hover:border-emerald-200'}`}
                  onClick={() => setUpdateMode('BOARDING')}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <LogIn className={`w-4 h-4 ${updateMode === 'BOARDING' ? 'text-emerald-600' : ''}`} />
                    <span className="text-xs font-black uppercase">Boarding</span>
                  </div>
                  <span className="text-[9px] font-bold opacity-80">+ Penumpang Masuk</span>
                </button>
                
                <button
                  className={`flex-1 py-3 px-2 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${updateMode === 'ALIGHTING' ? 'border-danger bg-danger/5 text-danger shadow-sm' : 'border-border text-foreground-muted hover:border-danger/30'}`}
                  onClick={() => setUpdateMode('ALIGHTING')}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <LogOut className={`w-4 h-4 ${updateMode === 'ALIGHTING' ? 'text-danger' : ''}`} />
                    <span className="text-xs font-black uppercase">Alighting</span>
                  </div>
                  <span className="text-[9px] font-bold opacity-80">- Penumpang Turun</span>
                </button>
              </div>

              <div className="space-y-5 flex-1">
                <div>
                  <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase">Jumlah Penumpang</label>
                  <div className="flex items-center">
                    <button 
                      className="w-12 h-12 bg-muted hover:bg-muted/80 rounded-l-xl border border-border flex items-center justify-center text-foreground font-black text-xl"
                      onClick={() => setQuantity(prev => (typeof prev === 'number' && prev > 1) ? prev - 1 : 1)}
                    >
                      -
                    </button>
                    <Input 
                      type="number" min="1" placeholder="0"
                      className="flex-1 h-12 text-xl font-black text-center border-y border-x-0 border-border rounded-none focus-visible:ring-0 focus-visible:border-emerald-500 bg-background"
                      value={quantity} onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value, 10) : '')}
                    />
                    <button 
                      className="w-12 h-12 bg-muted hover:bg-muted/80 rounded-r-xl border border-border flex items-center justify-center text-foreground font-black text-xl"
                      onClick={() => setQuantity(prev => (typeof prev === 'number' ? prev + 1 : 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-foreground mb-1.5 uppercase">Catatan (opsional)</label>
                  <textarea 
                    className="w-full h-24 p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none custom-scrollbar"
                    placeholder="Catatan tambahan..." value={note} onChange={(e) => setNote(e.target.value)} maxLength={100}
                  ></textarea>
                  <div className="text-right mt-1 text-[10px] text-foreground-muted font-bold">{note.length}/100</div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-2 rounded-lg bg-danger/10 text-danger text-xs border border-danger/20 flex items-start gap-1 font-medium">
                  <div className="mt-0.5"><Info className="w-3 h-3" /></div><span>{error}</span>
                </div>
              )}

              <Button 
                className="w-full h-12 text-sm font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 transition-all rounded-xl mt-auto" 
                onClick={handleSaveEvent} disabled={!quantity || quantity <= 0}
              >
                <Users className="w-4 h-4 mr-2" />
                CATAT EVENT
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
