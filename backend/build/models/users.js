"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    profile_image: { type: String, required: true, default: "/broken-image.jpg" },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true, unique: true },
    added: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Game",
            required: true,
            default: [],
        },
    ],
    played: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Game",
            required: true,
            default: [],
        },
    ],
    favorites: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Game",
            required: true,
            default: [],
        },
    ],
    wishlist: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Game",
            required: true,
            default: [],
        },
    ],
    reviews: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Review",
            required: true,
            default: [],
        },
    ],
});
const User = mongoose_1.default.model("User", userSchema);
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id?.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});
exports.default = User;
