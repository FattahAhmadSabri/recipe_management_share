const recipesApi = "http://localhost:4500/recipe";

async function checkLogin() {
  const token = localStorage.getItem("token");

  const loginContainer = document.getElementById("login-container");
  const recipeContainer = document.getElementById("recipe-container");

  console.log("Token:", token);

  // No token
  if (!token) {
    recipeContainer.style.display = "none";
    loginContainer.style.display = "block";

    const response = await fetch("./page/login_register/login.html");

    const html = await response.text();

    loginContainer.innerHTML = html;

    return;
  }

  // Token exists
  loginContainer.style.display = "none";
  recipeContainer.style.display = "block";
}

checkLogin();

async function handleRecipeForm(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");

  const form = event.target;

  const formData = new FormData(form);

  try {
    const response = await axios.post(recipesApi, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);

    alert("Recipe shared successfully");

    form.reset();
  } catch (error) {
    console.log(error);

    alert("Failed to share recipe");
  }
}
