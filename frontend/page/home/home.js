console.log("home.js is running");

const recipeList = document.getElementById("recipe-list");

axios
  .get("http://localhost:4500/recipe")
  .then((response) => {
    console.log("API response:", response.data);

    const recipes = response.data.data;

    recipeList.innerHTML = "";

    recipes.forEach((recipe) => {
      recipeList.innerHTML += `

        <article class="recipe-card">

          <img
            src="http://localhost:4500/${recipe.image}"
            alt="${recipe.recipeName}"
            class="recipe-image"
          />

          <h2 class="recipe-title">
            ${recipe.recipeName}
          </h2>

          <p class="recipe-description">
            ${recipe.description || recipe.method}
          </p>

          <a href="#" class="read-more">
            Read more
          </a>

          <p class="posted-by">
            Main Ingredient:
            <a href="#">
              ${recipe.mainIngredient}
            </a>
          </p>

        </article>

      `;
    });
  })

  .catch((error) => {
    console.log("API error:", error);

    recipeList.innerHTML = `
      <p>Unable to load recipes.</p>
    `;
  });
