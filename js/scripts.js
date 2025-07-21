/**
 * =====================================================
 * Valley Peak Roofing - Site JavaScript
 * =====================================================
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', function () {
  // Initialize all modules
  App.init();
});

// Main application namespace
const App = {
  // Initialize all modules
  init: function () {
    // Register all modules here
    this.registerModules([
      MobileNavigation,
      NavigationBehavior,
      ScrollAnimations,
      FAQAccordion,
      // FormHandling,
      PhoneFormatting,
      ImageHandling,
      PerformanceOptimization,
      AnalyticsTracking,
      MobileButtonDelay,
      BackToTopButton,
      PortfolioLightbox,
      FAQPageModule,
      // ContactPage,
      ActiveNavigation,

      PortfolioGallery,
      ReusableAccordion,
      SkylightPage,
    ]);
  },

  // Register and initialize an array of modules
  registerModules: function (moduleArray) {
    moduleArray.forEach((module) => {
      if (module && typeof module.init === 'function') {
        module.init();
      }
    });
  },
};
/**
 * =====================================================
 * MOBILE NAVIGATION MODULE
 * =====================================================
 */
const MobileNavigation = {
  init: function () {
    // Mobile Navigation Elements
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const body = document.body;

    // Only initialize if required elements exist
    if (!hamburger || !mobileMenu) return;

    // Close mobile menu function
    const closeMobileMenu = () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      body.classList.remove('menu-open');
    };

    // Toggle mobile menu function
    const toggleMobileMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      body.classList.toggle('menu-open');
    };

    // Setup mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);

    // Setup close menu button
    if (closeMenu) {
      closeMenu.addEventListener('click', closeMobileMenu);
    }

    // Mobile dropdown toggles
    const mobileDropdownToggles = document.querySelectorAll(
      '.mobile-dropdown-toggle'
    );

    mobileDropdownToggles.forEach((toggle) => {
      toggle.addEventListener('click', function () {
        const content = this.nextElementSibling;
        const isActive = this.classList.contains('active');

        // Close all other dropdowns
        mobileDropdownToggles.forEach((otherToggle) => {
          if (otherToggle !== this) {
            otherToggle.classList.remove('active');
            otherToggle.nextElementSibling.classList.remove('active');
          }
        });

        // Toggle current dropdown
        this.classList.toggle('active');
        content.classList.toggle('active');
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (e) {
      if (
        mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close mobile menu on window resize - Updated to 975px
    window.addEventListener('resize', function () {
      if (window.innerWidth > 975) {
        closeMobileMenu();
      }
    });

    // Store reference for other modules
    this.closeMobileMenu = closeMobileMenu;
  },
};

/**
 * =====================================================
 * NAVIGATION BEHAVIOR MODULE
 * =====================================================
 */
const NavigationBehavior = {
  init: function () {
    this.initSmoothScrolling();
    this.initNavbarScrollEffect();
  },

  // Smooth scrolling for anchor links
  initSmoothScrolling: function () {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Handle estimate modal - now using ModalSystem from modal.js
        if (href === '#estimate') {
          e.preventDefault();
          if (window.ModalSystem) {
            window.ModalSystem.open('estimate-modal');
          }
          return;
        }

        // Handle other anchor links
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();

          // Close mobile menu if open
          if (MobileNavigation.closeMobileMenu) {
            MobileNavigation.closeMobileMenu();
          }

          // Get the target's position relative to the document
          const targetRect = target.getBoundingClientRect();
          const currentScrollY =
            window.pageYOffset || document.documentElement.scrollTop;
          const headerHeight = 80;

          // Calculate the final scroll position
          const targetPosition = targetRect.top + currentScrollY - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth',
          });
        }
      });
    });
  },

  // Navbar scroll effects
  initNavbarScrollEffect: function () {
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Add/remove background on scroll
      if (scrollTop > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
      } else {
        navbar.style.background = '#ffffff';
        navbar.style.backdropFilter = 'none';
      }

      lastScrollTop = scrollTop;
    };

    // Debounce scroll handler
    const debouncedScrollHandler = this.debounce(handleScroll, 10);
    window.addEventListener('scroll', debouncedScrollHandler);
  },

  // Utility function for debouncing
  debounce: function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

/**
 * =====================================================
 * SCROLL ANIMATION CLASSES MODULE - UPDATED VERSION
 * =====================================================
 */
const ScrollAnimations = {
  init: function () {
    this.initIntersectionObserver();
  },

  initIntersectionObserver: function () {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px', // Trigger when element is 50px into viewport
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Optional: unobserve after animation to improve performance
          // observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Select all elements with animation classes - INCLUDING all new animation classes
    const animatedElements = document.querySelectorAll(
      '.fade-in, .fade-in-delay, .fade-in-delay-2, .fade-in-delay-3, ' +
        '.fade-in-stagger-1, .fade-in-stagger-2, .fade-in-stagger-3, ' +
        '.fade-in-stagger-4, .fade-in-stagger-5, .fade-in-grid, ' +
        '.slide-up, .slide-up-delay, .slide-up-delay-2, .slide-up-delay-3, ' +
        '.slide-up-delay-4, .slide-up-delay-5, .slide-up-delay-6, ' +
        '.slide-up-delay-7, .slide-up-delay-8, .slide-in-left, .slide-in-right, ' +
        '.slide-in-right-delay, .slide-in-right-delay-2, .slide-in-right-delay-3, ' +
        '.slide-in-left-delay, .slide-in-left-delay-2, .slide-in-left-delay-3, ' +
        '.zoom-in, .timeline-animate, .stagger-animation, ' +
        '.repairs-benefits-grid, .repairs-gallery-grid' // Added these for grid animations
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });

    // Special handling for grid containers to add visible class
    const gridContainers = document.querySelectorAll(
      '.repairs-benefits-grid, .repairs-gallery-grid'
    );

    gridContainers.forEach((container) => {
      observer.observe(container);
    });

    // Special handling for staggered animations
    const staggerContainers = document.querySelectorAll('.stagger-animation');
    staggerContainers.forEach((container) => {
      // Ensure children don't trigger individually
      const children = container.children;
      Array.from(children).forEach((child) => {
        child.style.transitionDelay = ''; // Will be set by CSS
      });
    });
  },
};

/**
 * =====================================================
 * FAQ ACCORDION MODULE - FIXED VERSION
 * =====================================================
 */
const FAQAccordion = {
  init: function () {
    // Only initialize for FAQ items NOT in the dedicated FAQ page
    const homepageFaqQuestions = document.querySelectorAll(
      '.faq-section .faq-question:not(.faq-service-section .faq-question)'
    );

    homepageFaqQuestions.forEach((question) => {
      question.addEventListener('click', function () {
        const answer = this.nextElementSibling;
        const isActive = this.classList.contains('active');

        // Close all other FAQ items (only homepage ones)
        homepageFaqQuestions.forEach((otherQuestion) => {
          if (otherQuestion !== this) {
            otherQuestion.classList.remove('active');
            otherQuestion.nextElementSibling.classList.remove('active');
          }
        });

        // Toggle current FAQ item
        this.classList.toggle('active');
        answer.classList.toggle('active');
      });
    });
  },
};

/**
 * =====================================================
 * FORM HANDLING MODULE
 * =====================================================
 */
