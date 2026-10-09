const commentsApi = "http://localhost:4500/reply";
const commentsTable = document.getElementById("commentsTable");
const commentMessage = document.getElementById("commentMessage");
const logoutLink = document.getElementById("logoutLink");
let comments = [];

logoutLink.addEventListener("click", () => {
  localStorage.removeItem("token");
});

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function renderComments() {
  if (comments.length === 0) {
    commentsTable.innerHTML =
      '<tr><td colspan="5">No comments found.</td></tr>';
    return;
  }

  commentsTable.innerHTML = comments
    .map(
      (comment) => `
        <tr>
          <td>${escapeHTML(comment.recipe?.recipeName || comment.recipeId || "-")}</td>
          <td>${escapeHTML(comment.user?.name || comment.user?.email || comment.userId || "-")}</td>
          <td>${escapeHTML(comment.reply)}</td>
          <td>${escapeHTML(comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "-")}</td>
          <td><button class="danger-btn" type="button" data-comment-id="${escapeHTML(comment.id)}">Delete</button></td>
        </tr>
      `,
    )
    .join("");
}

async function fetchComments() {
  commentsTable.innerHTML = '<tr><td colspan="5">Loading comments...</td></tr>';
  commentMessage.textContent = "";

  try {
    const response = await axios.get(commentsApi);
    comments = response.data.data || [];
    renderComments();
  } catch (error) {
    commentsTable.innerHTML =
      '<tr><td colspan="5">Unable to load comments.</td></tr>';
    commentMessage.textContent =
      error.response?.data?.message || "Unable to load comments.";
  }
}

commentsTable.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-comment-id]");
  if (!button) {
    return;
  }

  const commentId = button.dataset.commentId;
  const comment = comments.find((item) => String(item.id) === commentId);
  if (!comment || !window.confirm("Delete this comment?")) {
    return;
  }

  button.disabled = true;
  commentMessage.textContent = "";

  try {
    await axios.delete(`${commentsApi}/${encodeURIComponent(commentId)}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
    comments = comments.filter((item) => String(item.id) !== commentId);
    renderComments();
    commentMessage.textContent = "Comment deleted.";
  } catch (error) {
    button.disabled = false;
    commentMessage.textContent =
      error.response?.data?.message || "Unable to delete comment.";
  }
});

fetchComments();
