const {
  createFollowService,
  deleteFollowService,
  getFollowersByUserIdService,
  getFollowingByUserIdService,
} = require("../service/followersService");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");

const followUserController = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.followingId || req.body.followingId;

    const response = await createFollowService(followerId, followingId);
    return successResponse(res, 201, "User followed successfully", response);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

const unfollowUserController = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.followingId || req.body.followingId;

    const response = await deleteFollowService(followerId, followingId);
    return successResponse(res, 200, "User unfollowed successfully", response);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

const getFollowersController = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return errorResponse(res, 400, "User id is required");
    }

    const response = await getFollowersByUserIdService(userId);
    return successResponse(
      res,
      200,
      "Followers fetched successfully",
      response,
    );
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

const getFollowingController = async (req, res) => {
  try {
    const userId = req.params.userId || req.user?.id;

    if (!userId) {
      return errorResponse(res, 400, "User id is required");
    }

    const response = await getFollowingByUserIdService(userId);
    return successResponse(
      res,
      200,
      "Following users fetched successfully",
      response,
    );
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message);
  }
};

module.exports = {
  followUserController,
  unfollowUserController,
  getFollowersController,
  getFollowingController,
};
