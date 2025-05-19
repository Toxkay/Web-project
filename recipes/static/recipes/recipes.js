// Dynamically render recipes and allow adding to favorites

document.addEventListener("DOMContentLoaded", function () {
  const recipeListDiv = document.getElementById("dynamic-recipe-list");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  function renderRecipes(recipes) {
    recipeListDiv.innerHTML = "";
    if (!recipes.length) {
      recipeListDiv.innerHTML = '<p class="no-recipes">No recipes found.</p>';
      return;
    }
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let favorites = [];
    if (currentUser) {
      const user = users.find((u) => u.email === currentUser.email);
      favorites = user && user.favorites ? user.favorites : [];
    }
    recipes.forEach((recipe, index) => {
      const isFavorited = favorites.includes(recipe.id.toString());
      const card = document.createElement("article");
      card.className = "recipe-card";
      card.style.setProperty("--delay", `${index * 0.1}s`);
      card.innerHTML = `
                <div class="image-wrapper">
                    <img src="${
                      recipe.image || "/images/placeholder.jpg"
                    }" alt="${recipe.title}" loading="lazy" />
                    ${
                      recipe.duration
                        ? `<span class="badge">${recipe.duration} min</span>`
                        : ""
                    }
                </div>
                <div class="card-content">
                    <button class="favorite-btn" data-id="${
                      recipe.id
                    }" title="${
        isFavorited ? "Remove from Favorites" : "Add to Favorites"
      }">
                        ${isFavorited ? "❤️" : "🤍"}
                    </button>
                    <h3 class="recipe-title">${recipe.title}</h3>
                    <p class="recipe-category">${recipe.course}</p>
                    <a href="recipe-details.html?id=${
                      recipe.id
                    }" class="view-button">View Recipe</a>
                </div>
            `;
      card.addEventListener("mouseenter", handleCardHover);
      card.addEventListener("mouseleave", handleCardHover);
      recipeListDiv.appendChild(card);
    });
    requestAnimationFrame(() => {
      document.querySelectorAll(".recipe-card").forEach((card) => {
        card.classList.add("visible");
      });
    });
  }

  function handleCardHover(event) {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (event.type === "mouseenter") {
      card.style.transform = "scale(1.03)";
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    } else {
      card.style.transform = "scale(1)";
    }
  }

  function handleFavoriteClick(e) {
    if (!currentUser) {
      // Create a toast notification element
      const toast = document.createElement("div");
      toast.className = "toast-notification";
      toast.textContent = "Please login to add favorites";
      document.body.appendChild(toast);

      // Trigger animation
      requestAnimationFrame(() => {
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => toast.remove(), 300);
        }, 2000);
      });
      return;
    }

    const btn = e.target;
    const recipeId = btn.getAttribute("data-id");
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.email === currentUser.email);

    if (userIndex === -1) return;

    users[userIndex].favorites = users[userIndex].favorites || [];
    const isFavorited = users[userIndex].favorites.includes(recipeId);

    // Create heart animation element
    const heart = document.createElement("span");
    heart.className = "heart-animation";

    if (!isFavorited) {
      users[userIndex].favorites.push(recipeId);
      btn.innerHTML = "❤️";
      heart.innerHTML = "❤️";
      heart.classList.add("heart-add");
    } else {
      users[userIndex].favorites = users[userIndex].favorites.filter(
        (id) => id !== recipeId
      );
      btn.innerHTML = "🤍";
      heart.innerHTML = "💔";
      heart.classList.add("heart-remove");
    }

    // Position heart directly over the button
    const btnRect = btn.getBoundingClientRect();
    heart.style.position = "fixed";
    heart.style.left = `${btnRect.left + btnRect.width / 2}px`;
    heart.style.top = `${btnRect.top + btnRect.height / 2}px`;
    document.body.appendChild(heart);

    // Trigger animation and cleanup
    requestAnimationFrame(() => {
      heart.classList.add("animate");
      setTimeout(() => heart.remove(), 1000);
    });

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(users[userIndex]));
  }

  recipeListDiv.addEventListener("click", function (e) {
    if (e.target.classList.contains("favorite-btn")) {
      handleFavoriteClick(e);
    }
  });

  // Fetch recipes from Django API
  fetch("/api/recipes/")
    .then((response) => response.json())
    .then((data) => renderRecipes(data))
    .catch(
      () =>
        (recipeListDiv.innerHTML =
          '<p class="no-recipes">Failed to load recipes.</p>')
    );
});
