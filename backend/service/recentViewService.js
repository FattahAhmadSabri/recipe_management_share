const { RecentView, Recipe } = require("../model")


const addRecentView = async (recipeId, userId, ipAddress) => {
  const where = userId
    ? { userId, recipeId }
    : { ipAddress, recipeId };

  const [recentView, created] = await RecentView.findOrCreate({
    where,
    defaults: {
      userId: userId || null,
      ipAddress,
      recipeId,
      viewedAt: new Date(),
    },
  });

  if (!created) {
    recentView.viewedAt = new Date();
    await recentView.save();
  }

  const viewerWhere = userId
    ? { userId }
    : { ipAddress };

  const views = await RecentView.findAll({
    where: viewerWhere,
    order: [["viewedAt", "DESC"]],
  });

  if (views.length > 10) {
    await RecentView.destroy({
      where: {
        id: views.slice(10).map((view) => view.id),
      },
    });
  }

  return recentView;
};


const getRecentViewByIpAddress = async (ipAddress) => {
  const response = await RecentView.findAll({
    where: {
      ipAddress,
    },
    include: [
      {
        model: Recipe,
      },
    ],
    order: [["viewedAt", "DESC"]],
    limit: 10,
  });

  return response;
};


module.exports = {addRecentView, getRecentViewByIpAddress}