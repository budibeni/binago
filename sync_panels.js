const fs = require('fs');
const path = require('path');

function syncPanel(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Backgrounds
  content = content.replace(/bg-white dark:bg-surface/g, 'bg-surface');
  content = content.replace(/bg-neutral-50 dark:bg-neutral-800\/80/g, 'bg-background');
  content = content.replace(/bg-\[\#f7f7f7\] dark:bg-neutral-800\/80/g, 'bg-background');
  content = content.replace(/bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/g, 'bg-surface-elevated hover:bg-surface-elevated/80');
  content = content.replace(/hover:bg-neutral-100 dark:hover:bg-neutral-800/g, 'hover:bg-surface-elevated');
  content = content.replace(/hover:bg-neutral-50 dark:hover:bg-neutral-800/g, 'hover:bg-surface-elevated');
  content = content.replace(/bg-white dark:bg-neutral-900/g, 'bg-surface');
  content = content.replace(/focus:bg-neutral-50/g, 'focus:bg-surface-elevated');

  // Borders
  content = content.replace(/hover:border-neutral-400 dark:hover:border-neutral-500/g, 'hover:border-foreground-muted');
  content = content.replace(/border-neutral-200 dark:border-neutral-800/g, 'border-border');
  content = content.replace(/border-neutral-100/g, 'border-border');

  // Timeline track
  content = content.replace(/bg-neutral-200 dark:bg-neutral-700\/50/g, 'bg-border');

  // Tooltip
  content = content.replace(/bg-neutral-900 dark:bg-white text-white dark:text-neutral-900/g, 'bg-foreground text-background');

  // Font sizes: normalize text-[10px] sm:text-[11px] to text-[11px] to match PlaybackMapLayerPanel
  content = content.replace(/text-\[10px\] sm:text-\[11px\]/g, 'text-[11px]');

  // Colors
  content = content.replace(/text-neutral-500/g, 'text-foreground-muted');
  content = content.replace(/text-neutral-600/g, 'text-foreground-secondary');
  content = content.replace(/text-neutral-400/g, 'text-foreground-muted');
  content = content.replace(/text-neutral-800/g, 'text-foreground');
  
  fs.writeFileSync(filePath, content, 'utf8');
}

syncPanel(path.join(__dirname, 'apps/business/src/features/core/tracking/components/playback/PlaybackPanel.tsx'));
syncPanel(path.join(__dirname, 'apps/business/src/features/core/tracking/components/heatmap/HeatmapPanel.tsx'));

console.log('Panels synced.');
