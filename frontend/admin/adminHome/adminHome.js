const recipeTable = document.getElementById("recipeTable");
const logoutLink = document.getElementById("logoutLink");

logoutLink.addEventListener("click", () => {
  localStorage.removeItem("token");
});

axios
  .get("http://localhost:4500/recipe")
  .then((response) => {
    const recipes = response.data.data || [];

    document.getElementById("totalRecipes").textContent = recipes.length;

    document.getElementById("recentRecipes").textContent =
      recipes.slice(-5).length;

    const recentRecipes = recipes.slice(-5).reverse();

    recipeTable.innerHTML = "";

    if (recentRecipes.length === 0) {
      recipeTable.innerHTML = `
        <tr>
          <td colspan="3">No recipes found.</td>
        </tr>
      `;
      return;
    }

    recentRecipes.forEach((recipe) => {
      recipeTable.innerHTML += `
        <tr>
          <td>${recipe.recipeName || "Untitled"}</td>
          <td>${recipe.mainIngredient || "-"}</td>
          <td>${recipe.description || recipe.method || "-"}</td>
        </tr>
      `;
    });
  })
  .catch((error) => {
    console.error("Failed to load recipes:", error);

    recipeTable.innerHTML = `
      <tr>
        <td colspan="3">Unable to load recipes.</td>
      </tr>
    `;
  });

axios
  .get("http://localhost:4500/user", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  })
  .then((response) => {
    const users = response.data.data || [];
    document.getElementById("totalUsers").textContent = users.length;
  })
  .catch((error) => {
    console.error("Failed to load users:", error);
    document.getElementById("totalUsers").textContent = "--";
  });
