const {
  addUserService,
  loginService,
  updateUserByIdService,
  getAllUsersService,
  updateUserForAdminService,
  deleteUserByIdService,
} = require("../service/userService");
const jwt = require("jsonwebtoken");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");
const { User } = require("../model");

const addUserController = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const response = await addUserService(name, email, password,role);
    return successResponse(res, 201, "User added successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await loginService(email, password);
    const token = jwt.sign(
      {
        id: response.id,
        role: response.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    return successResponse(
      res,
      200,
      "User loggedin successfully",
      response,
      token,
    );
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;
    const response = await updateUserByIdService(userId, name, password);
    return successResponse(res, 200, "User updated successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const getAllUsersController = async (req, res) => {
  try {
    const response = await getAllUsersService();

    return successResponse(res, 200, "Get users successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

const updateUserForAdminController = async (req, res) => {
  try {
    const response = await updateUserForAdminService(req.params.id, req.body);
    return successResponse(res, 200, "User updated successfully", response);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

const deleteUserController = async (req, res) => {
  try {
    const response = await deleteUserByIdService(req.params.id);
    return successResponse(res, 200, "User deleted successfully", response);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

module.exports = {
  addUserController,
  loginController,
  updateUserController,
  getAllUsersController,
  updateUserForAdminController,
  deleteUserController,
};
