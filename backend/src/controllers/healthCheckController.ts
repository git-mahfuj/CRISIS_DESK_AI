import type { Response, Request, NextFunction } from "express"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

const healthCheck = (asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json(
        new ApiResponse(200, "Okk")
    )
}))


export { healthCheck }