const FormHandling = {
  init: function () {
    const estimateForm = document.querySelector('.estimate-form');

    if (estimateForm) {
      estimateForm.addEventListener('submit', (e) =>
        this.handleFormSubmission(e)
      );
    }
  },

  handleFormSubmission: function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate form
    if (!this.validateForm(form, data)) {
      this.showErrorMessage('Please fill in all required fields correctly.');
      return;
    }

    // Show success state
    this.showSuccessState(form);

    // In a real implementation, send data to server
    console.log('Form submitted:', data);

    // Reset form after delay
    setTimeout(() => {
      this.resetForm(form);
      if (window.ModalSystem) {
        window.ModalSystem.close('estimate-modal');
      }
    }, 3000);
  },

  validateForm: function (form, data) {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'message',
    ];
    let isValid = true;

    // Check required fields
    requiredFields.forEach((field) => {
      const input = form.querySelector(`[name="${field}"]`);
      if (!data[field] || data[field].trim() === '') {
        this.setFieldError(input, true);
        isValid = false;
      } else {
        this.setFieldError(input, false);
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInput = form.querySelector('[name="email"]');
    if (!emailRegex.test(data.email)) {
      this.setFieldError(emailInput, true);
      isValid = false;
    }

    // Phone validation
    const phoneInput = form.querySelector('[name="phone"]');
    const cleanPhone = data.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      this.setFieldError(phoneInput, true);
      isValid = false;
    }

    return isValid;
  },

  setFieldError: function (input, hasError) {
    if (hasError) {
      input.style.borderColor = '#e74c3c';
    } else {
      input.style.borderColor = '#e9ecef';
    }
  },

  showSuccessState: function (form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Thank You! We'll Contact You Soon";
    submitBtn.style.backgroundColor = '#27ae60';
    submitBtn.disabled = true;

    // Store original values for reset
    submitBtn.dataset.originalText = originalText;
    submitBtn.dataset.originalBgColor = submitBtn.style.backgroundColor;
  },

  resetForm: function (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    form.reset();
    submitBtn.textContent =
      submitBtn.dataset.originalText || 'Schedule My Free Inspection';
    submitBtn.style.backgroundColor = submitBtn.dataset.originalBgColor || '';
    submitBtn.disabled = false;

    // Reset field borders
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      input.style.borderColor = '#e9ecef';
    });
  },

  showErrorMessage: function (message) {
    alert(message); // In production, use a better notification system
  },
};

/**
 * =====================================================
 * PHONE FORMATTING MODULE
 * =====================================================
 */
const PhoneFormatting = {
  init: function () {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');

    phoneInputs.forEach((input) => {
      input.addEventListener('input', this.formatPhoneNumber);
    });
  },

  formatPhoneNumber: function (e) {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = '';

    if (value.length > 0) {
      if (value.length <= 3) {
        formattedValue = `(${value}`;
      } else if (value.length <= 6) {
        formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      } else {
        formattedValue = `(${value.slice(0, 3)}) ${value.slice(
          3,
          6
        )}-${value.slice(6, 10)}`;
      }
    }

    e.target.value = formattedValue;
  },
};

/**
 * =====================================================
 * IMAGE HANDLING MODULE
 * =====================================================
 */
const ImageHandling = {
  init: function () {
    this.initImageLoading();
    this.initLazyLoading();
  },

  initImageLoading: function () {
    const images = document.querySelectorAll('img');

    images.forEach((img) => {
      // Set initial state for loading animation
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';

      img.addEventListener('load', function () {
        this.style.opacity = '1';
      });

      // If image is already loaded (cached)
      if (img.complete) {
        img.style.opacity = '1';
      }
    });
  },

  initLazyLoading: function () {
    // Lazy loading for images with data-src attribute
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              let imageUrl = img.dataset.src;

              // Add mobile optimization for Google Cloud Storage images
              if (
                window.innerWidth <= 768 &&
                imageUrl.includes('storage.googleapis.com')
              ) {
                const params =
                  window.innerWidth <= 480
                    ? 'w=400&h=300&fit=crop'
                    : 'w=600&h=400&fit=crop';
                imageUrl = imageUrl.includes('?')
                  ? `${imageUrl}&${params}`
                  : `${imageUrl}?${params}`;
              }

              img.src = imageUrl;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach((img) => imageObserver.observe(img));
    }
  },
};

/**
 * =====================================================
 * PERFORMANCE OPTIMIZATION MODULE
 * =====================================================
 */
const PerformanceOptimization = {
  init: function () {
    this.initBodyScrollControl();
  },

  initBodyScrollControl: function () {
    const body = document.body;

    // Prevent body scroll when mobile menu or modal is open
    const handleBodyScroll = () => {
      if (
        body.classList.contains('menu-open') ||
        body.classList.contains('modal-open')
      ) {
        body.style.overflow = 'hidden';
      } else {
        body.style.overflow = '';
      }
    };

    // Create a MutationObserver to watch for class changes
    const bodyObserver = new MutationObserver(handleBodyScroll);
    bodyObserver.observe(body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  },
};

/**
 * =====================================================
 * ANALYTICS TRACKING MODULE
 * =====================================================
 */
const AnalyticsTracking = {
  init: function () {
    this.initClickTracking();
  },

  initClickTracking: function () {
    // Track important button clicks
    const trackableButtons = document.querySelectorAll(
      '.btn-primary, .phone-link'
    );

    trackableButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();
        this.trackClick('button_click', buttonText);
      });
    });
  },

  trackClick: function (eventName, elementType) {
    // In a real implementation, send this to your analytics service
    console.log(`Analytics: ${eventName} - ${elementType}`);

    // Example for Google Analytics (uncomment if you have GA set up):
    // gtag('event', eventName, {
    //     'event_category': 'User Interaction',
    //     'event_label': elementType
    // });
  },
};

/**
 * =====================================================
 * MOBILE BUTTON DELAY MODULE
 * =====================================================
 */
