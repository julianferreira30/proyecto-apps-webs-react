import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
mongoose.set("strictQuery", false);

export interface ReviewData{
    id: string,
    rating: number,
    content: string,
    author_name: string,
    author_profile_image: string,
    game: mongoose.Types.ObjectId,
}

const reviewSchema = new mongoose.Schema<ReviewData>({
    rating: {type: Number, required: true},
    content: {type: String, required: true},
    author_name: {type: String, required: true},
    author_profile_image: {type: String, required: true},
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true,
    }
});

const Review = mongoose.model<ReviewData>("Review", reviewSchema)
reviewSchema.set("toJSON", {
    transform: (
        document,
        returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number } 
    ) => {
        returnedObject.id = returnedObject._id?.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

export default Review