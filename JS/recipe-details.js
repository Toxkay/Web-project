document.addEventListener("DOMContentLoaded", function () {
  // Get container element where recipe details will be rendered
  const container = document.getElementById("recipe-details-container");

  // Get the recipe ID from the URL
  const params = new URLSearchParams(window.location.search);
  const recipeId = params.get("id");

  // Retrieve the list of recipes from localStorage or initialize an empty array
  const recipes = JSON.parse(localStorage.getItem("recipes")) || [];

  // Find the recipe that matches the ID
  const recipe = recipes.find((r) => r.id === recipeId);

  // If no recipe is found, display a message and stop the function
  if (!recipe) {
    container.innerHTML = "<p>Recipe not found.</p>";
    return;
  }

  // Build the recipe details HTML structure
  let recipeHTML = `
    <section class="recipe-page">
      <a href="recipes.html">← Back to Recipe List</a>
      <section class="recipe-title">
        <h1>${recipe.name}</h1>
        <p><strong>Course:</strong> ${recipe.course}</p>
        <p><strong>Description:</strong> ${recipe.description}</p>
      </section>
      <section class="recipe-details">
        <h2>Ingredients</h2>
        <ul>
          ${recipe.ingredients
            .map((ingredient) => {
              return `<li>${ingredient.name}${
                ingredient.quantity ? " (" + ingredient.quantity + ")" : ""
              }</li>`;
            })
            .join("")}
        </ul>
  `;

  // Add Materials Needed section if available
  if (recipe.materials && recipe.materials.length) {
    recipeHTML += `
      <h2>Materials Needed</h2>
      <ul>
        ${recipe.materials.map((material) => `<li>${material}</li>`).join("")}
      </ul>
    `;
  }

  // Add Instructions section if available
  if (Array.isArray(recipe.instructions) && recipe.instructions.length) {
    recipeHTML += `
      <h2>Instructions</h2>
      <ol>
        ${recipe.instructions.map((step) => `<li>${step.trim()}</li>`).join("")}
      </ol>
    `;
  }

  // Add Tips section if available
  if (recipe.tips && Array.isArray(recipe.tips) && recipe.tips.length) {
    recipeHTML += `
      <h2>Tips</h2>
      <ul>
        ${recipe.tips.map((tip) => `<li>${tip.trim()}</li>`).join("")}
      </ul>
    `;
  }

  // Close the recipe details section
  recipeHTML += `
      </section>
    </section>
  `;

  // Render the recipe details in the container
  container.innerHTML = recipeHTML;
});
