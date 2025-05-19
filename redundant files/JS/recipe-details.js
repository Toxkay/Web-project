document.addEventListener("DOMContentLoaded", function () {
  // Enable performance tracking
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log(`LCP: ${Math.round(entry.startTime)} ms`);
        }
      });
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  // Initialize recipe loading with optimizations
  initializeRecipeLoad();
});

function initializeRecipeLoad() {
  const container = document.getElementById("recipe-details-container");
  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("id");
  
  // Show optimistic loading state
  container.innerHTML = createLoadingTemplate();
  
  // Start preloading images
  preloadRecipeImages();
  
  // Load recipe data with timeout for better UX
  const loadTimeout = setTimeout(() => {
    container.querySelector('.recipe-loading')?.classList.add('extended-loading');
  }, 3000);

  try {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const recipe = recipes.find((r) => r.id === recipeId);

    // Clear timeout if we got data quickly
    clearTimeout(loadTimeout);

    if (!recipe) {
      showErrorState();
      return;
    }

    // Small delay for loading animation
    requestAnimationFrame(() => {
      setTimeout(() => {
        renderRecipe(recipe);
        initializeFeatures(recipe);
      }, 300);
    });
  } catch (error) {
    console.error('Error loading recipe:', error);
    showErrorState();
  }
}

function preloadRecipeImages() {
  try {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const imagesToPreload = recipes.slice(0, 5).map(r => r.image).filter(Boolean);
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  } catch (error) {
    console.error('Error preloading images:', error);
  }
}

function initializeFeatures(recipe) {
  // Initialize all features in parallel
  Promise.all([
    initializeRating(recipe.id),
    addRecommendations(recipe),
    setupNavigationObserver(),
    setupIntersectionObservers()
  ]).catch(error => {
    console.error('Error initializing features:', error);
  });

  // Add keyboard shortcuts
  setupKeyboardShortcuts();
}

function setupKeyboardShortcuts() {
  const shortcuts = new Map([
    ['p', () => document.querySelector('.print-button')?.click()],
    ['s', () => document.querySelector('.share-button')?.click()],
    ['ArrowLeft', () => navigateRecipe('prev')],
    ['ArrowRight', () => navigateRecipe('next')],
    ['Escape', () => window.location.href = 'recipes.html']
  ]);

  document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in input fields
    if (e.target.matches('input, textarea')) return;

    const action = shortcuts.get(e.key);
    if (action) {
      e.preventDefault();
      action();
    }
  });
}

// Update loading template with better accessibility
function createLoadingTemplate() {
  return `
    <div class="recipe-loading" role="alert" aria-busy="true">
      <div class="recipe-skeleton" aria-hidden="true">
        <div class="skeleton-title"></div>
        <div class="skeleton-meta"></div>
        <div class="skeleton-description"></div>
        <div class="skeleton-section">
          <div class="skeleton-heading"></div>
          <div class="skeleton-list"></div>
          <div class="skeleton-list"></div>
          <div class="skeleton-list"></div>
        </div>
      </div>
      <div class="sr-only">Loading recipe details, please wait...</div>
    </div>
  `;
}

function showErrorState() {
  const container = document.getElementById("recipe-details-container");
  container.innerHTML = `
    <div class="recipe-error">
      <h2>Recipe Not Found</h2>
      <p>We couldn't find the recipe you're looking for.</p>
      <a href="recipes.html" class="back-link">← Back to Recipes</a>
    </div>
  `;
}

