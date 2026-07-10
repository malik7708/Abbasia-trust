/* ==========================================================================
   Core UI Interactions
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-header]");
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  const revealItems = document.querySelectorAll(".reveal");

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const newsSearch = document.querySelector("[data-news-search]");
  const newsCards = document.querySelectorAll("[data-news-list] .news-card");

  if (newsSearch && newsCards.length) {
    newsSearch.addEventListener("input", () => {
      const query = newsSearch.value.trim().toLowerCase();
      newsCards.forEach((card) => {
        const haystack = `${card.dataset.title || ""} ${card.dataset.category || ""}`;
        card.hidden = query.length > 0 && !haystack.includes(query);
      });
    });
  }
});
