// Dynamic search for recipes by name or ingredient

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("search-form");
    const input = document.getElementById("inputSearch");
    const results = document.getElementById("search-results");
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    function renderResults(filtered) {
        // Clear existing results with fade-out
        const existingResults = results.children;
        Array.from(existingResults).forEach((item, index) => {
            item.style.animation = `fadeOut 0.3s ease forwards ${index * 0.05}s`;
        });

        // Remove old results after animation
        setTimeout(() => {
            results.innerHTML = '';
            
            if (filtered.length === 0) {
                const noResults = document.createElement('li');
                noResults.innerHTML = `
                    <div class="no-results">
                        <p>No recipes found.</p>
                        <p class="suggestion">Try searching with different keywords.</p>
                    </div>`;
                results.appendChild(noResults);
                return;
            }

            // Add new results with fade-in
            filtered.forEach((recipe, index) => {
                const li = document.createElement('li');
                li.className = 'cards_item';
                li.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
                li.style.opacity = '0';
                
                li.innerHTML = `
                    <div class="card">
                        <div class="card_content">
                            <h2 class="card_title">${recipe.name}</h2>
                            <p class="recipe-category">${recipe.course}</p>
                            <div class="recipe-details">
                                <p><strong>Ingredients:</strong> ${recipe.ingredients.map(i => 
                                    `<span class="ingredient">${i.name}${i.quantity ? ' ('+i.quantity+')' : ''}</span>`
                                ).join(', ')}</p>
                                <p class="recipe-description"><strong>Description:</strong> ${recipe.description}</p>
                            </div>
                            <button class="view-recipe-btn" data-id="${recipe.id}">View Recipe</button>
                        </div>
                    </div>
                `;
                results.appendChild(li);
            });
        }, existingResults.length ? 300 : 0);
    }

    function filterRecipes(query) {
        query = query.toLowerCase();
        return recipes.filter(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(query);
            const ingredientMatch = recipe.ingredients.some(i => 
                i.name.toLowerCase().includes(query)
            );
            const courseMatch = recipe.course.toLowerCase().includes(query);
            const descriptionMatch = recipe.description.toLowerCase().includes(query);
            
            return nameMatch || ingredientMatch || courseMatch || descriptionMatch;
        });
    }

    let searchTimeout;
    input.addEventListener("input", function() {
        clearTimeout(searchTimeout);
        const query = input.value.trim();
        
        // Add loading indicator
        input.classList.add('searching');
        
        // Debounce search for better performance
        searchTimeout = setTimeout(() => {
            const filtered = filterRecipes(query);
            renderResults(filtered);
            input.classList.remove('searching');
        }, 300);
    });

    results.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-recipe-btn')) {
            const recipeId = e.target.getAttribute('data-id');
            const button = e.target;
            
            // Add click animation
            button.classList.add('clicked');
            setTimeout(() => {
                window.location.href = `recipe-details.html?id=${recipeId}`;
            }, 200);
        }
    });

    // Initial render
    renderResults(recipes);
});
