(function () {
  "use strict";

  let lastHeartsTime = 0;

  function createHearts(target) {
    const now = Date.now();

    if (now - lastHeartsTime < 900) return;
    lastHeartsTime = now;

    const rect = target.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const count = reducedMotion ? 1 : 5;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement("span");

      heart.className = "puky-floating-heart";
      heart.textContent = "♥";

      const offsetX = (Math.random() - 0.5) * rect.width * 0.65;
      const offsetY = Math.random() * 20;

      heart.style.left =
        rect.left + rect.width / 2 + offsetX + "px";

      heart.style.top =
        rect.top + rect.height * 0.30 + offsetY + "px";

      heart.style.animationDelay = i * 80 + "ms";

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1600);
    }
  }

  document.addEventListener("click", function (event) {
    const puky = event.target.closest("#puky-main-img, #puky2d-img, #puky-outfit-wrap, #puky2d-mount");

    if (!puky) return;

    createHearts(puky);
  });
})();
