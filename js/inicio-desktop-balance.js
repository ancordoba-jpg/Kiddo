(() => {
  function norm(t) {
    return (t || "").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function findByText(root, text) {
    const target = norm(text);
    return [...root.querySelectorAll("div, p, span, button")]
      .find(el => norm(el.textContent).includes(target));
  }

  function lowestCommonAncestor(a, b) {
    const ancestors = new Set();
    let n = a;
    while (n) {
      ancestors.add(n);
      n = n.parentElement;
    }
    n = b;
    while (n) {
      if (ancestors.has(n)) return n;
      n = n.parentElement;
    }
    return null;
  }

  function initInicioDesktop() {
    const screen = document.querySelector("#screen-inicio");
    if (!screen) return;

    const leftBubble =
      findByText(screen, "vamos a aprender juntos") ||
      findByText(screen, "vamos aprender juntos");

    const rightBubble =
      findByText(screen, "puky te manda un abrazo") ||
      findByText(screen, "te mando un abrazo");

    if (!leftBubble || !rightBubble) return;

    const hero = lowestCommonAncestor(leftBubble, rightBubble);
    if (!hero) return;

    hero.classList.add("kiddo-home-hero");
    leftBubble.classList.add("kiddo-home-bubble-left");
    rightBubble.classList.add("kiddo-home-bubble-right");

    let puky =
      [...hero.querySelectorAll("img")]
        .find(el => /puky|koala/i.test([el.alt, el.id, el.className, el.src].join(" ")));

    if (!puky) {
      const imgs = [...hero.querySelectorAll("img")].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 80 && r.height > 80;
      });

      if (imgs.length > 0) {
        imgs.sort((a, b) => {
          const ra = a.getBoundingClientRect();
          const rb = b.getBoundingClientRect();
          return (rb.width * rb.height) - (ra.width * ra.height);
        });
        puky = imgs[0];
      }
    }

    if (!puky) return;

    puky.classList.add("kiddo-home-puky");

    let wrap = puky.closest("picture") || puky.parentElement || puky;
    if (wrap && wrap !== hero) {
      wrap.classList.add("kiddo-home-puky-wrap");
    } else {
      puky.classList.add("kiddo-home-puky-wrap");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initInicioDesktop);
  } else {
    initInicioDesktop();
  }

  window.addEventListener("load", initInicioDesktop);
})();