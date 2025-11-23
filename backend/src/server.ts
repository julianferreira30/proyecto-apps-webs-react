import dotenv from "dotenv";
import mongoose from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import config from "./utils/config";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";
import cors from "cors";
import registerRouter from "./routes/register";
import loginRouter from "./routes/login";
import userRouter from "./routes/user";
import gameRouter from "./routes/game";
import reviewRouter from "./routes/review";
import testingRouter from "./controllers/testing";
import path from "path";

// ---- DB ----
dotenv.config();
mongoose.set("strictQuery", false);




if (config.MONGODB_URI) {
  mongoose.connect(config.MONGODB_URI).catch((error) => {
    if (process.env.NODE_ENV !== "test") {
      logger.error("error connecting to MongoDB: ", error.message);
    }
  });
}

const app = express();

app.use(express.json());
app.use(cookieParser());

// ---- CORS ----
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);

// ---- LOGGER ----
const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.log("Method:", request.method);
  console.log("Path:   ", request.path);
  console.log("Body:   ", request.body);
  next();
};
app.use(requestLogger);

// ---- API ROUTES ----
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/users", userRouter);
app.use("/api/games", gameRouter);
app.use("/api/reviews", reviewRouter);

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

// ---- STATIC FILES ----
app.use(express.static("public"));

// ---- SPA FALLBACK ----
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

// ---- ERROR HANDLER (AL FINAL SIEMPRE) ----
const errorHandler = (
  error: { name: string; message: string },
  request: Request,
  response: Response,
  next: NextFunction
) => {
  console.error(error.message);
  console.error(error.name);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

export default app;
