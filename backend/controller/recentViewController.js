const { getRecentViewByIpAddress } = require("../service/recentViewService")
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseHandlingMiddleware");
const getRecentviewByIPController = async (req, res)=>{
    try {
        const ipAdress = req.ip

        const response = await getRecentViewByIpAddress(ipAdress)
        return successResponse(res, 200, "Recent View recipes", response);
    } catch (error) {
        return errorResponse(res, 500, error.message); 
    }
}

module.exports = {getRecentviewByIPController}