'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, Dialog } from '@adatrack/ui';
import { Bus, MapPin, Users, History, Info, ChevronRight, X, Save, Search } from 'lucide-react';
import { checkerService } from '@/data/modules/transport/services/checkerService';
import { passengerEventService } from '@/data/modules/transport/services/passengerEventService';
import { geofenceService } from '@/data/services';
import type { Checker } from './types/checker';
import type { PassengerEvent, PassengerEventType } from '../passenger-events/types/passengerEvent';
import type { Departure } from '../departures/types/departure';

// Dummy current checker (in real app, this comes from auth context)
const CURRENT_CHECKER_ID = 'chk-001';

export function CheckerFeature() {
  const [checker, setChecker] = useState<Checker | undefined>();
  const [geofenceName, setGeofenceName] = useState<string>('');
  
  const [busesAtGeofence, setBusesAtGeofence] = useState<any[]>([]);
  const [manualDepartures, setManualDepartures] = useState<Departure[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedDeparture, setSelectedDeparture] = useState<any | null>(null);
  const [updateMode, setUpdateMode] = useState<PassengerEventType>('BOARDING');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  
  const [eventHistory, setEventHistory] = useState<PassengerEvent[]>([]);

  useEffect(() => {
    const chk = checkerService.getCheckerById(CURRENT_CHECKER_ID);
    if (chk) {
      setChecker(chk);
      const geo = geofenceService.getGeofenceById(chk.assignedGeofenceId);
      if (geo) {
        setGeofenceName(geo.name);
      }
      
      const buses = checkerService.getBusesAtGeofence(chk.assignedGeofenceId);
      setBusesAtGeofence(buses);
      
      const active = checkerService.getActiveDeparturesForManualSelect();
      setManualDepartures(active);
    }
  }, []);

  const handleSelectBus = (departure: any) => {
    setSelectedDeparture(departure);
    setQuantity('');
    setNote('');
    setError('');
    
    // Load history
    const history = passengerEventService.getEventsByDepartureId(departure.id);
    setEventHistory(history.reverse());
  };

  const handleSaveEvent = () => {
    if (!selectedDeparture || !checker) return;
    if (typeof quantity !== 'number' || quantity <= 0) {
      setError('Jumlah harus lebih besar dari 0');
      return;
    }

    try {
      passengerEventService.recordEvent(
        selectedDeparture.id,
        checker.assignedGeofenceId,
        updateMode,
        quantity,
        checker.id,
        note
      );
      
      // Refresh state
      const history = passengerEventService.getEventsByDepartureId(selectedDeparture.id);
      setEventHistory(history.reverse());
      setQuantity('');
      setNote('');
      setError('');
      
      // Re-fetch buses to update current onboard
      const buses = checkerService.getBusesAtGeofence(checker.assignedGeofenceId);
      setBusesAtGeofence(buses);
    } catch (e: any) {
      setError(e.message || 'Gagal menyimpan data');
    }
  };

  const filteredManualDepartures = manualDepartures.filter(d => 
    d.vehicle?.plateNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.vehicle?.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.route?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Checker Penumpang</h1>
        <p className="text-sm text-neutral-500">Catat jumlah penumpang naik dan turun pada lokasi Anda</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Sidebar Info */}
        <div className="w-full md:w-1/4 space-y-4">
          <Card className="p-4 bg-brand-50 border-brand-200">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-brand-600" />
              <h3 className="font-semibold text-brand-900">Lokasi Penugasan</h3>
            </div>
            <p className="text-lg font-bold text-gray-900">{geofenceName || 'Memuat...'}</p>
            <p className="text-sm text-gray-500 mt-1">Petugas: {checker?.name}</p>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Bus di Lokasi ({busesAtGeofence.length})</h3>
            <div className="space-y-2">
              {busesAtGeofence.map((bus, i) => {
                const currentOnboard = passengerEventService.getCurrentOnboard(bus.activeDeparture.id);
                return (
                  <div 
                    key={i} 
                    className="p-3 border rounded-lg hover:border-brand-500 cursor-pointer transition-colors"
                    onClick={() => handleSelectBus(bus.activeDeparture)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-gray-900">{bus.tracking.plateNumber}</span>
                      <Badge variant="success">Di Lokasi</Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-1">{bus.activeDeparture.route?.name}</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{currentOnboard} / {bus.transportVehicle.passengerCapacity} Penumpang</span>
                    </div>
                  </div>
                );
              })}
              {busesAtGeofence.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Tidak ada bus terdeteksi di lokasi ini.</p>
              )}
            </div>
          </Card>
          
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Pencarian Manual</h3>
            <p className="text-xs text-gray-500 mb-3">Cari bus yang sedang beroperasi jika tidak terdeteksi GPS.</p>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari Nopol atau Rute..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            {searchQuery && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {filteredManualDepartures.map(dep => (
                  <div 
                    key={dep.id} 
                    className="p-2 border rounded hover:border-brand-500 cursor-pointer text-sm"
                    onClick={() => handleSelectBus(dep)}
                  >
                    <div className="font-bold">{dep.vehicle?.plateNumber}</div>
                    <div className="text-gray-500 text-xs truncate">{dep.route?.name}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Main Panel */}
        <div className="w-full md:w-3/4">
          {!selectedDeparture ? (
            <Card className="p-12 flex flex-col items-center justify-center text-center h-full border-dashed">
              <Bus className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pilih Bus</h3>
              <p className="text-gray-500 max-w-md">
                Pilih bus dari daftar di sebelah kiri untuk mencatat jumlah penumpang naik atau turun di lokasi ini.
              </p>
            </Card>
          ) : (
            <Card className="flex flex-col h-full">
              <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-gray-900">{selectedDeparture.vehicle?.coreVehicle?.plateNumber}</h2>
                    <Badge variant="default">{selectedDeparture.status}</Badge>
                  </div>
                  <p className="text-gray-600">{selectedDeparture.route?.name}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedDeparture(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 tracking-wider">Update Penumpang</h3>
                    
                    <div className="flex gap-4 mb-6">
                      <button
                        className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${updateMode === 'BOARDING' ? 'border-brand-600 bg-brand-50 text-brand-700 font-bold' : 'border-gray-200 text-gray-600 hover:border-brand-200'}`}
                        onClick={() => setUpdateMode('BOARDING')}
                      >
                        <ChevronRight className="w-5 h-5" />
                        Penumpang Naik
                      </button>
                      <button
                        className={`flex-1 py-3 px-4 rounded-lg border-2 flex items-center justify-center gap-2 transition-all ${updateMode === 'ALIGHTING' ? 'border-orange-600 bg-orange-50 text-orange-700 font-bold' : 'border-gray-200 text-gray-600 hover:border-orange-200'}`}
                        onClick={() => setUpdateMode('ALIGHTING')}
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        Penumpang Turun
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah</label>
                        <Input 
                          type="number"
                          min="1"
                          placeholder="Masukkan jumlah penumpang"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value ? parseInt(e.target.value, 10) : '')}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi (Otomatis)</label>
                        <Input 
                          value={geofenceName}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Catatan (Opsional)</label>
                        <Input 
                          placeholder="Tambahkan catatan jika perlu"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 rounded bg-red-50 text-red-700 text-sm border border-red-200">
                      {error}
                    </div>
                  )}

                  <Button 
                    className="w-full py-6 text-lg" 
                    onClick={handleSaveEvent}
                    disabled={!quantity || quantity <= 0}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Simpan Data
                  </Button>
                </div>

                {/* History & Status */}
                <div className="space-y-6">
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Penumpang Saat Ini</span>
                      <span className="text-2xl font-bold text-gray-900">
                        {passengerEventService.getCurrentOnboard(selectedDeparture.id)} <span className="text-sm text-gray-500 font-normal">/ {selectedDeparture.vehicle?.passengerCapacity}</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-brand-600 h-2.5 rounded-full" 
                        style={{ width: `${Math.min(100, (passengerEventService.getCurrentOnboard(selectedDeparture.id) / (selectedDeparture.vehicle?.passengerCapacity || 1)) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4 tracking-wider flex items-center gap-2">
                      <History className="w-4 h-4" />
                      Riwayat Event (Departure Ini)
                    </h3>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                      {eventHistory.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">Belum ada data penumpang.</p>
                      ) : (
                        eventHistory.map(evt => {
                          const geo = geofenceService.getGeofenceById(evt.geofenceId);
                          return (
                            <div key={evt.id} className="p-3 border rounded-lg bg-white flex justify-between items-center">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant={evt.type === 'BOARDING' ? 'success' : 'warning'}>
                                    {evt.type === 'BOARDING' ? 'Naik' : 'Turun'}
                                  </Badge>
                                  <span className="text-sm font-semibold text-gray-900">
                                    {evt.type === 'BOARDING' ? '+' : '-'}{evt.quantity} Orang
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">{geo?.name || evt.geofenceId}</p>
                                {evt.note && <p className="text-xs text-gray-400 mt-1 italic">"{evt.note}"</p>}
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-400">
                                  {new Date(evt.recordedAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(evt.recordedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
