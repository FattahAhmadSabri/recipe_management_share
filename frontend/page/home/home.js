console.log("home.js is running");

const recipeList = document.getElementById("recipe-list");

axios
  .get("http://localhost:4500/recipe")
  .then((response) => {
    console.log("API response:", response.data);

    const recipes = response.data.data;

    recipeList.innerHTML = "";

    recipes.forEach((recipe) => {
      const recipeId = encodeURIComponent(recipe.id);
      const imageUrl = encodeURIComponent(recipe.image || "");

      recipeList.innerHTML += `
        <a
          class="recipe-card"
          href="./page/home/recipeDetails.html?id=${recipeId}&image=${imageUrl}"
        >
          <img
            src="${escapeHtml(recipe.image)}"
            alt="${escapeHtml(recipe.recipeName)}"
            class="recipe-image"
          />

          <h2 class="recipe-title">
            ${escapeHtml(recipe.recipeName)}
          </h2>

          <p class="recipe-description">
            ${escapeHtml(recipe.description || recipe.method || "")}
          </p>

          <p class="posted-by">
            Main Ingredient: ${escapeHtml(recipe.mainIngredientName)}
          </p>
        </a>
      `;
    });
  })
  .catch((error) => {
    console.log("API error:", error);

    recipeList.innerHTML = `
      <p>Unable to load recipes.</p>
    `;
  });

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}
