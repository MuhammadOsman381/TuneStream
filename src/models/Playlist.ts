import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPlayList extends Document {
    title: string;
    user: mongoose.Types.ObjectId;
    songs: mongoose.Types.ObjectId[];
}

const PlayListSchema: Schema<IPlayList> = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        songs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Song",
            },
        ],
    },
    { timestamps: true }
);

const PlayListModel: Model<IPlayList> =
    mongoose.models.PlayList || mongoose.model<IPlayList>("PlayList", PlayListSchema);

export default PlayListModel;
