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
        const title: string | null = formData.get("title") as string | null;
        const token: any = request.headers.get("x-access-token");
        const decodedToken: any = jwt.decode(token);
        const user = await UserModel.findOne({ _id: decodedToken.id })
        const newPlayList: any = await PlayListModel.create({
            title: title,
            user: user?._id,
        })
        user?.playlist.push(newPlayList?._id)
        user?.save();
        return new Response(
            JSON.stringify({
                success: true,
                message: "Playlist create succesfully!",
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
