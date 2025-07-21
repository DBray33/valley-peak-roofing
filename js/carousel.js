/**
 * =====================================================
 * Valley Peak Roofing - Carousel Functionality
 * =====================================================
 * This file contains all carousel-related JavaScript
 * Only loaded on pages that actually need carousels
 */

/**
 * =====================================================
 * TESTIMONIAL CAROUSEL MODULE (Bootstrap Version)
 * =====================================================
 */
const TestimonialCarousel = {
  init: function () {
    console.log('Initializing TestimonialCarousel');

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
    const reviewButtons = document.querySelectorAll('.see-more-reviews-btn');

    reviewButtons.forEach((button) => {
      button.addEventListener('click', () => {
        window.open(reviewsUrl, '_blank');
      });
    });
  },
};

/**
 * =====================================================
 * INSPIRATION GALLERY MODULE (for Design Your Roof page)
 * =====================================================
 */
const InspirationGallery = {
  currentSlide: 0,
  slides: [],
  autoPlayInterval: null,
  isPlaying: true,

  init: function () {
    console.log('Initializing InspirationGallery');

    // Only initialize if gallery exists
    const carousel = document.getElementById('inspirationCarousel');
    if (!carousel) {
      console.log('InspirationGallery element not found');
      return;
    }

    // Get elements
    this.slides = document.querySelectorAll('.gallery-slide');
    this.prevBtn = document.getElementById('galleryPrev');
    this.nextBtn = document.getElementById('galleryNext');
    this.dotsContainer = document.getElementById('galleryDots');
    this.track = document.getElementById('galleryTrack');

    // Verify all elements exist
    if (
      !this.slides.length ||
      !this.prevBtn ||
      !this.nextBtn ||
      !this.dotsContainer ||
      !this.track
    ) {
      console.log('InspirationGallery: Missing required elements');
      return;
    }

    // Setup
    this.createDots();
    this.addEventListeners();
    this.startAutoPlay();
  },

  createDots: function () {
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = 'gallery-dot';
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer.appendChild(dot);
    });
  },

  addEventListeners: function () {
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());

    const carousel = document.getElementById('inspirationCarousel');
    carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
    carousel.addEventListener('mouseleave', () => this.startAutoPlay());

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    carousel.addEventListener(
      'touchend',
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe(touchStartX, touchEndX);
      },
      { passive: true }
    );
  },

  handleSwipe: function (startX, endX) {
    if (endX < startX - 50) {
      this.nextSlide();
    }
    if (endX > startX + 50) {
      this.prevSlide();
    }
  },

  goToSlide: function (index) {
    this.currentSlide = index;
    this.updateSlider();
  },

  nextSlide: function () {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateSlider();
  },

  prevSlide: function () {
    this.currentSlide =
      this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.updateSlider();
  },

  updateSlider: function () {
    if (!this.track) return;

    const translateX = -this.currentSlide * 100;
    this.track.style.transform = `translateX(${translateX}%)`;

    // Update dots
    const dots = this.dotsContainer.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });
  },

  startAutoPlay: function () {
    this.pauseAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  },

  pauseAutoPlay: function () {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  },
};

/**
 * =====================================================
 * REUSABLE CAROUSEL MODULE (for Repairs & Gutters pages)
 * =====================================================
 */
