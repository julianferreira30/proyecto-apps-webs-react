"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set("strictQuery", false);
const reviewSchema = new mongoose_1.default.Schema({
    rating: { type: Number, required: true },
    content: { type: String, required: true },
    author_name: { type: String, required: true },
    author_profile_image: { type: String, required: true },
    game: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Game",
        required: true,
    }
});
const Review = mongoose_1.default.model("Review", reviewSchema);
reviewSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id?.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = Review;
