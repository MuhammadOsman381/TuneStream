import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import SongModel from "@/models/Song";
import UserModel from "@/models/User";
import PlayListModel from "@/models/Playlist";

export async function POST(request: Request) {
    await dbConnection();
    try {
        const formData = await request.formData();
        const songID: string | null = formData.get("songID") as string | null;
        const playListID: string | null = formData.get("playListID") as string | null
        const song: any = await SongModel.findOne({ _id: songID })
        const playList = await PlayListModel.findOne({ _id: playListID })
        if (playList?.songs.includes(song?._id)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `${song?.title} already exist in ${playList?.title}!`,
                }),
                { status: 409 }
            );
        }
        playList?.songs.push(song?._id)
        playList?.save()
        return new Response(
            JSON.stringify({
                success: true,
                message: `Song added to ${playList?.title} succesfully!`,
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