const MobileButtonDelay = {
  init: function () {
    this.initMobileButtonDelay();
    this.initTouchFeedback();
  },

  // Function to check if device is mobile - Updated to 975px
  isMobileDevice: function () {
    return (
      window.innerWidth <= 975 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    );
  },

  // Handle button clicks with animation delay on mobile
  handleButtonClick: function (event) {
    console.log('Button clicked:', event.currentTarget); // Debug log

    // Only apply delay on mobile devices
    if (!this.isMobileDevice()) {
      console.log('Desktop device, no delay applied'); // Debug log
      return; // Let the normal click proceed on desktop
    }

    console.log('Mobile device detected'); // Debug log

    const button = event.currentTarget;
    const href = button.getAttribute('href');

    console.log('Button href:', href); // Debug log

    // Handle buttons without href (like form submits)
    if (!href) {
      button.classList.add('btn-mobile-active');
      setTimeout(() => {
        button.classList.remove('btn-mobile-active');
      }, 600);
      return;
    }

    // Special handling for estimate modal buttons
    if (href === '#estimate') {
      console.log('Estimate modal button - applying delay'); // Debug log
      event.preventDefault();
      event.stopPropagation();

      // Force hover state for animation
      button.classList.add('btn-mobile-active');

      // Add delay then open modal
      setTimeout(() => {
        button.classList.remove('btn-mobile-active');
        if (window.ModalSystem) {
          window.ModalSystem.open('estimate-modal');
        }
      }, 600);
      return;
    }

    // For other anchor links (smooth scroll), external links, phone/email - let them proceed normally
    if (
      href.startsWith('#') ||
      href === '' ||
      button.getAttribute('target') === '_blank' ||
      href.startsWith('tel:') ||
      href.startsWith('mailto:')
    ) {
      console.log('Special link type, no delay applied'); // Debug log
      return;
    }

    // For regular navigation links, prevent default and add delay
    console.log('Applying navigation delay'); // Debug log
    event.preventDefault();
    event.stopPropagation();

    // Force hover state for animation
    button.classList.add('btn-mobile-active');

    // Add a delay to let the animation play
    setTimeout(() => {
      console.log('Navigating to:', href); // Debug log
      // Navigate to the intended destination
      window.location.href = href;
    }, 600); // 600ms delay
  },

  // Initialize the mobile button delay functionality
  initMobileButtonDelay: function () {
    // Apply to all buttons and links with btn class
    const buttons = document.querySelectorAll('.btn, a.btn');
    console.log('Found buttons:', buttons.length); // Debug log

    buttons.forEach((button) => {
      // Use capture phase to ensure we get the event first
      button.addEventListener(
        'click',
        (event) => this.handleButtonClick(event),
        true
      );
    });
  },

  // Add touch event handling for better mobile experience
  initTouchFeedback: function () {
    const buttons = document.querySelectorAll('.btn, a.btn');

    buttons.forEach((button) => {
      // Add touch start event for immediate visual feedback
      button.addEventListener(
        'touchstart',
        () => {
          if (this.isMobileDevice()) {
            button.classList.add('btn-touched');
          }
        },
        { passive: true }
      );

      // Remove touch class on touch end
      button.addEventListener(
        'touchend',
        () => {
          if (this.isMobileDevice()) {
            setTimeout(() => {
              button.classList.remove('btn-touched');
            }, 200);
          }
        },
        { passive: true }
      );

      // Handle touch cancel (when user drags finger away)
      button.addEventListener(
        'touchcancel',
        () => {
          if (this.isMobileDevice()) {
            button.classList.remove('btn-touched');
          }
        },
        { passive: true }
      );
    });
  },
};

/**
 * =====================================================
 * PORTFOLIO LIGHTBOX MODULE - OPTIMIZED
 * =====================================================
 */
const PortfolioLightbox = {
  currentImageIndex: 0,
  currentGalleryImages: [],
  currentProjectTitle: '',

  init: function () {
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxCaption = document.querySelector('.lightbox-caption');
    this.lightboxCounter = document.querySelector('.lightbox-counter');
    this.closeBtn = document.querySelector('.lightbox-close');
    this.prevBtn = document.querySelector('.lightbox-prev');
    this.nextBtn = document.querySelector('.lightbox-next');

    if (!this.lightbox) return;

    this.initEventListeners();
  },

  initEventListeners: function () {
    // Portfolio item clicks
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach((item) => {
      item.addEventListener('click', () => this.openLightbox(item));
    });

    // Close button
    this.closeBtn.addEventListener('click', () => this.closeLightbox());

    // Previous/Next buttons
    this.prevBtn.addEventListener('click', () => this.changeImage(-1));
    this.nextBtn.addEventListener('click', () => this.changeImage(1));

    // Click outside image to close
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (this.lightbox.style.display === 'block') {
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.changeImage(-1);
        if (e.key === 'ArrowRight') this.changeImage(1);
      }
    });

    // Touch gestures for mobile - OPTIMIZED WITH PASSIVE LISTENERS
    let touchStartX = 0;
    let touchEndX = 0;

    this.lightbox.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    ); // ← ADDED PASSIVE: TRUE

    this.lightbox.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      },
      { passive: true }
    ); // ← ADDED PASSIVE: TRUE
  },

  openLightbox: function (item) {
    // Get the specific project's images
    const imagesData = item.dataset.images;
    const title = item.dataset.title;
    const location = item.dataset.location;

    // Parse the images array from the data attribute
    this.currentGalleryImages = JSON.parse(imagesData);
    this.currentProjectTitle = `${title} - ${location}`;

    // Start at first image
    this.currentImageIndex = 0;
    this.showImage(0);

    // Show lightbox
    this.lightbox.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  },

  closeLightbox: function () {
    this.lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
  },

  showImage: function (index) {
    // Update image
    this.lightboxImg.src = this.currentGalleryImages[index];
    this.lightboxImg.alt = `${this.currentProjectTitle} - Image ${index + 1}`;

    // Update caption
    this.lightboxCaption.textContent = this.currentProjectTitle;

    // Update counter
    this.lightboxCounter.textContent = `${index + 1} / ${
      this.currentGalleryImages.length
    }`;

    // Update navigation visibility
    this.prevBtn.style.display = index === 0 ? 'none' : 'block';
    this.nextBtn.style.display =
      index === this.currentGalleryImages.length - 1 ? 'none' : 'block';
  },

  changeImage: function (direction) {
    this.currentImageIndex += direction;

    // Ensure index stays within bounds
    if (this.currentImageIndex < 0) {
      this.currentImageIndex = 0;
    } else if (this.currentImageIndex >= this.currentGalleryImages.length) {
      this.currentImageIndex = this.currentGalleryImages.length - 1;
    }

    this.showImage(this.currentImageIndex);
  },

  handleSwipe: function (startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        this.changeImage(1);
      } else {
        // Swipe right - previous image
        this.changeImage(-1);
      }
    }
  },
};

/**
 * =====================================================
 * FAQ PAGE MODULE - FIXED VERSION
 * =====================================================
 */
