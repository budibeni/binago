const fs = require('fs');
const path = '/Users/beni/Developer/DEV_AJB/binago/apps/business/src/features/modules/rental/handover/components/HandoverForm.tsx';
let content = fs.readFileSync(path, 'utf8');

const newFormInputs = `                        <div className="space-y-5 animate-in fade-in duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                            <InputDateTimeGps
                              label={labels.fieldHandoverTime || "Waktu Serah Terima *"}
                              dateValue={vehicleData[activeTab]?.handoverAt}
                              onChange={(v) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], handoverAt: v } })}
                              latitude={vehicleData[activeTab]?.latitude}
                              longitude={vehicleData[activeTab]?.longitude}
                              onCoordinates={(lat, lng) => setVehicleData(prev => ({ ...prev, [activeTab]: { ...prev[activeTab], latitude: lat, longitude: lng } }))}
                              showAddress={false}
                              required
                            />
                            <InputTextarea
                              id={\`addr-\${activeTab}\`}
                              label={labels.fieldAddress || "Detail Alamat (Opsional)"}
                              value={vehicleData[activeTab]?.address}
                              onChange={(v) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], address: v } })}
                              placeholder={labels.fieldAddressPlaceholder || "Cth: Area lobi..."}
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                            <InputNumber
                              label={labels.fieldOdometer || "Odometer (km)"}
                              value={vehicleData[activeTab]?.odometer ?? null}
                              onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], odometer: val } })}
                              placeholder={labels.fieldOdometerPlaceholder || "Contoh: 15000"}
                            />
                            <InputSelect
                              label={labels.fieldFuelLevel || "BBM"}
                              value={vehicleData[activeTab]?.fuelLevel}
                              onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], fuelLevel: val as any } })}
                              placeholder={labels.fieldFuelPlaceholder || "Pilih Kondisi BBM"}
                              options={[
                                { value: 'EMPTY', label: labels.fuelEmpty || 'Kosong' },
                                { value: 'QUARTER', label: labels.fuelQuarter || '1/4' },
                                { value: 'HALF', label: labels.fuelHalf || '1/2' },
                                { value: 'THREE_QUARTER', label: labels.fuelThreeQuarter || '3/4' },
                                { value: 'FULL', label: labels.fuelFull || 'Penuh' },
                              ]}
                            />
                            <InputSelect
                              label={labels.fieldCondition || "Kondisi"}
                              value={vehicleData[activeTab]?.vehicleCondition}
                              onChange={(val) => setVehicleData({ ...vehicleData, [activeTab]: { ...vehicleData[activeTab], vehicleCondition: val as any } })}
                              placeholder={labels.fieldConditionPlaceholder || "Pilih Kondisi Kendaraan"}
                              options={[
                                { value: 'GOOD', label: labels.condGood || 'Baik' },
                                { value: 'MINOR_DAMAGE', label: labels.condMinorDamage || 'Kerusakan Ringan' },
                                { value: 'NEEDS_REPAIR', label: labels.condNeedsRepair || 'Perlu Perbaikan' },
                              ]}
                            />
                          </div>

                          <div className="bg-slate-50/50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/50">
                            <Label className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400 mb-3 block tracking-wide">{labels.fieldEquipment || 'Kelengkapan Kendaraan'}</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              {Object.keys(vehicleData[activeTab]?.equipment || {}).map((key) => {
                                if (key === 'other') return null;
                                const isChecked = (vehicleData[activeTab]?.equipment as any)?.[key] || false;
                                return (
                                  <label
                                    key={key}
                                    className={cn(
                                      "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                                      isChecked 
                                        ? "bg-primary/5 border-primary/30 dark:border-primary/50 shadow-sm" 
                                        : "bg-white dark:bg-neutral-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-neutral-800"
                                    )}
                                  >
                                    <InputCheckbox
                                      id={\`eq-\${activeTab}-\${key}\`}
                                      className="m-0"
                                      label=""
                                      value={isChecked}
                                      onChange={(checked) => setVehicleData({
                                        ...vehicleData,
                                        [activeTab]: {
                                          ...vehicleData[activeTab],
                                          equipment: { ...vehicleData[activeTab].equipment, [key]: checked === true }
                                        }
                                      })}
                                    />
                                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 select-none">
                                      {key.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>`;

content = content.replace(
  /<div className="space-y-5 animate-in fade-in duration-300">[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>/,
  newFormInputs + '\n                      )'
);

fs.writeFileSync(path, content);
