// Blog loader - automatically populates blog sections from blog-data.js
(function() {
  'use strict';

  // Wait for DOM and blog data to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogLoader);
  } else {
    initBlogLoader();
  }

  function initBlogLoader() {
    // Check if blogPosts data is available
    if (typeof blogPosts === 'undefined') {
      console.error('Blog data not loaded. Make sure blog-data.js is included before blog-loader.js');
      return;
    }

    // Load featured posts (top 3 with images) - for homepage
    loadFeaturedPosts();

    // Load additional posts list - for homepage
    loadAdditionalPosts();

    // Load all blog posts - for our-blog.html page
    loadAllBlogPosts();
  }

  function loadFeaturedPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;

    // Get the top 3 featured posts
    const featuredPosts = blogPosts.filter(post => post.featured).slice(0, 3);

    // Clear existing content
    blogGrid.innerHTML = '';

    // Create card for each featured post
    featuredPosts.forEach((post, index) => {
      const card = createFeaturedCard(post, index);
      blogGrid.appendChild(card);
    });
  }

  function createFeaturedCard(post, index) {
    const article = document.createElement('article');
    article.className = `blog-card fade-in-delay${index > 0 ? '-' + index : ''}`;

    article.innerHTML = `
      <div class="blog-image">
        <img
          src="${post.image}"
          alt="${post.title}"
          width="360"
          height="239" />
      </div>
      <div class="blog-content">
        <span class="blog-date">
          <i class="far fa-calendar-alt"></i> ${post.dateDisplay}
        </span>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a href="${post.url}" class="blog-link">
          Read Full Post <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    `;

    return article;
  }

  function loadAdditionalPosts() {
    const gridList = document.querySelector('.blog-grid-list');
    if (!gridList) return;

    // Get posts after the featured ones (skip first 3 featured)
    const additionalPosts = blogPosts.slice(3, 13); // Show 10 additional posts

    // Clear existing content
    gridList.innerHTML = '';

    // Create list item for each post
    additionalPosts.forEach(post => {
      const item = createListItem(post);
      gridList.appendChild(item);
    });
  }

  function createListItem(post) {
    const link = document.createElement('a');
    link.href = post.url;
    link.className = 'blog-list-item';

    link.innerHTML = `
      <div class="blog-list-content">
        <h4>${post.title}</h4>
        <span class="blog-list-date">
          <i class="far fa-calendar-alt"></i> ${post.dateDisplay}
        </span>
      </div>
      <i class="fas fa-arrow-right blog-list-arrow"></i>
    `;

    return link;
  }

  function loadAllBlogPosts() {
    const blogGrid = document.getElementById('blogGrid');
    if (!blogGrid) return; // Not on our-blog.html page

    // Clear existing content
    blogGrid.innerHTML = '';

    // Create card for each blog post
    blogPosts.forEach((post, index) => {
      const card = createBlogPageCard(post, index);
      blogGrid.appendChild(card);
    });

    // Setup intersection observer for scroll animations
    setupScrollAnimations();
  }

  function createBlogPageCard(post, index) {
    const article = document.createElement('article');
    article.className = 'blog-page-card fade-in';
    article.setAttribute('data-date', post.date);
    article.style.cursor = 'pointer';
    article.style.animationDelay = `${index * 0.1}s`;

    // Add click handler
    article.onclick = function() {
      window.location.href = post.url;
    };

    // Use placeholder image if no image provided
    const imageUrl = post.image || 'https://storage.googleapis.com/kws-clientele/Valley%20Peak%20Roofing%20Co/blog/newly-replaced-roof-pennsylvania.webp';

    article.innerHTML = `
      <div class="blog-page-image">
        <img
          src="${imageUrl}"
          alt="${post.title}" />
      </div>
      <div class="blog-page-content">
        <span class="blog-page-date">
          <i class="far fa-calendar-alt"></i> ${post.dateDisplay}
        </span>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <span class="blog-page-link">
          Read Full Post <i class="fas fa-arrow-right"></i>
        </span>
      </div>
    `;

    return article;
  }

  function setupScrollAnimations() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe all blog cards
    const cards = document.querySelectorAll('.blog-page-card');
    cards.forEach(card => {
      observer.observe(card);
    });
  }
})();
