"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;
mongoose_1.default.set("strictQuery", false);
if (url) {
    mongoose_1.default.connect(url, { dbName }).catch((error) => {
        console.log("error connecting to MongoDB: ", error.message);
    });
}
const gameSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    release_year: { type: Number, required: true },
    creator: { type: String, required: false, default: "Desconocido" }, // Puse que no es necesario, pero se puede cambiar obvio
    genre: { type: [String], required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, required: true, default: 0 },
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review",
            default: [],
        }
    ]
});
gameSchema.set("toJSON", {
    transform: (_, returnedObject) => {
        returnedObject.id = returnedObject._id?.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
const Game = mongoose_1.default.model("Game", gameSchema);
exports.default = Game;
