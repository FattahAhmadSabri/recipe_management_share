const {
  addUserService,
  loginService,
  updateUserByIdService,
} = require("../service/userService");
const jwt = require("jsonwebtoken");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const addUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const response = await addUserService(name, email, password);
    return successResponse(res, response, "User created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await loginService(email, password);
    const token = jwt.sign({ id: response.id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });
    return successResponse(
      res,
      200,
      "User updated successfully",
      response,
      token,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateUserController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, password } = req.body;
    const response = await updateUserByIdService(userId, name, password);
    return successResponse(res, 201, "User updated successfully", response);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

module.exports = { addUserController, loginController, updateUserController };
