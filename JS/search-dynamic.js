// Dynamic search for recipes by name or ingredient

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("search-form");
    const input = document.getElementById("inputSearch");
    const results = document.getElementById("search-results");
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    function renderResults(filtered) {
        results.innerHTML = '';
        if (filtered.length === 0) {
            results.innerHTML = '<li><p>No recipes found.</p></li>';
            return;
        }
        filtered.forEach(recipe => {
            const li = document.createElement('li');
            li.className = 'cards_item';
            li.innerHTML = `
                <div class="card">
                    <div class="card_content">
                        <h2 class="card_title">${recipe.name}</h2>
                        <p class="recipe-category">${recipe.course}</p>
                        <p><strong>Ingredients:</strong> ${recipe.ingredients.map(i => i.name + (i.quantity ? ' ('+i.quantity+')' : '')).join(', ')}</p>
                        <p><strong>Description:</strong> ${recipe.description}</p>
                        <button class="view-recipe-btn" data-id="${recipe.id}">View Recipe</button>
                    </div>
                </div>
            `;
            results.appendChild(li);
        });
    }

    function filterRecipes(query) {
        query = query.toLowerCase();
        return recipes.filter(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(query);
            const ingredientMatch = recipe.ingredients.some(i => i.name.toLowerCase().includes(query));
            return nameMatch || ingredientMatch;
        });
    }

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const query = input.value.trim();
        renderResults(filterRecipes(query));
    });

    input.addEventListener("input", function() {
        const query = input.value.trim();
        renderResults(filterRecipes(query));
    });

    results.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-recipe-btn')) {
            const recipeId = e.target.getAttribute('data-id');
            window.location.href = `recipe-details.html?id=${recipeId}`;
        }
    });

    // Initial render (show all recipes)
    renderResults(recipes);
});
