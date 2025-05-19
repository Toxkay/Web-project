document.addEventListener("DOMContentLoaded", function () {
  setupNavigationObserver();
  setupIntersectionObservers();
  setupPerformanceTracking();
  setupKeyboardNavigation();
  setupScrollProgress();
  setupBackToTopButton();
  initializeStyles();
});

function setupNavigationObserver() {
  // Preload adjacent recipes for faster navigation
  const preloadRecipes = () => {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const currentId = new URLSearchParams(window.location.search).get("id");
    const currentIndex = recipes.findIndex(r => r.id === currentId);
    
    if (currentIndex === -1) return;

    const prevIndex = (currentIndex - 1 + recipes.length) % recipes.length;
    const nextIndex = (currentIndex + 1) % recipes.length;
    
    // Create link preload tags
    [prevIndex, nextIndex].forEach(index => {
      const link = document.createElement('link');
      link.rel = 'prerender';
      link.href = `recipe-details.html?id=${recipes[index].id}`;
      document.head.appendChild(link);
    });
  };

  // Call preload after a short delay
  requestIdleCallback(() => preloadRecipes());
}

function setupIntersectionObservers() {
  const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe recipe sections
  document.querySelectorAll('.recipe-section').forEach(section => {
    sectionObserver.observe(section);
  });
}

function setupPerformanceTracking() {
  // Track and report performance metrics
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log(`LCP: ${entry.startTime}`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // Track user interactions
  let lastInteraction = Date.now();
  document.addEventListener('click', () => {
    lastInteraction = Date.now();
  });

  // Show loading state if navigation takes too long
  const showLoadingState = () => {
    const loader = document.querySelector('.page-loader');
    if (loader && Date.now() - lastInteraction < 100) {
      loader.classList.add('active');
    }
  };

  const hideLoadingState = () => {
    const loader = document.querySelector('.page-loader');
    if (loader) {
      loader.classList.remove('active');
    }
  };

  window.addEventListener('beforeunload', showLoadingState);
  window.addEventListener('load', hideLoadingState);
}

function setupKeyboardNavigation() {
  if (!isRecipePage()) return;

  const map = new Map();
  
  const handleKeyDown = (e) => {
    map.set(e.key, true);
    
    // Navigation shortcuts
    if (e.key === 'ArrowLeft') navigateRecipe('prev');
    if (e.key === 'ArrowRight') navigateRecipe('next');
    if (e.key === 'Escape') window.location.href = 'recipes.html';
    
    // Print shortcut (Cmd/Ctrl + P)
    if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
      e.preventDefault();
      document.querySelector('.print-button')?.click();
    }
    
    // Share shortcut (Cmd/Ctrl + Shift + S)
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'S') {
      e.preventDefault();
      document.querySelector('.share-button')?.click();
    }
  };

  const handleKeyUp = (e) => {
    map.delete(e.key);
  };

  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
}

function setupScrollProgress() {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  window.addEventListener("scroll", () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progress.style.width = `${scrolled}%`;
  });
}

function setupBackToTopButton() {
  const button = document.createElement("button");
  button.className = "back-to-top";
  button.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
    </svg>
  `;
  document.body.appendChild(button);

  let isScrolling;
  window.addEventListener("scroll", () => {
    button.style.display = window.scrollY > 200 ? "block" : "none";
    button.classList.toggle("active", window.scrollY > 200);

    // Hide button while actively scrolling
    clearTimeout(isScrolling);
    button.classList.add("scrolling");
    
    isScrolling = setTimeout(() => {
      button.classList.remove("scrolling");
    }, 150);
  });

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

function navigateRecipe(direction) {
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const currentId = new URLSearchParams(window.location.search).get("id");
  const currentIndex = recipes.findIndex(r => r.id === currentId);
  
  if (currentIndex === -1) return;

  let nextIndex;
  if (direction === "prev") {
    nextIndex = currentIndex === 0 ? recipes.length - 1 : currentIndex - 1;
  } else {
    nextIndex = currentIndex === recipes.length - 1 ? 0 : currentIndex + 1;
  }

  // Add transition class
  document.body.classList.add('page-transition');
  
  // Show loading indicator
  const loader = document.querySelector('.page-loader');
  if (loader) loader.classList.add('active');
  
  setTimeout(() => {
    window.location.href = `recipe-details.html?id=${recipes[nextIndex].id}`;
  }, 300);
}

function isRecipePage() {
  return window.location.pathname.includes("recipe-details.html");
}

function initializeStyles() {
  // Add dynamic styles for recipe elements
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .recipe-details {
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease forwards;
    }

    .recipe-navigation {
      opacity: 0;
      animation: fadeIn 0.6s ease 0.3s forwards;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .ingredient-list li, .instruction-list li {
      position: relative;
      padding-left: 1.5em;
      margin-bottom: 1em;
      opacity: 0;
      animation: fadeInLeft 0.5s ease forwards;
      animation-delay: calc(var(--item-index) * 0.1s);
    }

    @keyframes fadeInLeft {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // Add scroll progress tracking
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = `${scrolled}%`;
    });
  }

  // Add animation delays to list items
  document.querySelectorAll('.ingredient-list li, .instruction-list li').forEach((item, index) => {
    item.style.setProperty('--item-index', index);
  });
}
