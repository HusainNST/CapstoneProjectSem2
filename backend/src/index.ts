import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes";
import gameRoutes from "./routes/gameRoutes";
import cookieParser from "cookie-parser";
import { OK } from "./constants/httpStatusCodes";
import { FRONTEND_URL, PORT } from "./constants/env";

const app = express();

// Cors
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);

// Parse JSON and Cookies
app.use(express.json());
app.use(cookieParser());

// Health check endpoints
["/", "/health", "/status"].forEach((path) => {
  app.get(path, (_, res) => {
    res.status(OK).json({ message: "Healthy" });
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
