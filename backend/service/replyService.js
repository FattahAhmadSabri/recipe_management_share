const { Op } = require("sequelize");
const { Reply } = require("../model/index");

const addReplyService = async (reply, recipeId, userId) => {
  const response = await Reply.create({ reply, recipeId, userId });
  return response;
};

const getAllReply = async () => {
  const response = await Reply.findAll();
  return response;
};

const getAllReplyByRecipe = async (recipeId) => {
  const response = await Reply.findAll({
    where: {
      recipeId: recipeId,
    },
    order: [["createdAt", "DESC"]],
  });

  return response;
};

const updateReplyService = async (reply,userId,id,)=>{
    const response = await Reply.update({reply},{where : {
        id: id,
        userId : userId
    },
    
})

return response
}

const deleteReplyService=async(userId,id)=>{
    const response = await Reply.destroy({
        where:{
            id : id,
            userId : userId,
            
        }
    })
}

module.exports = { addReplyService, getAllReply, getAllReplyByRecipe,updateReplyService, deleteReplyService };
