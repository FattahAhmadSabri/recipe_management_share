const { Op } = require("sequelize");
const { Reply, Recipe, User } = require("../model/index");

const addReplyService = async (reply, recipeId, userId) => {
  const response = await Reply.create({ reply, recipeId, userId });
  return response;
};

const getAllReply = async () => {
  const response = await Reply.findAll({
    include: [
      { model: Recipe, attributes: ["recipeName"] },
      { model: User, attributes: ["name", "email"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  return response;
};

const getAllReplyByRecipe = async (recipeId) => {
  const response = await Reply.findAll({
    where: {
      recipeId: recipeId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return response;
};

const updateReplyService = async (reply, userId, id) => {
  const response = await Reply.update(
    { reply },
    {
      where: {
        id: id,
        userId: userId,
      },
    },
  );

  return response;
};

const deleteReplyService = async (userId, id, isAdmin = false) => {
  const where = { id };

  if (!isAdmin) {
    where.userId = userId;
  }

  const deletedCount = await Reply.destroy({ where });

  if (deletedCount === 0) {
    const error = new Error("Comment not found or permission denied");
    error.statusCode = 404;
    throw error;
  }

  return deletedCount;
};

module.exports = {
  addReplyService,
  getAllReply,
  getAllReplyByRecipe,
  updateReplyService,
  deleteReplyService,
};
