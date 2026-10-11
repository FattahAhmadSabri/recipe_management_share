const {
  Recipe,
  MainIngredient,
  RecipeType,
  RecipeRating,
} = require("../model/index");
const sequelize = require("../utils/dbConfig");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../utils/s3Config");
const { uploadImage } = require("./s3Service");

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

const addRecipeService = async (
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
  userId,
) => {
  const transaction = await sequelize.transaction();

  try {
    const mainIngredientData = await MainIngredient.findOne({
      where: {
        name: mainIngredient,
      },
      transaction,
    });

    if (!mainIngredientData) {
      throw new Error("Invalid main ingredient");
    }

    const recipeTypeData = await RecipeType.findOne({
      where: {
        name: recipeType,
      },
      transaction,
    });

    if (!recipeTypeData) {
      throw new Error("Invalid recipe type");
    }

    const imageKey = `recipes/${Date.now()}-${file.originalname}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    const response = await Recipe.create(
      {
        recipeName,
        description,
        ingredients,
        method,
        cuisine,

        mainIngredientId: mainIngredientData.id,
        recipeTypeId: recipeTypeData.id,

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
        image: imageKey,
        userId,
      },
      {
        transaction,
      },
    );

    const recipeData = response.toJSON();

    await transaction.commit();

    return {
      ...recipeData,
      image: normalizeRecipeImage(recipeData.image),
    };
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

const getRecipeService = async () => {
  const response = await Recipe.findAll({
    include: [
      { model: MainIngredient, attributes: ["name"] },
      { model: RecipeType, attributes: ["name"] },
    ],
  });

  return response.map((recipe) => {
    const data = recipe.toJSON();

    return {
      ...data,
      mainIngredientName: data.mainIngredient?.name || "",
      recipeTypeName: data.recipeType?.name || "",
      image: normalizeRecipeImage(data.image),
    };
  });
};

const updateRecipeService = async (userId, updates, file, id, isAdmin) => {
  const recipe = await Recipe.findByPk(id);

  if (!recipe) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  if (!isAdmin && recipe.userId !== userId) {
    const error = new Error("You can only update your own recipes");
    error.statusCode = 403;
    throw error;
  }

  const updateData = {};
  const editableFields = [
    "recipeName",
    "description",
    "ingredients",
    "method",
    "cuisine",
    "cookingTime",
    "preparationTime",
    "marinationTime",
    "soakingTime",
    "serves",
    "makes",
    "otherNames",
    "tags",
    "keywords",
    "source",
    "notes",
  ];

  for (const field of editableFields) {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  }

  if (updates.rating !== undefined) {
    const ratingValue = Number(updates.rating);

    if (!Number.isFinite(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      const error = new Error("Rating must be between 1 and 5");
      error.statusCode = 400;
      throw error;
    }

    const existingRating = await RecipeRating.findOne({
      where: { userId, recipeId: id },
    });

    if (existingRating) {
      const error = new Error("You have already rated this recipe.");
      error.statusCode = 400;
      throw error;
    }

    const currentRating = Number(recipe.rating || 0);
    const currentCount = Number(recipe.ratingCount || 0);
    const nextCount = currentCount + 1;
    const nextAverage =
      currentCount === 0
        ? ratingValue
        : (currentRating * currentCount + ratingValue) / nextCount;

    await RecipeRating.create({
      userId,
      recipeId: id,
      value: ratingValue,
    });

    updateData.rating = Number(nextAverage.toFixed(1));
    updateData.ratingCount = nextCount;
  }

  if (file) {
    updateData.image = await uploadImage(file);
  }

  await recipe.update(updateData);

  const recipeData = recipe.toJSON();
  return {
    ...recipeData,
    image: normalizeRecipeImage(recipeData.image),
  };
};

const deleteRecipeService = async (id, userId, isAdmin = false) => {
  const recipe = await Recipe.findByPk(id);

  if (!recipe) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  if (!isAdmin && recipe.userId !== userId) {
    const error = new Error("You can only delete your own recipes");
    error.statusCode = 403;
    throw error;
  }

  const deletedCount = await Recipe.destroy({ where: { id } });

  if (deletedCount === 0) {
    const error = new Error("Recipe not found");
    error.statusCode = 404;
    throw error;
  }

  return { id };
};

const searchRecipeByRecipeNameService = (recipeName) => {
  const response = Recipe.findAll({
    where: {
      recipeName: recipeName,
    },
  });
};

module.exports = {
  addRecipeService,
  getRecipeService,
  updateRecipeService,
  deleteRecipeService,
  searchRecipeByRecipeNameService,
};
