/* ==========================================================================
   Counter Animation
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const animateCounter = (counter) => {
    const target = Number(counter.dataset.counter || 0);
    const duration = 1200;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, counterObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.55 }
    );

    counters.forEach((counter) => observer.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }
});
