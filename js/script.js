(function() {
  'use strict';

  // ==========================================
  // DOM Ready Handler
  // ==========================================
  document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initSmoothScroll();
    initAuthForms();
    initEarningsCalculator();
    initToast();
  });

  // ==========================================
  // Navbar Scroll Effect
  // ==========================================
  function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }

  // ==========================================
  // Mobile Menu Toggle
  // ==========================================
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');

    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', function() {
      toggle.classList.toggle('active');
      mobileNav.classList.toggle('active');
      document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    mobileLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
        toggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // Scroll Animations (Fade In)
  // ==========================================
  function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (!fadeElements.length) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeElements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // ==========================================
  // Smooth Scroll for Anchor Links
  // ==========================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 80; // navbar height
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // ==========================================
  // Auth Forms (Login / Signup)
  // ==========================================
  function initAuthForms() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    // Tab switching
    authTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        const targetForm = this.dataset.tab;

        authTabs.forEach(function(t) { t.classList.remove('active'); });
        authForms.forEach(function(f) { f.classList.remove('active'); });

        this.classList.add('active');
        document.getElementById(targetForm + '-form').classList.add('active');
      });
    });

    // Login form validation
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateLoginForm()) {
          simulateAuthSubmit(loginForm, 'login');
        }
      });
    }

    // Signup form validation
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateSignupForm()) {
          simulateAuthSubmit(signupForm, 'signup');
        }
      });
    }

    // Real-time validation on input
    document.querySelectorAll('.form-input').forEach(function(input) {
      input.addEventListener('input', function() {
        clearFieldError(this);
      });

      input.addEventListener('blur', function() {
        validateField(this);
      });
    });
  }

  function validateLoginForm() {
    let isValid = true;

    const email = document.getElementById('login-email');
    const password = document.getElementById('login-password');

    if (!email || !password) return false;

    if (!isValidEmail(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email address');
      isValid = false;
    }

    if (password.value.length < 6) {
      showFieldError(password, 'Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  }

  function validateSignupForm() {
    let isValid = true;

    const fullName = document.getElementById('signup-name');
    const email = document.getElementById('signup-email');
    const phone = document.getElementById('signup-phone');
    const password = document.getElementById('signup-password');
    const confirmPassword = document.getElementById('signup-confirm');
    const role = document.getElementById('signup-role');

    if (!fullName || !email || !phone || !password || !confirmPassword || !role) return false;

    if (fullName.value.trim().length < 2) {
      showFieldError(fullName, 'Please enter your full name');
      isValid = false;
    }

    if (!isValidEmail(email.value.trim())) {
      showFieldError(email, 'Please enter a valid email address');
      isValid = false;
    }

    if (!isValidPhone(phone.value.trim())) {
      showFieldError(phone, 'Please enter a valid phone number');
      isValid = false;
    }

    if (password.value.length < 8) {
      showFieldError(password, 'Password must be at least 8 characters');
      isValid = false;
    }

    if (password.value !== confirmPassword.value) {
      showFieldError(confirmPassword, 'Passwords do not match');
      isValid = false;
    }

    if (!role.value) {
      showFieldError(role, 'Please select your role');
      isValid = false;
    }

    return isValid;
  }

  function validateField(input) {
    const value = input.value.trim();
    const id = input.id;

    clearFieldError(input);

    if (id === 'login-email' || id === 'signup-email') {
      if (value && !isValidEmail(value)) {
        showFieldError(input, 'Please enter a valid email address');
      }
    }

    if (id === 'signup-phone') {
      if (value && !isValidPhone(value)) {
        showFieldError(input, 'Please enter a valid phone number');
      }
    }

    if (id === 'login-password') {
      if (value && value.length < 6) {
        showFieldError(input, 'Password must be at least 6 characters');
      }
    }

    if (id === 'signup-password') {
      if (value && value.length < 8) {
        showFieldError(input, 'Password must be at least 8 characters');
      }
    }

    if (id === 'signup-confirm') {
      const password = document.getElementById('signup-password');
      if (value && password && value !== password.value) {
        showFieldError(input, 'Passwords do not match');
      }
    }
  }

  function showFieldError(input, message) {
    input.classList.add('error');
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      const errorEl = formGroup.querySelector('.form-error');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('visible');
      }
    }
  }

  function clearFieldError(input) {
    input.classList.remove('error');
    const formGroup = input.closest('.form-group');
    if (formGroup) {
      const errorEl = formGroup.querySelector('.form-error');
      if (errorEl) {
        errorEl.classList.remove('visible');
      }
    }
  }

  function isValidEmail(email) {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    return /^[\\+]?[(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$/.test(phone.replace(/\\s/g, ''));
  }

  function simulateAuthSubmit(form, type) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Processing...';

    // Simulate API call
    setTimeout(function() {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      if (type === 'login') {
        showToast('Welcome back! Redirecting...', 'success');
        // In production: window.location.href = 'https://app.pupopadiride.com/dashboard';
      } else {
        showToast('Account created successfully! Please verify your email.', 'success');
      }
    }, 1500);
  }

  // ==========================================
  // Earnings Calculator (Riders Page)
  // ==========================================
  function initEarningsCalculator() {
    const slider = document.getElementById('rides-slider');
    const ridesDisplay = document.getElementById('rides-count');
    const dailyEarnings = document.getElementById('daily-earnings');
    const weeklyEarnings = document.getElementById('weekly-earnings');
    const monthlyEarnings = document.getElementById('monthly-earnings');

    if (!slider) return;

    const AVG_FARE = 500; // Average fare in NGN
    const COMMISSION = 0.10; // 10% commission

    function updateEarnings() {
      const rides = parseInt(slider.value);
      const grossDaily = rides * AVG_FARE;
      const netDaily = grossDaily * (1 - COMMISSION);
      const netWeekly = netDaily * 7;
      const netMonthly = netDaily * 30;

      if (ridesDisplay) ridesDisplay.textContent = rides;
      if (dailyEarnings) dailyEarnings.textContent = '₦' + formatNumber(netDaily);
      if (weeklyEarnings) weeklyEarnings.textContent = '₦' + formatNumber(netWeekly);
      if (monthlyEarnings) monthlyEarnings.textContent = '₦' + formatNumber(netMonthly);
    }

    slider.addEventListener('input', updateEarnings);
    updateEarnings(); // Initial calculation
  }

  function formatNumber(num) {
    return num.toLocaleString('en-NG');
  }

  // ==========================================
  // Toast Notifications
  // ==========================================
  function initToast() {
    // Toast container is created dynamically
  }

  function showToast(message, type) {
    // Remove existing toasts
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    const icon = type === 'success'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

    toast.innerHTML = icon + '<span>' + message + '</span>';
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function() {
      toast.classList.add('show');
    });

    // Auto dismiss
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        toast.remove();
      }, 300);
    }, 4000);
  }

  // Expose showToast globally
  window.showToast = showToast;

  // ==========================================
  // CTA Button Tracking (Ready for analytics)
  // ==========================================
  document.querySelectorAll('[data-track]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const event = this.dataset.track;
      const label = this.dataset.label || '';

      // Google Analytics 4 ready
      if (typeof gtag !== 'undefined') {
        gtag('event', event, {
          event_category: 'engagement',
          event_label: label
        });
      }

      // Meta Pixel ready
      if (typeof fbq !== 'undefined') {
        fbq('trackCustom', event, { label: label });
      }

      console.log('Track:', event, label);
    });
  });

  // ==========================================
  // Passive Event Listeners for Performance
  // ==========================================
  window.addEventListener('scroll', function() {}, { passive: true });
  window.addEventListener('touchstart', function() {}, { passive: true });

})();
