"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./utils/config"));
const logger_1 = __importDefault(require("./utils/logger"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const register_1 = __importDefault(require("./routes/register"));
const login_1 = __importDefault(require("./routes/login"));
const user_1 = __importDefault(require("./routes/user"));
const game_1 = __importDefault(require("./routes/game"));
const review_1 = __importDefault(require("./routes/review"));
const path_1 = __importDefault(require("path"));
// ---- DB ----
dotenv_1.default.config();
mongoose_1.default.set("strictQuery", false);
if (config_1.default.MONGODB_URI) {
    mongoose_1.default.connect(config_1.default.MONGODB_URI).catch((error) => {
        if (process.env.NODE_ENV !== "test") {
            logger_1.default.error("error connecting to MongoDB: ", error.message);
        }
    });
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// ---- CORS ----
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || "http://localhost:5173";
app.use((0, cors_1.default)({
    origin: FRONTEND_ORIGIN,
    credentials: true,
}));
// ---- LOGGER ----
const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:   ", request.path);
    console.log("Body:   ", request.body);
    next();
};
app.use(requestLogger);
// ---- API ROUTES ----
app.use("/api/login", login_1.default);
app.use("/api/register", register_1.default);
app.use("/api/users", user_1.default);
app.use("/api/games", game_1.default);
app.use("/api/reviews", review_1.default);
// ---- STATIC FILES ----
app.use(express_1.default.static("public"));
// ---- SPA FALLBACK ----
app.get(/.*/, (req, res) => {
    res.sendFile(path_1.default.resolve("public/index.html"));
});
// ---- ERROR HANDLER (AL FINAL SIEMPRE) ----
const errorHandler = (error, request, response, next) => {
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
exports.default = app;
