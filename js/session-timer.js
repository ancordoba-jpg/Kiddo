(function () {
  "use strict";

  let sessionSeconds = 0;
  let lastTick = Date.now();

  function updateDisplay() {
    const hours = Math.floor(sessionSeconds / 3600);
    const minutes = Math.floor((sessionSeconds % 3600) / 60);

    const value =
      String(hours).padStart(2, "0") + ":" +
      String(minutes).padStart(2, "0");

    document.querySelectorAll("#kiddo-session-time").forEach(el => {
      el.textContent = value;
    });
  }

  updateDisplay();

  setInterval(() => {
    const now = Date.now();

    if (document.visibilityState === "visible" &&
        !window.kiddoApp?.isLockedOut) {
      sessionSeconds += Math.max(
        0,
        Math.min(2, (now - lastTick) / 1000)
      );
    }

    lastTick = now;
    updateDisplay();
  }, 1000);

  document.addEventListener("visibilitychange", () => {
    lastTick = Date.now();
  });
})();
