const { MainIngredient } = require("../model/index")


const addMainIngrdients=(data)=>{
    const response = MainIngredient.bulkCreate(data)
    return response
}


const getMainIngredients =()=>{
    const response = MainIngredient.findAll()
    return response
}
module.exports={addMainIngrdients,getMainIngredients }