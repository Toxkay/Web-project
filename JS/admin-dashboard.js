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
                  .join(", ")}<br>
                  <em>Materials:</em> ${
                    recipe.materials?.join(", ") || "N/A"
                  }<br>
                  <em>Instructions:</em> ${
                    Array.isArray(recipe.instructions) &&
                    recipe.instructions.length > 0
                      ? `<ul>${recipe.instructions
                          .map((step) => `<li>${step}</li>`)
                          .join("")}</ul>`
                      : "N/A"
                  }<br>
                  ${recipe.tips ? `<em>Tips:</em> ${recipe.tips}<br>` : ""}
  
                <em>Description:</em> ${recipe.description}<br>
                <button class="edit-btn" data-id="${recipe.id}">Edit</button>
                <button class="delete-btn" data-id="${
                  recipe.id
                }">Delete</button>
                <hr>
            `;
      listDiv.appendChild(recipeDiv);
    });
  }
  // Add recipe
  const form = document.querySelector("#add-recipe form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("recipe-name").value.trim();
      const course = document.getElementById("course").value;
      const ingredientsStr = document
        .getElementById("ingredients")
        .value.trim();
      const description = document.getElementById("description").value.trim();
      const imageInput = document.getElementById("image");
      const duration = document.getElementById("duration").value.trim();
      const materialsStr = document.getElementById("materials").value.trim();
      const instructionsStr = document
        .getElementById("instructions")
        .value.trim();
      const tips = document.getElementById("tips").value.trim();

      if (!/^[0-9]+$/.test(duration)) {
        alert("Duration must be a number in minutes.");
        return;
      }

      if (
        !name ||
        !ingredientsStr ||
        !description ||
        !materialsStr ||
        !instructionsStr
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      // Validate that ingredients are separated by commas
      if (!ingredientsStr.includes(",")) {
        alert("Please separate ingredients with commas.");
        return;
      }

      // Convert instructions into an array (split by full stops)
      const instructions = instructionsStr
        .split(".")
        .map((step) => step.trim())
        .filter(Boolean); // Remove any empty strings that might result from consecutive full stops

      const handleRecipe = (imageData) => {
        // Always fetch the latest recipes from localStorage
        const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
        const newRecipe = {
          id: generateId("rec"),
          name,
          course,
          ingredients: parseIngredients(ingredientsStr),
          materials: materialsStr
            .split(",")
            .map((m) => m.trim())
            .filter(Boolean),
          instructions, // Store instructions as an array
          tips,
          description,
          image: imageData || "",
          createdAt: new Date().toISOString(),
          duration: duration + " mins",
        };

        recipes.push(newRecipe);
        localStorage.setItem("recipes", JSON.stringify(recipes));
        alert("Recipe added!");
        form.reset();
        renderRecipes();
      };

      if (imageInput && imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (evt) {
          handleRecipe(evt.target.result);
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        handleRecipe("");
      }
    });
  }
  // Edit and Delete handlers
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const id = e.target.getAttribute("data-id");
      let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      recipes = recipes.filter((r) => r.id !== id);
      localStorage.setItem("recipes", JSON.stringify(recipes));
      renderRecipes();
    }
    if (e.target.classList.contains("edit-btn")) {
      const id = e.target.getAttribute("data-id");
      let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
      const recipe = recipes.find((r) => r.id === id);
      if (recipe) {
        document.getElementById("recipe-name").value = recipe.name;
        document.getElementById("course").value = recipe.course;
        document.getElementById("ingredients").value = recipe.ingredients
          .map((i) => i.name + (i.quantity ? ":" + i.quantity : ""))
          .join(", ");
        document.getElementById("description").value = recipe.description;
        document.getElementById("materials").value = (
          recipe.materials || []
        ).join(", ");
        document.getElementById("instructions").value =
          recipe.instructions || "";
        document.getElementById("tips").value = recipe.tips || "";

        // Remove old recipe
        recipes = recipes.filter((r) => r.id !== id);
        localStorage.setItem("recipes", JSON.stringify(recipes));
        renderRecipes();
      }
    }
  });

  // Initial render
  renderRecipes();
});
