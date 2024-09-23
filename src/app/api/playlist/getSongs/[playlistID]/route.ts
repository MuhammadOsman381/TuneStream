import dbConnection from "@/lib/dbConnection";
import SongModel from "@/models/Song";
import PlayListModel from "@/models/Playlist";
import mongoose from "mongoose";

interface Song {
    playlistTitle:string
    playlistID: mongoose.Types.ObjectId;
    _id: mongoose.Types.ObjectId,
    title: string,
    thumbnail: string,
    song: string,
    likes: mongoose.Types.ObjectId[],
    dislikes: mongoose.Types.ObjectId[],
    artistId: string[],
    artistName: string,
    comments: mongoose.Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date,
}

export async function GET(request: Request) {
    await dbConnection();
    try {
        const playlistID = request.url.split("getSongs/")[1]
        const playList: any = await PlayListModel.findOne({ _id: playlistID })
        if (playList.songs.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "No songs found!",
                }),
                { status: 404 }
            );
        }
        let songs: any = await Promise.all(playList?.songs.map(async (items: mongoose.Types.ObjectId) => {
            let song: Song | null = await SongModel.findOne({ _id: items })
            return (
                {
                    playlistTitle:playList?.title,
                    playlistID:playList?._id,
                    _id: song?._id,
                    title: song?.title,
                    thumbnail: `${process.env.URL}/uploads/thumbnail/${song?.thumbnail}`,
                    song: `${process.env.URL}/uploads/song/${song?.song}`,
                    likes: song?.likes,
                    dislikes: song?.dislikes,
                    artistId: song?.artistId,
                    artistName: song?.artistName,
                    comments: song?.comments,
                    createdAt: song?.createdAt,
                    updatedAt: song?.updatedAt,
                }
            )
        }))
        return new Response(
            JSON.stringify({
                success: true,
                message: "Songs fetched succesfully!",
                songs: songs
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Error processing request",
            }),
            { status: 500 }
        );
    }
}
