import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";
dotenv.config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;

mongoose.set("strictQuery", false);
if (url) {
    mongoose.connect(url, { dbName }).catch((error) => {
        console.log("error connecting to MongoDB: ", error.menssage);
    });
}

export interface Game{
    name: string,
    release_year: number,
    creator: string,
    genre: string[], 
    image: string,
}

const gameSchema = new mongoose.Schema<Game>({
    name: {type: String, required: true},
    release_year: {type: String, required: true},
    creator: {type: String, required: false}, // Puse que no es necesario, pero se puede cambiar obvio
    genre: {type: [String], required: true},
    image: {type: String, required: true}
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

const GameModel = mongoose.model<Game>("Game", gameSchema);

export default GameModel;