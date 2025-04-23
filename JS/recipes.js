// Dynamically render recipes and allow adding to favorites

document.addEventListener("DOMContentLoaded", function() {
    const recipeListDiv = document.getElementById("dynamic-recipe-list");
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    function renderRecipes() {
        recipeListDiv.innerHTML = '';
        if (recipes.length === 0) {
            recipeListDiv.innerHTML = '<p>No recipes found.</p>';
            return;
        }
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let favorites = [];
        if (currentUser) {
            const user = users.find(u => u.email === currentUser.email);
            favorites = user && user.favorites ? user.favorites : [];
        }
        recipes.forEach(recipe => {
            const isFavorited = favorites.includes(recipe.id);
            const card = document.createElement('article');
            card.className = 'recipe-card';
            card.innerHTML = `
                <div class="image-wrapper">
                    <img src="${recipe.image || '/images/placeholder.jpg'}" alt="${recipe.name}">
                    ${recipe.duration ? `<span class="badge">${recipe.duration}</span>` : ''}
                </div>
                <div class="card-content">
                    <button class="favorite-btn" data-id="${recipe.id}" title="Add to Favorites">${isFavorited ? '&#10084;' : '&#9825;'}</button>
                    <h3 class="recipe-title">${recipe.name}</h3>
                    <p class="recipe-category">${recipe.course}</p>
                    <a href="recipe-details.html?id=${recipe.id}" class="view-button">View Recipe</a>
                </div>
            `;
            recipeListDiv.appendChild(card);
        });
    }

    recipeListDiv.addEventListener('click', function(e) {
        if (e.target.classList.contains('favorite-btn')) {
            if (!currentUser) {
                alert('Please login to add favorites.');
                return;
            }
            const recipeId = e.target.getAttribute('data-id');
            let users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => u.email === currentUser.email);
            if (userIndex === -1) return;
            users[userIndex].favorites = users[userIndex].favorites || [];
            if (!users[userIndex].favorites.includes(recipeId)) {
                users[userIndex].favorites.push(recipeId);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            } else {
                users[userIndex].favorites = users[userIndex].favorites.filter(id => id !== recipeId);
                localStorage.setItem('users', JSON.stringify(users));
                localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
            }
            renderRecipes();
        }
        if (e.target.classList.contains('view-recipe-btn')) {
            const recipeId = e.target.getAttribute('data-id');
            window.location.href = `recipe-details.html?id=${recipeId}`;
        }
    });

    renderRecipes();
});
