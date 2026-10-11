const recipeApi = "http://localhost:4500/recipe";

const css = document.createElement("link");
css.rel = "stylesheet";
css.href = "./page/search/search.css";
document.head.appendChild(css);

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");
const cuisine = document.getElementById("cuisine");
const mainIngredients = document.getElementById("mainIngredients");
const recipeTypes = document.getElementById("recipeTypes");
const tags = document.getElementById("tags");
const searchResults = document.getElementById("search-results");

let allRecipes = [];

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>\"']/g, (character) => {
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

function buildOptions(selectElement, values) {
  const uniqueValues = [...new Set(values.filter(Boolean))].sort();

  const hasPlaceholder = selectElement.querySelector("option[value='']");
  if (hasPlaceholder) {
    return;
  }

  selectElement.innerHTML = "";

  if (selectElement.multiple) {
    selectElement.innerHTML = "<option disabled>Select one or more</option>";
  }

  uniqueValues.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

function populateFilterOptions(recipes) {
  const cuisineValues = recipes.map((recipe) => recipe.cuisine).filter(Boolean);
  const ingredientValues = recipes
    .map((recipe) => recipe.mainIngredientName)
    .filter(Boolean);
  const typeValues = recipes
    .map((recipe) => recipe.recipeTypeName)
    .filter(Boolean);

  const cuisineOptions = document.createElement("option");
  cuisineOptions.value = "";
  cuisineOptions.textContent = "Please select";
  cuisine.innerHTML = "";
  cuisine.appendChild(cuisineOptions);
  cuisineValues
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .sort()
    .forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      cuisine.appendChild(option);
    });

  buildOptions(mainIngredients, ingredientValues);
  buildOptions(recipeTypes, typeValues);
}

function getSelectedValues(selectElement) {
  return Array.from(selectElement.selectedOptions).map(
    (option) => option.value,
  );
}

function matchesTerm(recipe, term) {
  if (!term) return true;

  const haystack = [
    recipe.recipeName,
    recipe.description,
    recipe.ingredients,
    recipe.method,
    recipe.cuisine,
    recipe.tags,
    recipe.keywords,
    recipe.mainIngredientName,
    recipe.recipeTypeName,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(term.toLowerCase());
}

function matchesFilters(recipe) {
  const selectedCuisine = cuisine.value.trim();
  const selectedIngredients = getSelectedValues(mainIngredients);
  const selectedTypes = getSelectedValues(recipeTypes);
  const tagValue = tags.value.trim().toLowerCase();

  if (
    selectedCuisine &&
    (recipe.cuisine || "").toLowerCase() !== selectedCuisine.toLowerCase()
  ) {
    return false;
  }

  if (
    selectedIngredients.length &&
    !selectedIngredients.includes(recipe.mainIngredientName)
  ) {
    return false;
  }

  if (selectedTypes.length && !selectedTypes.includes(recipe.recipeTypeName)) {
    return false;
  }

  if (tagValue) {
    const combined =
      `${recipe.tags || ""} ${recipe.keywords || ""}`.toLowerCase();
    if (!combined.includes(tagValue)) {
      return false;
    }
  }

  return true;
}

function renderRecipes(recipes) {
  if (!recipes.length) {
    searchResults.innerHTML =
      '<div class="no-results">No recipes match your search.</div>';
    return;
  }

  searchResults.innerHTML = recipes
    .map((recipe) => {
      const recipeId = encodeURIComponent(recipe.id);
      const imageUrl = encodeURIComponent(recipe.image || "");
      const imageSrc =
        recipe.image || "https://placehold.co/600x400?text=Recipe";

      return `
        <a class="recipe-card" href="../home/recipeDetails.html?id=${recipeId}&image=${imageUrl}">
          <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(recipe.recipeName || "Recipe")}" class="recipe-image" />
          <h2 class="recipe-title">${escapeHtml(recipe.recipeName || "Recipe")}</h2>
          <p class="recipe-description">${escapeHtml(recipe.description || recipe.method || "")}</p>
          <p class="posted-by">
            Main Ingredient: ${escapeHtml(recipe.mainIngredientName || "Unknown")}
          </p>
        </a>
      `;
    })
    .join("");
}

function applyFilters() {
  const query = searchInput.value.trim();

  const filteredRecipes = allRecipes.filter((recipe) => {
    return matchesTerm(recipe, query) && matchesFilters(recipe);
  });

  renderRecipes(filteredRecipes);
}

async function loadRecipes() {
  try {
    searchResults.innerHTML =
      '<div class="loading-message">Loading recipes...</div>';
    const response = await axios.get(recipeApi);
    allRecipes = response?.data?.data || [];

    populateFilterOptions(allRecipes);
    applyFilters();
  } catch (error) {
    console.error("Failed to load recipes:", error);
    searchResults.innerHTML =
      '<div class="error-message">Unable to load recipes.</div>';
  }
}

searchButton.addEventListener("click", applyFilters);
searchInput.addEventListener("input", applyFilters);
cuisine.addEventListener("change", applyFilters);
mainIngredients.addEventListener("change", applyFilters);
recipeTypes.addEventListener("change", applyFilters);
tags.addEventListener("input", applyFilters);

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  cuisine.value = "";
  tags.value = "";

  Array.from(mainIngredients.options).forEach((option) => {
    option.selected = false;
  });

  Array.from(recipeTypes.options).forEach((option) => {
    option.selected = false;
  });

  applyFilters();
});

loadRecipes();
