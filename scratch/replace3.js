const fs = require('fs');
const path = '/Users/beni/Developer/DEV_AJB/binago/apps/business/src/features/modules/rental/handover/components/HandoverForm.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<div className=\{cn\("relative w-full mx-auto transition-all duration-500", !isDropdownOpen \? "max-w-xl" : "max-w-4xl"\)\} ref=\{searchContainerRef\}>/g,
  '<div className="relative w-full max-w-4xl mx-auto transition-all duration-500" ref={searchContainerRef}>'
);

content = content.replace(
  /<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">\n\s*<Search className="h-5 w-5 text-muted-foreground" \/>\n\s*<\/div>/g,
  `<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">\n                  <Search className="h-4 w-4 text-muted-foreground" />\n                </div>`
);

content = content.replace(
  /className="flex h-14 w-full rounded-2xl border border-input bg-white dark:bg-neutral-900 pl-12 pr-4 text-base transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm hover:shadow-md focus:shadow-md"/g,
  'className="flex h-11 w-full rounded-xl border border-input bg-white dark:bg-neutral-900 pl-10 pr-4 text-sm transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm hover:shadow-md focus:shadow-md"'
);

fs.writeFileSync(path, content);
