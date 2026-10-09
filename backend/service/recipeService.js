const { Recipe, MainIngredient, RecipeType } = require("../model/index");
const sequelize = require("../utils/dbConfig");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../utils/s3Config");
const { uploadImage } = require("./s3Service");

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
  userId
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
        userId
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


const searchRecipeByRecipeNameService = (recipeName)=>{
     const response = Recipe.findAll({where : {
      recipeName : recipeName,

     }})
}

module.exports = { addRecipeService, getRecipeService, updateRecipeService };