const FAQPageModule = {
  searchInput: null,
  clearButton: null,
  resultsCount: null,
  faqItems: null,
  categoryTabs: null,
  serviceSections: null,
  currentCategory: 'all',
  searchTimeout: null,

  init: function () {
    // Only initialize on FAQ pages
    if (!document.querySelector('.faq-hero')) return;

    console.log('Initializing FAQ Page Module');

    // Get DOM elements
    this.searchInput = document.getElementById('faq-search-input');
    this.clearButton = document.getElementById('clear-search');
    this.resultsCount = document.getElementById('search-results-count');
    this.faqItems = document.querySelectorAll('.faq-service-section .faq-item');
    this.categoryTabs = document.querySelectorAll('.faq-tab');
    this.serviceSections = document.querySelectorAll('.faq-service-section');

    // Initialize components
    this.initSearch();
    this.initTabs();
    this.initFAQAccordion();
    this.initScrollToSection();
  },

  // Search Functionality
  initSearch: function () {
    if (!this.searchInput) return;

    // Search input handler
    this.searchInput.addEventListener('input', (e) => {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value);
      }, 300);

      // Show/hide clear button
      if (e.target.value.length > 0) {
        this.clearButton.classList.add('visible');
      } else {
        this.clearButton.classList.remove('visible');
      }
    });

    // Clear button handler
    this.clearButton.addEventListener('click', () => {
      this.searchInput.value = '';
      this.clearButton.classList.remove('visible');
      this.performSearch('');
      this.searchInput.focus();
    });

    // Handle enter key
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.performSearch(e.target.value);
      }
    });
  },

  performSearch: function (query) {
    const searchTerm = query.toLowerCase().trim();
    let visibleCount = 0;
    let totalCount = this.faqItems.length;

    // Reset all items first
    this.faqItems.forEach((item) => {
      item.classList.remove('hidden', 'highlight');
      const question = item.querySelector('.faq-question span');
      const answer = item.querySelector('.faq-answer p');

      // Remove existing highlights
      if (question) question.innerHTML = question.textContent;
      if (answer) answer.innerHTML = answer.textContent;
    });

    if (searchTerm === '') {
      // No search term - show based on current category
      this.filterByCategory(this.currentCategory);
      this.updateResultsCount('');
      return;
    }

    // Search through questions and answers
    this.faqItems.forEach((item) => {
      const questionText = item
        .querySelector('.faq-question span')
        .textContent.toLowerCase();
      const answerText = item
        .querySelector('.faq-answer p')
        .textContent.toLowerCase();
      const category = item.dataset.category;

      // Check if search term exists in question or answer
      const matchesSearch =
        questionText.includes(searchTerm) || answerText.includes(searchTerm);
      const matchesCategory =
        this.currentCategory === 'all' || category === this.currentCategory;

      if (matchesSearch && matchesCategory) {
        item.classList.remove('hidden');
        item.classList.add('highlight');
        visibleCount++;

        // Highlight search terms
        this.highlightSearchTerm(item, searchTerm);

        // Auto-expand if search term is in answer
        if (
          answerText.includes(searchTerm) &&
          !questionText.includes(searchTerm)
        ) {
          this.expandItem(item);
        }
      } else {
        item.classList.add('hidden');
      }
    });

    // Update sections visibility
    this.updateSectionsVisibility();

    // Update results count
    if (searchTerm) {
      this.updateResultsCount(
        `Found ${visibleCount} result${
          visibleCount !== 1 ? 's' : ''
        } for "${query}"`
      );
    } else {
      this.updateResultsCount('');
    }

    // Show no results message if needed
    this.handleNoResults(visibleCount, searchTerm);
  },

  highlightSearchTerm: function (item, searchTerm) {
    const question = item.querySelector('.faq-question span');
    const answer = item.querySelector('.faq-answer p');

    // Create regex for case-insensitive search
    const regex = new RegExp(`(${searchTerm})`, 'gi');

    // Highlight in question
    if (question) {
      const highlightedText = question.textContent.replace(
        regex,
        '<span class="highlight-text">$1</span>'
      );
      question.innerHTML = highlightedText;
    }

    // Highlight in answer
    if (answer) {
      const highlightedText = answer.innerHTML.replace(
        regex,
        '<span class="highlight-text">$1</span>'
      );
      answer.innerHTML = highlightedText;
    }
  },

  expandItem: function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = question.querySelector('i');

    if (!question.classList.contains('active')) {
      question.classList.add('active');
      answer.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      icon.classList.remove('fa-plus');
      icon.classList.add('fa-minus');
    }
  },

  updateResultsCount: function (text) {
    if (this.resultsCount) {
      this.resultsCount.textContent = text;
    }
  },

  updateSectionsVisibility: function () {
    this.serviceSections.forEach((section) => {
      const visibleItems = section.querySelectorAll('.faq-item:not(.hidden)');
      if (visibleItems.length === 0) {
        section.classList.add('hidden');
      } else {
        section.classList.remove('hidden');
      }
    });
  },

  handleNoResults: function (count, searchTerm) {
    const existingMessage = document.querySelector('.no-results-message');

    if (count === 0 && searchTerm) {
      if (!existingMessage) {
        const message = document.createElement('div');
        message.className = 'no-results-message';
        message.innerHTML = `
          <i class="fas fa-search"></i>
          <h3>No results found</h3>
          <p>We couldn't find any FAQs matching "${searchTerm}"</p>
          <p>Try different keywords or browse all FAQs</p>
          <button class="btn btn-primary" onclick="FAQPageModule.clearSearch()">
            Clear Search
          </button>
        `;

        const container = document.querySelector(
          '.faq-content-section .container'
        );
        container.appendChild(message);
      }
    } else if (existingMessage) {
      existingMessage.remove();
    }
  },

  clearSearch: function () {
    this.searchInput.value = '';
    this.clearButton.classList.remove('visible');
    this.performSearch('');
    this.searchInput.focus();
  },

  // Tab Navigation
  initTabs: function () {
    this.categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Update active tab
        this.categoryTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter by category
        const category = tab.dataset.category;
        this.currentCategory = category;
        this.filterByCategory(category);

        // Re-run search if there's a search term
        if (this.searchInput.value) {
          this.performSearch(this.searchInput.value);
        }
      });
    });
  },

  filterByCategory: function (category) {
    if (category === 'all') {
      // Show all sections and items
      this.serviceSections.forEach((section) => {
        section.classList.remove('hidden');
      });
      this.faqItems.forEach((item) => {
        item.classList.remove('hidden');
      });
    } else {
      // Show only matching category
      this.serviceSections.forEach((section) => {
        if (section.dataset.service === category) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      });

      this.faqItems.forEach((item) => {
        if (item.dataset.category === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }

    this.updateSectionsVisibility();
  },

  // FAQ Accordion Functionality - FIXED VERSION
  initFAQAccordion: function () {
    // Use event delegation to handle dynamically added content
    const faqContainers = document.querySelectorAll('.faq-items-container');

    faqContainers.forEach((container) => {
      container.addEventListener('click', (e) => {
        // Check if clicked element is a question or child of question
        const question = e.target.closest('.faq-question');

        if (question) {
          e.preventDefault();
          e.stopPropagation();

          const answer = question.nextElementSibling;
          const icon = question.querySelector('i');

          console.log('FAQ Question clicked:', question); // Debug log
          console.log('Answer element:', answer); // Debug log

          // Toggle active state
          if (question.classList.contains('active')) {
            // Close
            question.classList.remove('active');
            answer.classList.remove('active');
            answer.style.maxHeight = '0';
            icon.classList.remove('fa-minus');
            icon.classList.add('fa-plus');
            console.log('Closing FAQ item'); // Debug log
          } else {
            // Close other open items first (optional - remove if you want multiple open)
            const otherQuestions = container.querySelectorAll(
              '.faq-question.active'
            );
            otherQuestions.forEach((otherQ) => {
              if (otherQ !== question) {
                const otherAnswer = otherQ.nextElementSibling;
                const otherIcon = otherQ.querySelector('i');
                otherQ.classList.remove('active');
                otherAnswer.classList.remove('active');
                otherAnswer.style.maxHeight = '0';
                otherIcon.classList.remove('fa-minus');
                otherIcon.classList.add('fa-plus');
              }
            });

            // Open current item
            question.classList.add('active');
            answer.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            icon.classList.remove('fa-plus');
            icon.classList.add('fa-minus');
            console.log(
              'Opening FAQ item, maxHeight set to:',
              answer.scrollHeight + 'px'
            ); // Debug log
          }
        }
      });
    });
  },

  // Scroll to section from URL hash
  initScrollToSection: function () {
    // Check if there's a hash in the URL
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetTab = document.querySelector(`[data-category="${targetId}"]`);

      if (targetTab) {
        // Simulate tab click
        targetTab.click();

        // Scroll to section after a delay
        setTimeout(() => {
          const targetSection = document.querySelector(
            `[data-service="${targetId}"]`
          );
          if (targetSection) {
            targetSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }
        }, 300);
      }
    }
  },
};

/**
 * =====================================================
 * CONTACT PAGE MODULE
 * =====================================================
 */
const ContactPage = {
  init: function () {
    // Only initialize on contact pages
    if (!document.querySelector('.contact-page')) return;

    this.initContactForm();
    this.initMapInteraction();
    this.initFormValidation();
  },

  /**
   * Initialize contact form handling
   */
  initContactForm: function () {
    const contactForm = document.getElementById('contact-estimate-form');

    if (contactForm) {
      contactForm.addEventListener('submit', (e) =>
        this.handleContactSubmission(e)
      );
    }
  },

  /**
   * Handle contact form submission
   */
  handleContactSubmission: function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Validate form
    if (!this.validateContactForm(form, data)) {
      this.showMessage(
        'Please fill in all required fields correctly.',
        'error'
      );
      return;
    }

    // Show loading state
    this.setFormLoadingState(form, true);

    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      this.showSuccessState(form);
      this.showMessage(
        "Thank you! We'll contact you within 24 hours.",
        'success'
      );

      // Reset form after delay
      setTimeout(() => {
        this.resetContactForm(form);
      }, 3000);
    }, 1500);

    // Log form data (for debugging - remove in production)
    console.log('Contact form submitted:', data);
  },

  /**
   * Validate contact form
   */
  validateContactForm: function (form, data) {
    const requiredFields = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'service',
    ];
    let isValid = true;

    // Check required fields
    requiredFields.forEach((field) => {
      const input = form.querySelector(`[name="${field}"]`);
      if (!data[field] || data[field].trim() === '') {
        this.setFieldError(input, true);
        isValid = false;
      } else {
        this.setFieldError(input, false);
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInput = form.querySelector('[name="email"]');
    if (data.email && !emailRegex.test(data.email)) {
      this.setFieldError(emailInput, true);
      isValid = false;
    }

    // Phone validation
    const phoneInput = form.querySelector('[name="phone"]');
    const cleanPhone = data.phone ? data.phone.replace(/\D/g, '') : '';
    if (data.phone && cleanPhone.length < 10) {
      this.setFieldError(phoneInput, true);
      isValid = false;
    }

    return isValid;
  },

  /**
   * Set field error state
   */
  setFieldError: function (input, hasError) {
    if (!input) return;

    if (hasError) {
      input.style.borderColor = '#e74c3c';
      input.classList.add('error');
    } else {
      input.style.borderColor = '#e9ecef';
      input.classList.remove('error');
    }
  },

  /**
   * Set form loading state
   */
  setFormLoadingState: function (form, isLoading) {
    const submitBtn = form.querySelector('button[type="submit"]');

    if (isLoading) {
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
    } else {
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send';
      submitBtn.disabled = false;
    }
  },

  /**
   * Show success state
   */
  showSuccessState: function (form) {
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    submitBtn.style.backgroundColor = '#27ae60';
    submitBtn.disabled = true;
  },

  /**
   * Reset contact form
   */
  resetContactForm: function (form) {
    form.reset();
    this.setFormLoadingState(form, false);

    // Reset field borders
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      this.setFieldError(input, false);
    });

    // Reset button style
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.style.backgroundColor = '';
  },

  /**
   * Show message to user
   */
  showMessage: function (message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `contact-message contact-message-${type}`;
    messageEl.innerHTML = `
      <div class="message-content">
        <i class="fas fa-${
          type === 'error' ? 'exclamation-circle' : 'check-circle'
        }"></i>
        <span>${message}</span>
      </div>
    `;

    // Add to page
    document.body.appendChild(messageEl);

    // Show with animation
    setTimeout(() => messageEl.classList.add('show'), 100);

    // Remove after delay
    setTimeout(() => {
      messageEl.classList.remove('show');
      setTimeout(() => messageEl.remove(), 300);
    }, 4000);
  },

  /**
   * Initialize map interaction
   */
  initMapInteraction: function () {
    const mapContainer = document.querySelector('.contact-map');
    const mapIframe = document.querySelector('.contact-map iframe');

    if (!mapContainer || !mapIframe) return;

    // Prevent scrolling when hovering over map
    mapContainer.addEventListener('mouseenter', function () {
      mapIframe.style.pointerEvents = 'auto';
    });

    mapContainer.addEventListener('mouseleave', function () {
      mapIframe.style.pointerEvents = 'none';
    });

    // Enable pointer events on click
    mapContainer.addEventListener('click', function () {
      mapIframe.style.pointerEvents = 'auto';
    });
  },

  /**
   * Initialize real-time form validation
   */
  initFormValidation: function () {
    const form = document.getElementById('contact-estimate-form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required], select[required]');

    inputs.forEach((input) => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });

      input.addEventListener('input', () => {
        // Clear error state when user starts typing
        if (input.classList.contains('error')) {
          this.setFieldError(input, false);
        }
      });
    });
  },

  /**
   * Validate individual field
   */
  validateField: function (input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;

    // Check if required field is empty
    if (input.hasAttribute('required') && !value) {
      isValid = false;
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
      }
    }

    // Phone validation
    if (type === 'tel' && value) {
      const cleanPhone = value.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        isValid = false;
      }
    }

    this.setFieldError(input, !isValid);
    return isValid;
  },
};

