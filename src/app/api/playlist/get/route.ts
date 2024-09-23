import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import SongModel from "@/models/Song";
import UserModel from "@/models/User";
import PlayListModel from "@/models/Playlist";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnection();
    try {
        const token: any = request.headers.get("x-access-token");
        const decodedToken: any = jwt.decode(token);
        const user: any = await UserModel.findOne({ _id: decodedToken.id })
        if (user?.playlist?.length === 0) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Playlist not found!",
                }),
                { status: 404 }
            );
        }
        let userPlayLists = await Promise.all(user?.playlist?.map(async (items: mongoose.Types.ObjectId) => (
            await PlayListModel.findOne({ _id: items })
        )))
        return new Response(
            JSON.stringify({
                success: true,
                message: "Playlist fetched succesfully!",
                userPlayLists: userPlayLists,
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
