const { React } = window;

const timerOptions = (function () {
  'use strict';

  let publicAPIs = {};

  publicAPIs.useTimer = (at, fn) => {
    React.useEffect(() => {
      if (typeof at === 'number') {
        const timeout = setTimeout(fn, Math.max(0, at - Date.now()));

        return () => clearTimeout(timeout);
      }
    }, [at, fn]);
  };

  publicAPIs.clearTimers = () => {
    for (let t of timers) {
      clearInterval(t);
      timers.pop(t);
    }
  };
  return publicAPIs;
})();
