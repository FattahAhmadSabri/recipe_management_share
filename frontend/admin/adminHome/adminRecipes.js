const recipeTable = document.getElementById("recipeTable");
const logoutLink = document.getElementById("logoutLink");
const recipeMessage = document.getElementById("recipeMessage");
const editRecipeDialog = document.getElementById("editRecipeDialog");
const editRecipeForm = document.getElementById("editRecipeForm");
const recipesApi = "http://localhost:4500/recipe";
let recipes = [];

logoutLink.addEventListener("click", () => {
  localStorage.removeItem("token");
});

function authConfig() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  };
}

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );
}

function renderRecipes() {
  if (recipes.length === 0) {
    recipeTable.innerHTML = '<tr><td colspan="5">No recipes found.</td></tr>';
    return;
  }

  recipeTable.innerHTML = recipes
    .map(
      (recipe) => `
        <tr>
          <td>${escapeHTML(recipe.recipeName || "Untitled")}</td>
          <td>${escapeHTML(recipe.mainIngredientName || "-")}</td>
          <td>${escapeHTML(recipe.recipeTypeName || "-")}</td>
          <td>${escapeHTML(recipe.description || recipe.method || "-")}</td>
          <td>
            <div class="recipe-actions">
              <button type="button" data-action="edit" data-recipe-id="${escapeHTML(recipe.id)}">Edit</button>
              <button type="button" data-action="delete" data-recipe-id="${escapeHTML(recipe.id)}">Delete</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

async function fetchRecipes() {
  recipeMessage.textContent = "";
  recipeTable.innerHTML = '<tr><td colspan="5">Loading recipes...</td></tr>';

  try {
    const response = await axios.get(recipesApi);
    recipes = response.data.data || [];
    renderRecipes();
  } catch (error) {
    console.error("Failed to load recipes:", error);
    recipeTable.innerHTML =
      '<tr><td colspan="5">Unable to load recipes.</td></tr>';
    recipeMessage.textContent =
      error.response?.data?.message || "Unable to load recipes.";
  }
}

function openEditDialog(recipe) {
  editRecipeForm.dataset.recipeId = recipe.id;
  document.getElementById("editRecipeMessage").textContent = "";

  for (const field of [
    "recipeName",
    "description",
    "ingredients",
    "method",
    "cuisine",
    "cookingTime",
  ]) {
    editRecipeForm.elements.namedItem(field).value = recipe[field] || "";
  }

  editRecipeDialog.showModal();
}

recipeTable.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const recipe = recipes.find(
    (item) => String(item.id) === button.dataset.recipeId,
  );

  if (!recipe) {
    return;
  }

  if (button.dataset.action === "edit") {
    openEditDialog(recipe);
    return;
  }

  if (!window.confirm(`Delete "${recipe.recipeName || "this recipe"}"?`)) {
    return;
  }

  button.disabled = true;
  recipeMessage.textContent = "";

  try {
    await axios.delete(
      `${recipesApi}/${encodeURIComponent(recipe.id)}`,
      authConfig(),
    );
    recipes = recipes.filter((item) => item.id !== recipe.id);
    renderRecipes();
    recipeMessage.textContent = "Recipe deleted successfully.";
  } catch (error) {
    recipeMessage.textContent =
      error.response?.data?.message || "Unable to delete recipe.";
    button.disabled = false;
  }
});

editRecipeForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = editRecipeForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  recipeMessage.textContent = "";

  const updates = Object.fromEntries(
    [
      "recipeName",
      "description",
      "ingredients",
      "method",
      "cuisine",
      "cookingTime",
    ].map((field) => [
      field,
      editRecipeForm.elements.namedItem(field).value.trim(),
    ]),
  );

  try {
    await axios.put(
      `${recipesApi}/${encodeURIComponent(editRecipeForm.dataset.recipeId)}`,
      updates,
      authConfig(),
    );
    editRecipeDialog.close();
    await fetchRecipes();
    recipeMessage.textContent = "Recipe updated successfully.";
  } catch (error) {
    document.getElementById("editRecipeMessage").textContent =
      error.response?.data?.message || "Unable to update recipe.";
  } finally {
    submitButton.disabled = false;
  }
});

document.getElementById("cancelRecipeEdit").addEventListener("click", () => {
  editRecipeDialog.close();
});

fetchRecipes();
