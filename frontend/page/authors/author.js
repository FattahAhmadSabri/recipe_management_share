const API_URL = "http://localhost:4500/user";
const FOLLOW_API = "http://localhost:4500/follow";

const allAuthorsList = document.getElementById("allAuthorsList");
const followedAuthorsList = document.getElementById("followedAuthorsList");
const authorSearch = document.getElementById("authorSearch");
const loading = document.getElementById("loading");
const error = document.getElementById("error");
let followedIds = new Set();

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

const normalizeUsers = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (payload && Array.isArray(payload.data)) {
    return payload.data;
  }

  return [];
};

const getCurrentUserId = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || payload.userId || null;
  } catch (err) {
    return null;
  }
};

const getFollowingUsers = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    followedIds = new Set();
    return;
  }

  try {
    const response = await axios.get(
      "http://localhost:4500/following/me",
      authConfig(),
    );
    const follows = response?.data?.data || [];

    followedIds = new Set(
      follows
        .map((item) => item.followingId || item.followingUser?.id)
        .filter(Boolean),
    );
  } catch (err) {
    console.error("Unable to load following list:", err);
    followedIds = new Set();
  }
};

const getUserName = (user) => user.name || user.username || "Unknown author";

const getUserEmail = (user) => user.email || "No email provided";

const getAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`;

const getUsers = async () => {
  try {
    loading.style.display = "block";
    error.style.display = "none";
    allAuthorsList.innerHTML = "";
    followedAuthorsList.innerHTML = "";

    await getFollowingUsers();

    const response = await axios.get(API_URL, authConfig());
    const users = normalizeUsers(response.data);

    renderAuthors(users);
  } catch (err) {
    console.error("Error getting authors:", err);

    loading.style.display = "none";
    error.style.display = "block";

    if (err.response?.status === 401) {
      error.textContent = "Please log in to view authors.";
      return;
    }

    error.textContent = "Unable to load authors right now.";
  }
};

const toggleFollow = async (targetUserId, button) => {
  const token = localStorage.getItem("token");

  if (!token) {
    error.style.display = "block";
    error.textContent = "Please log in to follow authors.";
    return;
  }

  const isFollowing = followedIds.has(targetUserId);

  try {
    button.disabled = true;
    button.textContent = isFollowing ? "Updating..." : "Following...";

    if (isFollowing) {
      await axios.delete(`${FOLLOW_API}/${targetUserId}`, authConfig());
      followedIds.delete(targetUserId);
    } else {
      await axios.post(`${FOLLOW_API}/${targetUserId}`, {}, authConfig());
      followedIds.add(targetUserId);
    }

    const users = normalizeUsers((await axios.get(API_URL, authConfig())).data);
    renderAuthors(users);
  } catch (err) {
    console.error("Follow toggle failed:", err);
    error.style.display = "block";
    error.textContent =
      err.response?.data?.message || "Unable to update follow status.";
  }
};

const renderAuthors = async (users) => {
  loading.style.display = "none";

  if (!users || users.length === 0) {
    allAuthorsList.innerHTML =
      '<div class="no-authors">No authors found.</div>';
    followedAuthorsList.innerHTML =
      '<div class="no-authors">No followed authors yet.</div>';
    return;
  }

  const currentUserId = getCurrentUserId();
  const searchTerm = (authorSearch?.value || "").trim().toLowerCase();

  const filteredUsers = !searchTerm
    ? users
    : users.filter((user) => {
        const name = getUserName(user).toLowerCase();
        const email = getUserEmail(user).toLowerCase();
        return name.includes(searchTerm) || email.includes(searchTerm);
      });

  const allVisibleUsers = filteredUsers.filter((user) => {
    const userId = user.id || user._id || user.email || "";
    return String(userId) !== String(currentUserId || "");
  });

  const followedUsers = allVisibleUsers.filter((user) => {
    const userId = user.id || user._id || user.email || "";
    return followedIds.has(userId);
  });

  const buildCard = (user) => {
    const userId = user.id || user._id || user.email || "";
    const userName = getUserName(user);
    const userEmail = getUserEmail(user);
    const recipeCount = user.recipeCount || 0;
    const isCurrentUser = currentUserId && userId === currentUserId;
    const isFollowing = followedIds.has(userId);
    const tokenExists = Boolean(localStorage.getItem("token"));
    const buttonText = !tokenExists
      ? "Login to follow"
      : isCurrentUser
        ? "This is you"
        : isFollowing
          ? "Unfollow"
          : "Follow";
    const buttonDisabled = !tokenExists || isCurrentUser;

    return `
      <article class="author-card" data-user-id="${userId}" tabindex="0" aria-label="View author ${userName}">
        <div class="author-main">
          <div class="author-avatar">
            <img
              src="${getAvatarUrl(userName)}"
              alt="${userName}"
              onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random&color=fff&size=200'"
            />
          </div>
          <div class="author-info">
            <h2 class="author-name">${userName}</h2>
            <p class="author-email">${userEmail}</p>
            <p class="author-recipes">Posted Recipes (${recipeCount})</p>
          </div>
        </div>

        <button
          type="button"
          class="follow-btn ${isFollowing ? "following" : ""}"
          data-user-id="${userId}"
          ${buttonDisabled ? "disabled" : ""}
        >
          ${buttonText}
        </button>
      </article>
    `;
  };

  allAuthorsList.innerHTML = allVisibleUsers.length
    ? allVisibleUsers.map(buildCard).join("")
    : '<div class="no-authors">No author matches your search.</div>';

  if (followedUsers.length) {
    const followedMarkup = await Promise.all(
      followedUsers.map(async (user) => {
        const userId = user.id || user._id || user.email || "";
        const recipeList = await fetchAuthorRecipes(userId);

        return `
          <article class="author-card" data-user-id="${userId}" tabindex="0" aria-label="View author ${getUserName(user)}">
            <div class="author-main">
              <div class="author-avatar">
                <img
                  src="${getAvatarUrl(getUserName(user))}"
                  alt="${getUserName(user)}"
                  onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(getUserName(user))}&background=random&color=fff&size=200'"
                />
              </div>
              <div class="author-info">
                <h2 class="author-name">${getUserName(user)}</h2>
                <p class="author-email">${getUserEmail(user)}</p>
                <p class="author-recipes">Posted Recipes (${user.recipeCount || 0})</p>
              </div>
            </div>

            <button
              type="button"
              class="follow-btn following"
              data-user-id="${userId}"
            >
              Unfollow
            </button>

            <div class="author-recipe-preview">
              <h3>Recipes</h3>
              <ul class="author-recipe-list">
                ${
                  recipeList.length
                    ? recipeList
                        .slice(0, 3)
                        .map(
                          (recipe) => `
                          <li>
                            <a href="../home/recipeDetails.html?id=${encodeURIComponent(recipe.id)}&image=${encodeURIComponent(recipe.image || "")}">
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
      }),
    );

    followedAuthorsList.innerHTML = followedMarkup.join("");
  } else {
    followedAuthorsList.innerHTML = searchTerm
      ? '<div class="no-authors">No followed author matches your search.</div>'
      : '<div class="no-authors">You are not following any author yet.</div>';
  }
};

async function fetchAuthorRecipes(userId) {
  try {
    const response = await axios.get("http://localhost:4500/recipe");
    const recipes = response?.data?.data || [];
    return recipes.filter((recipe) => String(recipe.userId) === String(userId));
  } catch (error) {
    return [];
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>\"']/g, (char) => {
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

allAuthorsList.addEventListener("click", async (event) => {
  const followButton = event.target.closest(".follow-btn");

  if (followButton) {
    event.stopPropagation();
    const targetUserId = followButton.dataset.userId;

    if (targetUserId) {
      await toggleFollow(targetUserId, followButton);
    }
    return;
  }

  const card = event.target.closest(".author-card");

  if (!card) {
    return;
  }

  const userId = card.dataset.userId;

  if (userId) {
    console.log("Selected author id:", userId);
  }
});

followedAuthorsList.addEventListener("click", async (event) => {
  const followButton = event.target.closest(".follow-btn");

  if (followButton) {
    event.stopPropagation();
    const targetUserId = followButton.dataset.userId;

    if (targetUserId) {
      await toggleFollow(targetUserId, followButton);
    }
    return;
  }

  const card = event.target.closest(".author-card");

  if (!card) {
    return;
  }

  const userId = card.dataset.userId;

  if (userId) {
    console.log("Selected followed author id:", userId);
  }
});

allAuthorsList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const followButton = event.target.closest(".follow-btn");

  if (followButton) {
    event.preventDefault();
    followButton.click();
    return;
  }

  const card = event.target.closest(".author-card");

  if (!card) {
    return;
  }

  event.preventDefault();
  card.click();
});

followedAuthorsList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const followButton = event.target.closest(".follow-btn");

  if (followButton) {
    event.preventDefault();
    followButton.click();
    return;
  }

  const card = event.target.closest(".author-card");

  if (!card) {
    return;
  }

  event.preventDefault();
  card.click();
});

if (authorSearch) {
  authorSearch.addEventListener("input", async () => {
    try {
      const response = await axios.get(API_URL, authConfig());
      const users = normalizeUsers(response.data);
      await getFollowingUsers();
      renderAuthors(users);
    } catch (err) {
      console.error("Search failed:", err);
    }
  });
}

getUsers();
