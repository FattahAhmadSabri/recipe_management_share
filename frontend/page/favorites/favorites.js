const statusEl = document.getElementById("favorite-status");
const listEl = document.getElementById("favorite-list");

function getAuthHeader() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

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

function extractFavoriteRecipes(payload) {
  const source = payload?.data ?? payload ?? [];

  if (Array.isArray(source)) {
    return source;
  }

  if (Array.isArray(source?.favorites)) {
    return source.favorites;
  }

  if (Array.isArray(source?.favoriteRecipes)) {
    return source.favoriteRecipes;
  }

  if (Array.isArray(source?.items)) {
    return source.items;
  }

  return [];
}

async function removeFavorite(recipeId, button) {
  const auth = getAuthHeader();

  if (!auth) {
    statusEl.textContent = "Please log in to manage your favorite collection.";
    return;
  }

  try {
    if (button) {
      button.disabled = true;
      button.textContent = "Removing...";
    }

    await axios.delete(
      `http://localhost:4500/favorite/${encodeURIComponent(recipeId)}`,
      auth,
    );

    await loadFavoriteRecipes();
  } catch (error) {
    console.error("Favorite removal failed:", error);
    statusEl.textContent =
      error.response?.data?.message ||
      "Unable to remove recipe from favorites.";
  }
}

async function loadFavoriteRecipes() {
  const auth = getAuthHeader();

  if (!auth) {
    statusEl.textContent = "Please log in to view your favorite collection.";
    listEl.innerHTML =
      '<div class="favorite-empty">No favorite recipes yet.</div>';
    return;
  }

  try {
    statusEl.textContent = "Loading your favorite recipes...";
    const response = await axios.get(
      "http://localhost:4500/favorites/me",
      auth,
    );
    const favorites = extractFavoriteRecipes(response?.data);

    if (!favorites.length) {
      statusEl.textContent = "Your favorite collection is empty.";
      listEl.innerHTML =
        '<div class="favorite-empty">No favorite recipes yet.</div>';
      return;
    }

    statusEl.textContent = `You have ${favorites.length} favorite recipe(s).`;

    listEl.innerHTML = favorites
      .map((item) => {
        const recipe =
          item.recipe ||
          item.Recipe ||
          item.dataValues?.recipe ||
          item.dataValues?.Recipe ||
          {};
        const recipeId =
          recipe.id || item.recipeId || item.dataValues?.recipeId || "";
        const recipeName =
          recipe.recipeName || recipe.name || "Untitled recipe";
        const description =
          recipe.description || recipe.method || "No description available.";
        const image =
          recipe.image ||
          "https://placehold.co/600x400/f5f5f5/8b0000?text=Recipe";

        if (!recipeId) {
          return "";
        }

        return `
          <div class="favorite-item">
            <a class="favorite-card" href="../home/recipeDetails.html?id=${encodeURIComponent(recipeId)}&image=${encodeURIComponent(image)}">
              <img class="favorite-image" src="${image}" alt="${escapeHtml(recipeName)}" />
              <h2 class="favorite-title">${escapeHtml(recipeName)}</h2>
              <p class="favorite-description">${escapeHtml(description)}</p>
            </a>
            <button
              type="button"
              class="remove-favorite-btn"
              data-recipe-id="${recipeId}"
            >
              Remove Favorite
            </button>
          </div>
        `;
      })
      .filter(Boolean)
      .join("");

    if (!listEl.innerHTML.trim()) {
      statusEl.textContent = "Your favorite collection is empty.";
      listEl.innerHTML =
        '<div class="favorite-empty">No favorite recipes yet.</div>';
    }

    listEl.querySelectorAll(".remove-favorite-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const recipeId = button.dataset.recipeId;
        removeFavorite(recipeId, button);
      });
    });
  } catch (error) {
    console.error("Favorite collection load failed:", error);
    statusEl.textContent =
      error.response?.data?.message ||
      "Unable to load your favorite collection.";
    listEl.innerHTML =
      '<div class="favorite-empty">No favorite recipes yet.</div>';
  }
}

loadFavoriteRecipes();
