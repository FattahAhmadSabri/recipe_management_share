const {
  addReplyService,
  getAllReply,
  getAllReplyByRecipe,
  updateReplyService,
  deleteReplyService,
} = require("../service/replyService");

const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");
const { where } = require("sequelize");

const addReplyController = async (req, res) => {
  try {
    const { reply } = req.body;
    const userId = req.user.id;
    const recipeId = req.params.recipeId;

    const response = await addReplyService(reply, recipeId, userId);
    return successResponse(res, 201, "Reply added successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getReplyController = async (req, res) => {
  try {
    const response = await getAllReply();
    return successResponse(res, 200, "Reply added successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAllReplyByrecipeIdController = async (req, res) => {
  try {
    const recipeId = req.params.recipeId;
    const response = await getAllReplyByRecipe(recipeId);
    return successResponse(res, 200, "Reply listed successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateReplyByIdController = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const { reply } = req.body;
    const response = await updateReplyService(reply, userId, id);
    return successResponse(res, 200, "Reply updated successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const deleteReplyByRecipeId = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    await deleteReplyService(userId, id);
    return successResponse(res, 200, "Reply deleted successfully");
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = {
  addReplyController,
  getReplyController,
  getAllReplyByrecipeIdController,
  updateReplyByIdController,
  deleteReplyByRecipeId,
};