function addShareButton() {
  const nav = document.querySelector('.recipe-navigation');
  if (!nav) return;

  const shareButton = document.createElement('button');
  shareButton.className = 'share-button';
  shareButton.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
    </svg>
    Share Recipe
  `;
  
  shareButton.addEventListener('click', handleShare);
  nav.appendChild(shareButton);
}

async function handleShare() {
  const recipe = document.querySelector('.recipe-page');
  if (!recipe) return;

  const recipeTitle = recipe.querySelector('h1').textContent;
  const recipeUrl = window.location.href;

  try {
    if (navigator.share) {
      await navigator.share({
        title: recipeTitle,
        text: `Check out this recipe for ${recipeTitle}!`,
        url: recipeUrl
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const tempInput = document.createElement('input');
      tempInput.value = recipeUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      showToast('Recipe link copied to clipboard!');
    }
  } catch (error) {
    console.error('Error sharing:', error);
    showToast('Could not share recipe. Link copied to clipboard instead.');
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  });
}

function renderRecipe(recipe) {
  let recipeHTML = `
    <section class="recipe-page" role="main" aria-label="Recipe details for ${recipe.name}">
      <nav class="recipe-navigation" aria-label="Recipe navigation">
        <a href="recipes.html" class="back-link" aria-label="Back to recipes list">Back to<br>Recipes</a>
        <div class="keyboard-shortcuts" role="note" aria-label="Keyboard shortcuts">
          <span>Press Esc to return to recipes list</span>
          <span>Use ← → arrows to navigate between recipes</span>
        </div>
      </nav>
      
      <section class="recipe-title fade-in">
        <h1 tabindex="0">${recipe.name}</h1>
        <div class="recipe-meta">
          <span class="recipe-course" role="text">${recipe.course}</span>
          ${recipe.duration ? `<span class="recipe-duration" role="text">${recipe.duration}</span>` : ''}
        </div>
        <p class="recipe-description" tabindex="0">${recipe.description}</p>
      </section>

      <section class="recipe-details">
        <div class="rating-section fade-in">
          <h2>Rate this Recipe</h2>
          <div class="rating-container" role="radiogroup" aria-label="Rate this recipe from 1 to 5 stars">
            <div class="stars">
              ${Array(5).fill(0).map((_, i) => `
                <button class="star-btn" data-rating="${i + 1}" aria-label="${i + 1} star${i !== 0 ? 's' : ''}" role="radio" aria-checked="false">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </button>
              `).join('')}
            </div>
            <p class="rating-avg" role="status" aria-live="polite"></p>
          </div>
        </div>
        
        <div class="recipe-section fade-in">
          <h2 tabindex="0">Ingredients</h2>
          <ul class="ingredient-list" role="list">
            ${recipe.ingredients.map((ingredient, index) => 
              `<li class="fade-in-item" tabindex="0" style="--item-index: ${index}">
                ${ingredient.name}${ingredient.quantity ? ` <span class="quantity">(${ingredient.quantity})</span>` : ''}
              </li>`
            ).join('')}
          </ul>
        </div>
  `;

  if (recipe.materials?.length) {
    recipeHTML += `
      <div class="recipe-section fade-in">
        <h2 tabindex="0">Materials Needed</h2>
        <ul class="materials-list" role="list">
          ${recipe.materials.map((material, index) => 
            `<li class="fade-in-item" tabindex="0" style="--item-index: ${index}">${material}</li>`
          ).join('')}
        </ul>
      </div>
    `;
  }

  if (Array.isArray(recipe.instructions) && recipe.instructions.length) {
    recipeHTML += `
      <div class="recipe-section fade-in">
        <h2 tabindex="0">Instructions</h2>
        <ol class="instruction-list" role="list">
          ${recipe.instructions.map((step, index) => 
            `<li class="fade-in-item" tabindex="0" style="--item-index: ${index}">${step.trim()}</li>`
          ).join('')}
        </ol>
      </div>
    `;
  }

  if (recipe.tips?.length) {
    recipeHTML += `
      <div class="recipe-section fade-in">
        <h2 tabindex="0">Tips</h2>
        <ul class="tips-list" role="list">
          ${recipe.tips.map((tip, index) => 
            `<li class="fade-in-item" tabindex="0" style="--item-index: ${index}">${tip.trim()}</li>`
          ).join('')}
        </ul>
      </div>
    `;
  }

  recipeHTML += `
      </section>
      <section class="recommendations fade-in">
        <h2>You Might Also Like</h2>
        <div class="recommendations-container"></div>
      </section>
      <div class="pagination-info" role="status" aria-live="polite"></div>
    </section>
  `;

  const container = document.getElementById("recipe-details-container");
  container.innerHTML = recipeHTML;

  // Add recommendations after rendering
  addRecommendations(recipe);

  // Update pagination info
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  const currentIndex = recipes.findIndex(r => r.id === recipe.id);
  if (currentIndex !== -1) {
    const total = recipes.length;
    const paginationInfo = document.querySelector('.pagination-info');
    paginationInfo.textContent = `Recipe ${currentIndex + 1} of ${total}`;
  }

  // Add keyboard navigation tooltip
  const keyboardTooltip = document.createElement('div');
  keyboardTooltip.className = 'keyboard-tooltip';
  keyboardTooltip.setAttribute('role', 'tooltip');
  keyboardTooltip.innerHTML = `
    <div class="tooltip-content">
      <h3>Keyboard Shortcuts</h3>
      <ul>
        <li><kbd>←</kbd> Previous recipe</li>
        <li><kbd>→</kbd> Next recipe</li>
        <li><kbd>Esc</kbd> Back to recipes</li>
      </ul>
    </div>
  `;
  document.body.appendChild(keyboardTooltip);

  // Show tooltip on '?' key press
  document.addEventListener('keydown', function(e) {
    if (e.key === '?') {
      keyboardTooltip.classList.toggle('visible');
    }
  });

  // Trigger animations
  requestAnimationFrame(() => {
    document.querySelectorAll('.fade-in').forEach((element, index) => {
      element.style.animation = `fadeInUp 0.6s ease forwards ${index * 0.2}s`;
    });

    document.querySelectorAll('.fade-in-item').forEach((element) => {
      element.classList.add('animate');
    });
  });

  // Add print button after render
  addPrintButton();

  // Add sharing functionality
  addShareButton();
  
  // Add error recovery
  window.addEventListener('unhandledrejection', function(event) {
    showToast('Something went wrong. Please try refreshing the page.');
    console.error('Promise error:', event.reason);
  });

  // Add rating functionality
  initializeRating(recipe.id);
}

function addRecommendations(currentRecipe) {
  const recommendationsContainer = document.querySelector('.recommendations-container');
  if (!recommendationsContainer) return;

  const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
  
  // Find similar recipes based on ingredients and course
  const similarRecipes = recipes
    .filter(r => r.id !== currentRecipe.id) // Exclude current recipe
    .map(recipe => {
      // Calculate similarity score
      const score = calculateSimilarity(currentRecipe, recipe);
      return { ...recipe, similarityScore: score };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 3); // Get top 3 recommendations

  // Render recommendations
  if (similarRecipes.length > 0) {
    const recommendationsHTML = similarRecipes.map((recipe, index) => `
      <article class="recommendation-card fade-in-item" style="--item-index: ${index}">
        <a href="recipe-details.html?id=${recipe.id}" class="recommendation-link">
          <div class="recommendation-content">
            <h3>${recipe.name}</h3>
            <p class="recommendation-category">${recipe.course}</p>
            <div class="recommendation-meta">
              ${recipe.duration ? `<span class="duration">${recipe.duration}</span>` : ''}
              <span class="similarity">${Math.round(recipe.similarityScore * 100)}% match</span>
            </div>
          </div>
        </a>
      </article>
    `).join('');

    recommendationsContainer.innerHTML = recommendationsHTML;

    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.recommendation-card').forEach(card => {
      observer.observe(card);
    });
  } else {
    recommendationsContainer.innerHTML = '<p>No similar recipes found.</p>';
  }
}

function calculateSimilarity(recipe1, recipe2) {
  let score = 0;
  
  // Course similarity (30% weight)
  if (recipe1.course === recipe2.course) {
    score += 0.3;
  }
  
  // Ingredient similarity (50% weight)
  const ingredients1 = recipe1.ingredients.map(i => i.name.toLowerCase());
  const ingredients2 = recipe2.ingredients.map(i => i.name.toLowerCase());
  const commonIngredients = ingredients1.filter(i => ingredients2.includes(i));
  const ingredientScore = (commonIngredients.length / Math.max(ingredients1.length, ingredients2.length)) * 0.5;
  score += ingredientScore;
  
  // Duration similarity (20% weight)
  if (recipe1.duration && recipe2.duration) {
    const duration1 = parseDuration(recipe1.duration);
    const duration2 = parseDuration(recipe2.duration);
    const durationDiff = Math.abs(duration1 - duration2);
    const durationScore = Math.max(0, 1 - (durationDiff / 60)) * 0.2; // Max 1-hour difference
    score += durationScore;
  }
  
  return score;
}

function parseDuration(durationString) {
  const minutes = durationString.match(/(\d+)/g);
  return minutes ? parseInt(minutes[0]) : 0;
}

function initializeRating(recipeId) {
  const ratingContainer = document.querySelector('.rating-container');
  const stars = document.querySelectorAll('.star-btn');
  const ratingAvg = document.querySelector('.rating-avg');
  
  if (!ratingContainer || !stars.length) return;

  // Get existing ratings
  const ratings = JSON.parse(localStorage.getItem('recipe-ratings')) || {};
  const recipeRatings = ratings[recipeId] || [];
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Calculate and display average rating
  updateAverageRating(recipeRatings);
  
  // If user is logged in and has already rated, highlight their rating
  if (currentUser) {
    const userRating = recipeRatings.find(r => r.userId === currentUser.email);
    if (userRating) {
      highlightStars(userRating.rating);
    }
  }

  // Add event listeners
  stars.forEach(star => {
    star.addEventListener('click', () => handleRating(parseInt(star.dataset.rating)));
    
    // Hover effect
    star.addEventListener('mouseenter', () => {
      const rating = parseInt(star.dataset.rating);
      highlightStars(rating, true);
    });
  });

  ratingContainer.addEventListener('mouseleave', () => {
    const currentRating = getCurrentUserRating();
    highlightStars(currentRating || 0);
  });

  function handleRating(rating) {
    if (!currentUser) {
      showToast('Please login to rate recipes');
      return;
    }

    // Animate stars on rating
    stars.forEach((star, index) => {
      const delay = index * 50;
      if (index < rating) {
        setTimeout(() => {
          star.classList.add('pop');
          setTimeout(() => star.classList.remove('pop'), 300);
        }, delay);
      }
    });

    // Update ratings in localStorage
    const ratings = JSON.parse(localStorage.getItem('recipe-ratings')) || {};
    ratings[recipeId] = ratings[recipeId] || [];
    
    // Remove existing rating from this user if any
    ratings[recipeId] = ratings[recipeId].filter(r => r.userId !== currentUser.email);
    
    // Add new rating with animation
    const ratingObj = {
      userId: currentUser.email,
      rating,
      timestamp: Date.now()
    };
    
    ratings[recipeId].push(ratingObj);
    localStorage.setItem('recipe-ratings', JSON.stringify(ratings));
    
    // Update display with animation
    const ratingAvg = document.querySelector('.rating-avg');
    if (ratingAvg) {
      ratingAvg.style.transform = 'scale(0.8)';
      ratingAvg.style.opacity = '0';
      
      setTimeout(() => {
        updateAverageRating(ratings[recipeId]);
        ratingAvg.style.transform = 'scale(1)';
        ratingAvg.style.opacity = '1';
      }, 300);
    }

    // Show confirmation with animated emoji
    const toast = document.createElement('div');
    toast.className = 'toast rating-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <span class="rating-emoji">⭐</span>
        <span class="toast-message">Thank you for rating!</span>
      </div>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    });
  }

  function updateAverageRating(ratings) {
    if (!ratings || !ratings.length) {
      ratingAvg.textContent = 'No ratings yet';
      return;
    }

    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    ratingAvg.textContent = `Average rating: ${avg.toFixed(1)} out of 5 (${ratings.length} ${ratings.length === 1 ? 'rating' : 'ratings'})`;
  }

  function highlightStars(rating, isHover = false) {
    stars.forEach((star, index) => {
      const starRating = index + 1;
      const shouldBeActive = starRating <= rating;
      
      if (shouldBeActive) {
        star.classList.add(isHover ? 'hover' : 'active');
        if (!isHover && !star.classList.contains('was-active')) {
          star.classList.add('pop');
          star.classList.add('was-active');
          setTimeout(() => star.classList.remove('pop'), 300);
        }
      } else {
        star.classList.remove('hover', 'active', 'was-active');
      }
      
      star.setAttribute('aria-checked', shouldBeActive);
    });
  }

  function getCurrentUserRating() {
    if (!currentUser) return 0;
    const ratings = JSON.parse(localStorage.getItem('recipe-ratings')) || {};
    const recipeRatings = ratings[recipeId] || [];
    const userRating = recipeRatings.find(r => r.userId === currentUser.email);
    return userRating ? userRating.rating : 0;
  }
}

// Add print button to the recipe navigation
function addPrintButton() {
  const nav = document.querySelector('.recipe-navigation');
  if (!nav) return;

  const printButton = document.createElement('button');
  printButton.className = 'print-button';
  printButton.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/>
    </svg>
    Print Recipe
  `;
  
  printButton.addEventListener('click', handlePrint);
  nav.appendChild(printButton);
}

