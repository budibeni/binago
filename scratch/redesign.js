const fs = require('fs');
const path = '/Users/beni/Developer/DEV_AJB/binago/apps/business/src/features/modules/rental/handover/components/HandoverForm.tsx';
let content = fs.readFileSync(path, 'utf8');
const lines = content.split('\n');

const newCode = `        {!contract ? (
          <div className={cn(
            "flex flex-col transition-all duration-700 ease-out w-full",
            isDropdownOpen ? "justify-start mt-4" : "justify-center min-h-[60vh]"
          )}>
            {!isDropdownOpen && (
              <div className="text-center mb-10 animate-in zoom-in-95 fade-in slide-in-from-bottom-8 duration-700">
                <div className="relative mx-auto mb-6 w-20 h-20">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping duration-1000 opacity-50"></div>
                  <div className="absolute inset-2 bg-primary/10 rounded-full animate-pulse"></div>
                  <div className="relative w-full h-full bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-full flex items-center justify-center shadow-sm">
                    <Search className="w-8 h-8 text-primary/80" />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent mb-3">
                  {labels.formTitle || 'Proses Serah Terima'}
                </h3>
                <p className="text-[15px] text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Ketik <span className="font-semibold text-slate-700 dark:text-slate-200">nomor kontrak, nama pelanggan,</span> atau <span className="font-semibold text-slate-700 dark:text-slate-200">plat nomor</span> kendaraan untuk memulai.
                </p>
              </div>
            )}

            <div className="relative w-full max-w-4xl mx-auto transition-all duration-500" ref={searchContainerRef}>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-foreground-muted">
                  <Search className="h-4 w-4" />
                </div>
                <input 
                  type="text"
                  placeholder="Cari nomor kontrak, nama pelanggan, atau plat nomor..."
                  value={eligibleSearch}
                  onChange={(e) => {
                    setEligibleSearch(e.target.value);
                    if (!isDropdownOpen) setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className={cn(
                    "flex h-11 w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground",
                    "placeholder:text-foreground-subtle transition-colors duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-offset-1",
                    "border-border hover:border-border-strong focus:ring-neutral-400",
                    "pl-9 shadow-sm"
                  )}
                />
              </div>

              {isDropdownOpen && (`;

// Replace lines 193 to 226
lines.splice(193, 226 - 193 + 1, newCode);
fs.writeFileSync(path, lines.join('\n'));
