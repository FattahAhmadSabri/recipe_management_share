const { RecipeType } = require("../model");

const addRecipeTypeService = (data) => {
  return RecipeType.bulkCreate(data);
};

module.exports = {addRecipeTypeService};