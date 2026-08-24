const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'apps/business/src/features/core/tracking/components/shared/VehicleList.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Update search input
const searchInputOld = `<div className="shrink-0 px-3 py-2 bg-background border-b border-border flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full h-8 rounded-md border border-border bg-surface-elevated pl-8 pr-3 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger transition-shadow placeholder:text-foreground-muted"
          />
        </div>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface-elevated text-foreground-muted hover:bg-surface transition-colors shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>`;
const searchInputNew = `<div className="shrink-0 px-3 py-2 bg-background border-b border-border flex gap-2 items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-foreground-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full pl-8 pr-2 py-1.5 text-[11px] rounded border border-border bg-surface text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger transition-shadow"
          />
        </div>
        <button
          type="button"
          className="flex h-[30px] w-[30px] items-center justify-center rounded border border-border bg-surface text-foreground-muted hover:bg-surface-elevated transition-colors shrink-0"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>`;
content = content.replace(searchInputOld, searchInputNew);

// 2. Remove container padding
content = content.replace(
  /<div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 space-y-2\.5 bg-surface" role="list">/g,
  '<div className="flex-1 min-h-0 overflow-y-auto bg-surface space-y-2.5 pb-2.5" role="list">'
);
content = content.replace(
  /<div key=\{group\.id\} role="listitem" className="bg-background border border-border rounded-md shadow-\[0_2px_8px_-4px_rgba\(0,0,0,0\.03\)\] overflow-hidden">/g,
  '<div key={group.id} role="listitem" className="bg-background border-y border-border shadow-[0_2px_8px_-4px_rgba(0,0,0,0.03)] overflow-hidden">'
);

// 3. Update default expandedGroups state to false
content = content.replace(
  /Object\.fromEntries\(groups\.map\(\(g\) => \[g\.id, true\]\)\)/g,
  'Object.fromEntries(groups.map((g) => [g.id, false]))'
);
content = content.replace(
  /const isExpanded = expandedGroups\[group\.id\] \?\? true;/g,
  'const isExpanded = expandedGroups[group.id] ?? false;'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Final touches applied safely.');
