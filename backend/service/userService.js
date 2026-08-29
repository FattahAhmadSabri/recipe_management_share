const { DELETE } = require("sequelize/lib/query-types");
const User = require("../model/userSchema");

const addUserService = async (name, email, password) => {
  const response = await User.create({ name, email, password });
  return response;
};

const loginService = async (email, password) => {
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  if (!user) {
    throw Error("invalid credentials");
  }
  if (password !== user.password) {
    throw Error("invalid credentials");
  }
  const finalUser = user.toJSON();

  delete finalUser.password;

  return finalUser;
};

const updateUserByIdService = (userId, name,password)=>{
    const user = User.update({name,password},{where : {
        id : userId
    },
   
})
return user
}

module.exports = { addUserService, loginService, updateUserByIdService  };
