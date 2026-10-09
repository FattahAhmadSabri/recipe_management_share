const { MainIngredient, Recipe } = require("../model/index");

const addMainIngrdients = async (data) => {
  const ingredients = (Array.isArray(data) ? data : [data])
    .map((item) => (typeof item === "string" ? { name: item } : item))
    .filter(
      (item) => item && typeof item.name === "string" && item.name.trim(),
    );

  if (ingredients.length === 0) {
    throw new Error("Ingredient name is required");
  }

  return MainIngredient.bulkCreate(
    ingredients.map((item) => ({ name: item.name.trim() })),
  );
};

const getMainIngredients = () => {
  const response = MainIngredient.findAll();
  return response;
};

const updateMainIngredient = async (id, name) => {
  if (typeof name !== "string" || !name.trim()) {
    const error = new Error("Ingredient name is required");
    error.statusCode = 400;
    throw error;
  }

  const ingredient = await MainIngredient.findByPk(id);
  if (!ingredient) {
    const error = new Error("Ingredient not found");
    error.statusCode = 404;
    throw error;
  }

  ingredient.name = name.trim();
  await ingredient.save();
  return ingredient;
};

const deleteMainIngredient = async (id) => {
  const ingredient = await MainIngredient.findByPk(id);
  if (!ingredient) {
    const error = new Error("Ingredient not found");
    error.statusCode = 404;
    throw error;
  }

  const recipeCount = await Recipe.count({
    where: { mainIngredientId: id },
  });

  if (recipeCount > 0) {
    const error = new Error(
      "Ingredient is used by recipes and cannot be deleted",
    );
    error.statusCode = 409;
    throw error;
  }

  await ingredient.destroy();
  return { id };
};

module.exports = {
  addMainIngrdients,
  getMainIngredients,
  updateMainIngredient,
  deleteMainIngredient,
};
