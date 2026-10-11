const bcrypt = require("bcrypt");
const { User } = require("../model/index");

const addUserService = async (name, email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const response = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
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
const updateUserByIdService = async (userId, name, password) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (name !== undefined && name !== null && name !== "") {
    user.name = name;
  }

  if (password !== undefined && password !== null && password !== "") {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  const response = user.toJSON();
  delete response.password;
  return response;
};

const getAllUsersService = async () => {
  const response = await User.findAll({
    attributes: { exclude: ["password"] },
  });

  return response;
};

const updateUserForAdminService = async (userId, updates) => {
  const user = await User.findByPk(userId);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  for (const field of ["name", "email", "role"]) {
    if (updates[field] !== undefined) {
      user[field] = updates[field];
    }
  }

  await user.save();

  const response = user.toJSON();
  delete response.password;
  return response;
};

const deleteUserByIdService = async (userId) => {
  const deletedCount = await User.destroy({ where: { id: userId } });

  if (deletedCount === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return { id: userId };
};

module.exports = {
  addUserService,
  loginService,
  updateUserByIdService,
  getAllUsersService,
  updateUserForAdminService,
  deleteUserByIdService,
};
