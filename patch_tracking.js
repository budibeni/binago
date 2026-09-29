const fs = require('fs');
const file = 'apps/business/src/features/core/tracking/TrackingFeature.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace handlePlay to be more robust and log things
const newHandlePlay = `  const handlePlay = React.useCallback(() => {
    stopTimer();

    setPlaybackPointIndex((prevIdx) => {
      const data = playbackDataRef.current;
      if (data && prevIdx >= data.points.length - 1) {
        return 0;
      }
      return prevIdx;
    });

    setPlaybackState((prev) => {
      if (prev.status !== 'ready' && prev.status !== 'paused') return prev;
      const isFinished = prev.currentTime >= prev.totalDuration && prev.totalDuration > 0;
      return { ...prev, status: 'playing', currentTime: isFinished ? 0 : prev.currentTime };
    });

    timerRef.current = setInterval(() => {
      const data = playbackDataRef.current;
      if (!data) return;
      const speed = playbackSpeedRef.current;

      setPlaybackPointIndex((prevIdx) => {
        const nextIdx = Math.min(prevIdx + speed, data.points.length - 1);
        
        setPlaybackState((ps) => {
          // Remove the status check here! It causes race conditions if state hasn't flushed.
          // If the timer is running, we are playing.
          
          if (nextIdx >= data.points.length - 1) {
            stopTimer();
            return { ...ps, status: 'ready', currentTime: ps.totalDuration };
          }
          return { ...ps, status: 'playing', currentTime: nextIdx * 15 };
        });
        
        return nextIdx;
      });
    }, 200);
  }, [stopTimer]);`;

content = content.replace(/const handlePlay = React\.useCallback\(\(\) => \{[\s\S]*?\}, \[stopTimer\]\);/, newHandlePlay);

fs.writeFileSync(file, content);
console.log('Patched handlePlay again');
