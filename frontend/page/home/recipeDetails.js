const recipeApi = "http://localhost:4500/recipe";
const favoritesApi = "http://localhost:4500/favorite";
const replyApi = "http://localhost:4500/reply";
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
const imageUrl = params.get("image");
const detail = document.getElementById("recipe-detail");
const commentForm = document.getElementById("comment-form");
const commentInput = document.getElementById("comment-input");
const commentStatus = document.getElementById("comment-status");
const commentsList = document.getElementById("recipe-comments-list");
let isFavorite = false;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>\"']/g, (character) => {
    const htmlMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return htmlMap[character];
  });
}

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

async function renderComments() {
  if (!recipeId) {
    commentsList.innerHTML =
      '<p class="no-comments">Recipe details unavailable.</p>';
    return;
  }

  try {
    const response = await axios.get(
      `${replyApi}/${encodeURIComponent(recipeId)}`,
    );
    const comments = response?.data?.data || [];

    if (!comments.length) {
      commentsList.innerHTML =
        '<p class="no-comments">No comments yet. Be the first to share your thoughts.</p>';
      return;
    }

    commentsList.innerHTML = comments
      .map(
        (comment) => {
          const userName =
            comment?.user?.name || comment?.user?.email || "Unknown user";

          return `
            <article class="recipe-comment-item">
              <div class="recipe-comment-header">
                <strong>${escapeHtml(userName)}</strong>
                <span>${new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p>${escapeHtml(comment.reply || "")}</p>
            </article>
          `;
        },
      )
      .join("");
  } catch (error) {
    commentsList.innerHTML =
      '<p class="no-comments">Unable to load comments right now.</p>';
    console.error("Unable to fetch recipe comments:", error);
  }
}

async function submitComment(event) {
  event.preventDefault();

  if (!recipeId) {
    commentStatus.textContent = "Recipe ID is missing.";
    return;
  }

  const auth = getAuthHeader();
  if (!auth) {
    commentStatus.textContent = "Please log in to comment.";
    window.location.href = "../login_register/login.html";
    return;
  }

  const commentValue = commentInput.value.trim();
  if (!commentValue) {
    commentStatus.textContent = "Please enter a comment before posting.";
    return;
  }

  const submitButton = commentForm.querySelector("button[type='submit']");
  submitButton.disabled = true;
  commentStatus.textContent = "Posting comment...";

  try {
    await axios.post(
      `${replyApi}/${encodeURIComponent(recipeId)}`,
      { reply: commentValue },
      auth,
    );

    commentInput.value = "";
    commentStatus.textContent = "Comment posted successfully.";
    await renderComments();
  } catch (error) {
    commentStatus.textContent =
      error.response?.data?.message || "Unable to post comment.";
  } finally {
    submitButton.disabled = false;
  }
}

if (commentForm) {
  commentForm.addEventListener("submit", submitComment);
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
      renderComments();
    })
    .catch((error) => {
      detail.textContent =
        error.response?.data?.message || "Unable to load recipe details.";
    });
}
