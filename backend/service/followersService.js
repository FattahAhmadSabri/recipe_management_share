const { Follow, User } = require("../model");

const createFollowService = async (followerId, followingId) => {
  if (!followerId || !followingId) {
    const error = new Error("Follower and following user ids are required");
    error.statusCode = 400;
    throw error;
  }

  if (followerId === followingId) {
    const error = new Error("User cannot follow themselves");
    error.statusCode = 400;
    throw error;
  }

  const follower = await User.findByPk(followerId);
  const following = await User.findByPk(followingId);

  if (!follower || !following) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const existingFollow = await Follow.findOne({
    where: {
      followerId,
      followingId,
    },
  });

  if (existingFollow) {
    const error = new Error("Already following this user");
    error.statusCode = 409;
    throw error;
  }

  return Follow.create({
    followerId,
    followingId,
  });
};

const deleteFollowService = async (followerId, followingId) => {
  if (!followerId || !followingId) {
    const error = new Error("Follower and following user ids are required");
    error.statusCode = 400;
    throw error;
  }

  const deletedCount = await Follow.destroy({
    where: {
      followerId,
      followingId,
    },
  });

  if (deletedCount === 0) {
    const error = new Error("Follow relationship not found");
    error.statusCode = 404;
    throw error;
  }

  return { followerId, followingId };
};

const getFollowersByUserIdService = async (userId) => {
  return Follow.findAll({
    where: {
      followingId: userId,
    },
    include: [
      {
        model: User,
        as: "follower",
        attributes: { exclude: ["password"] },
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

const getFollowingByUserIdService = async (userId) => {
  return Follow.findAll({
    where: {
      followerId: userId,
    },
    include: [
      {
        model: User,
        as: "followingUser",
        attributes: { exclude: ["password"] },
      },
    ],
    order: [["createdAt", "DESC"]],
  });
};

module.exports = {
  createFollowService,
  deleteFollowService,
  getFollowersByUserIdService,
  getFollowingByUserIdService,
};