/**
 * =====================================================
 * BACK TO TOP BUTTON MODULE
 * =====================================================
 */
const BackToTopButton = {
  init: function () {
    this.button = document.getElementById('back-to-top');
    this.scrollThreshold = 300; // Show button after 300px scroll

    if (!this.button) return;

    this.initEventListeners();
  },

  initEventListeners: function () {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => this.handleScroll());

    // Smooth scroll to top when clicked
    this.button.addEventListener('click', () => this.scrollToTop());
  },

  handleScroll: function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > this.scrollThreshold) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  },

  scrollToTop: function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  },
};

// Initialize the back to top button
document.addEventListener('DOMContentLoaded', function () {
  BackToTopButton.init();
});

/**
 * =====================================================
 * ACTIVE NAVIGATION MODULE - IMPROVED VERSION
 * =====================================================
 */
const ActiveNavigation = {
  init: function () {
    this.setActiveNavigation();
  },

  setActiveNavigation: function () {
    // Get current page filename
    const currentPage =
      window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current page:', currentPage);

    // Clear any existing active states
    this.clearActiveStates();

    // Set active states for desktop navigation
    this.setDesktopActiveStates(currentPage);

    // Set active states for mobile navigation
    this.setMobileActiveStates(currentPage);
  },

  clearActiveStates: function () {
    // Remove all active classes
    document
      .querySelectorAll('.active, .has-active-child')
      .forEach((element) => {
        element.classList.remove('active', 'has-active-child');
      });
  },

  setDesktopActiveStates: function (currentPage) {
    // Find all navigation links
    const allLinks = document.querySelectorAll(
      '.nav-link, .dropdown-content a'
    );

    allLinks.forEach((link) => {
      const href = link.getAttribute('href');

      // Check if this link matches the current page
      if (href === currentPage) {
        link.classList.add('active');

        // If this link is inside a dropdown, activate parent
        const dropdownContent = link.closest('.dropdown-content');
        if (dropdownContent) {
          const parentDropdown = dropdownContent.closest('.dropdown');
          if (parentDropdown) {
            parentDropdown.classList.add('has-active-child');
            const parentLink =
              parentDropdown.querySelector(':scope > .nav-link');
            if (parentLink) {
              parentLink.classList.add('active');
            }
          }
        }
      }
    });
  },

  setMobileActiveStates: function (currentPage) {
    // Find all mobile navigation links
    const mobileLinks = document.querySelectorAll(
      '.mobile-nav-item > a, .mobile-dropdown-content a'
    );

    mobileLinks.forEach((link) => {
      const href = link.getAttribute('href');

      // Check if this link matches the current page
      if (href === currentPage) {
        link.classList.add('active');

        // If this link is inside a mobile dropdown, activate parent
        const mobileDropdownContent = link.closest('.mobile-dropdown-content');
        if (mobileDropdownContent) {
          const parentMobileItem =
            mobileDropdownContent.closest('.mobile-nav-item');
          if (parentMobileItem) {
            parentMobileItem.classList.add('has-active-child');
            const parentToggle = parentMobileItem.querySelector(
              '.mobile-dropdown-toggle'
            );
            if (parentToggle) {
              parentToggle.classList.add('active');
            }
          }
        }
      }
    });
  },
};

