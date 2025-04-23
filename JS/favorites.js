// Dynamically render user's favorite recipes

document.addEventListener("DOMContentLoaded", function() {
    const favoritesDiv = document.getElementById("favorites-list");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    if (!currentUser || !currentUser.favorites || currentUser.favorites.length === 0) {
        favoritesDiv.innerHTML = '<p>No favorites yet.</p>';
        return;
    }
    const favoriteRecipes = recipes.filter(r => currentUser.favorites.includes(r.id));
    if (favoriteRecipes.length === 0) {
        favoritesDiv.innerHTML = '<p>No favorites yet.</p>';
        return;
    }
    favoriteRecipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="card-content">
                <h3 class="recipe-title">${recipe.name}</h3>
                <p class="recipe-category">${recipe.course}</p>
                <p><strong>Ingredients:</strong> ${recipe.ingredients.map(i => i.name + (i.quantity ? ' ('+i.quantity+')' : '')).join(', ')}</p>
                <p><strong>Description:</strong> ${recipe.description}</p>
                <button class="view-recipe-btn" data-id="${recipe.id}">View Recipe</button>
            </div>
        `;
        favoritesDiv.appendChild(card);
    });

    favoritesDiv.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-recipe-btn')) {
            const recipeId = e.target.getAttribute('data-id');
            window.location.href = `recipe-details.html?id=${recipeId}`;
        }
    });
});
