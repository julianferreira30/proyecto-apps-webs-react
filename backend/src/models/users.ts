import mongoose from "mongoose";

interface UserData{
  id:string;
  profile_image: string;
  username: string;
  name: string;
  passwordHash: string;
  played: mongoose.Types.ObjectId[];
  favourites: mongoose.Types.ObjectId[];
  wishlist: mongoose.Types.ObjectId[];
  reviews: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<UserData>({
  profile_image: {type: String, required: true},
  username:{type:String, required: true, unique: true},
  name: String,
  passwordHash: String,
  played: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
  favourites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
  ],
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
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