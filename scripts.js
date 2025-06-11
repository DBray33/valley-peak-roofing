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
      TestimonialCarousel,
      FAQAccordion,
      EstimateModal,
      FormHandling,
      PhoneFormatting,
      ImageHandling,
      PerformanceOptimization,
      AnalyticsTracking,
      MobileButtonDelay,
      BackToTopButton,
      PortfolioLightbox,
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

        // Handle estimate modal
        if (href === '#estimate') {
          e.preventDefault();
          EstimateModal.open();
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

          // Smooth scroll to target
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
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
 * SCROLL ANIMATIONS MODULE
 * =====================================================
 */
const ScrollAnimations = {
  init: function () {
    this.initIntersectionObserver();
  },

  initIntersectionObserver: function () {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px 0px 0px', // Trigger when entering viewport
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      '.slide-up, .slide-up-delay, .slide-up-delay-2, .slide-up-delay-3, .slide-up-delay-4, .slide-up-delay-5, .slide-up-delay-6, .slide-up-delay-7, .slide-up-delay-8, .slide-in-left, .slide-in-right'
    );

    animatedElements.forEach((element) => {
      observer.observe(element);
    });
  },
};

/**
 * =====================================================
 * TESTIMONIAL CAROUSEL MODULE (Bootstrap Version)
 * =====================================================
 */
const TestimonialCarousel = {
  init: function () {
    // Initialize review button handlers
    this.initReviewButtonHandlers();

    // Optional: Add event listeners for Bootstrap carousel events
    const carousel = document.getElementById('testimonialCarousel');
    if (carousel) {
      // Log carousel events (optional - remove in production)
      carousel.addEventListener('slide.bs.carousel', (event) => {
        console.log('Testimonial sliding from:', event.from, 'to:', event.to);
      });

      // You can add more event handlers here if needed
      carousel.addEventListener('slid.bs.carousel', (event) => {
        console.log('Testimonial slide complete:', event.to);
      });
    }
  },

  initReviewButtonHandlers: function () {
    const reviewsUrl =
      'https://www.google.com/search?q=Valley+Peak+Roofing+Co.+Reviews';

    // Handle any programmatically added buttons (since we're using onclick in HTML, this is optional)
    const reviewButtons = document.querySelectorAll('.see-more-reviews-btn');
    reviewButtons.forEach((button) => {
      // Only add listener if button doesn't have onclick attribute
      if (!button.hasAttribute('onclick')) {
        button.addEventListener('click', () => {
          window.open(reviewsUrl, '_blank');
        });
      }
    });
  },
};

/**
 * =====================================================
 * FAQ ACCORDION MODULE
 * =====================================================
 */
const FAQAccordion = {
  init: function () {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach((question) => {
      question.addEventListener('click', function () {
        const answer = this.nextElementSibling;
        const isActive = this.classList.contains('active');

        // Close all other FAQ items
        faqQuestions.forEach((otherQuestion) => {
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
 * ESTIMATE MODAL MODULE
 * =====================================================
 */
const EstimateModal = {
  init: function () {
    this.modal = document.getElementById('estimate-modal');
    this.closeBtn = document.querySelector('.close-modal');
    this.body = document.body;

    if (!this.modal) return;

    this.initEventListeners();
  },

  initEventListeners: function () {
    // Close modal events
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Close modal when clicking outside
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  },

  open: function () {
    this.modal.classList.add('active');
    this.body.classList.add('modal-open');
    this.body.style.overflow = 'hidden';
  },

  close: function () {
    this.modal.classList.remove('active');
    this.body.classList.remove('modal-open');
    this.body.style.overflow = '';
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
      EstimateModal.close();
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
              img.src = img.dataset.src;
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
        EstimateModal.open();
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
 * PORTFOLIO LIGHTBOX MODULE
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

    // Touch gestures for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    this.lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
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
 * INITIALIZATION COMPLETE
 * =====================================================
 */

// Log successful initialization
console.log('Valley Peak Roofing website initialized successfully!');

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
