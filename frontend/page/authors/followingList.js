const FOLLOWING_API = "http://localhost:4500/following/me";

const followingAuthorsList = document.getElementById("followingAuthorsList");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

const authConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

const normalizeItems = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const getUserId = (user) => user?.id || user?.userId || user?._id || null;
const getUserName = (user) => user?.name || user?.username || "Unknown author";
const getUserEmail = (user) => user?.email || "No email provided";

const getAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`;

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

const getFollowingAuthors = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return [];
  }

  try {
    const response = await axios.get(FOLLOWING_API, authConfig());
    const followList = normalizeItems(response.data);

    return followList
      .map((item) => item?.followingUser || item?.user || item)
      .filter((user) => getUserId(user));
  } catch (err) {
    console.error("Unable to load followed authors:", err);
    return [];
  }
};

const buildFollowCard = (user) => {
  const userId = getUserId(user);
  const userName = escapeHtml(getUserName(user));
  const userEmail = escapeHtml(getUserEmail(user));
  const recipes = Array.isArray(user?.recipes) ? user.recipes : [];

  return `
    <article class="author-card" data-user-id="${escapeHtml(userId)}">
      <div class="author-main">
        <div class="author-avatar">
          <img src="${getAvatarUrl(getUserName(user))}" alt="${userName}" />
        </div>

        <div class="author-info">
          <h2 class="author-name">${userName}</h2>
          <p class="author-email">${userEmail}</p>
          <p class="author-recipes">Posted Recipes (${recipes.length})</p>
        </div>
      </div>

      <div class="author-recipe-preview">
        <h3>Recipes</h3>
        <ul class="author-recipe-list">
          ${
            recipes.length
              ? recipes
                  .slice(0, 5)
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
};

const renderFollowingAuthors = async () => {
  try {
    loading.style.display = "block";
    error.style.display = "none";
    followingAuthorsList.innerHTML = "";

    const authors = await getFollowingAuthors();

    if (!authors.length) {
      followingAuthorsList.innerHTML =
        '<div class="no-authors">You are not following any author yet.</div>';
      loading.style.display = "none";
      return;
    }

    followingAuthorsList.innerHTML = authors.map(buildFollowCard).join("");
    loading.style.display = "none";
  } catch (err) {
    console.error("Error rendering following authors:", err);
    loading.style.display = "none";
    error.style.display = "block";
    error.textContent = "Unable to load followed authors.";
  }
};

renderFollowingAuthors();
