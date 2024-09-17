import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/User";
import ArtistModel from "@/models/Artist";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import SongModel from "@/models/Song";

export async function DELETE(request: Request) {
  await dbConnection();
  try {
    const token: any = request.headers.get("x-access-token");
    const decodedToken: any = jwt.decode(token);
    const artist: any = await ArtistModel.findById(decodedToken.id);
    const song: any = await SongModel.findOne({
      _id: request.url.split("delete/")[1],
    });
    artist.songs = artist?.songs.filter(
      (songId: string) => songId.toString() !== song?._id.toString()
    );
    await artist?.save();
    const songFilePath = path.join(
      process.cwd(),
      "public/uploads/song",
      song?.song
    );
    const thumbnailFilePath = path.join(
      process.cwd(),
      "public/uploads/thumbnail",
      song?.thumbnail
    );

    if (fs.existsSync(songFilePath)) {
      fs.unlinkSync(songFilePath);
    }
    if (fs.existsSync(thumbnailFilePath)) {
      fs.unlinkSync(thumbnailFilePath);
    }
    await song.deleteOne();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Song deleted successfully!",
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
