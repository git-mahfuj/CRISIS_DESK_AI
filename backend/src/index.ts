import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { router } from "./routes/reports_route.js"
import morgan from "morgan";
import dns from "dns"

import { connectDB } from "./services/DBConnect.js";
import { globalLimiter } from "./middlewares/RateLimiter.js";
import { speedLimiter } from "./middlewares/SpeedLimiter.js";

dns.setServers(['8.8.8.8', '8.8.4.4'])


dotenv.config();

const app = express()

app.use(express.json());
app.use(cors())
app.use(morgan("dev"))
app.use(globalLimiter)
app.use(speedLimiter)
connectDB();

app.use("/api/v1", router)


export default app;