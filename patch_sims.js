const fs = require('fs');
const path = '/home/arfian107/Projects/adatrack/admin/src/app/(protected)/sim-cards/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update error handling to show backend message
content = content.replace(
  /\} else \{\s*toast\.error\("Failed to register SIM card\."\);\s*\}/,
  `} else {
        const errData = await res.json().catch(()=>({}));
        toast.error(errData.message || "Failed to register SIM card.");
      }`
);

// Update ICCID input (make optional)
content = content.replace(
  /<label className="block text-sm font-medium text-slate-700">ICCID \(Serial Number\)<\/label>\s*<input\s*type="text"\s*required\s*value=\{addForm\.iccid\}/,
  `<label className="block text-sm font-medium text-slate-700">ICCID (Optional, auto-generated if blank)</label>
                <input
                  type="text"
                  value={addForm.iccid}`
);

// Update Phone Number input to force +
content = content.replace(
  /<input\s*type="text"\s*required\s*value=\{addForm\.phone_number\}\s*onChange=\{\(e\) => setAddForm\(\{\.\.\.addForm, phone_number: e\.target\.value\}\)\}\s*className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 py-2 px-3 focus:ring-2 focus:ring-indigo-600 sm:text-sm"\s*placeholder="e\.g\. \+62811\.\.\."/,
  `<input
                  type="text"
                  required
                  pattern="^\\+[0-9]+"
                  title="Format harus menggunakan kode negara, contoh: +62811..."
                  value={addForm.phone_number}
                  onChange={(e) => setAddForm({...addForm, phone_number: e.target.value})}
                  className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 py-2 px-3 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                  placeholder="e.g. +62811..."`
);

fs.writeFileSync(path, content);
console.log("Patched sim cards page");
