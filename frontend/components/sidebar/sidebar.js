/**
 * Sidebar Component - Fetch and display main ingredients and recipe types
 */

// Get Main Ingredients

const api = "http://localhost:4500"
const getMainIngredients = async () => {
  try {
    const response = await axios.get(`${api}/main`);

    const ingredients = response.data.data;

    const list = document.getElementById("mainIngredientsList");

    if (!list) {
      console.warn("mainIngredientsList element not found");
      return;
    }

    ingredients.forEach((ingredient) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <a href="#">${ingredient.name}</a>
      `;

      list.appendChild(li);
    });
    console.log("✓ Main ingredients loaded");
  } catch (error) {
    console.error("✗ Error fetching main ingredients:", error);
  }
};

// Get Recipe Types
const getRecipeTypes = async () => {
  try {
    const response = await axios.get(`${api}/recipe-type`);

    const recipeTypes = response.data.data;

    const list = document.getElementById("recipeTypesList");

    if (!list) {
      console.warn("recipeTypesList element not found");
      return;
    }

    recipeTypes.forEach((type) => {
      const li = document.createElement("li");

      li.innerHTML = `
        <a href="#">${type.name}</a>
      `;

      list.appendChild(li);
    });
    console.log("✓ Recipe types loaded");
  } catch (error) {
    console.error("✗ Error fetching recipe types:", error);
  }
};

// Initialize sidebar - Call APIs when component is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    getMainIngredients();
    getRecipeTypes();
  });
} else {
  getMainIngredients();
  getRecipeTypes();
}
