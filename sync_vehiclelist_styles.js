const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'apps/business/src/features/core/tracking/components/shared/VehicleList.tsx');
let content = fs.readFileSync(file, 'utf8');

// Colors
content = content.replace(/text-neutral-500 dark:text-neutral-400/g, 'text-foreground-muted');
content = content.replace(/text-neutral-800 dark:text-neutral-200/g, 'text-foreground');
content = content.replace(/text-neutral-600 dark:text-neutral-400/g, 'text-foreground-secondary');
content = content.replace(/text-neutral-500 bg-\[#fafafa\] dark:bg-neutral-800/g, 'text-foreground-muted bg-surface-elevated');
content = content.replace(/text-neutral-500 bg-white dark:bg-neutral-800/g, 'text-foreground-muted bg-surface-elevated');
content = content.replace(/text-neutral-400 hover:bg-neutral-50 hover:text-foreground/g, 'text-foreground-muted hover:bg-surface hover:text-foreground');
content = content.replace(/bg-\[#fafafa\] dark:bg-neutral-900 pl-8 pr-3 text-\[12px\] text-foreground focus:outline-none focus:border-neutral-300 focus:bg-white transition-all placeholder:text-neutral-400/g, 'bg-surface-elevated pl-8 pr-3 text-[11px] text-foreground focus:outline-none focus:border-neutral-300 placeholder:text-foreground-placeholder transition-colors');
content = content.replace(/bg-\[#fafafa\] dark:bg-neutral-900 text-neutral-500 hover:bg-white dark:hover:bg-neutral-800/g, 'bg-surface-elevated text-foreground-muted hover:bg-surface');

// Remaining text-neutral replacements where applicable
content = content.replace(/text-neutral-400/g, 'text-foreground-muted');
content = content.replace(/text-neutral-500/g, 'text-foreground-muted');
content = content.replace(/text-neutral-300/g, 'text-foreground-disabled');

// Backgrounds
content = content.replace(/bg-white dark:bg-neutral-950/g, 'bg-background');
content = content.replace(/bg-white dark:bg-neutral-900/g, 'bg-background');
content = content.replace(/bg-\[#fafafa\] dark:bg-neutral-900/g, 'bg-surface');
content = content.replace(/bg-\[#fcfcfc\] dark:bg-neutral-950/g, 'bg-background');

// Badges
content = content.replace(/text-\[#de3531\] bg-red-50 dark:bg-red-900\/20/g, 'text-danger bg-danger/10');
content = content.replace(/text-\[#de3531\]/g, 'text-danger');

// Item hover
content = content.replace(/hover:bg-\[#fafafa\] dark:hover:bg-neutral-800\/40/g, 'hover:bg-surface-elevated/50');
content = content.replace(/bg-neutral-50 dark:bg-neutral-800\/80/g, 'bg-surface-elevated');

fs.writeFileSync(file, content, 'utf8');
console.log('VehicleList styling updated.');
