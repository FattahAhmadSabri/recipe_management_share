const statusEl = document.getElementById("favorite-status");
const listEl = document.getElementById("favorite-list");
const collectionsEl = document.getElementById("collection-list");
const collectionNameEl = document.getElementById("selected-collection-name");
const createCollectionForm = document.getElementById("create-collection-form");
const collectionsApi = "http://localhost:4500/collections";
let collections = [];
let activeCollectionId = "";

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

function renderCollectionTabs() {
  collectionsEl.innerHTML = collections
    .map(
      (collection) => `
        <button
          class="collection-tab ${String(collection.id) === String(activeCollectionId) ? "active" : ""}"
          type="button"
          role="tab"
          aria-selected="${String(collection.id) === String(activeCollectionId)}"
          data-collection-id="${escapeHtml(collection.id)}"
        >${escapeHtml(collection.name)}</button>
      `,
    )
    .join("");

  collectionsEl.querySelectorAll(".collection-tab").forEach((button) => {
    button.addEventListener("click", () => {
      activeCollectionId = button.dataset.collectionId;
      renderCollections();
    });
  });
}

function renderCollections() {
  renderCollectionTabs();
  const activeCollection = collections.find(
    (collection) => String(collection.id) === String(activeCollectionId),
  );

  if (!activeCollection) {
    collectionNameEl.textContent = "";
    listEl.innerHTML =
      '<div class="favorite-empty">Create a collection to get started.</div>';
    statusEl.textContent = "No collections yet.";
    return;
  }

  collectionNameEl.textContent = activeCollection.name;
  const favorites = activeCollection.favorites || [];
  statusEl.textContent = `${favorites.length} recipe${favorites.length === 1 ? "" : "s"}`;

  if (!favorites.length) {
    listEl.innerHTML =
      '<div class="favorite-empty">This collection is empty.</div>';
    return;
  }

  listEl.innerHTML = favorites
    .map((item) => {
      const recipe = item.recipe || {};
      const recipeId = recipe.id || item.recipeId || "";
      const recipeName = recipe.recipeName || "Untitled recipe";
      const description =
        recipe.description || recipe.method || "No description available.";
      const image = normalizeRecipeImage(recipe.image);

      if (!recipeId) return "";

      return `
        <div class="favorite-item">
          <a class="favorite-card" href="../home/recipeDetails.html?id=${encodeURIComponent(recipeId)}&image=${encodeURIComponent(image)}">
            <img class="favorite-image" src="${escapeHtml(image)}" alt="${escapeHtml(recipeName)}" />
            <h2 class="favorite-title">${escapeHtml(recipeName)}</h2>
            <p class="favorite-description">${escapeHtml(description)}</p>
          </a>
          <button
            type="button"
            class="remove-favorite-btn"
            data-recipe-id="${escapeHtml(recipeId)}"
          >Remove from collection</button>
        </div>
      `;
    })
    .filter(Boolean)
    .join("");

  listEl.querySelectorAll(".remove-favorite-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      removeFavorite(button.dataset.recipeId, button);
    });
  });
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
      `${collectionsApi}/${encodeURIComponent(activeCollectionId)}/recipes/${encodeURIComponent(recipeId)}`,
      auth,
    );
    await loadCollections();
  } catch (error) {
    console.error("Favorite removal failed:", error);
    statusEl.textContent =
      error.response?.data?.message ||
      "Unable to remove recipe from favorites.";
  }
}

async function loadCollections() {
  const auth = getAuthHeader();

  if (!auth) {
    statusEl.textContent = "Please log in to view your favorite collection.";
    listEl.innerHTML =
      '<div class="favorite-empty">No favorite recipes yet.</div>';
    return;
  }

  try {
    statusEl.textContent = "Loading collections...";
    const response = await axios.get(`${collectionsApi}/me`, auth);
    collections = response?.data?.data || [];
    if (
      !collections.some(
        (collection) => String(collection.id) === String(activeCollectionId),
      )
    ) {
      activeCollectionId = collections[0]?.id || "";
    }
    renderCollections();
  } catch (error) {
    console.error("Collections load failed:", error);
    statusEl.textContent =
      error.response?.data?.message || "Unable to load your collections.";
    listEl.innerHTML =
      '<div class="favorite-empty">Unable to load collections.</div>';
  }
}

createCollectionForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const auth = getAuthHeader();
  if (!auth) {
    statusEl.textContent = "Please log in to create a collection.";
    return;
  }

  const nameInput = document.getElementById("new-collection-name");
  const submitButton = createCollectionForm.querySelector(
    "button[type='submit']",
  );
  submitButton.disabled = true;
  try {
    await axios.post(collectionsApi, { name: nameInput.value.trim() }, auth);
    nameInput.value = "";
    await loadCollections();
  } catch (error) {
    statusEl.textContent =
      error.response?.data?.message || "Unable to create collection.";
  } finally {
    submitButton.disabled = false;
  }
});

loadCollections();
