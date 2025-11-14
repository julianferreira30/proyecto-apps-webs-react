import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

mongoose.set("strictQuery", false);
if (url) {
  mongoose.connect(url, { dbName }).catch((error) => {
    console.log("error connecting to MongoDB: ", error.menssage);
  });
}

export interface GameData{
  id: string,
  name: string,
  release_year: number,
  creator: string,
  genre: string[], 
  image: string,
  description: string,
  rating: number,
  reviews: mongoose.Types.ObjectId[],
}

const gameSchema = new mongoose.Schema<GameData>({
  name: {type: String, required: true},
  release_year: {type: Number, required: true},
  creator: {type: String, required: false}, // Puse que no es necesario, pero se puede cambiar obvio
  genre: {type: [String], required: true},
  image: {type: String, required: true},
  description: {type: String, required: true},
  rating: {type: Number, required: true, default: 0},
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      default: [],
    }
  ]
})

gameSchema.set("toJSON", {
  transform: (
    _,
    returnedObject: { id?: string; _id?: mongoose.Types.ObjectId; __v?: number }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
const Game = mongoose.model<GameData>("Game", gameSchema);

export default Game;