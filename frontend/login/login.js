/**
 * Login Handler
 */
const handleLoggin = async (event) => {
  try {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USER_LOGIN}`,
      {
        email,
        password,
      },
    );

    console.log("✓ Login successful:", response.data);
    // Store token or redirect to main page
    // localStorage.setItem('token', response.data.token);
    // window.location.href = '../index.html';
    alert("Login successful!");
    event.target.reset();
  } catch (error) {
    console.error("✗ Login failed:", error.response?.data || error.message);
    alert("Login failed. Please check your credentials.");
  }
};
