import mongoose from "mongoose";

interface UserData{
  id:string;
  profile_image: string;
  username: string;
  name: string;
  passwordHash: string;
  played: mongoose.Types.ObjectId[];
  favorites: mongoose.Types.ObjectId[];
  wishlist: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
}
const userSchema = new mongoose.Schema<UserData>({
  profile_image: {type: String, required: true, default: "/broken-image.jpg"},
  username: {type: String, required: true, unique: true},
  name: {type: String, required: true, unique: true},
  passwordHash: {type: String, required: true, unique: true},
  played: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
      default: [],
    },
  ],
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
      default: [],
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
      required: true,
      default: [],
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
      default: [],
    },
  ],
})

const User = mongoose.model("User", userSchema)
userSchema.set("toJSON", {
  transform: (
    document,
    returnedObject: {
      id?: string;
      _id?: mongoose.Types.ObjectId;
      __v?: number;
      passwordHash?: string;
    }
  ) => {
    returnedObject.id = returnedObject._id?.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

export default User;