/**
 * =====================================================
 * OUR COMPANY PAGE JAVASCRIPT
 * =====================================================
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initialize page-specific modules
  OurCompanyPage.init();
});

// Our Company Page Module
const OurCompanyPage = {
  init: function () {
    // Initialize all page-specific functionality
    this.initAnimations();
    this.initImageEffects();
    this.initCounterAnimation();
  },

  // Initialize scroll animations
  initAnimations: function () {
    // Set up Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // If it's a benefit card, stagger the animations
          if (entry.target.classList.contains('benefit-card')) {
            const cards = document.querySelectorAll('.benefit-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('visible');
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
      '.fade-in, .fade-in-delay, .slide-up, .slide-up-delay, .slide-up-delay-2, .slide-up-delay-3, .slide-up-delay-4, .slide-up-delay-5, .slide-in-left, .slide-in-right'
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  },

  // Initialize image hover effects
  initImageEffects: function () {
    const images = document.querySelectorAll(
      '.story-image img, .founder-images img'
    );

    images.forEach((img) => {
      img.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.05)';
      });

      img.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
      });
    });
  },

  // Initialize counter animation for stats (if added in future)
  initCounterAnimation: function () {
    const counters = document.querySelectorAll('.counter');

    if (counters.length === 0) return;

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const step = target / (duration / 16); // 60 FPS
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    // Use Intersection Observer to trigger counters when visible
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains('animated')
          ) {
            entry.target.classList.add('animated');
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  },
};

// Smooth scroll enhancement for CTA buttons
document.addEventListener('click', function (e) {
  // Handle estimate modal trigger
  if (e.target.closest('a[href="#estimate"]')) {
    e.preventDefault();
    // This will be handled by the main scripts.js file
    // Just ensuring smooth behavior
  }
});

// Add parallax effect to page header
window.addEventListener('scroll', function () {
  const scrolled = window.pageYOffset;
  const pageHeader = document.querySelector('.page-header');

  if (pageHeader) {
    pageHeader.style.transform = `translateY(${scrolled * 0.5}px)`;
  }
});

// Mobile menu enhancement for active page
document.addEventListener('DOMContentLoaded', function () {
  // Highlight current page in navigation
  const currentPage = 'our-company.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-item a');

  navLinks.forEach((link) => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active-page');
    }
  });
});

/**
 * =====================================================
 * PORTFOLIO PAGE GALLERY MODULE - FIXED AND CONSOLIDATED
 * =====================================================
 */
const PortfolioGallery = {
  init: function () {
    // Only initialize if we're on the portfolio page
    if (!document.querySelector('.portfolio-main-sections')) {
      console.log('Not on portfolio page, skipping portfolio gallery init');
      return;
    }

    console.log('Initializing Portfolio Gallery');
    this.initAllProjectGalleries();
    this.initVideoHandling();
  },

  // Initialize all project galleries
  initAllProjectGalleries: function () {
    const projects = [
      {
        projectId: 'project-residential-roof',
        mainImageId: 'residential-roof-main',
        titleId: 'residential-roof-title',
        descriptionId: 'residential-roof-description',
      },
      {
        projectId: 'project-commercial-roof',
        mainImageId: 'commercial-roof-main',
        titleId: 'commercial-roof-title',
        descriptionId: 'commercial-roof-description',
      },
      {
        projectId: 'project-metal-roof',
        mainImageId: 'metal-roof-main',
        titleId: 'metal-roof-title',
        descriptionId: 'metal-roof-description',
      },
      {
        projectId: 'project-siding',
        mainImageId: 'siding-main',
        titleId: 'siding-title',
        descriptionId: 'siding-description',
      },
      // NEW GALLERY ADDED
      {
        projectId: 'project-gallery-work',
        mainImageId: 'gallery-work-main',
        titleId: 'gallery-work-title',
        descriptionId: 'gallery-work-description',
      },
    ];

    projects.forEach((project) => {
      this.initProjectGallery(project);
    });
  },

  // Initialize individual project gallery
  initProjectGallery: function (config) {
    const projectContainer = document.getElementById(config.projectId);
    if (!projectContainer) {
      console.warn(`Project container not found: ${config.projectId}`);
      return;
    }

    const thumbnails = projectContainer.querySelectorAll(
      '.portfolio-thumbnail-item'
    );
    const mainImage = document.getElementById(config.mainImageId);
    const titleElement = document.getElementById(config.titleId);
    const descriptionElement = document.getElementById(config.descriptionId);

    if (thumbnails.length === 0) {
      console.warn(`No thumbnails found for project: ${config.projectId}`);
      return;
    }

    if (!mainImage) {
      console.warn(`Main image not found for project: ${config.projectId}`);
      return;
    }

    console.log(
      `Setting up gallery for ${config.projectId} with ${thumbnails.length} thumbnails`
    );

    // Setup thumbnail click handlers
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`Thumbnail ${index} clicked for ${config.projectId}`);

        // Remove active class from all thumbnails in THIS project only
        thumbnails.forEach((t) => t.classList.remove('active'));

        // Add active class to clicked thumbnail
        thumbnail.classList.add('active');

        // Get data from thumbnail
        const imageSrc = thumbnail.getAttribute('data-image');
        const imageTitle = thumbnail.getAttribute('data-title');
        const imageDescription = thumbnail.getAttribute('data-description');

        console.log('Updating image to:', imageSrc, imageTitle);

        // Update main image
        this.updateProjectImage(
          mainImage,
          imageSrc,
          titleElement,
          imageTitle,
          descriptionElement,
          imageDescription,
          config.projectId
        );
      });

      // Add keyboard support
      thumbnail.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          thumbnail.click();
        }
      });

      // Make thumbnails focusable
      thumbnail.setAttribute('tabindex', '0');
      thumbnail.setAttribute('role', 'button');
      thumbnail.setAttribute(
        'aria-label',
        `View ${thumbnail.getAttribute('data-title')} in gallery`
      );
    });

    console.log(`Successfully initialized gallery for ${config.projectId}`);
  },

  // Update project image with smooth transition
  updateProjectImage: function (
    mainImage,
    imageSrc,
    titleElement,
    imageTitle,
    descriptionElement,
    imageDescription,
    projectId
  ) {
    console.log(`Updating image for ${projectId}:`, {
      imageSrc,
      imageTitle,
      imageDescription,
    });

    // Add loading state
    mainImage.classList.add('loading');

    // Create new image to preload
    const newImage = new Image();

    newImage.onload = () => {
      console.log(`Image loaded successfully for ${projectId}`);

      // Update main image source
      mainImage.src = imageSrc;
      mainImage.alt = imageTitle || 'Portfolio image';

      // Update text content if elements exist
      if (titleElement && imageTitle) {
        titleElement.textContent = imageTitle;
      }
      if (descriptionElement && imageDescription) {
        descriptionElement.textContent = imageDescription;
      }

      // Remove loading class and add loaded class
      mainImage.classList.remove('loading');
      mainImage.classList.add('loaded');

      // Remove loaded class after animation
      setTimeout(() => {
        mainImage.classList.remove('loaded');
      }, 300);
    };

    // Handle image load error
    newImage.onerror = () => {
      console.error(`Failed to load image for ${projectId}:`, imageSrc);
      mainImage.classList.remove('loading');

      // Show error state
      if (titleElement) titleElement.textContent = 'Image unavailable';
      if (descriptionElement) {
        descriptionElement.textContent =
          'Please try another image from this project';
      }
    };

    // Start preloading
    newImage.src = imageSrc;
  },

  // Initialize video handling
  initVideoHandling: function () {
    const video = document.getElementById('residential-roof-video');

    if (video) {
      console.log('Initializing video handling');

      // Add play/pause on click
      video.addEventListener('click', function () {
        if (this.paused) {
          this.play();
        } else {
          this.pause();
        }
      });

      // Handle video loading errors
      video.addEventListener('error', function () {
        console.error('Portfolio project video failed to load');
        const videoContainer = this.closest('.portfolio-video-container');
        if (videoContainer) {
          videoContainer.style.display = 'none';
        }
      });

      // Add loading state handling
      video.addEventListener('loadstart', function () {
        this.style.opacity = '0.7';
      });

      video.addEventListener('canplay', function () {
        this.style.opacity = '1';
      });

      video.addEventListener('loadedmetadata', function () {
        console.log('Portfolio project video loaded successfully');
      });
    }
  },

  // Utility method to reset all galleries to first image
  resetAllGalleries: function () {
    const projects = document.querySelectorAll('.portfolio-gallery-section');
    projects.forEach((project) => {
      const firstThumbnail = project.querySelector('.portfolio-thumbnail-item');
      if (firstThumbnail) {
        firstThumbnail.click();
      }
    });
  },

  // Debug method to check gallery state
  debugGalleryState: function () {
    const projects = document.querySelectorAll('.portfolio-gallery-section');
    projects.forEach((project) => {
      const projectId = project.id;
      const thumbnails = project.querySelectorAll('.portfolio-thumbnail-item');
      const mainImage = project.querySelector('.portfolio-main-image');

      console.log(`Project ${projectId}:`, {
        thumbnailCount: thumbnails.length,
        hasMainImage: !!mainImage,
        thumbnailsHaveData: Array.from(thumbnails).every(
          (t) =>
            t.hasAttribute('data-image') &&
            t.hasAttribute('data-title') &&
            t.hasAttribute('data-description')
        ),
      });
    });
  },
};

