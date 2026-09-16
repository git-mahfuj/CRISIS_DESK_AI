import type { NextFunction, RequestHandler, Request, Response } from "express";


const asyncHandler = (fn: RequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch((err: any) => {
            next(err)
        })
    }
}


export {asyncHandler}