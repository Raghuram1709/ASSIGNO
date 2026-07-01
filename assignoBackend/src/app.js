import express from "express";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js'
import authMiddleware from "./middleware/authMiddleware.js";
import memberRoutes from "./routes/memberRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js";
import communicationRoutes from './routes/communicationRoutes.js'
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("API Running");
});

app.use("/api/auth", authRoutes);

app.use("/api", authMiddleware, projectRoutes);

app.use("/api", authMiddleware, memberRoutes);

app.use("/api", authMiddleware, taskRoutes);

app.use("/api", authMiddleware, submissionRoutes);

app.use("/api", authMiddleware, notificationRoutes);

app.use("/api", authMiddleware, communicationRoutes);


app.use(errorHandler);

export default app;