/**
 * =====================================================
 * SERVICE AREA PAGE JAVASCRIPT
 * =====================================================
 */
// County Filter Functionality
document.addEventListener('DOMContentLoaded', function () {
  const countyBtns = document.querySelectorAll('.county-btn');
  const areaCards = document.querySelectorAll('.area-card');

  countyBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      // Update active button
      countyBtns.forEach((b) => b.classList.remove('active'));
      this.classList.add('active');

      const county = this.dataset.county;

      // Filter cards
      areaCards.forEach((card) => {
        if (county === 'all') {
          card.style.display = 'block';
        } else {
          card.style.display =
            card.dataset.area === county || card.dataset.area === 'extended'
              ? 'block'
              : 'none';
        }
      });
    });
  });

  // Popup Functionality
  const popupTriggers = document.querySelectorAll('.popup-trigger');
  const popupCloses = document.querySelectorAll('.popup-close');

  popupTriggers.forEach((trigger) => {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      const popupId = this.dataset.popup + '-popup';
      document.getElementById(popupId).style.display = 'block';
      document.body.style.overflow = 'hidden';
    });
  });

  popupCloses.forEach((close) => {
    close.addEventListener('click', function () {
      this.closest('.service-popup').style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  });

  // Close popup on outside click
  document.querySelectorAll('.service-popup').forEach((popup) => {
    popup.addEventListener('click', function (e) {
      if (e.target === this) {
        this.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    });
  });

  // Form Submission
  const form = document.getElementById('service-area-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Add your form submission logic here
      alert("Thank you for your interest! We'll contact you within 24 hours.");
    });
  }
});

/**
 * =====================================================
 * ROOF REPLACEMENT VIDEO CONTROL
 * =====================================================
 */

// Initialize roof replacement page video
document.addEventListener('DOMContentLoaded', function () {
  const roofVideo = document.querySelector('.roof-hero-video');

  if (roofVideo) {
    // Skip first 2 seconds when video loads
    roofVideo.addEventListener('loadedmetadata', function () {
      this.currentTime = 2;
    });

    // If video ends and loops, skip first 2 seconds again
    roofVideo.addEventListener('ended', function () {
      this.currentTime = 2;
      this.play();
    });

    // Ensure video starts at 2 seconds if it was already loaded
    if (roofVideo.readyState >= 2) {
      roofVideo.currentTime = 2;
    }

    // Handle video loading errors gracefully
    roofVideo.addEventListener('error', function (e) {
      console.error('Video failed to load:', e);
      // Optionally hide video wrapper and show fallback
      const videoWrapper = document.querySelector('.roof-hero-video-wrapper');
      if (videoWrapper) {
        videoWrapper.style.display = 'none';
      }
    });
  }
});

/**
 * =====================================================
 * ROOF REPLACEMENT TIMELINE ANIMATION
 * =====================================================
 */
// Timeline Animation Script
document.addEventListener('DOMContentLoaded', function () {
  // Get the timeline element
  const timeline = document.querySelector('.roof-process-timeline');
  const timelineItems = document.querySelectorAll('.timeline-item');

  // Exit early if timeline doesn't exist on this page
  if (!timeline) {
    return;
  }

  // Remove any existing slide-in classes that might interfere
  timelineItems.forEach((item) => {
    // Remove all classes that start with 'slide-in'
    const classesToRemove = Array.from(item.classList).filter((className) =>
      className.startsWith('slide-in')
    );
    classesToRemove.forEach((className) => item.classList.remove(className));
  });

  // Options for the Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '-100px',
    threshold: 0.1,
  };

  // Create the observer
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // First animate the timeline line
        timeline.classList.add('timeline-visible');

        // Then animate the timeline items
        timelineItems.forEach((item, index) => {
          // Clear any existing animations
          item.classList.remove('slide-in-active');

          // Force a reflow to ensure the animation restarts
          void item.offsetWidth;

          // Add the class after the appropriate delay
          setTimeout(() => {
            item.classList.add('slide-in-active');
          }, 0); // Rely on CSS transition-delay for timing
        });

        // Optional: Stop observing after animation triggers
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Start observing the timeline
  observer.observe(timeline);

  // Optional: Reset animations when scrolling far away
  window.addEventListener('scroll', function () {
    // Check if timeline still exists before using it
    if (!timeline) {
      return;
    }

    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // If timeline is far out of view (above or below)
    if (rect.bottom < -windowHeight || rect.top > windowHeight * 2) {
      timeline.classList.remove('timeline-visible');
      timelineItems.forEach((item) => {
        item.classList.remove('slide-in-active');
      });

      // Re-observe for next time
      observer.observe(timeline);
    }
  });
});

