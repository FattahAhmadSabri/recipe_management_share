const api = "http://localhost:4500/recipe";

const token = localStorage.getItem("token");

if (!token) {
  alert("Please login first");
  return;
}

const handleRecipeForm = async (event) => {
  event.preventDefault();

  try {
    const form = event.target;

    const formData = new FormData(form);

    const response = await axios.post(api, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Recipe added:", response.data);

    // alert("Recipe shared successfully!");

    form.reset();
  } catch (error) {
    console.error("Recipe error:", error);

    alert("Failed to share recipe");
  }
};

const form = document.querySelector(".recipe-form");

form.addEventListener("submit", handleRecipeForm);
