const { Collection, Favorite, Recipe } = require("../model");

const normalizeRecipeImage = (image) => {
  if (!image) {
    return "https://placehold.co/600x400/f5f5f5/8b0000?text=Recipe";
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (image.startsWith("recipes/")) {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${image}`;
  }

  return image;
};

const getCollectionsByUserService = async (userId) => {
  const collections = await Collection.findAll({
    where: { userId },
    include: [
      {
        model: Favorite,
        as: "favorites",
        include: [{ model: Recipe, as: "recipe" }],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  return collections.map((collection) => {
    const data = collection.toJSON();
    data.favorites = (data.favorites || []).map((favorite) => ({
      ...favorite,
      recipe: favorite.recipe
        ? {
            ...favorite.recipe,
            image: normalizeRecipeImage(favorite.recipe.image),
          }
        : null,
    }));
    return data;
  });
};

const createCollectionService = async (userId, name) => {
  const collectionName = String(name || "").trim();

  if (!collectionName) {
    const error = new Error("Collection name is required");
    error.statusCode = 400;
    throw error;
  }

  if (collectionName.length > 100) {
    const error = new Error("Collection name must be 100 characters or fewer");
    error.statusCode = 400;
    throw error;
  }

  const existing = await Collection.findOne({
    where: { userId, name: collectionName },
  });

  if (existing) {
    const error = new Error("A collection with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  return Collection.create({ userId, name: collectionName });
};

const addRecipeToCollectionService = async (userId, collectionId, recipeId) => {
  const collection = await Collection.findOne({
    where: { id: collectionId, userId },
  });

  if (!collection) {
    const error = new Error("Collection not found");
    error.statusCode = 404;
    throw error;
  }

  const recipe = await Recipe.findByPk(recipeId);
  if (!recipe) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  const existing = await Favorite.findOne({
    where: { userId, recipeId, collectionId },
  });

  if (existing) {
    const error = new Error("Recipe is already in this collection");
    error.statusCode = 409;
    throw error;
  }

  return Favorite.create({ userId, recipeId, collectionId });
};

const removeRecipeFromCollectionService = async (
  userId,
  collectionId,
  recipeId,
) => {
  const collection = await Collection.findOne({
    where: { id: collectionId, userId },
  });

  if (!collection) {
    const error = new Error("Collection not found");
    error.statusCode = 404;
    throw error;
  }

  const deletedCount = await Favorite.destroy({
    where: { userId, collectionId, recipeId },
  });

  if (deletedCount === 0) {
    const error = new Error("Recipe is not in this collection");
    error.statusCode = 404;
    throw error;
  }

  return { collectionId, recipeId };
};

module.exports = {
  getCollectionsByUserService,
  createCollectionService,
  addRecipeToCollectionService,
  removeRecipeFromCollectionService,
};
