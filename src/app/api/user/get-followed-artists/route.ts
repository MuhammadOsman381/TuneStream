import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { use } from "react";

interface Artist {
    _id: string,
    name: string,
    email: string,
    password: string,
    image: string,
    songs: mongoose.Types.ObjectId[],
    followStatus: Boolean,
    followers: mongoose.Types.ObjectId[],
    createdAt: Date,
    updatedAt: Date,
}

export async function GET(request: Request) {
    await dbConnection();
    try {
        const token = request.headers.get("x-access-token");
        if (!token) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "No token provided",
                }),
                { status: 401 }
            );
        }
        const decodedToken: any = jwt.decode(token)
        const user = await UserModel.findById(decodedToken?.id).lean();
        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "user not found",
                }),
                { status: 404 }
            );
        }
        const followedArtists = await Promise.all(
            user?.followedArtist?.map(async (id: mongoose.Types.ObjectId) => {
                let isFollowed: Boolean = false;
                let artist: Artist | null = await ArtistModel.findOne({ _id: id })
                if (artist?.followers.includes(user._id)) isFollowed = true
                return {
                    _id: artist?._id,
                    name: artist?.name,
                    email: artist?.email,
                    password: artist?.password,
                    image: `${process.env.URL}/uploads/image/${artist?.image}`,
                    songs: artist?.songs,
                    followStatus: isFollowed,
                    followers: artist?.followers,
                    createdAt: artist?.createdAt,
                    updatedAt: artist?.updatedAt,
                }
            })
        )
        return new Response(
            JSON.stringify({
                success: true,
                message: "Followed artists found succesfully!",
                followedArtists: followedArtists,
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
