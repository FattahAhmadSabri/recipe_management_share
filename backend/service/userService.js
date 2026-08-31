const bcrypt = require("bcrypt");
const { User } = require("../model/index");

const addUserService = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const response = await User.create({ name, email, password: hashedPassword });
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

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw Error("invalid credentials");
  }

  const finalUser = user.toJSON();

  delete finalUser.password;

  return finalUser;
};
const updateUserByIdService = (userId, name, password) => {
  const user = User.update(
    { name, password },
    {
      where: {
        id: userId,
      },
    },
  );
  return user;
};

module.exports = { addUserService, loginService, updateUserByIdService };
