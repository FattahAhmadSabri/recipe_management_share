const recentApi = "http://localhost:4500/recent-view";

const getRecentView = async () => {
  try {
    const response = await axios.get(recentApi);

    console.log(response.data);

    displayData(response.data.data);
  } catch (error) {
    console.error("Error fetching recent views:", error);
  }
};

const displayData = (data) => {
  const container = document.querySelector("#recent-view-list");

  container.innerHTML = "";

  data.forEach((item) => {
    const recipe = item.recipe;

    const div = document.createElement("div");

    div.classList.add("recent-recipe");

    div.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.recipeName}">
      <h3>${recipe.recipeName}</h3>
    `;

    container.appendChild(div);
  });
};

getRecentView();

window.onload = getRecentView;
