/**
 * Tirupati Jewellery & Casting - Main Script
 */

(function () {
  'use strict';

  /* ---- Page Loader ---- */
  function hideLoader() {
    var loader = document.getElementById('page-loader');
    if (loader && !loader.classList.contains('hidden')) {
      loader.classList.add('hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(hideLoader, 600);
  });

  window.addEventListener('load', function () {
    setTimeout(hideLoader, 300);
  });

  setTimeout(hideLoader, 3000);

  /* ---- Scroll Progress Bar ---- */
  var progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    });
  }

  /* ---- Sticky Navbar ---- */
  var navbar = document.querySelector('.navbar-main');
  var navbarSpacer = document.querySelector('.navbar-spacer');
  var topBar = document.querySelector('.top-bar');

  function getNavbarOffset() {
    if (!navbar) return 0;
    var topBarHeight = topBar && window.getComputedStyle(topBar).display !== 'none' ? topBar.offsetHeight : 0;
    return topBarHeight;
  }

  function updateStickyNavbar() {
    if (!navbar) return;
    var offset = getNavbarOffset();
    if (window.scrollY > offset) {
      navbar.classList.add('sticky');
      if (navbarSpacer) navbarSpacer.classList.add('active');
    } else {
      navbar.classList.remove('sticky');
      if (navbarSpacer) navbarSpacer.classList.remove('active');
    }
  }

  if (navbar) {
    updateStickyNavbar();
    window.addEventListener('scroll', updateStickyNavbar);
    window.addEventListener('resize', updateStickyNavbar);
  }

  /* ---- Active Nav Link ---- */
  var pathParts = window.location.pathname.split('/').filter(Boolean);
  var currentPage = pathParts[pathParts.length - 1] || 'index.html';
  if (currentPage.indexOf('.html') === -1) currentPage = 'index.html';

  document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && (href === 'index.html' || href === './' || href === '/'))) {
      link.classList.add('active');
    }
  });

  /* ---- Scroll Animations ---- */
  var animatedElements = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

  function revealElement(el) {
    el.classList.add('visible');
  }

  function isInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  }

  if (animatedElements.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          revealElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    animatedElements.forEach(function (el) {
      if (isInViewport(el)) {
        revealElement(el);
      } else {
        observer.observe(el);
      }
    });
  } else {
    animatedElements.forEach(revealElement);
  }

  /* ---- Animated Counters ---- */
  var counters = document.querySelectorAll('.counter-number');
  var countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'), 10);
      var suffix = counter.getAttribute('data-suffix') || '';
      var duration = 2000;
      var start = 0;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        counter.textContent = current + suffix;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target + suffix;
        }
      }

      requestAnimationFrame(step);
    });

    countersAnimated = true;
  }

  if (counters.length && 'IntersectionObserver' in window) {
    var counterSection = document.querySelector('.counter-section');
    if (counterSection) {
      var counterObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounters();
            counterObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      counterObserver.observe(counterSection);
    }
  }

  /* ---- Testimonial Slider ---- */
  var track = document.querySelector('.testimonial-track');
  var dots = document.querySelectorAll('.testimonial-dots button');
  var currentSlide = 0;
  var slideInterval;

  function goToSlide(index) {
    if (!track) return;
    var total = track.children.length;
    currentSlide = (index + total) % total;
    track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';

    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  if (track && dots.length) {
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        goToSlide(i);
        resetAutoSlide();
      });
    });

    function resetAutoSlide() {
      clearInterval(slideInterval);
      slideInterval = setInterval(function () {
        goToSlide(currentSlide + 1);
      }, 5000);
    }

    resetAutoSlide();
  }

  /* ---- Back To Top ---- */
  var backToTop = document.querySelector('.back-to-top');

  if (backToTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Smooth Scroll for Anchor Links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = navbar && navbar.classList.contains('sticky') ? 80 : 0;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ---- Form Validation ---- */
  var contactForms = document.querySelectorAll('.contact-form');

  contactForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var isValid = true;

      form.querySelectorAll('[required]').forEach(function (field) {
        clearError(field);

        if (!field.value.trim()) {
          showError(field, 'This field is required.');
          isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
          showError(field, 'Please enter a valid email address.');
          isValid = false;
        } else if (field.type === 'tel' && !isValidPhone(field.value)) {
          showError(field, 'Please enter a valid 10-digit phone number.');
          isValid = false;
        }
      });

      if (isValid) {
        var successMsg = form.querySelector('.form-success');
        if (successMsg) {
          successMsg.classList.remove('d-none');
          form.reset();
          setTimeout(function () {
            successMsg.classList.add('d-none');
          }, 5000);
        } else {
          alert('Thank you! Your message has been sent successfully. We will contact you soon.');
          form.reset();
        }
      }
    });

    form.querySelectorAll('[required]').forEach(function (field) {
      field.addEventListener('input', function () {
        clearError(field);
      });
    });
  });

  function showError(field, message) {
    field.classList.add('is-invalid');
    var feedback = field.parentElement.querySelector('.invalid-feedback');
    if (feedback) {
      feedback.textContent = message;
    }
  }

  function clearError(field) {
    field.classList.remove('is-invalid');
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
  }

  /* ---- Close mobile menu on link click ---- */
  var navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  var navCollapse = document.querySelector('.navbar-collapse');

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navCollapse && navCollapse.classList.contains('show')) {
        var toggler = document.querySelector('.navbar-toggler');
        if (toggler) toggler.click();
      }
    });
  });

})();
