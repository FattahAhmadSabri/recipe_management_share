console.log("home.js is running");

const recipeList = document.getElementById("recipe-list");

function normalizeRecipeImage(image) {
  if (!image) {
    return "https://placehold.co/600x400/f5f5f5/8b0000?text=Recipe";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("recipes/")) {
    return `https://recipe-share-data.s3.ap-south-1.amazonaws.com/${image}`;
  }

  return image;
}

axios
  .get("http://localhost:4500/recipe")
  .then((response) => {
    console.log("API response:", response.data);

    const recipes = response.data.data;

    recipeList.innerHTML = "";

    recipes.forEach((recipe) => {
      const recipeId = encodeURIComponent(recipe.id);
      const imageUrl = encodeURIComponent(recipe.image || "");

      const safeImage = normalizeRecipeImage(recipe.image);
      recipeList.innerHTML += `
        <a
          class="recipe-card"
          href="./page/home/recipeDetails.html?id=${recipeId}&image=${encodeURIComponent(safeImage)}"
        >
          <img
            src="${escapeHtml(safeImage)}"
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
