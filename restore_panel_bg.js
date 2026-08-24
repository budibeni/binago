const fs = require('fs');
const path = require('path');

function makeWhite(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // We want to replace the main container's bg-surface with bg-background.
  // In my previous script, I replaced 'bg-white dark:bg-surface' with 'bg-surface'.
  // The main container typically has 'flex items-center w-full h-full ... bg-surface'
  content = content.replace(
    /className=\{cn\('flex items-center w-full h-full px-2 sm:px-4 bg-surface shadow/g,
    "className={cn('flex items-center w-full h-full px-2 sm:px-4 bg-background shadow"
  );
  
  // Also check if there's any flex flex-col container for HeatmapPanel
  content = content.replace(
    /className=\{cn\('flex flex-col w-full h-full px-2 sm:px-4 bg-surface shadow/g,
    "className={cn('flex flex-col w-full h-full px-2 sm:px-4 bg-background shadow"
  );

  // In HeatmapPanel.tsx, the container might be:
  // className={cn('flex flex-col sm:flex-row items-center w-full h-full px-2 sm:px-4 bg-surface shadow...
  content = content.replace(
    /className=\{cn\('flex flex-col sm:flex-row items-center w-full h-full px-2 sm:px-4 bg-surface shadow/g,
    "className={cn('flex flex-col sm:flex-row items-center w-full h-full px-2 sm:px-4 bg-background shadow"
  );

  // Just to be safe, I'll globally replace 'px-2 sm:px-4 bg-surface shadow' with 'px-2 sm:px-4 bg-background shadow'
  content = content.replace(
    /px-2 sm:px-4 bg-surface shadow/g,
    'px-2 sm:px-4 bg-background shadow'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

makeWhite(path.join(__dirname, 'apps/business/src/features/core/tracking/components/playback/PlaybackPanel.tsx'));
makeWhite(path.join(__dirname, 'apps/business/src/features/core/tracking/components/heatmap/HeatmapPanel.tsx'));

console.log('Background restored to white (bg-background).');
