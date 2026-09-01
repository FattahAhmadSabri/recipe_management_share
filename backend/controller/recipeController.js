const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");
const Recipe = require("../model/recipeSchema");
const { addRecentView } = require("../service/recentViewService");
const {
  addRecipeService,
  getRecipeService,
  updateRecipeService,
} = require("../service/recipeService");
const sequelize = require("../utils/dbConfig");

const addRecipeController = async (req, res) => {
  try {
    const {
      recipeName,
      description,
      ingredients,
      method,
      cuisine,
      mainIngredient,
      recipeType,
      cookingTime,
      preparationTime,
      marinationTime,
      soakingTime,
      serves,
      makes,
      otherNames,
      tags,
      keywords,
      source,
      notes,
    } = req.body;
    const file = req.file;
    const response = await addRecipeService(
      recipeName,
      description,
      ingredients,
      method,
      cuisine,
      mainIngredient,
      recipeType,
      cookingTime,
      preparationTime,
      marinationTime,
      soakingTime,
      serves,
      makes,
      otherNames,
      tags,
      keywords,
      source,
      notes,
      file,
    );

    return successResponse(res, 201, "Recipe added successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getRecipeController = async (req, res) => {
  try {
    const response = await getRecipeService();
    return successResponse(res, 200, "Recipe listed successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateRecipeController = async (req, res) => {
  try {
    const {
      recipeName,
      description,
      ingredients,
      method,
      cuisine,
      mainIngredient,
      recipeType,
      cookingTime,
      preparationTime,
      marinationTime,
      soakingTime,
      serves,
      makes,
      otherNames,
      tags,
      keywords,
      source,
      notes,
    } = req.body;
    const userId = req.user.id;
    const file = req.file;
    const {id }= req.params
    const response = await updateRecipeService(
      recipeName,
      description,
      ingredients,
      method,
      cuisine,
      mainIngredient,
      recipeType,
      cookingTime,
      preparationTime,
      marinationTime,
      soakingTime,
      serves,
      makes,
      otherNames,
      tags,
      keywords,
      source,
      notes,
      userId,
      file,
      id
    );
    return successResponse(res, 200, "Recipe updated successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getRecipeByIdController = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const ipAddress = req.ip;
    const recipeId = req.params.id;
    const userId = req.user?.id || null;

    const response = await Recipe.findOne({
      where: {
        id: recipeId,
      },
      transaction,
    });

    if (!response) {
      await transaction.rollback();

      return errorResponse(res, 404, "Recipe not found");
    }

    await addRecentView(
      recipeId,
      userId,
      ipAddress,
      transaction
    );

    await transaction.commit();

    return successResponse(
      res,
      200,
      "Recipe fetched successfully",
      response
    );

  } catch (error) {
    await transaction.rollback();

    return errorResponse(res, 500, error.message);
  }
};


module.exports = {
  addRecipeController,
  getRecipeController,
  updateRecipeController,
  getRecipeByIdController
};
