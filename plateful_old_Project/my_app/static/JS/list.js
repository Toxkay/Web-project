document.addEventListener("DOMContentLoaded", () => {
  setupBackToTopButton();
});

function setupBackToTopButton() {
  const button = createOrGetBackToTopButton();
  
  // Hide button initially
  button.style.display = "none";
  
  // Show/hide button based on scroll position
  let lastScrollTop = 0;
  const scrollThreshold = 200;
  
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    
    // Show/hide based on scroll position and direction
    if (currentScroll > scrollThreshold) {
      if (currentScroll > lastScrollTop) {
        // Scrolling down - hide button with fade
        button.style.opacity = "0";
        setTimeout(() => {
          button.style.display = "none";
        }, 300);
      } else {
        // Scrolling up - show button with fade
        button.style.display = "block";
        setTimeout(() => {
          button.style.opacity = "1";
        }, 10);
      }
    } else {
      // Above threshold - hide button
      button.style.opacity = "0";
      setTimeout(() => {
        button.style.display = "none";
      }, 300);
    }
    
    lastScrollTop = currentScroll;
  });

  // Smooth scroll to top with easing
  button.addEventListener("click", () => {
    const scrollDuration = 600;
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 15);
  });
}

function createOrGetBackToTopButton() {
  let button = document.querySelector(".back-to-top");
  
  if (!button) {
    button = document.createElement("button");
    button.className = "back-to-top";
    button.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
      </svg>
    `;
    button.style.transition = "opacity 0.3s ease";
    document.body.appendChild(button);
  }
  
  return button;
}