/**
 * =====================================================
 * REUSABLE ACCORDION MODULE
 * Works for both repairs and gutter accordions
 * =====================================================
 */
const ReusableAccordion = {
  init: function () {
    this.initAccordions();
  },

  initAccordions: function () {
    // Look for both types of accordion headers
    const accordionHeaders = document.querySelectorAll(
      '.repairs-accordion-header, .gutter-accordion-header'
    );

    accordionHeaders.forEach((header) => {
      header.addEventListener('click', function () {
        const accordionItem = this.parentElement;
        const isActive = accordionItem.classList.contains('active');

        // Determine which type of accordion this is
        const isRepairs = header.classList.contains('repairs-accordion-header');
        const accordionClass = isRepairs
          ? '.repairs-accordion-item'
          : '.gutter-accordion-item';

        // Close all accordion items of the same type
        document.querySelectorAll(accordionClass).forEach((item) => {
          item.classList.remove('active');
        });

        // Open clicked item if it wasn't already active
        if (!isActive) {
          accordionItem.classList.add('active');
        }
      });
    });
  },
};

/**
 * =====================================================
 * COMMERCIAL ROOFING PAGE JAVASCRIPT
 * =====================================================
 */

document.addEventListener('DOMContentLoaded', function () {
  // Initialize lazy loading for images (same as other pages)
  if (typeof App !== 'undefined' && App.LazyLoading) {
    App.LazyLoading.init();
  }

  // Initialize animations (same as other pages)
  if (typeof App !== 'undefined' && App.AnimationModule) {
    App.AnimationModule.init();
  }

  // Smooth scroll to form
  const scrollLinks = document.querySelectorAll('.scroll-to');
  scrollLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const offset = 100; // Account for fixed header
        const targetPosition = targetElement.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // Form submission handler
  const commercialForm = document.getElementById('commercial-form');
  if (commercialForm) {
    commercialForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Log form data (replace with actual submission logic)
      console.log('Commercial form submitted:', data);

      // Show success message
      alert("Thank you for your inquiry! We'll contact you within 24 hours.");

      // Reset form
      this.reset();
    });
  }

  // Animate timeline on scroll
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
  };

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const timeline = entry.target.querySelector(
          '.commercial-timeline-line'
        );
        if (timeline) {
          timeline.style.animation = 'lineGrow 1s ease forwards';
        }

        const featureItems = entry.target.querySelectorAll('.feature-item');
        featureItems.forEach((item, index) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
          }, index * 150);
        });

        timelineObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const featureTimeline = document.querySelector('.feature-timeline');
  if (featureTimeline) {
    // Set initial states
    const featureItems = featureTimeline.querySelectorAll('.feature-item');
    featureItems.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = 'all 0.5s ease';
    });

    timelineObserver.observe(featureTimeline);
  }

  // Add hover effect to material items
  const materialItems = document.querySelectorAll('.material-item');
  materialItems.forEach((item) => {
    item.addEventListener('mouseenter', function () {
      this.style.background = '#ffffff';
    });

    item.addEventListener('mouseleave', function () {
      this.style.background = '#f8f9fa';
    });
  });

  // Animate process cards on hover
  const processCards = document.querySelectorAll('.process-card');
  processCards.forEach((card) => {
    card.addEventListener('mouseenter', function () {
      const number = this.querySelector('.process-number');
      if (number) {
        number.style.transform = 'scale(1.1) rotate(5deg)';
      }
    });

    card.addEventListener('mouseleave', function () {
      const number = this.querySelector('.process-number');
      if (number) {
        number.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });

  // Add CSS for timeline animation
  if (!document.getElementById('commercial-animations')) {
    const style = document.createElement('style');
    style.id = 'commercial-animations';
    style.textContent = `
      @keyframes lineGrow {
        from {
          transform: scaleY(0);
          transform-origin: top;
        }
        to {
          transform: scaleY(1);
          transform-origin: top;
        }
      }
      
      .process-number {
        transition: transform 0.3s ease;
      }
      
      .commercial-timeline-line {
        transform: scaleY(0);
        transform-origin: top;
      }
    `;
    document.head.appendChild(style);
  }
});

/**
 * =====================================================
 * SKYLIGHT PAGE MODULE
 * =====================================================
 */
const SkylightPage = {
  init: function () {
    // Only initialize if we're on the skylight page
    if (this.isSkylightPage()) {
      this.initAccordion();
    }
  },

  isSkylightPage: function () {
    // Check if we're on the skylight page
    return (
      window.location.pathname.includes('skylight-installation-and-repair') ||
      document.querySelector('.skylight-hero') !== null
    );
  },

  initAccordion: function () {
    const accordionHeaders = document.querySelectorAll(
      '.materials-accordion .accordion-header'
    );

    if (accordionHeaders.length === 0) return;

    accordionHeaders.forEach((header) => {
      header.addEventListener('click', () => {
        const accordionItem = header.parentElement;
        const accordionContent =
          accordionItem.querySelector('.accordion-content');
        const isActive = header.classList.contains('active');

        // Close all accordion items
        document
          .querySelectorAll('.materials-accordion .accordion-header')
          .forEach((h) => {
            h.classList.remove('active');
            h.parentElement
              .querySelector('.accordion-content')
              .classList.remove('active');
          });

        // If this item wasn't active, open it
        if (!isActive) {
          header.classList.add('active');
          accordionContent.classList.add('active');
        }
      });
    });

    // Open first item by default
    const firstHeader = accordionHeaders[0];
    if (firstHeader) {
      firstHeader.classList.add('active');
      firstHeader.parentElement
        .querySelector('.accordion-content')
        .classList.add('active');
    }
  },
};

/**
 * =====================================================
 * INITIALIZATION COMPLETE
 * =====================================================
 */

// Log successful initialization
console.log('Valley Peak Roofing website initialized successfully!');

// Add CSS for contact messages
const contactMessageStyles = `
  .contact-message {
    position: fixed;
    top: 100px;
    right: 20px;
    background: var(--white);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    padding: 15px 20px;
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  }

  .contact-message.show {
    transform: translateX(0);
  }

  .contact-message-success {
    border-left: 4px solid #27ae60;
  }

  .contact-message-error {
    border-left: 4px solid #e74c3c;
  }

  .message-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .contact-message-success .fas {
    color: #27ae60;
  }

  .contact-message-error .fas {
    color: #e74c3c;
  }

  @media (max-width: 768px) {
    .contact-message {
      right: 10px;
      left: 10px;
      max-width: none;
    }
  }
`;

// Inject styles
if (!document.querySelector('#contact-message-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'contact-message-styles';
  styleSheet.textContent = contactMessageStyles;
  document.head.appendChild(styleSheet);
}

/**
 * =====================================================
 * TEMPLATE FOR NEW MODULES
 * =====================================================
 * To add a new module, copy this template, rename it,
 * implement your functionality in the init method,
 * and add it to the App.init moduleArray.
 *
 * const NewFeatureModule = {
 *   init: function() {
 *     // Your initialization code here
 *   }
 * };
 */
