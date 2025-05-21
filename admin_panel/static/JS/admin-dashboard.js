document.addEventListener("DOMContentLoaded", function () {
  // Admin check
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    alert("Access denied. Admins only.");
    window.location.href = "login.html";
  }

  // Helper to generate unique IDs
  function generateId(prefix) {
    return prefix + "_" + Math.random().toString(36).substr(2, 9);
  }

  // Parse ingredients string to array of objects
  function parseIngredients(str) {
    return str
      .split(",")
      .map((item) => {
        const [name, quantity] = item.split(":").map((s) => s.trim());
        return { id: generateId("ing"), name, quantity };
      })
      .filter((ing) => ing.name);
  }

  // Render recipe list
  function renderRecipes() {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const listDiv = document.getElementById("recipe-list");
    if (!listDiv) return;
    listDiv.innerHTML = "";
    if (recipes.length === 0) {
      listDiv.innerHTML = "<p>No recipes found.</p>";
      return;
    }
    recipes.forEach((recipe) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.className = "recipe-item";
      recipeDiv.innerHTML = `
                ${
                  recipe.image
                    ? `<img src="${recipe.image}" alt="Recipe Image" style="max-width:120px;max-height:120px;">`
                    : ""
                }
                <strong>${recipe.name}</strong> (${recipe.course})<br>
                <em>Ingredients:</em> ${recipe.ingredients
                  .map(
                    (i) => i.name + (i.quantity ? " (" + i.quantity + ")" : "")
                  )
                  .join(", ")}<br>`;
      listDiv.appendChild(recipeDiv);
    });
  }

  renderRecipes();
});