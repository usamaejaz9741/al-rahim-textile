(function () {
  'use strict';

  /* ------ Navbar scroll effect ------ */
  const navbar = document.querySelector('.site-navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------ Active nav link ------ */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-navbar .nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  /* ------ Mobile menu auto-close ------ */
  const navCollapse = document.getElementById('mainNav');
  if (navCollapse) {
    document.querySelectorAll('#mainNav .nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        var bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      });
    });
  }

  /* ------ Counter animation ------ */
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      if (el.dataset.animated) return;
  
      var target = parseFloat(el.dataset.count);
      var suffix = el.dataset.suffix || '';
      var isDecimal = target % 1 !== 0;
      var duration = 1800;
      var startTime = null;
  
      el.dataset.animated = 'true';
  
      function formatValue(value) {
        if (isDecimal) {
          return value.toFixed(1) + suffix;
        } else if (target >= 1000) {
          return Math.floor(value).toLocaleString() + suffix;
        } else {
          return Math.floor(value) + suffix;
        }
      }
  
      function formatFinalValue() {
        if (isDecimal) {
          return target.toFixed(1) + suffix;
        } else if (target >= 1000) {
          return target.toLocaleString() + suffix;
        } else {
          return target + suffix;
        }
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
    });
  }
  
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });
  
    var statsSection = document.querySelector('[data-count]');
    if (statsSection) {
      observer.observe(statsSection.closest('section') || statsSection);
    }
  } else {
    animateCounters();
  }

  /* ------ Form validation ------ */
  function setupFormHandler(formId) {
    var form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var originalText = btn.innerHTML;
      btn.innerHTML = '<i class="bi bi-check-circle me-1"></i> Submitted';
      btn.disabled = true;

      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.disabled = false;
        form.reset();
        form.classList.remove('was-validated');
      }, 3000);
    });
  }

  setupFormHandler('inquiryForm');
  setupFormHandler('contactForm');

  /* ------ Smooth scroll for anchor links ------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
