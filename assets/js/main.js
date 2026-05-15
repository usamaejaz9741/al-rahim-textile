(function () {
  "use strict";

  /* ------ Navbar scroll effect ------ */
  const navbar = document.querySelector(".site-navbar");
  if (navbar) {
    /**
     * Toggles the 'scrolled' class on the navbar based on the window's vertical scroll position.
     * @returns {void}
     */
    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ------ Active nav link ------ */
  /**
   * Normalizes a URL path by removing hashes, query parameters, and trailing slashes.
   * If the path is empty, it defaults to 'index.html'.
   *
   * @param {string} value - The raw URL path or href string to normalize.
   * @returns {string} The normalized filename or 'index.html'.
   */
  function normalizePath(value) {
    const clean = (value || "").split("#")[0].split("?")[0].replace(/\/+$/, "");
    return clean.split("/").pop() || "index.html";
  }

  const currentPath = normalizePath(window.location.pathname);

  document.querySelectorAll(".site-navbar .nav-link").forEach(function (link) {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("active", normalizePath(href) === currentPath);
  });

  /* ------ Mobile menu auto-close ------ */
  const navCollapse = document.getElementById("mainNav");
  if (navCollapse) {
    document.querySelectorAll("#mainNav .nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.bootstrap && bootstrap.Collapse) {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  /* ------ Counter animation ------ */
  /**
   * Animates a numerical counter from zero to a target value specified in the element's data attributes.
   * Supports decimal values, custom prefixes/suffixes, and respect for reduced motion preferences.
   *
   * @param {HTMLElement} el - The DOM element containing counter data attributes (data-count, data-suffix, data-prefix).
   * @returns {void}
   */
  function animateCounter(el) {
    if (el.dataset.animated) return;

    const target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;

    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    let startTime = null;

    /**
     * Formats the final target value for display based on whether it is a decimal or a large number.
     * @returns {string} The formatted final counter value.
     */
    function formatFinalValue() {
      if (isDecimal) return prefix + target.toFixed(1) + suffix;
      if (target >= 1000) return prefix + target.toLocaleString() + suffix;
      return prefix + target + suffix;
    }

    if (prefersReducedMotion) {
      el.textContent = formatFinalValue();
      el.dataset.animated = "true";
      return;
    }

    el.dataset.animated = "true";

    /**
     * Formats an intermediate value during the animation.
     * @param {number} value - The current raw value of the counter.
     * @returns {string} The formatted value for display.
     */
    function formatValue(value) {
      if (isDecimal) return prefix + value.toFixed(1) + suffix;
      if (target >= 1000) return prefix + Math.floor(value).toLocaleString() + suffix;
      return prefix + Math.floor(value) + suffix;
    }

    /**
     * The animation step function called by requestAnimationFrame.
     * @param {number} timestamp - The current time provided by requestAnimationFrame.
     * @returns {void}
     */
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      el.textContent = formatValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatFinalValue();
      }
    }

    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    document.querySelectorAll("[data-count]").forEach(function (el) {
      observer.observe(el);
    });
  } else {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      animateCounter(el);
    });
  }

  /* ------ Form validation ------ */
  /**
   * Sets up an event listener for form submission to handle validation and display a success state.
   *
   * @param {string} formId - The ID of the form element to handle.
   * @returns {void}
   */
  function setupFormHandler(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated");
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-circle me-1"></i> Submitted';
      btn.disabled = true;

      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.disabled = false;
        form.reset();
        form.classList.remove("was-validated");
      }, 3000);
    });
  }

  setupFormHandler("inquiryForm");
  setupFormHandler("contactForm");

  /* ------ Smooth scroll for anchor links ------ */
  document
    .querySelectorAll('a[href^="#"]:not([data-bs-toggle])')
    .forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;
        let targetEl = null;
        try {
          targetEl = document.querySelector(targetId);
        } catch (err) {
          return;
        }
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }
      });
    });

  /* ------ Hero Slider Logic ------ */
  const slides = document.querySelectorAll(".hero-slide");
  const nextBtn = document.querySelector(".hero-control-btn.next");
  const prevBtn = document.querySelector(".hero-control-btn.prev");
  let currentSlide = 0;
  let slideInterval;

  /** Image paths for slides 2-8 (slide 1 is loaded via CSS for instant first paint) */
  const heroImages = [
    null,
    "assets/images/factory-hero.webp",
    "assets/images/products/bedding-hero.webp",
    "assets/images/finishing-hero.webp",
    "assets/images/new-hero-1.webp",
    "assets/images/new-hero-2.webp",
    "assets/images/new-hero-3.webp",
    "assets/images/new-hero-4.webp",
  ];

  /**
   * Ensures the background image for a given slide index is loaded.
   * @param {number} index - The slide index to load.
   * @returns {void}
   */
  function loadSlideImage(index) {
    if (
      slides[index] &&
      heroImages[index] &&
      !slides[index].dataset.loaded
    ) {
      slides[index].style.backgroundImage =
        "url('" + heroImages[index] + "')";
      slides[index].dataset.loaded = "true";
    }
  }

  if (slides.length > 0) {
    /**
     * Changes the current slide to the specified index, lazy-loading images as needed.
     * @param {number} index - The index of the slide to display.
     * @returns {void}
     */
    const showSlide = (index) => {
      slides[currentSlide].classList.remove("active");
      currentSlide = (index + slides.length) % slides.length;
      loadSlideImage(currentSlide);
      slides[currentSlide].classList.add("active");

      const nextIndex = (currentSlide + 1) % slides.length;
      loadSlideImage(nextIndex);
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    const startAutoSlide = () => {
      stopAutoSlide();
      slideInterval = setInterval(nextSlide, 7000);
    };

    const stopAutoSlide = () => {
      if (slideInterval) clearInterval(slideInterval);
    };

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
        startAutoSlide();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        startAutoSlide();
      });
    }

    /* Pause auto-slide when the tab is not visible */
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopAutoSlide();
      } else {
        startAutoSlide();
      }
    });

    startAutoSlide();
  }

})();
