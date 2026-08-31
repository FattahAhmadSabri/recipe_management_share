const loginApi = "http://localhost:4500/user/login";
console.log("LOGIN JS LOADED");
// Use a regular function so it is available globally
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  try {
    const response = await axios.post(loginApi, { email, password });

    // ✅ Token is at response.data.token (from your backend response)
    const token = response.data.token;
    console.log(token);
    if (!token) throw new Error("Token not found");

    localStorage.setItem("token", token);

    window.location.href = "../share-recipe/share-recipe.html";
  } catch (error) {
    if (error.response) {
      message.innerText = error.response.data?.message || "Login failed";
    } else {
      message.innerText = "Server unreachable. Please try again.";
    }
  }
}
