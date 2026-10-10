const API_URL = "http://localhost:4500/user";
const FOLLOW_API = "http://localhost:4500/follow";
const FOLLOWING_API = "http://localhost:4500/following/me";
const RECIPE_API = "http://localhost:4500/recipe";
const AUTHOR_CACHE_KEY = "authors-cache";

const allAuthorsList = document.getElementById("allAuthorsList");
const followedAuthorsList = document.getElementById("followedAuthorsList");
const authorSearch = document.getElementById("authorSearch");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

let allUsers = [];
let followedUsers = [];

const safeSetHtml = (el, html) => {
  if (!el) return;
  el.innerHTML = html;
};

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

const normalizeUsers = (payload) => {
  if (Array.isArray(payload)) return payload;

  if (Array.isArray(payload?.data)) return payload.data;

  return [];
};

const getUserId = (user) =>
  user?.id || user?.userId || user?._id || user?.followingId || null;

const getUserName = (user) => user?.name || user?.username || "Unknown author";

const getUserEmail = (user) => user?.email || "No email provided";

const getAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name,
  )}&background=random&color=fff&size=200`;

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return map[char];
  });
}

// Load all users from GET /user
async function getAllUsers() {
  try {
    const response = await axios.get(API_URL, authConfig());
    const users = normalizeUsers(response.data);

    if (Array.isArray(users) && users.length) {
      localStorage.setItem(AUTHOR_CACHE_KEY, JSON.stringify(users));
    }

    return users;
  } catch (err) {
    console.error("Unable to load all users:", err);

    try {
      const cached = JSON.parse(localStorage.getItem(AUTHOR_CACHE_KEY) || "[]");
      return Array.isArray(cached) ? cached : [];
    } catch {
      return [];
    }
  }
}

// Load the users followed by the logged-in user
async function getFollowingUsers() {
  try {
    const response = await axios.get(FOLLOWING_API, authConfig());
    const follows = normalizeUsers(response.data);

    return follows
      .map((item) => item?.followingUser || item?.user || item)
      .filter((user) => getUserId(user));
  } catch (err) {
    console.error("Unable to load followed users:", err);
    return [];
  }
}

async function fetchAuthorRecipes(userId) {
  try {
    const response = await axios.get(RECIPE_API, authConfig());
    const recipes = normalizeUsers(response.data);

    return recipes.filter((recipe) => String(recipe.userId) === String(userId));
  } catch (err) {
    console.error("Unable to load author recipes:", err);
    return [];
  }
}

function getAuthorRecipes(user) {
  const recipes = user?.recipes || user?.recipeList || [];

  if (Array.isArray(recipes) && recipes.length) {
    return recipes;
  }

  return [];
}

function buildAuthorCard(user, isFollowing) {
  const userId = getUserId(user);
  const userName = escapeHtml(getUserName(user));
  const userEmail = escapeHtml(getUserEmail(user));
  const recipeCount = user.recipeCount || 0;

  return `
    <article class="author-card" data-user-id="${escapeHtml(userId)}">
      <div class="author-main">
        <div class="author-avatar">
          <img
            src="${getAvatarUrl(getUserName(user))}"
            alt="${userName}"
          />
        </div>

        <div class="author-info">
          <h2 class="author-name">${userName}</h2>
          <p class="author-email">${userEmail}</p>
          <p class="author-recipes">
            Posted Recipes (${recipeCount})
          </p>
        </div>
      </div>

      <button
        type="button"
        class="follow-btn ${isFollowing ? "following" : ""}"
        data-user-id="${escapeHtml(userId)}"
      >
        ${isFollowing ? "Unfollow" : "Follow"}
      </button>
    </article>
  `;
}

async function buildFollowedAuthorCard(user) {
  const userId = getUserId(user);
  const recipes = getAuthorRecipes(user);

  const userName = escapeHtml(getUserName(user));
  const userEmail = escapeHtml(getUserEmail(user));

  return `
    <article class="author-card" data-user-id="${escapeHtml(userId)}">
      <div class="author-main">
        <div class="author-avatar">
          <img
            src="${getAvatarUrl(getUserName(user))}"
            alt="${userName}"
          />
        </div>

        <div class="author-info">
          <h2 class="author-name">${userName}</h2>
          <p class="author-email">${userEmail}</p>
          <p class="author-recipes">
            Posted Recipes (${user.recipeCount || recipes.length})
          </p>
        </div>
      </div>

      <button
        type="button"
        class="follow-btn following"
        data-user-id="${escapeHtml(userId)}"
      >
        Unfollow
      </button>

      <div class="author-recipe-preview">
        <h3>Recipes</h3>
        <ul class="author-recipe-list">
          ${
            recipes.length
              ? recipes
                  .slice(0, 3)
                  .map(
                    (recipe) => `
                      <li>
                        <a href="../home/recipeDetails.html?id=${encodeURIComponent(
                          recipe.id,
                        )}&image=${encodeURIComponent(recipe.image || "")}">
                          ${escapeHtml(recipe.recipeName || "Recipe")}
                        </a>
                      </li>
                    `,
                  )
                  .join("")
              : "<li>No recipes yet.</li>"
          }
        </ul>
      </div>
    </article>
  `;
}

async function renderAuthors() {
  try {
    const searchTerm = (authorSearch?.value || "").trim().toLowerCase();
    const token = localStorage.getItem("token");
    const currentUserId = getCurrentUserId();

    if (!allUsers.length && !token) {
      safeSetHtml(
        allAuthorsList,
        '<div class="no-authors">Please log in to view authors.</div>',
      );
      safeSetHtml(
        followedAuthorsList,
        '<div class="no-authors">Please log in to view authors you follow.</div>',
      );
      if (error) {
        error.style.display = "block";
        error.textContent = "Please log in to follow authors.";
      }
      return;
    }

    const matchesSearch = (user) => {
      if (!user) return false;
      return (
        getUserName(user).toLowerCase().includes(searchTerm) ||
        getUserEmail(user).toLowerCase().includes(searchTerm)
      );
    };

    const visibleUsers = allUsers.filter((user) => {
      const userId = getUserId(user);

      return (
        String(userId) !== String(currentUserId || "") && matchesSearch(user)
      );
    });

    const followedIds = new Set(
      followedUsers.map((user) => String(getUserId(user))).filter(Boolean),
    );

    const authorsToFollow = visibleUsers.map((user) => ({
      ...user,
      isFollowing: followedIds.has(String(getUserId(user))),
    }));

    safeSetHtml(
      allAuthorsList,
      authorsToFollow.length
        ? authorsToFollow
            .map((user) => buildAuthorCard(user, Boolean(user.isFollowing)))
            .join("")
        : '<div class="no-authors">No authors to show.</div>',
    );

    const followedToDisplay = followedUsers.filter((user) => {
      const userId = getUserId(user);
      const userName = getUserName(user);
      const userEmail = getUserEmail(user);

      return (
        userId &&
        String(userId) !== String(currentUserId || "") &&
        (userName.toLowerCase().includes(searchTerm) ||
          userEmail.toLowerCase().includes(searchTerm))
      );
    });

    safeSetHtml(
      followedAuthorsList,
      followedToDisplay.length
        ? (
            await Promise.all(followedToDisplay.map(buildFollowedAuthorCard))
          ).join("")
        : '<div class="no-authors">You are not following any matching authors yet.</div>',
    );

    if (!token) {
      error.style.display = "block";
      error.textContent = "Please log in to follow authors.";
    } else {
      error.style.display = "none";
    }
  } catch (err) {
    console.error("Error rendering authors:", err);
    safeSetHtml(
      allAuthorsList,
      '<div class="no-authors">Unable to load authors right now.</div>',
    );
    safeSetHtml(
      followedAuthorsList,
      '<div class="no-authors">Unable to load followed authors right now.</div>',
    );
    if (error) {
      error.style.display = "block";
      error.textContent = "Unable to render authors right now.";
    }
  }
}

function getCurrentUserId() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload.userId || null;
  } catch {
    return null;
  }
}

async function loadAuthors() {
  try {
    if (loading) loading.style.display = "block";
    if (error) error.style.display = "none";

    const [users, following] = await Promise.all([
      getAllUsers(),
      localStorage.getItem("token") ? getFollowingUsers() : Promise.resolve([]),
    ]);

    allUsers = Array.isArray(users) ? users : [];
    followedUsers = Array.isArray(following) ? following : [];

    await renderAuthors();
  } catch (err) {
    console.error("Unable to load authors:", err);

    if (error) {
      error.style.display = "block";
      error.textContent =
        err?.response?.data?.message || "Unable to load authors right now.";
    }
  } finally {
    if (loading) loading.style.display = "none";
  }
}

async function toggleFollow(targetUserId, button) {
  if (!localStorage.getItem("token")) {
    error.style.display = "block";
    error.textContent = "Please log in to follow authors.";
    return;
  }

  const isFollowing = followedUsers.some(
    (user) => String(getUserId(user)) === String(targetUserId),
  );

  try {
    button.disabled = true;
    button.textContent = "Updating...";

    if (isFollowing) {
      await axios.delete(`${FOLLOW_API}/${targetUserId}`, authConfig());
    } else {
      await axios.post(`${FOLLOW_API}/${targetUserId}`, {}, authConfig());
    }

    // Refresh both lists from the backend after a successful update.
    await loadAuthors();
  } catch (err) {
    console.error("Follow update failed:", err);

    error.style.display = "block";
    error.textContent =
      err.response?.data?.message || "Unable to update follow status.";

    button.disabled = false;
    button.textContent = isFollowing ? "Unfollow" : "Follow";
  }
}

// Handle Follow and Unfollow in both sections.
document.addEventListener("click", async (event) => {
  const button = event.target.closest(".follow-btn");

  if (!button) return;

  event.stopPropagation();

  const targetUserId = button.dataset.userId;

  if (targetUserId) {
    await toggleFollow(targetUserId, button);
  }
});

if (authorSearch) {
  authorSearch.addEventListener("input", async () => {
    try {
      await renderAuthors();
    } catch (err) {
      console.error("Error filtering authors:", err);
    }
  });
}

loadAuthors();
