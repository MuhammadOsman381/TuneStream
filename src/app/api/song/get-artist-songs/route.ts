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

export async function GET(request: Request) {
  await dbConnection();
  try {
    const token: any = request.headers.get("x-access-token");
    const decodedToken: any = jwt.decode(token);
    const artist: any = await ArtistModel.findOne({
      _id: decodedToken?.id,
    });
    const songs = await Promise.all(
      artist.songs.map(
        async (songid: string) => await SongModel.findOne({ _id: songid })
      )
    );
    const updatedSongArray: SongArray[] = songs.map((items) => {
      return {
        _id: items._id,
        title: items.title,
        thumbnail: `${process.env.URL}/uploads/thumbnail/${items?.thumbnail}`,
        song: `${process.env.URL}/uploads/song/${items?.song}`,
        comments: items.comments,
        likes: items.likes,
        dislikes: items.dislikes,
        artist: items.artist,
        artistName: items.artistName,
        createdAt:items.createdAt,
      };
    });
    return new Response(
      JSON.stringify({
        success: true,
        message: "artist song found succesfully!",
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
