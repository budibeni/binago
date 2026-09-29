const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/admin/src/app/(protected)/sim-cards/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add editId state
content = content.replace(
  /const \[isSubmitting, setIsSubmitting\] = useState\(false\);/,
  `const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);`
);

// Update Register/Edit Submit function
content = content.replace(
  /const res = await fetchWithAuth\(\`\$\{API_URL\}\/api\/v1\/admin\/sim-cards\`, \{\n\s*method: "POST",/,
  `const url = editId ? \`\$\{API_URL\}/api/v1/admin/sim-cards/\$\{editId\}\` : \`\$\{API_URL\}/api/v1/admin/sim-cards\`;
      const res = await fetchWithAuth(url, {
        method: editId ? "PUT" : "POST",`
);

// Update Register success toast
content = content.replace(
  /toast\.success\("SIM Card registered successfully!"\);/,
  `toast.success(editId ? "SIM Card updated successfully!" : "SIM Card registered successfully!");`
);

// Update Close function to reset editId
content = content.replace(
  /setIsAddOpen\(false\);\n\s*setAddForm\(\{ iccid: "", phone_number: "", provider: "Telkomsel IoT" \}\);/g,
  `setIsAddOpen(false);
        setEditId(null);
        setAddForm({ iccid: "", phone_number: "", provider: "Telkomsel IoT" });`
);

// Update button onClick to reset editId
content = content.replace(
  /onClick=\{\(\) => setIsAddOpen\(true\)\}/g,
  `onClick={() => { setEditId(null); setAddForm({ iccid: "", phone_number: "", provider: "Telkomsel IoT" }); setIsAddOpen(true); }}`
);

// Add Action column header
content = content.replace(
  /<th className="px-3 py-4 text-left text-sm font-semibold text-slate-900">Status<\/th>/,
  `<th className="px-3 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-3 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>`
);

// Add edit button inside the row
content = content.replace(
  /<td className="whitespace-nowrap px-3 py-4 text-sm">\s*<span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600\/20">\{s\.status\}<\/span>\s*<\/td>/g,
  `<td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">{s.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <button
                      onClick={() => {
                        setEditId(s.id);
                        setAddForm({
                          iccid: s.iccid || "",
                          phone_number: s.phone_number || "",
                          provider: s.provider || "Telkomsel IoT"
                        });
                        setIsAddOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Edit
                    </button>
                  </td>`
);

// Change modal title if editing
content = content.replace(
  /<h3 className="text-lg font-semibold text-slate-900">Register SIM Card<\/h3>/,
  `<h3 className="text-lg font-semibold text-slate-900">{editId ? "Edit SIM Card" : "Register SIM Card"}</h3>`
);

fs.writeFileSync(path, content);
console.log("Patched sim-cards page completely");
