const recipeApi = "http://localhost:4500/recipe";
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
const imageUrl = params.get("image");
const detail = document.getElementById("recipe-detail");

function addDetailSection(label, value) {
  if (!value) {
    return;
  }

  const section = document.createElement("section");
  section.className = "recipe-detail-section";

  const heading = document.createElement("h2");
  heading.textContent = label;

  const content = document.createElement("p");
  content.textContent = value;

  section.append(heading, content);
  detail.append(section);
}

if (!recipeId) {
  detail.textContent = "Recipe ID is missing.";
} else {
  axios
    .get(`${recipeApi}/${encodeURIComponent(recipeId)}`)
    .then((response) => {
      const recipe = response.data.data;

      if (!recipe) {
        detail.textContent = "Recipe not found.";
        return;
      }

      detail.replaceChildren();

      if (imageUrl || recipe.image?.startsWith("http")) {
        const image = document.createElement("img");
        image.className = "recipe-detail-image";
        image.src = imageUrl || recipe.image;
        image.alt = recipe.recipeName || "Recipe";
        detail.append(image);
      }

      const title = document.createElement("h1");
      title.className = "recipe-detail-title";
      title.textContent = recipe.recipeName || "Recipe details";
      detail.append(title);

      addDetailSection("Description", recipe.description);
      addDetailSection("Ingredients", recipe.ingredients);
      addDetailSection("Method", recipe.method);
      addDetailSection("Cuisine", recipe.cuisine);
      addDetailSection("Cooking time", recipe.cookingTime);
      addDetailSection("Preparation time", recipe.preparationTime);
      addDetailSection("Marination time", recipe.marinationTime);
      addDetailSection("Soaking time", recipe.soakingTime);
      addDetailSection("Serves", recipe.serves);
      addDetailSection("Makes", recipe.makes);
      addDetailSection("Other names", recipe.otherNames);
      addDetailSection("Tags", recipe.tags);
      addDetailSection("Keywords", recipe.keywords);
      addDetailSection("Source", recipe.source);
      addDetailSection("Notes", recipe.notes);
    })
    .catch((error) => {
      detail.textContent =
        error.response?.data?.message || "Unable to load recipe details.";
    });
}
