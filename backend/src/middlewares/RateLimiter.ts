import rateLimit from "express-rate-limit";


export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
})

export const aiRouteLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 15,
    message: {
        success: false,
        message: "You have submitted too many reports recently. Please wait a few minutes to avoid AI spam.",
    },
})