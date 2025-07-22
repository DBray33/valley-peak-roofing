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
 * CAROUSEL INITIALIZATION
 * =====================================================
 */
document.addEventListener('DOMContentLoaded', function () {
  console.log('Carousel.js loaded - initializing all carousels');

  // Initialize all carousel modules
  TestimonialCarousel.init();
  InspirationGallery.init();
  ReusableCarousel.init();

  console.log('All carousel modules initialized');
});
