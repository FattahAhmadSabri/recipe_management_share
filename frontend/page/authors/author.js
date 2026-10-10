const API_URL = "http://localhost:4500/user";

const authorsList = document.getElementById("authorsList");
const loading = document.getElementById("loading");
const error = document.getElementById("error");

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

const getUserName = (user) => user.name || user.username || "Unknown author";

const getUserEmail = (user) => user.email || "No email provided";

const getAvatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200`;

const getUsers = async () => {
  try {
    loading.style.display = "block";
    error.style.display = "none";
    authorsList.innerHTML = "";

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

const renderAuthors = (users) => {
  loading.style.display = "none";
  authorsList.innerHTML = "";

  if (!users || users.length === 0) {
    authorsList.innerHTML = '<div class="no-authors">No authors found.</div>';
    return;
  }

  authorsList.innerHTML = users
    .map((user) => {
      const userId = user.id || user._id || user.email || "";
      const userName = getUserName(user);
      const userEmail = getUserEmail(user);
      const recipeCount = user.recipeCount || 0;

      return `
        <article class="author-card" data-user-id="${userId}" tabindex="0" aria-label="View author ${userName}">
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
        </article>
      `;
    })
    .join("");
};

authorsList.addEventListener("click", (event) => {
  const card = event.target.closest(".author-card");

  if (!card) {
    return;
  }

  const userId = card.dataset.userId;

  if (!userId) {
    return;
  }

  console.log("Selected author id:", userId);
});

authorsList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  const card = event.target.closest(".author-card");

  if (!card) {
    return;
  }

  event.preventDefault();
  card.click();
});

getUsers();
