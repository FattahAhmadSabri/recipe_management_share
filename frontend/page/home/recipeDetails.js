const recipeApi = "http://localhost:4500/recipe";
const favoritesApi = "http://localhost:4500/favorite";
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
const imageUrl = params.get("image");
const detail = document.getElementById("recipe-detail");
let isFavorite = false;

function getAuthHeader() {
  const token = localStorage.getItem("token");

  return token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : null;
}

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

async function loadFavoriteStatus() {
  const auth = getAuthHeader();

  if (!auth) {
    return;
  }

  try {
    const response = await axios.get(
      "http://localhost:4500/favorites/me",
      auth,
    );
    const favorites = response?.data?.data || [];

    isFavorite = favorites.some(
      (item) => String(item.recipeId) === String(recipeId),
    );

    const favoriteButton = document.getElementById("favorite-button");
    if (favoriteButton) {
      favoriteButton.textContent = isFavorite
        ? "Remove from Favorite Collection"
        : "Add to Favorite Collection";
      favoriteButton.classList.toggle("is-favorite", isFavorite);
    }
  } catch (error) {
    console.warn("Unable to load favorite status:", error);
  }
}

async function toggleFavorite() {
  const auth = getAuthHeader();

  if (!auth) {
    window.location.href = "../login_register/login.html";
    return;
  }

  const favoriteButton = document.getElementById("favorite-button");

  try {
    favoriteButton.disabled = true;
    favoriteButton.textContent = isFavorite ? "Updating..." : "Saving...";

    if (isFavorite) {
      await axios.delete(
        `${favoritesApi}/${encodeURIComponent(recipeId)}`,
        auth,
      );
      isFavorite = false;
    } else {
      await axios.post(
        `${favoritesApi}/${encodeURIComponent(recipeId)}`,
        {},
        auth,
      );
      isFavorite = true;
    }

    favoriteButton.textContent = isFavorite
      ? "Remove from Favorite Collection"
      : "Add to Favorite Collection";
    favoriteButton.classList.toggle("is-favorite", isFavorite);
  } catch (error) {
    console.error("Favorite toggle failed:", error);
    alert(error.response?.data?.message || "Unable to update favorites.");
  } finally {
    if (favoriteButton) {
      favoriteButton.disabled = false;
    }
  }
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

      const favoriteButton = document.createElement("button");
      favoriteButton.id = "favorite-button";
      favoriteButton.type = "button";
      favoriteButton.className = "favorite-btn";
      favoriteButton.textContent = "Add to Favorite Collection";
      favoriteButton.addEventListener("click", toggleFavorite);
      detail.append(favoriteButton);

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

      loadFavoriteStatus();
    })
    .catch((error) => {
      detail.textContent =
        error.response?.data?.message || "Unable to load recipe details.";
    });
}
