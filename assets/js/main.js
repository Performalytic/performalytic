(function(){
  'use strict';

  /* ============================================
     Scroll Reveal Animations
  ============================================ */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!revealEls.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealEls.forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ============================================
     Back to Top Button
  ============================================ */
  function initBackToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
      document.body.appendChild(btn);
    }

    var scrollThreshold = 400;
    var ticking = false;

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          if (window.scrollY > scrollThreshold) {
            btn.classList.add('visible');
          } else {
            btn.classList.remove('visible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     Lazy Image Load Handler
  ============================================ */
  function initLazyImages() {
    var imgs = document.querySelectorAll('img[loading="lazy"]');
    imgs.forEach(function(img) {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', function() {
          img.classList.add('loaded');
        });
        img.addEventListener('error', function() {
          img.classList.add('loaded');
        });
      }
    });
  }

  /* ============================================
     Counter Animation
  ============================================ */
  function initCounters() {
    var counters = document.querySelectorAll('.hero-stat h3');
    if (!counters.length) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var text = el.textContent.trim();
          var numStr = text.replace(/[^0-9]/g, '');
          var suffix = text.replace(/[0-9]/g, '');
          var target = parseInt(numStr, 10);
          if (isNaN(target) || target === 0) return;

          var duration = 2000;
          var startTime = null;

          function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            el.innerHTML = current + suffix;
            if (progress < 1) {
              window.requestAnimationFrame(animate);
            } else {
              el.innerHTML = target + suffix;
            }
          }

          window.requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(el) {
      observer.observe(el);
    });
  }

  /* ============================================
     Smooth Anchor Scrolling
  ============================================ */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var navHeight = 80;
          var targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
      });
    });
  }

  /* ============================================
     Mobile Menu Enhancement
  ============================================ */
  function initMobileMenu() {
    var mt = document.getElementById('menuToggle');
    var mm = document.getElementById('mobileMenu');
    if (!mt || !mm) return;

    mt.addEventListener('click', function(e) {
      var active = mm.classList.toggle('active');
      mt.setAttribute('aria-expanded', active ? 'true' : 'false');
      e.stopPropagation();
    });

    mm.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        mm.classList.remove('active');
        mt.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on scroll
    var tickingMenu = false;
    window.addEventListener('scroll', function() {
      if (!tickingMenu) {
        window.requestAnimationFrame(function() {
          if (mm.classList.contains('active')) {
            mm.classList.remove('active');
            mt.setAttribute('aria-expanded', 'false');
          }
          tickingMenu = false;
        });
        tickingMenu = true;
      }
    }, { passive: true });
  }

  /* ============================================
     Nav Dropdown Touch Support
  ============================================ */
  function initDropdownTouch() {
    if (!('ontouchstart' in window)) return;
    document.querySelectorAll('.nav-links > li > a[aria-haspopup]').forEach(function(trigger) {
      trigger.addEventListener('click', function(e) {
        var li = this.parentElement;
        var dropdown = li.querySelector('.dropdown, .nav-dropdown');
        if (!dropdown) return;
        var isOpen = dropdown.style.display === 'block';
        // Close all first
        document.querySelectorAll('.dropdown, .nav-dropdown').forEach(function(d) {
          d.style.display = '';
        });
        if (!isOpen) {
          e.preventDefault();
          dropdown.style.display = 'block';
        }
      });
    });

    // Close dropdowns when tapping outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.nav-links > li')) {
        document.querySelectorAll('.dropdown, .nav-dropdown').forEach(function(d) {
          d.style.display = '';
        });
      }
    });
  }

  /* ============================================
     Parallax Hero Glow Effect
  ============================================ */
  function initHeroParallax() {
    var hero = document.querySelector('.hero, .blog-hero, .post-hero');
    if (!hero) return;

    hero.addEventListener('mousemove', function(e) {
      var rect = hero.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var glows = hero.querySelectorAll('::before, ::after');
      // Subtle CSS custom prop approach instead
      hero.style.setProperty('--mouse-x', (x * 20) + 'px');
      hero.style.setProperty('--mouse-y', (y * 20) + 'px');
    });
  }

  /* ============================================
     Navbar Background on Scroll
  ============================================ */
  function initNavScroll() {
    var nav = document.querySelector('nav');
    if (!nav) return;
    var tickingNav = false;

    function updateNav() {
      if (window.scrollY > 10) {
        nav.style.background = 'rgba(255,255,255,0.98)';
        nav.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
      } else {
        nav.style.background = 'rgba(255,255,255,0.97)';
        nav.style.boxShadow = 'none';
      }
    }

    window.addEventListener('scroll', function() {
      if (!tickingNav) {
        window.requestAnimationFrame(function() {
          updateNav();
          tickingNav = false;
        });
        tickingNav = true;
      }
    }, { passive: true });

    updateNav();
  }

  /* ============================================
     Initialize Everything
  ============================================ */
  function init() {
    initScrollReveal();
    initBackToTop();
    initLazyImages();
    initCounters();
    initSmoothAnchors();
    initMobileMenu();
    initDropdownTouch();
    initHeroParallax();
    initNavScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
