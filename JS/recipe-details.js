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

    // Render using the exact structure of recipe-bechamel.html
    container.innerHTML = `
    <section class="recipe-page">
        <a href="recipes.html">← Back to Recipe List</a>
        <section class="recipe-title">
            <h1>${recipe.name}</h1>
            <p><strong>Course:</strong> ${recipe.course}</p>
            <p><strong>Description:</strong>${recipe.description}</p>
        </section>
        <section class="recipe-details">
            <h2>Ingredients</h2>
            <ul>
                ${recipe.ingredients.map(i => `<li>${i.name}${i.quantity ? ' ('+i.quantity+')' : ''}</li>`).join('')}
            </ul>
            ${recipe.materials && recipe.materials.length ? `<h2>Materials Needed</h2><ul>${recipe.materials.map(m => `<li>${m}</li>`).join('')}</ul>` : ''}
            <h2>Instructions</h2>
            <ol>
                ${recipe.instructions && recipe.instructions.length ? recipe.instructions.map(step => `<li>${step}</li>`).join('') : '<li>Instructions not available.</li>'}
            </ol>
            ${recipe.tips && recipe.tips.length ? `<h2>Tips</h2><ul>${recipe.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>` : ''}
        </section>
    </section>
    `;
});
