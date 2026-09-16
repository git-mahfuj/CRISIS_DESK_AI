import express from "express"
import { healthCheck } from "../controllers/healthCheckController.js";
import { aiRouteLimiter } from "../middlewares/RateLimiter.js";
import { createReportHandler, deleteReportByIdHandler, getReportByIdHandler, getReportHandler } from "../controllers/ReportController.js";


const router = express.Router();

router.route("/health").get(healthCheck);
router.route("/POST/reports").post(aiRouteLimiter, createReportHandler);
router.route("/GET/reports").get(getReportHandler);
router.route("/GET/reports/:id").get(getReportByIdHandler);
router.route("/DELETE/reports/:id").delete(deleteReportByIdHandler);

export { router }