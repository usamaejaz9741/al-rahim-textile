(function () {
  "use strict";

  /* ------ Navbar scroll effect ------ */
  const navbar = document.querySelector(".site-navbar");
  if (navbar) {
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
  const path = window.location.pathname.replace(/\/+$/, "");
  const currentPath = path.split("/").pop() || "index.html";

  document.querySelectorAll(".site-navbar .nav-link").forEach(function (link) {
    const href = (link.getAttribute("href") || "").split("#")[0].split("?")[0];
    const normalizedHref = href.replace(/\/+$/, "") || "index.html";
    link.classList.toggle("active", normalizedHref === currentPath);
  });

  /* ------ Mobile menu auto-close ------ */
  const navCollapse = document.getElementById("mainNav");
  if (navCollapse) {
    document.querySelectorAll("#mainNav .nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.bootstrap && bootstrap.Collapse) {
          var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  /* ------ Counter animation ------ */
  function animateCounter(el) {
    if (el.dataset.animated) return;

    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;

    var suffix = el.dataset.suffix || "";
    var isDecimal = target % 1 !== 0;
    var duration = 1800;
    var startTime = null;

    function formatFinalValue() {
      if (isDecimal) return target.toFixed(1) + suffix;
      if (target >= 1000) return target.toLocaleString() + suffix;
      return target + suffix;
    }

    if (prefersReducedMotion) {
      el.textContent = formatFinalValue();
      el.dataset.animated = "true";
      return;
    }

    el.dataset.animated = "true";

    function formatValue(value) {
      if (isDecimal) return value.toFixed(1) + suffix;
      if (target >= 1000) return Math.floor(value).toLocaleString() + suffix;
      return Math.floor(value) + suffix;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = eased * target;

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
    var observer = new IntersectionObserver(
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
  function setupFormHandler(formId) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add("was-validated");
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;

      var originalText = btn.innerHTML;
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
        var targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;
        var targetEl = null;
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
})();
