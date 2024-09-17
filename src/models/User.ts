import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  image: string;
  comments: mongoose.Types.ObjectId[];
  likedSongs: mongoose.Types.ObjectId[];
  dislikedSongs: mongoose.Types.ObjectId[];
  playlist: mongoose.Types.ObjectId[];
  followedArtist: mongoose.Types.ObjectId[];
}

const UserSchema: Schema<User> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    likedSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    dislikedSongs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    playlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    followedArtist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist",
      },
    ],
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
