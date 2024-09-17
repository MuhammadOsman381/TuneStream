import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import SongModel from "@/models/Song";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const formData = await request.formData();
    const title: string | null = formData.get("title") as string | null;
    const song: File | null = formData.get("song") as File | null;
    const thumbnail: File | null = formData.get("thumbnail") as File | null;
    const token: any = request.headers.get("x-access-token");
    const decodedToken: any = jwt.decode(token);

    const artist: any = await ArtistModel.findOne({
      _id: decodedToken?.id,
    });

    let thumbnailName = null;
    if (thumbnail) {
      const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
      const thumbnailUploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "thumbnail"
      );
      thumbnailName = `${Date.now()}-${thumbnail.name}`;
      const thumbnailFilePath = path.join(thumbnailUploadDir, thumbnailName);
      if (!fs.existsSync(thumbnailUploadDir)) {
        fs.mkdirSync(thumbnailUploadDir, { recursive: true });
      }
      fs.writeFileSync(thumbnailFilePath, thumbnailBuffer);
    }

    let songName = null;
    if (song) {
      const songBuffer = Buffer.from(await song.arrayBuffer());
      const songUploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "song"
      );
      songName = `${Date.now()}-${song.name}`;
      const songFilePath = path.join(songUploadDir, songName);
      if (!fs.existsSync(songUploadDir)) {
        fs.mkdirSync(songUploadDir, { recursive: true });
      }
      fs.writeFileSync(songFilePath, songBuffer);
    }

    const newSong = await SongModel.create({
      title: title,
      thumbnail: thumbnailName,
      song: songName,
      artistId: artist._id,
      artistName: artist.name,
    });

    artist.songs.push(newSong._id);
    await artist.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Song uploaded successfully!",
        song: newSong,
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
