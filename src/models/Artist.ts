import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface Artist {
  name: string;
  email: string;
  password: string;
  image: string;
  songs: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
}

const ArtistSchema: Schema<Artist> = new Schema(
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
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const ArtistModel =
  (mongoose.models.Artist as mongoose.Model<Artist>) ||
  mongoose.model<Artist>("Artist", ArtistSchema);

export default ArtistModel;
