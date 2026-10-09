const API_URL = "http://localhost:4500/user";

const usersTable = document.getElementById("usersTable");
const searchInput = document.getElementById("searchInput");
const refreshBtn = document.getElementById("refreshBtn");
const message = document.getElementById("message");
const logoutLink = document.getElementById("logoutLink");
const editUserDialog = document.getElementById("editUserDialog");
const editUserForm = document.getElementById("editUserForm");
const editUserMessage = document.getElementById("editUserMessage");
let editingUserId = null;

logoutLink.addEventListener("click", () => {
  localStorage.removeItem("token");
});

let allUsers = [];

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

function getRoleClass(role) {
  const normalizedRole = String(role || "").toLowerCase();

  if (normalizedRole === "admin" || normalizedRole === "superadmin") {
    return "role-admin";
  }

  if (normalizedRole === "user") {
    return "role-user";
  }

  return "role-other";
}

function authConfig() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  };
}

function updateStats(users) {
  document.getElementById("totalUsers").textContent = users.length;

  document.getElementById("totalAdmins").textContent = users.filter((user) =>
    ["admin", "superadmin"].includes(String(user.role || "").toLowerCase()),
  ).length;

  document.getElementById("regularUsers").textContent = users.filter(
    (user) => String(user.role || "user").toLowerCase() === "user",
  ).length;
}

function renderUsers(users) {
  document.getElementById("userCount").textContent =
    `Showing ${users.length} of ${allUsers.length} users`;

  if (users.length === 0) {
    usersTable.innerHTML = `
      <tr>
        <td colspan="5" class="table-message">
          No users found.
        </td>
      </tr>
    `;
    return;
  }

  usersTable.innerHTML = users
    .map((user) => {
      const id = user._id || user.id || "";
      const name = user.name || "Unnamed";
      const email = user.email || "No email";
      const role = user.role || "user";

      return `
      <tr>
        <td>${escapeHTML(id)}</td>
        <td>${escapeHTML(name)}</td>
        <td>${escapeHTML(email)}</td>
        <td>
          <span class="role-badge ${getRoleClass(role)}">
            ${escapeHTML(role)}
          </span>
        </td>
        <td>
          <div class="user-actions">
            <button type="button" data-action="update" data-user-id="${escapeHTML(id)}">Update</button>
            <button type="button" data-action="delete" data-user-id="${escapeHTML(id)}">Delete</button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}

function filterUsers() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filteredUsers = allUsers.filter((user) => {
    const name = String(user.name || "").toLowerCase();
    const email = String(user.email || "").toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  renderUsers(filteredUsers);
}

async function fetchUsers() {
  refreshBtn.disabled = true;
  refreshBtn.textContent = "Loading...";
  message.textContent = "";

  usersTable.innerHTML = `
    <tr>
      <td colspan="4" class="table-message">
        Loading users...
      </td>
    </tr>
  `;

  try {
    const response = await axios.get(API_URL, authConfig());

    // Supports common API response formats.
    const result = response.data;
    const users = Array.isArray(result) ? result : result.data;

    if (!Array.isArray(users)) {
      throw new Error("The API did not return a users array.");
    }

    allUsers = users;

    updateStats(allUsers);
    filterUsers();
  } catch (error) {
    console.error("Unable to load users:", error);

    usersTable.innerHTML = `
      <tr>
        <td colspan="4" class="table-message">
          Unable to load users. Check your API route and backend.
        </td>
      </tr>
    `;

    message.textContent = error.response?.data?.message || error.message;

    document.getElementById("totalUsers").textContent = "--";
    document.getElementById("totalAdmins").textContent = "--";
    document.getElementById("regularUsers").textContent = "--";
    document.getElementById("userCount").textContent = "Users unavailable";
  } finally {
    refreshBtn.disabled = false;
    refreshBtn.textContent = "Refresh Users";
  }
}

function openEditDialog(user) {
  editingUserId = user.id || user._id;
  document.getElementById("editName").value = user.name || "";
  document.getElementById("editEmail").value = user.email || "";
  document.getElementById("editRole").value = user.role || "user";
  editUserMessage.textContent = "";
  editUserDialog.showModal();
}

async function deleteUser(user) {
  const userId = user.id || user._id;

  if (!window.confirm(`Delete ${user.name || user.email || "this user"}?`)) {
    return;
  }

  message.textContent = "";

  try {
    await axios.delete(
      `${API_URL}/${encodeURIComponent(userId)}`,
      authConfig(),
    );
    allUsers = allUsers.filter((item) => (item.id || item._id) !== userId);
    updateStats(allUsers);
    filterUsers();
    message.textContent = "User deleted successfully.";
  } catch (error) {
    message.textContent =
      error.response?.data?.message || "Unable to delete user.";
  }
}

usersTable.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) {
    return;
  }

  const user = allUsers.find(
    (item) => String(item.id || item._id) === button.dataset.userId,
  );

  if (!user) {
    return;
  }

  if (button.dataset.action === "update") {
    openEditDialog(user);
  } else if (button.dataset.action === "delete") {
    deleteUser(user);
  }
});

editUserForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = editUserForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  editUserMessage.textContent = "";

  try {
    const response = await axios.put(
      `${API_URL}/${encodeURIComponent(editingUserId)}`,
      {
        name: document.getElementById("editName").value.trim(),
        email: document.getElementById("editEmail").value.trim(),
        role: document.getElementById("editRole").value,
      },
      authConfig(),
    );

    editUserDialog.close();
    await fetchUsers();
    message.textContent = response.data.message || "User updated successfully.";
  } catch (error) {
    editUserMessage.textContent =
      error.response?.data?.message || "Unable to update user.";
  } finally {
    submitButton.disabled = false;
  }
});

document.getElementById("cancelEditBtn").addEventListener("click", () => {
  editUserDialog.close();
});

searchInput.addEventListener("input", filterUsers);
refreshBtn.addEventListener("click", fetchUsers);

fetchUsers();
