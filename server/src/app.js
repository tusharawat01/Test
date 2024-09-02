import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pilotRouter from "./routes/pilot.routes.js";
import router from "./routes/index.routes.js";
import detailRouter from "./routes/details.routes.js";

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/pilot", pilotRouter);
app.use("/api", router);
app.use("/api", detailRouter);

// Default route
app.get("/", (req, res) => {
    res.send("Listening...");
});

export { app };
