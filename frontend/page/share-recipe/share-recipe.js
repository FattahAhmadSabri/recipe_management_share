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

    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", handleLogin);

    return;
  }

  // Token exists
  loginContainer.style.display = "none";
  recipeContainer.style.display = "block";
  recipeContainer
    .querySelector(".recipe-form")
    .addEventListener("submit", handleRecipeForm);
}

checkLogin();

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  try {
    const response = await axios.post("http://localhost:4500/user/login", {
      email,
      password,
    });
    const token = response.data.token;

    if (!token) {
      throw new Error("Token not found");
    }

    localStorage.setItem("token", token);
    document.getElementById("login-container").style.display = "none";
    document.getElementById("recipe-container").style.display = "block";
  } catch (error) {
    message.innerText = error.response?.data?.message || "Login failed";
  }
}

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
