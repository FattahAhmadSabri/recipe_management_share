const { Recipe } = require("../model/index");
const sequelize = require("../utils/dbConfig");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../utils/s3Config");
const { uploadImage } = require("./s3Service")

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
) => {
  const transaction = await sequelize.transaction();

  try {
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
        image: imageKey,
      },
      {
        transaction,
      },
    );

    await transaction.commit();

    return response;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getRecipeService = () => {
  const response = Recipe.findAll();
  return response;
};



const updateRecipeService = async (
  userId,
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
  id,
) => {
  try {
    const updateData = {
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
    };

   
    if (file) {
      const imageKey = await uploadImage(file);

      updateData.image = imageKey;
    }

    const response = await Recipe.update(updateData, {
      where: {
        id,
        userId,
      },
    });

    return response;
  } catch (error) {
    throw error;
  }
};

module.exports = { addRecipeService, getRecipeService, updateRecipeService };
