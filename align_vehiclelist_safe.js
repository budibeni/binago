const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'apps/business/src/features/core/tracking/components/shared/VehicleList.tsx');
let content = fs.readFileSync(file, 'utf8');

// Update Search Input strictly (matching PlaybackMapLayerPanel's search styling but keeping flex layout)
// We do this first before text-neutral replacements to avoid mismatch
content = content.replace(
  /className="w-full h-8 rounded-md border border-border bg-\[#fafafa\] dark:bg-neutral-900 pl-8 pr-3 text-\[12px\] text-foreground focus:outline-none focus:border-neutral-300 focus:bg-white transition-all placeholder:text-neutral-400"/g,
  'className="w-full h-8 rounded-md border border-border bg-surface-elevated pl-8 pr-3 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-danger focus:border-danger transition-shadow placeholder:text-foreground-muted"'
);
content = content.replace(
  /bg-\[#fafafa\] dark:bg-neutral-900 text-neutral-500 hover:bg-white dark:hover:bg-neutral-800/g,
  'bg-surface-elevated text-foreground-muted hover:bg-surface'
);

// Colors replacement to semantic tokens
content = content.replace(/text-neutral-500 dark:text-neutral-400/g, 'text-foreground-muted');
content = content.replace(/text-neutral-800 dark:text-neutral-200/g, 'text-foreground');
content = content.replace(/text-neutral-600 dark:text-neutral-400/g, 'text-foreground-secondary');

// Hover states
content = content.replace(/hover:bg-\[#fafafa\] dark:hover:bg-neutral-800\/40/g, 'hover:bg-surface-elevated/50');
content = content.replace(/bg-neutral-50 dark:bg-neutral-800\/80/g, 'bg-surface-elevated');
content = content.replace(/hover:bg-\[#fafafa\] dark:hover:bg-neutral-800/g, 'hover:bg-surface-elevated');

// Backgrounds logic to align with design system while keeping layout contrast
content = content.replace(/bg-white dark:bg-neutral-950/g, 'bg-background');
content = content.replace(/bg-white dark:bg-neutral-900/g, 'bg-background'); // headers and cards
content = content.replace(/bg-\[#fafafa\] dark:bg-neutral-900/g, 'bg-surface'); // Select All bar, footer
content = content.replace(/bg-\[#fcfcfc\] dark:bg-neutral-950/g, 'bg-surface'); // The scroll area behind the cards
content = content.replace(/bg-\[#fafafa\] dark:bg-neutral-800/g, 'bg-surface-elevated');
content = content.replace(/bg-white dark:bg-neutral-800/g, 'bg-surface-elevated');

// Badges
content = content.replace(/text-\[#de3531\] bg-red-50 dark:bg-red-900\/20/g, 'text-danger bg-danger/10');
content = content.replace(/text-\[#de3531\]/g, 'text-danger');

// Remaining text-neutral replacements where applicable
content = content.replace(/text-neutral-400 hover:bg-neutral-50 hover:text-foreground/g, 'text-foreground-muted hover:bg-surface hover:text-foreground');
content = content.replace(/text-neutral-400/g, 'text-foreground-muted');
content = content.replace(/text-neutral-500/g, 'text-foreground-muted');
content = content.replace(/text-neutral-300/g, 'text-foreground-disabled');

fs.writeFileSync(file, content, 'utf8');
console.log('VehicleList styling aligned safely.');