function handlePrint() {
  // Create print-friendly version
  const printContent = document.createElement('div');
  printContent.className = 'print-content';
  
  const recipe = document.querySelector('.recipe-page');
  if (!recipe) return;

  // Clone content for printing
  const printRecipe = recipe.cloneNode(true);
  
  // Remove navigation elements
  const nav = printRecipe.querySelector('.recipe-navigation');
  if (nav) nav.remove();
  
  // Add print-specific styles
  const style = document.createElement('style');
  style.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      .print-content, .print-content * {
        visibility: visible;
      }
      .print-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      @page {
        margin: 2cm;
      }
      .recipe-title h1 {
        font-size: 24pt;
        color: black;
      }
      .recipe-description {
        font-size: 12pt;
        color: black;
      }
      .recipe-section {
        page-break-inside: avoid;
        margin: 20pt 0;
        padding: 0;
        box-shadow: none;
      }
      .recipe-section h2 {
        font-size: 18pt;
        color: black;
      }
      .recipe-meta {
        margin: 10pt 0;
      }
      .recipe-meta span {
        color: black;
        background: none;
        border: 1px solid black;
      }
      .footer, .back-to-top, .keyboard-tooltip {
        display: none !important;
      }
    }
  `;
  
  printContent.appendChild(style);
  printContent.appendChild(printRecipe);
  document.body.appendChild(printContent);
  
  window.print();
  
  // Cleanup after print dialog closes
  setTimeout(() => {
    document.body.removeChild(printContent);
  }, 1000);
}

// Handle keyboard navigation focus
document.addEventListener('keydown', function(e) {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-navigation');
  }
});

document.addEventListener('mousedown', function() {
  document.body.classList.remove('keyboard-navigation');
});

// Add error boundary
window.addEventListener('error', function(event) {
  showErrorState();
  console.error('Recipe loading error:', event.error);
  return false;
});
