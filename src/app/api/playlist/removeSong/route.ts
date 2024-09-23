import dbConnection from "@/lib/dbConnection";
import SongModel from "@/models/Song";
import PlayListModel from "@/models/Playlist";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbConnection();
    try {
        const { songID, playlistID }: any = await request.json();
        const playList = await PlayListModel.findOne({ _id: playlistID });
        if (!playList) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Playlist not found",
                }),
                { status: 404 }
            );
        }
        const song = await SongModel.findOne({ _id: songID });
        if (!song) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Song not found",
                }),
                { status: 404 }
            );
        }
        playList.songs = playList.songs.filter((id) => id.toString() !== song._id.toString());
        await playList.save();
        return new Response(
            JSON.stringify({
                success: true,
                message: "Song removed from playlist!",
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
