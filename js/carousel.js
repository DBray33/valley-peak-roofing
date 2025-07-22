/**
 * =====================================================
 * Valley Peak Roofing - Carousel Functionality
 * =====================================================
 */

const InspirationGallery = {
  currentSlide: 0,
  slides: [],
  autoPlayInterval: null,
  isPlaying: true,

  init: function () {
    console.log('Initializing InspirationGallery');

    const carousel = document.getElementById('inspirationCarousel');
    if (!carousel) {
      console.log('InspirationGallery element not found');
      return;
    }

    this.slides = document.querySelectorAll('.gallery-slide');
    this.prevBtn = document.getElementById('galleryPrev');
    this.nextBtn = document.getElementById('galleryNext');
    this.dotsContainer = document.getElementById('galleryDots');
    this.track = document.getElementById('galleryTrack');

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

const ReusableCarousel = {
  init: function () {
    console.log('Initializing ReusableCarousel');

    const carousels = document.querySelectorAll(
      '.repairs-carousel, .gutter-carousel'
    );

    if (!carousels.length) {
      console.log('ReusableCarousel: No carousel elements found');
      return;
    }

    carousels.forEach((carousel) => {
      this.initializeCarousel(carousel);
    });
  },

  initializeCarousel: function (carousel) {
    console.log('Initializing individual carousel:', carousel.className);

    const isRepairs = carousel.classList.contains('repairs-carousel');
    const prefix = isRepairs ? 'repairs' : 'gutter';

    const carouselContainer = carousel.closest(`.${prefix}-carousel-container`);

    // CRITICAL FIX: Look for slides within the track if it exists
    const track = carousel.querySelector(`.${prefix}-carousel-track`);
    const slideContainer = track || carousel;

    // Get slides from the correct container
    const slides = slideContainer.querySelectorAll(`.${prefix}-carousel-slide`);
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

    // FIX: Force the parent containers to be visible
    const visualContainer = carousel.closest(
      '.gutter-issues-visual, .repairs-issues-visual'
    );
    if (visualContainer) {
      visualContainer.style.opacity = '1';
      visualContainer.style.transform = 'none';
      visualContainer.classList.remove('fade-in');
      visualContainer.classList.add('visible');
    }

    let currentSlide = 0;
    let autoPlayInterval = null;

    function showSlide(index) {
      slides.forEach((slide) => {
        slide.classList.remove('active');
        // FIX: Force opacity with inline styles
        slide.style.opacity = '0';
      });
      indicators.forEach((indicator) => indicator.classList.remove('active'));

      if (slides[index]) {
        slides[index].classList.add('active');
        // FIX: Force opacity with inline styles
        slides[index].style.opacity = '1';
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
      stopAutoPlay();
      autoPlayInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        startAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        startAutoPlay();
      });
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', function () {
        showSlide(index);
        startAutoPlay();
      });
    });

    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

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
        nextSlide();
        startAutoPlay();
      }
      if (touchEndX > touchStartX + 50) {
        prevSlide();
        startAutoPlay();
      }
    }

    showSlide(0);
    startAutoPlay();

    console.log(`${prefix} carousel initialized successfully`);
  },
};

document.addEventListener('DOMContentLoaded', function () {
  console.log('Carousel.js loaded - initializing carousels');

  // FIX: Add a delay to let other scripts run first
  setTimeout(function () {
    InspirationGallery.init();
    ReusableCarousel.init();
    console.log('Carousel modules initialized');
  }, 500);
});
