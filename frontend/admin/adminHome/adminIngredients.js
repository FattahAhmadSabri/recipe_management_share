const ingredientsApi = "http://localhost:4500/main";
const ingredientForm = document.getElementById("ingredientForm");
const ingredientName = document.getElementById("ingredientName");
const ingredientMessage = document.getElementById("ingredientMessage");
const ingredientsTable = document.getElementById("ingredientsTable");
const logoutLink = document.getElementById("logoutLink");
const editIngredientDialog = document.getElementById("editIngredientDialog");
const editIngredientForm = document.getElementById("editIngredientForm");
let ingredients = [];

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

function authConfig() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
    },
  };
}

function renderIngredients() {
  if (ingredients.length === 0) {
    ingredientsTable.innerHTML =
      '<tr><td colspan="3">No ingredients found.</td></tr>';
    return;
  }

  ingredientsTable.innerHTML = ingredients
    .map(
      (ingredient) => `
        <tr>
          <td>${escapeHTML(ingredient.name)}</td>
          <td>${escapeHTML(ingredient.id)}</td>
          <td>
            <div class="recipe-actions">
              <button type="button" data-action="edit" data-ingredient-id="${escapeHTML(ingredient.id)}">Edit</button>
              <button type="button" data-action="delete" data-ingredient-id="${escapeHTML(ingredient.id)}">Delete</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");
}

async function fetchIngredients() {
  ingredientsTable.innerHTML =
    '<tr><td colspan="3">Loading ingredients...</td></tr>';

  try {
    const response = await axios.get(ingredientsApi);
    ingredients = response.data.data || [];
    renderIngredients();
  } catch (error) {
    ingredientsTable.innerHTML =
      '<tr><td colspan="3">Unable to load ingredients.</td></tr>';
    ingredientMessage.textContent =
      error.response?.data?.message || "Unable to load ingredients.";
  }
}

ingredientForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = ingredientName.value.trim();

  if (!name) {
    return;
  }

  const submitButton = ingredientForm.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  ingredientMessage.textContent = "";

  try {
    await axios.post(
      ingredientsApi,
      { name },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      },
    );

    ingredientsTable.addEventListener("click", async (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) {
        return;
      }

      const ingredient = ingredients.find(
        (item) => String(item.id) === button.dataset.ingredientId,
      );
      if (!ingredient) {
        return;
      }

      if (button.dataset.action === "edit") {
        editIngredientForm.dataset.ingredientId = ingredient.id;
        document.getElementById("editIngredientName").value = ingredient.name;
        document.getElementById("editIngredientMessage").textContent = "";
        editIngredientDialog.showModal();
        return;
      }

      if (!window.confirm(`Delete "${ingredient.name}"?`)) {
        return;
      }

      button.disabled = true;
      ingredientMessage.textContent = "";

      try {
        await axios.delete(
          `${ingredientsApi}/${encodeURIComponent(ingredient.id)}`,
          authConfig(),
        );
        ingredients = ingredients.filter((item) => item.id !== ingredient.id);
        renderIngredients();
        ingredientMessage.textContent = "Ingredient deleted.";
      } catch (error) {
        button.disabled = false;
        ingredientMessage.textContent =
          error.response?.data?.message || "Unable to delete ingredient.";
      }
    });

    editIngredientForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const submitButton = editIngredientForm.querySelector(
        'button[type="submit"]',
      );
      submitButton.disabled = true;

      try {
        await axios.put(
          `${ingredientsApi}/${encodeURIComponent(editIngredientForm.dataset.ingredientId)}`,
          { name: document.getElementById("editIngredientName").value.trim() },
          authConfig(),
        );
        editIngredientDialog.close();
        await fetchIngredients();
        ingredientMessage.textContent = "Ingredient updated.";
      } catch (error) {
        document.getElementById("editIngredientMessage").textContent =
          error.response?.data?.message || "Unable to update ingredient.";
      } finally {
        submitButton.disabled = false;
      }
    });

    document
      .getElementById("cancelIngredientEdit")
      .addEventListener("click", () => {
        editIngredientDialog.close();
      });
    ingredientForm.reset();
    await fetchIngredients();
    ingredientMessage.textContent = "Ingredient added.";
  } catch (error) {
    ingredientMessage.textContent =
      error.response?.data?.message || "Unable to add ingredient.";
  } finally {
    submitButton.disabled = false;
  }
});

fetchIngredients();
