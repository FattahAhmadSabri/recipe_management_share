const { MainIngredient } = require("../model/index")


const addMainIngrdients=(data)=>{
    const response = MainIngredient.bulkCreate(data)
    return response
}

module.exports=addMainIngrdients