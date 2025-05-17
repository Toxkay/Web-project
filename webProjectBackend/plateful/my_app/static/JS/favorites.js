// Dynamically render user's favorite recipes

document.addEventListener("DOMContentLoaded", function() {
    const favoritesDiv = document.getElementById("favorites-list");
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    
    if (!currentUser || !currentUser.favorites || currentUser.favorites.length === 0) {
        favoritesDiv.innerHTML = '<p class="no-recipes">No favorites yet.</p>';
        return;
    }
    
    const favoriteRecipes = recipes.filter(r => currentUser.favorites.includes(r.id));
    
    if (favoriteRecipes.length === 0) {
        favoritesDiv.innerHTML = '<p class="no-recipes">No favorites yet.</p>';
        return;
    }
    
    favoriteRecipes.forEach((recipe, index) => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.style.setProperty('--delay', `${index * 0.1}s`);
        
        card.innerHTML = `
            <div class="image-wrapper">
                <img src="${recipe.image || '../images/placeholder.jpg'}" alt="${recipe.name}"
                     loading="lazy" />
                ${recipe.duration ? `<span class="badge">${recipe.duration}</span>` : ''}
            </div>
            <div class="card-content">
                <h3 class="recipe-title">${recipe.name}</h3>
                <p class="recipe-category">${recipe.course}</p>
                <p class="recipe-description">${recipe.description}</p>
                <button class="view-recipe-btn" data-id="${recipe.id}">View Recipe</button>
            </div>
        `;

        // Add hover effect listeners
        card.addEventListener('mouseenter', handleCardHover);
        card.addEventListener('mouseleave', handleCardHover);
        
        favoritesDiv.appendChild(card);
    });

    // Trigger entrance animations
    requestAnimationFrame(() => {
        document.querySelectorAll('.recipe-card').forEach(card => {
            card.classList.add('visible');
        });
    });

    function handleCardHover(event) {
        const card = event.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    }

    favoritesDiv.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-recipe-btn')) {
            const recipeId = e.target.getAttribute('data-id');
            window.location.href = `recipe-details.html?id=${recipeId}`;
        }
    });
});
