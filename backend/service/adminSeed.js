// const sequelize = require("../utils/dbConfig");
// require("dotenv").config();
// const MainIngredient = require("../model/mainIngredientSchema");
// const RecipeType = require("../model/recipeTypeSchema");

// const seedRecipeDataService = async () => {
//   const transaction = await sequelize.transaction();

//   try {
//     const ingredients = [
//       { name: "Chicken" },
//       { name: "Beef" },
//       { name: "Fish" },
//       { name: "Rice" },
//       { name: "Vegetables" },
//       { name: "Egg" },
//       { name: "Paneer" },
//       { name: "Potato" },
//     ];

//     const recipeTypes = [
//       { name: "Breakfast" },
//       { name: "Lunch" },
//       { name: "Dinner" },
//       { name: "Dessert" },
//       { name: "Beverages" },
//       { name: "Snacks" },
//       { name: "Salad" },
//       { name: "Soup" },
//     ];

//     await MainIngredient.bulkCreate(ingredients, {
//       transaction,
//     });

//     await RecipeType.bulkCreate(recipeTypes, {
//       transaction,
//     });

//     await transaction.commit();

//     console.log("Recipe data seeded successfully");
//   } catch (error) {
//     await transaction.rollback();
//     console.error("Seeding failed:", error);
//     throw error;
//   }
// };


// // Run the service immediately
// (async () => {
//   try {
//     await seedRecipeDataService();
//     process.exit(0);
//   } catch (error) {
//     process.exit(1);
//   }
// })();