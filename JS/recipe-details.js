// Dynamically render recipe details based on ID in URL

document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("recipe-details-container");
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get("id");
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) {
        container.innerHTML = '<p>Recipe not found.</p>';
        return;
    }
    container.innerHTML = `
        <div class="recipe-details-card">
            ${recipe.image ? `<img src="${recipe.image}" alt="Recipe Image" class="recipe-details-img">` : ''}
            <h1 class="recipe-title">${recipe.name}</h1>
            <h3 class="recipe-category">${recipe.course}</h3>
            <h4>Ingredients</h4>
            <ul>
                ${recipe.ingredients.map(i => `<li>${i.name}${i.quantity ? ' ('+i.quantity+')' : ''}</li>`).join('')}
            </ul>
            <h4>Description</h4>
            <p>${recipe.description}</p>
        </div>
    `;
});
