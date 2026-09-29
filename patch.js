const fs = require('fs');

let content = fs.readFileSync('/tmp/page.tsx', 'utf8');

// 1. Add states
content = content.replace(
  'const [formData, setFormData] = useState({ imei: "", device_brand: "", device_model: "", sim_number: "", protocol: "" });',
  `const [formData, setFormData] = useState({ imei: "", device_brand: "", device_model: "", sim_number: "", protocol: "", iccid: "" });
  const [isEditMode, setIsEditMode] = useState(false);
  const [simCards, setSimCards] = useState<any[]>([]);`
);

// 2. Add fetchSimCards useEffect
const fetchCompsStr = `useEffect(() => {
    const fetchComps = async () => {`;
const fetchSimCardsStr = `useEffect(() => {
    const fetchSimCards = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088";
        const res = await fetchWithAuth(\`\${API_URL}/api/v1/admin/sim-cards\`);
        if (res.ok) {
          const json = await res.json();
          setSimCards(json.data || []);
        }
      } catch (e) {}
    };
    fetchSimCards();
  }, []);

  ` + fetchCompsStr;
content = content.replace(fetchCompsStr, fetchSimCardsStr);

// 3. Replace handleAddSubmit with handleDeviceSubmit
content = content.replace(/const handleAddSubmit = async [^]+?fetchDevices\(\);\s+\} else \{\s+toast.error\("Failed to add device"\);\s+\}\s+\} catch \(e\) \{\s+console.error\(e\);\s+toast.error\("An error occurred"\);\s+\}\s+\};/, 
`const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8088";
      const url = isEditMode ? \`\${API_URL}/api/v1/admin/gps-devices/\${formData.imei}\` : \`\${API_URL}/api/v1/admin/gps-devices\`;
      const method = isEditMode ? 'PUT' : 'POST';
      const res = await fetchWithAuth(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, iccid: formData.iccid || null })
      });
      if (res.ok) {
        setShowAddModal(false);
        setFormData({ imei: "", device_brand: "", device_model: "", sim_number: "", protocol: "", iccid: "" });
        toast.success(\`Device \${isEditMode ? 'updated' : 'added'} successfully\`);
        fetchDevices();
      } else {
        toast.error(\`Failed to \${isEditMode ? 'update' : 'add'} device\`);
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred");
    }
  };`
);

// 4. Update "Add Device" button onClick
content = content.replace(
  `onClick={() => setShowAddModal(true)}`,
  `onClick={() => { setIsEditMode(false); setFormData({ imei: "", device_brand: "", device_model: "", sim_number: "", protocol: "", iccid: "" }); setShowAddModal(true); }}`
);

// 5. Update Table Row Actions
content = content.replace(
  `{!d.assigned_company && (
                      <button onClick={() => setShowAssignModal(d.imei)} className="text-indigo-600 hover:text-indigo-900">Assign</button>
                    )}`,
  `<button onClick={() => { setIsEditMode(true); setFormData({ imei: d.imei, device_brand: d.device_brand || "", device_model: d.device_model || "", sim_number: d.sim_number || "", protocol: d.protocol || "", iccid: d.iccid || "" }); setShowAddModal(true); }} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    {!d.assigned_company && (
                      <button onClick={() => setShowAssignModal(d.imei)} className="text-indigo-600 hover:text-indigo-900">Assign</button>
                    )}`
);

// 6. Update Form Modal title
content = content.replace(
  `<h2 className="text-lg font-bold text-slate-800">Add Global GPS Device</h2>`,
  `<h2 className="text-lg font-bold text-slate-800">{isEditMode ? 'Edit' : 'Add'} Global GPS Device</h2>`
);

// 7. Update IMEI disabled
content = content.replace(
  `value={formData.imei} onChange={e => setFormData({...formData, imei: e.target.value})}`,
  `disabled={isEditMode} value={formData.imei} onChange={e => setFormData({...formData, imei: e.target.value})}`
);

// 8. Add SIM Card selector before SIM Number
content = content.replace(
  `<div>
                <label className="block text-sm font-medium text-slate-700">SIM Number (Optional)</label>`,
  `<div>
                <label className="block text-sm font-medium text-slate-700">IoT SIM Card (Optional)</label>
                <select value={formData.iccid || ""} onChange={(e) => {
                  const iccid = e.target.value;
                  const sim = simCards.find(s => s.iccid === iccid);
                  setFormData({ ...formData, iccid, sim_number: sim ? sim.phone_number : formData.sim_number });
                }} className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border mb-4">
                  <option value="">-- Manual Input / None --</option>
                  {simCards.map(s => <option key={s.iccid} value={s.iccid}>{s.iccid} - {s.phone_number}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">SIM Number (Optional)</label>`
);

fs.writeFileSync('/home/arfian107/Projects/adatrack/admin/src/app/(protected)/global-devices/page.tsx', content);
console.log("Patched successfully!");
