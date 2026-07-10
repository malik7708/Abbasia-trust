/* ==========================================================================
   Gallery Filters And Lightbox
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll("[data-filter]");
  const galleryItems = document.querySelectorAll("[data-gallery-item]");
  const lightbox = document.querySelector("[data-lightbox]");
  const lightboxImage = document.querySelector("[data-lightbox-image]");
  const lightboxTitle = document.querySelector("[data-lightbox-title]");
  const lightboxClose = document.querySelector("[data-lightbox-close]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");

      galleryItems.forEach((item) => {
        const isVisible = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !isVisible);
      });
    });
  });

  const openLightbox = (item) => {
    if (!lightbox || !lightboxImage || !lightboxTitle) return;
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.dataset.title || "";
    lightboxTitle.textContent = item.dataset.title || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
  };

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => openLightbox(item));
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
});
