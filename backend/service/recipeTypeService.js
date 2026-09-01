const { RecipeType } = require("../model");

const addRecipeTypeService = (data) => {
  return RecipeType.bulkCreate(data);
};

const getRecipeTypeService = ()=>{
  const response = RecipeType.findAll()
  return response
}

module.exports = {addRecipeTypeService, getRecipeTypeService};