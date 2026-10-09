// const API_URL = "http://localhost:4500/user";

// const usersList = document.getElementById("usersList");
// const loading = document.getElementById("loading");
// const error = document.getElementById("error");

// const getUsers = async () => {
//   try {
//     loading.style.display = "block";
//     error.style.display = "none";

//     const response = await axios.get(API_URL);

//     console.log("Users API response:", response.data);

//     const users = response.data.data;

//     renderUsers(users);
//   } catch (err) {
//     console.error("Error getting users:", err);

//     loading.style.display = "none";

//     error.style.display = "block";

//     error.textContent = "Unable to load users.";
//   }
// };

// const renderUsers = (users) => {
//   loading.style.display = "none";

//   usersList.innerHTML = "";

//   if (!users || users.length === 0) {
//     usersList.innerHTML = `
//       <div class="no-users">
//         No users found.
//       </div>
//     `;

//     return;
//   }

//   users.forEach((user) => {
//     const userElement = document.createElement("div");

//     userElement.className = "user";

//     const image = user.profileImage
//       ? user.profileImage
//       : "../assets/default-user.png";

//     const userName = user.username || user.name || "Unknown User";

//     const recipeCount = user.recipeCount || 0;

//     userElement.innerHTML = `

//       <div class="user-image">

//         <img
//           src="${image}"
//           alt="${userName}"
//           onerror="this.src='../assets/default-user.png'"
//         />

//       </div>


//       <div class="user-info">

//         <h2 class="user-name">
//           ${userName}
//         </h2>

//         <p class="user-recipes">
//           Posted Recipes (${recipeCount})
//         </p>

//       </div>

//     `;

//     usersList.appendChild(userElement);
//   });
// };

// getUsers();