const ReusableCarousel = {
  init: function () {
    console.log('Initializing ReusableCarousel');

    // Check for both types of carousels
    const carousels = document.querySelectorAll(
      '.repairs-carousel, .gutter-carousel'
    );

    if (!carousels.length) {
      console.log('ReusableCarousel: No carousel elements found');
      return;
    }

    // Initialize each carousel found
    carousels.forEach((carousel) => {
      this.initializeCarousel(carousel);
    });
  },

  initializeCarousel: function (carousel) {
    console.log('Initializing individual carousel:', carousel.className);

    // Determine carousel type
    const isRepairs = carousel.classList.contains('repairs-carousel');
    const prefix = isRepairs ? 'repairs' : 'gutter';

    // Get the parent container that holds both carousel and indicators
    const carouselContainer = carousel.closest(`.${prefix}-carousel-container`);

    // Get carousel elements using the appropriate prefix
    const slides = carousel.querySelectorAll(`.${prefix}-carousel-slide`);
    const nextBtn = carousel.querySelector(`.${prefix}-carousel-next`);
    const prevBtn = carousel.querySelector(`.${prefix}-carousel-prev`);
    const indicators = carouselContainer
      ? carouselContainer.querySelectorAll(`.${prefix}-carousel-indicator`)
      : [];

    if (!slides.length) {
      console.log(`${prefix} carousel: No slides found`);
      return;
    }

    console.log(`Found ${slides.length} slides for ${prefix} carousel`);

    // Initialize carousel state
    let currentSlide = 0;
    let autoPlayInterval = null;

    // Carousel functions
    function showSlide(index) {
      // Remove active class from all slides and indicators
      slides.forEach((slide) => slide.classList.remove('active'));
      indicators.forEach((indicator) => indicator.classList.remove('active'));

      // Add active class to current slide and indicator
      if (slides[index]) {
        slides[index].classList.add('active');
      }
      if (indicators[index]) {
        indicators[index].classList.add('active');
      }
      currentSlide = index;
    }

    function nextSlide() {
      const nextIndex = (currentSlide + 1) % slides.length;
      showSlide(nextIndex);
    }

    function prevSlide() {
      const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    }

    function startAutoPlay() {
      stopAutoPlay(); // Clear any existing interval
      autoPlayInterval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    // Event listeners
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoPlay(); // Restart autoplay
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoPlay(); // Restart autoplay
      });
    }

    // Indicator clicks
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', function () {
        showSlide(index);
        startAutoPlay(); // Restart autoplay
      });
    });

    // Pause auto-play on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    carousel.addEventListener(
      'touchend',
      function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        nextSlide(); // Swipe left
        startAutoPlay();
      }
      if (touchEndX > touchStartX + 50) {
        prevSlide(); // Swipe right
        startAutoPlay();
      }
    }

    // Initialize: show first slide and start autoplay
    showSlide(0);
    startAutoPlay();

    console.log(`${prefix} carousel initialized successfully`);
  },
};

/**
 * =====================================================
 * GOOGLE REVIEWS SLIDER MODULE - COMPLETE VERSION
 * =====================================================
 */
