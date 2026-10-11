const recipesApi = "http://localhost:4500/recipe";
const token = localStorage.getItem("token");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileStatus = document.getElementById("profileStatus");
const profileRecipes = document.getElementById("profileRecipes");
const editModal = document.getElementById("editModal");
const editRecipeForm = document.getElementById("editRecipeForm");

function getTokenPayload() {
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    return base64Payload ? JSON.parse(atob(base64Payload)) : null;
  } catch (error) {
    console.warn("Token decode failed:", error);
    return null;
  }
}

function getProfileInitials(name) {
  if (!name) return "U";
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "U"
  );
}

async function loadCurrentUser() {
  const payload = getTokenPayload();

  if (!token || !payload) {
    window.location.href = "../page/login_register/login.html";
    return;
  }

  const userId = payload.id || payload.userId;

  try {
    const userResponse = await axios.get("http://localhost:4500/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = Array.isArray(userResponse.data)
      ? userResponse.data
      : Array.isArray(userResponse.data?.data)
        ? userResponse.data.data
        : [];

    const currentUser = users.find(
      (user) => String(user.id) === String(userId),
    );

    const displayName =
      currentUser?.name || localStorage.getItem("userName") || "User";
    const email = currentUser?.email || "No email available";

    profileName.textContent = displayName;
    profileEmail.textContent = email;
    document.getElementById("profileAvatar").textContent =
      getProfileInitials(displayName);
  } catch (error) {
    console.warn("Could not load user data:", error);
    profileName.textContent = localStorage.getItem("userName") || "User";
    profileEmail.textContent = "Profile loaded";
  }
}

function renderRecipeCard(recipe) {
  const image =
    recipe.image || "https://placehold.co/600x400/f5f5f5/8b0000?text=Recipe";

  return `
    <article class="recipe-card">
      <img src="${image}" alt="${recipe.recipeName || "Recipe"}" class="recipe-image" />
      <div class="recipe-content">
        <h4>${recipe.recipeName || "Untitled recipe"}</h4>
        <p>${recipe.description || "No description available."}</p>
      </div>
      <div class="recipe-actions">
        <button type="button" class="primary-btn edit-btn" data-action="edit" data-id="${recipe.id}">
          Edit
        </button>
        <button type="button" class="danger-btn delete-btn" data-action="delete" data-id="${recipe.id}">
          Delete
        </button>
      </div>
    </article>
  `;
}

async function loadMyRecipes() {
  if (!token) {
    profileStatus.textContent = "Please log in to view your profile.";
    profileRecipes.innerHTML = "";
    return;
  }

  try {
    profileStatus.textContent = "Loading your recipe posts...";
    const response = await axios.get(recipesApi);
    const recipes = response?.data?.data || [];
    const payload = getTokenPayload();
    const userId = payload?.id || payload?.userId;
    const myRecipes = recipes.filter(
      (recipe) => String(recipe.userId) === String(userId),
    );

    window.__myRecipes = myRecipes;

    if (!myRecipes.length) {
      profileStatus.textContent = "You have not posted any recipes yet.";
      profileRecipes.innerHTML =
        '<div class="empty-state">No recipes found.</div>';
      return;
    }

    profileStatus.textContent = `You have ${myRecipes.length} recipe post(s).`;
    profileRecipes.innerHTML = myRecipes.map(renderRecipeCard).join("");
  } catch (error) {
    console.error("Failed to load my recipes:", error);
    profileStatus.textContent = "Unable to load your recipe posts right now.";
    profileRecipes.innerHTML =
      '<div class="empty-state">No recipes found.</div>';
  }
}

async function deleteRecipe(recipeId) {
  const confirmed = window.confirm(
    "Are you sure you want to delete this recipe?",
  );
  if (!confirmed) return;

  try {
    await axios.delete(`${recipesApi}/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    profileStatus.textContent = "Recipe deleted successfully.";
    await loadMyRecipes();
  } catch (error) {
    console.error("Delete recipe failed:", error);
    alert(error.response?.data?.message || "Unable to delete recipe.");
  }
}

function openEditModal(recipe) {
  document.getElementById("editRecipeId").value = recipe.id;
  document.getElementById("editRecipeName").value = recipe.recipeName || "";
  document.getElementById("editCuisine").value = recipe.cuisine || "";
  document.getElementById("editCookingTime").value = recipe.cookingTime || "";
  document.getElementById("editServes").value = recipe.serves || "";
  document.getElementById("editDescription").value = recipe.description || "";
  document.getElementById("editIngredients").value = recipe.ingredients || "";
  document.getElementById("editMethod").value = recipe.method || "";
  editModal.classList.remove("hidden");
  editModal.setAttribute("aria-hidden", "false");
}

function closeEditModal() {
  editModal.classList.add("hidden");
  editModal.setAttribute("aria-hidden", "true");
  editRecipeForm.reset();
}

async function saveRecipeChanges(event) {
  event.preventDefault();

  const recipeId = document.getElementById("editRecipeId").value;
  const formData = new FormData();
  const fields = [
    "recipeName",
    "description",
    "ingredients",
    "method",
    "cuisine",
    "cookingTime",
    "serves",
  ];

  fields.forEach((field) => {
    const value = document.getElementById(
      `edit${field.charAt(0).toUpperCase()}${field.slice(1)}`,
    )?.value;
    if (value !== undefined && value !== null) {
      formData.append(field, value);
    }
  });

  const fileInput = document.getElementById("editImage");
  if (fileInput && fileInput.files && fileInput.files[0]) {
    formData.append("image", fileInput.files[0]);
  }

  try {
    await axios.put(`${recipesApi}/${recipeId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    closeEditModal();
    profileStatus.textContent = "Recipe updated successfully.";
    await loadMyRecipes();
  } catch (error) {
    console.error("Update failed:", error);
    alert(error.response?.data?.message || "Unable to update recipe.");
  }
}

function handleProfileActions(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const recipeId = button.dataset.id;

  if (!recipeId) return;

  if (action === "delete") {
    deleteRecipe(recipeId);
    return;
  }

  if (action === "edit") {
    const recipe = (window.__myRecipes || []).find(
      (item) => String(item.id) === String(recipeId),
    );
    if (recipe) {
      openEditModal(recipe);
    }
  }
}

async function initializeProfile() {
  if (!token) {
    window.location.href = "../page/login_register/login.html";
    return;
  }

  await loadCurrentUser();
  await loadMyRecipes();
}

window.__myRecipes = [];

document.getElementById("logoutProfileBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userName");
  window.location.href = "../page/login_register/login.html";
});

document
  .getElementById("refreshRecipesBtn")
  .addEventListener("click", loadMyRecipes);
profileRecipes.addEventListener("click", handleProfileActions);
editRecipeForm.addEventListener("submit", saveRecipeChanges);
document
  .getElementById("closeModalBtn")
  .addEventListener("click", closeEditModal);
document
  .getElementById("cancelEditBtn")
  .addEventListener("click", closeEditModal);
editModal.addEventListener("click", (event) => {
  if (event.target === editModal) {
    closeEditModal();
  }
});

initializeProfile();
