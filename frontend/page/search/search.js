// Load Search page CSS

const css = document.createElement("link");

css.rel = "stylesheet";

css.href = "./page/search/search.css";

document.head.appendChild(css);

// Elements

const searchInput = document.getElementById("searchInput");

const searchButton = document.getElementById("searchButton");

const clearButton = document.getElementById("clearButton");

const cuisine = document.getElementById("cuisine");

const mainIngredients = document.getElementById("mainIngredients");

const recipeTypes = document.getElementById("recipeTypes");

const tags = document.getElementById("tags");

// Search button

searchButton.addEventListener("click", () => {
  const searchValue = searchInput.value.trim();

  console.log("Search:", searchValue);
});

// Clear All

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
});
