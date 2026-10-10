const loginApi = "http://localhost:4500/user/login";

console.log("LOGIN JS LOADED");

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", handleLogin);

async function handleLogin(event) {
  event.preventDefault();

  console.log("LOGIN FUNCTION CALLED");

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("message");

  try {
    console.log("Calling login API...");

    const response = await axios.post(loginApi, {
      email,
      password,
    });

    console.log("Login response:", response.data);

    const token = response.data.token;
    const user = response.data.data;

    if (!token) {
      throw new Error("Token not found");
    }

    localStorage.setItem("token", token);

    if (user?.name) {
      localStorage.setItem("userName", user.name);
    } else if (user?.email) {
      localStorage.setItem("userName", user.email.split("@")[0]);
    }

    window.location.href = "../../index.html";
  } catch (error) {
    console.error("Login error:", error);

    if (error.response) {
      message.innerText = error.response.data?.message || "Login failed";
    } else {
      message.innerText = "Server unreachable. Please try again.";
    }
  }
}