const GoogleReviewsSlider = {
  // Configuration
  config: {
    placeId: 'ChIJ36SvdAhTW6oR0auHMJ3wDFQ',
    apiEndpoint: 'https://google-reviews-72386059671.us-east5.run.app',
    updateInterval: 3600000, // Update every hour
    minRating: 4,
    maxReviews: 20,
  },

  // Module properties
  currentIndex: 0,
  reviewsPerView: 4,
  reviews: [],
  isLoading: true,
  totalReviews: 0,
  maxIndex: 0,

  // DOM elements
  elements: {
    container: null,
    prevBtn: null,
    nextBtn: null,
    dotsContainer: null,
    track: null,
  },

  /**
   * Initialize the module
   */
  init: function () {
    console.log('Initializing GoogleReviewsSlider');

    // Check if the container exists
    if (!document.getElementById('googleReviewsSliderWrapper')) {
      console.log('GoogleReviewsSlider container not found');
      return;
    }

    this.initializeElements();
    this.showLoadingState();
    this.fetchReviews();
    this.attachEventListeners();

    // Set up auto-refresh
    setInterval(() => this.fetchReviews(), this.config.updateInterval);
  },

  /**
   * Cache DOM elements
   */
  initializeElements: function () {
    this.elements.container = document.getElementById(
      'googleReviewsCardsContainer'
    );
    this.elements.prevBtn = document.getElementById('googleReviewsPrevBtn');
    this.elements.nextBtn = document.getElementById('googleReviewsNextBtn');
    this.elements.dotsContainer = document.getElementById(
      'googleReviewsDotsContainer'
    );
    this.elements.track = document.getElementById('googleReviewsSliderTrack');
  },

  /**
   * Determine reviews per view based on viewport
   */
  getReviewsPerView: function () {
    const width = window.innerWidth;
    if (width <= 480) return 1;
    if (width <= 768) return 2;
    if (width <= 1024) return 3;
    return 4; // Show 4 reviews on desktop
  },

  /**
   * Show loading animation
   */
  showLoadingState: function () {
    this.elements.container.innerHTML = `
      <div style="color: white; text-align: center; padding: 40px; width: 100%;">
        <div style="font-size: 18px; margin-bottom: 10px;">Loading reviews...</div>
        <div class="google-reviews-spinner">
          <i class="fas fa-spinner fa-spin" style="font-size: 48px;"></i>
        </div>
      </div>
    `;
  },

  /**
   * Show error message
   */
  showErrorState: function (message) {
    this.elements.container.innerHTML = `
      <div style="color: white; text-align: center; padding: 40px; width: 100%;">
        <div style="font-size: 18px; margin-bottom: 10px;">Unable to load reviews</div>
        <div style="font-size: 14px; opacity: 0.8;">${message}</div>
      </div>
    `;
  },

  /**
   * Fetch reviews from API
   */
  fetchReviews: async function () {
    try {
      const response = await fetch(
        `${this.config.apiEndpoint}/${this.config.placeId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success || !data.reviews) {
        throw new Error('Invalid API response');
      }

      // Process and combine reviews
      this.processReviews(data.reviews);
    } catch (error) {
      console.log('API fetch failed, using manual reviews:', error.message);
      // Fallback to manual reviews only
      this.processReviews([]);
    }
  },

  /**
   * Get manual reviews to append after API reviews
   */
  getManualReviews: function () {
    return [
      {
        author_name: 'Sarah Johnson',
        profile_photo_url:
          'https://lh3.googleusercontent.com/a/default-user=s40-c',
        rating: 5,
        relative_time_description: '2 weeks ago',
        text: 'Absolutely fantastic service! The team was professional, punctual, and went above and beyond.',
        time: Date.now() - 14 * 24 * 60 * 60 * 1000,
        isManual: true,
      },
      {
        author_name: 'Michael Chen',
        profile_photo_url:
          'https://lh3.googleusercontent.com/a/default-user=s40-c',
        rating: 5,
        relative_time_description: '1 month ago',
        text: 'Outstanding experience from start to finish. Will definitely be using their services again!',
        time: Date.now() - 30 * 24 * 60 * 60 * 1000,
        isManual: true,
      },
      {
        author_name: 'Emily Rodriguez',
        profile_photo_url:
          'https://lh3.googleusercontent.com/a/default-user=s40-c',
        rating: 4,
        relative_time_description: '1 month ago',
        text: 'Great service overall. The team was knowledgeable and helpful throughout the process.',
        time: Date.now() - 30 * 24 * 60 * 60 * 1000,
        isManual: true,
      },
    ];
  },

  /**
   * Process and setup reviews data
   */
  processReviews: function (apiReviews) {
    // Filter API reviews by rating and sort by time
    const filteredApiReviews = apiReviews
      .filter((review) => review.rating >= this.config.minRating)
      .sort((a, b) => b.time - a.time);

    // Combine API reviews with manual reviews
    const manualReviews = this.getManualReviews();
    this.reviews = [...filteredApiReviews, ...manualReviews].slice(
      0,
      this.config.maxReviews
    );

    if (this.reviews.length === 0) {
      this.showErrorState('No reviews available');
      return;
    }

    this.totalReviews = this.reviews.length;
    this.reviewsPerView = this.getReviewsPerView();
    this.maxIndex = Math.max(0, this.totalReviews - this.reviewsPerView);
    this.currentIndex = 0;

    this.renderReviews();
    this.renderDots();
    this.updateSliderPosition();
    this.isLoading = false;
  },

  /**
   * Render review cards
   */
  renderReviews: function () {
    this.elements.container.innerHTML = this.reviews
      .map((review) => this.createReviewCard(review))
      .join('');
  },

  /**
   * Create individual review card HTML
   */
  createReviewCard: function (review) {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    return `
    <div class="google-review-card">
      <div class="google-review-header">
        <img src="${
          review.profile_photo_url ||
          'https://www.gstatic.com/images/branding/product/2x/avatar_circle_blue_48dp.png'
        }" 
             alt="${review.author_name}" 
             class="google-review-avatar" 
             onerror="this.src='https://www.gstatic.com/images/branding/product/2x/avatar_circle_blue_48dp.png'">
        <div class="google-review-info">
          <h3 class="google-review-author">${this.escapeHtml(
            review.author_name
          )}</h3>
          <div class="google-review-rating">
            <span class="google-review-stars">${stars}</span>
            <span class="google-review-date">${
              review.relative_time_description
            }</span>
          </div>
        </div>
      </div>
      <p class="google-review-text">${this.escapeHtml(review.text)}</p>
      <div class="google-review-source">
        <i class="fab fa-google"></i>
        <span>Google Review</span>
      </div>
    </div>
    `;
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml: function (text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, function (m) {
      return map[m];
    });
  },

  /**
   * Render navigation dots
   */
  renderDots: function () {
    const totalDots = Math.ceil(this.totalReviews / this.reviewsPerView);
    this.elements.dotsContainer.innerHTML = '';

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'google-reviews-dot';
      dot.dataset.dotIndex = i;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);

      if (i === 0) {
        dot.classList.add('active');
      }

      this.elements.dotsContainer.appendChild(dot);
    }
  },

  /**
   * Update slider position
   */
  updateSliderPosition: function () {
    const translateX = -(this.currentIndex * (100 / this.reviewsPerView));
    this.elements.track.style.transform = `translateX(${translateX}%)`;

    // Update dots
    const dots = this.elements.dotsContainer.querySelectorAll(
      '.google-reviews-dot'
    );
    const currentDot = Math.floor(this.currentIndex / this.reviewsPerView);

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentDot);
    });

    // Update button states
    this.elements.prevBtn.style.opacity = this.currentIndex <= 0 ? '0.5' : '1';
    this.elements.nextBtn.style.opacity =
      this.currentIndex >= this.maxIndex ? '0.5' : '1';
  },

  /**
   * Navigate to previous reviews
   */
  goToPrev: function () {
    if (this.currentIndex > 0) {
      this.currentIndex = Math.max(0, this.currentIndex - this.reviewsPerView);
      this.updateSliderPosition();
    }
  },

  /**
   * Navigate to next reviews
   */
  goToNext: function () {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex = Math.min(
        this.maxIndex,
        this.currentIndex + this.reviewsPerView
      );
      this.updateSliderPosition();
    }
  },

  /**
   * Navigate to specific slide
   */
  goToSlide: function (slideIndex) {
    this.currentIndex = slideIndex * this.reviewsPerView;
    this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
    this.updateSliderPosition();
  },

  /**
   * Attach event listeners
   */
  attachEventListeners: function () {
    // Navigation buttons
    this.elements.prevBtn.addEventListener('click', () => this.goToPrev());
    this.elements.nextBtn.addEventListener('click', () => this.goToNext());

    // Dot navigation
    this.elements.dotsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('google-reviews-dot')) {
        const dotIndex = parseInt(e.target.dataset.dotIndex);
        this.goToSlide(dotIndex);
      }
    });

    // Touch support
    this.initTouchSupport();

    // Resize handler
    this.initResizeHandler();
  },

  /**
   * Initialize touch/swipe support
   */
  initTouchSupport: function () {
    let touchStartX = 0;
    let touchEndX = 0;

    this.elements.track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.elements.track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  },

  /**
   * Handle swipe gestures
   */
  handleSwipe: function (startX, endX) {
    const swipeThreshold = 50;
    const diff = startX - endX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        this.goToNext();
      } else {
        this.goToPrev();
      }
    }
  },

  /**
   * Initialize resize handler
   */
  initResizeHandler: function () {
    let resizeTimer;

    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newReviewsPerView = this.getReviewsPerView();
        if (newReviewsPerView !== this.reviewsPerView) {
          this.reviewsPerView = newReviewsPerView;
          this.maxIndex = Math.max(0, this.totalReviews - this.reviewsPerView);
          this.currentIndex = Math.min(this.currentIndex, this.maxIndex);
          this.renderDots();
          this.updateSliderPosition();
        }
      }, 250);
    });
  },
};

/**
 * =====================================================
 * CAROUSEL INITIALIZATION
 * =====================================================
 */
document.addEventListener('DOMContentLoaded', function () {
  console.log('Carousel.js loaded - initializing all carousels');

  // Initialize all carousel modules
  TestimonialCarousel.init();
  InspirationGallery.init();
  ReusableCarousel.init();
  GoogleReviewsSlider.init();

  console.log('All carousel modules initialized');
});
