const api = "http://localhost:4500/user/login";
const handleLoggin = async (event) => {
  try {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const response = await axios.post(api, {
      email,
      password,
    });
    console.log(response.data);
    event.target.reset();
  } catch (error) {
    console.log(error);
  }
};
