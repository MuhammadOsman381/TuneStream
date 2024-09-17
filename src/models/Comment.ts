import mongoose, { Schema } from "mongoose";

export interface Comment {
  content: string;
  userId: mongoose.Types.ObjectId;
  songId: mongoose.Types.ObjectId;
}

const commentSchema: Schema<Comment> = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    songId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
    },
  },
  { timestamps: true }
);

const CommentModel =
  (mongoose.models.Comment as mongoose.Model<Comment>) ||
  mongoose.model<Comment>("Comment", commentSchema);

export default CommentModel;
