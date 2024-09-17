import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/User";
import ArtistModel from "@/models/Artist";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import SongModel from "@/models/Song";

interface SongArray {
  _id: string;
  title: string;
  thumbnail: string;
  song: string;
  comments: string[];
  likes: string[];
  dislikes: string[];
  artist: string;
  artistName: string;
}

interface DecodedToken {
  id: string | null;
  userType: string | null;
  iat: string | null;
  exp: string | null;
}

export async function GET(request: Request) {
  await dbConnection();
  try {
    const songs: any = await SongModel.find().exec();
    const token: any = request.headers.get("x-access-token");
    const decodedToken = jwt.decode(token) as DecodedToken | null;
    const user = await UserModel.findOne({ _id: decodedToken?.id });

    const updatedSongArray: SongArray[] = songs.map((items: any) => {
      return {
        _id: items._id,
        title: items.title,
        thumbnail: `${process.env.URL}/uploads/thumbnail/${items?.thumbnail}`,
        song: `${process.env.URL}/uploads/song/${items?.song}`,
        comments: items.comments,
        likes: items.likes,
        dislikes: items.dislikes,
        artistId: items.artistId,
        artistName: items.artistName,
        createdAt: items.createdAt,
      };
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "user songs found succesfully!",
        songs: updatedSongArray,
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
