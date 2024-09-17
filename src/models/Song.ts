import mongoose, { Schema, Document, Mongoose } from "mongoose";

export interface Song {
  title: string;
  thumbnail: string;
  song: string;
  likes: mongoose.Types.ObjectId[];
  dislikes: mongoose.Types.ObjectId[];
  artistId: mongoose.Types.ObjectId;
  artistName: string;
  comments: mongoose.Schema.Types.ObjectId[];
}

const SongSchema: Schema<Song> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail: {
      type: String,
      unique: true,
    },
    song: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
    },
    artistName: {
      type: String,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const SongModel =
  (mongoose.models.Song as mongoose.Model<Song>) ||
  mongoose.model<Song>("Song", SongSchema);

export default SongModel;
