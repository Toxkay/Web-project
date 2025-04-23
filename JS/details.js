document.addEventListener("DOMContentLoaded", function () {
  const recipes = [
    { name: "Spaghetti Carbonara", file: "recipe-carbonara.html" },
    { name: "Classic Cheesecake", file: "recipe-cheesecake.html" },
    { name: "Chicken Cream Soup", file: "recipe-chicken-soup.html" },
    { name: "Chocolate Cake", file: "recipe-chocolate-cake.html" },
    { name: "Lasagna", file: "recipe-lasagna.html" },
  ];

  if (isRecipePage()) {
    addRecipeNavigation();
    setupKeyboardNavigation();
  }

  function isRecipePage() {
    return window.location.pathname.includes("recipe-");
  }

  function addRecipeNavigation() {
    const recipeContent = document.querySelector(".recipe-details");
    if (!recipeContent) return;

    const navContainer = document.createElement("div");
    navContainer.className = "recipe-navigation";

    const prevButton = createNavButton("← Previous Recipe", goToPreviousRecipe);
    const nextButton = createNavButton("Next Recipe →", goToNextRecipe);

    navContainer.appendChild(prevButton);
    navContainer.appendChild(nextButton);

    recipeContent.parentNode.insertBefore(
      navContainer,
      recipeContent.nextSibling
    );
  }

  function createNavButton(text, clickHandler) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = "recipe-nav-button";
    button.addEventListener("click", clickHandler);
    return button;
  }

  function getCurrentRecipeIndex() {
    const currentPage = window.location.pathname.split("/").pop();
    return recipes.findIndex((recipe) => recipe.file === currentPage);
  }

  function goToPreviousRecipe() {
    const currentIndex = getCurrentRecipeIndex();
    const previousIndex = (currentIndex - 1 + recipes.length) % recipes.length;
    window.location.href = recipes[previousIndex].file;
  }

  function goToNextRecipe() {
    const currentIndex = getCurrentRecipeIndex();
    const nextIndex = (currentIndex + 1) % recipes.length;
    window.location.href = recipes[nextIndex].file;
  }

  function setupKeyboardNavigation() {
    document.addEventListener("keydown", function (event) {
      if (!isRecipePage()) return;

      switch (event.key) {
        case "ArrowLeft":
          goToPreviousRecipe();
          break;
        case "ArrowRight":
          goToNextRecipe();
          break;
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  setupBackToTopButton();

  function setupBackToTopButton() {
    const button =
      document.querySelector(".back-to-top") ||
      addElementToPage(
        "button",
        "back-to-top",
        "⬆ Back to Top",
        "append",
        "body"
      );

    button.style.display = "none";

    window.addEventListener("scroll", () => {
      button.style.display = window.scrollY > 200 ? "block" : "none";
    });

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function addElementToPage(
    tag,
    className,
    text = "",
    position = "append",
    targetSelector = "body"
  ) {
    const element = document.createElement(tag);
    element.className = className;
    if (text) element.textContent = text;

    const target = document.querySelector(targetSelector) || document.body;

    switch (position) {
      case "prepend":
        target.prepend(element);
        break;
      case "before":
        target.parentNode.insertBefore(element, target);
        break;
      default:
        target.appendChild(element);
    }

    return element;
  }
});
