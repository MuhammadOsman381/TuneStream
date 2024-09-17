import dbConnection from "@/lib/dbConnection";
import SongModel from "@/models/Song";
import path from "path";
import fs from "fs";

export async function PUT(request: Request) {
  await dbConnection();
  try {
    const formData = await request.formData();
    const title: string | null = formData.get("title") as string | null;
    const song: File | null | string = formData.get("song") as
      | File
      | null
      | string;
    const thumbnail: File | null | string = formData.get("thumbnail") as
      | File
      | null
      | string;
    const id = request.url.split("edit/")[1];
    const songData: any = await SongModel.findOne({ _id: id });
    let thumbnailName = songData.thumbnail;
    if (thumbnail && typeof thumbnail === "object") {
      const oldThumbnailPath = path.join(
        process.cwd(),
        "public/uploads/thumbnail",
        songData?.thumbnail
      );
      if (fs.existsSync(oldThumbnailPath)) {
        fs.unlinkSync(oldThumbnailPath);
      }
      const thumbnailBuffer = Buffer.from(await thumbnail.arrayBuffer());
      const thumbnailUploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "thumbnail"
      );
      if (!fs.existsSync(thumbnailUploadDir)) {
        fs.mkdirSync(thumbnailUploadDir, { recursive: true });
      }
      thumbnailName = `${Date.now()}-${thumbnail.name}`;
      const thumbnailFilePath = path.join(thumbnailUploadDir, thumbnailName);
      fs.writeFileSync(thumbnailFilePath, thumbnailBuffer);
    }

    let songName = songData.song;
    if (song && typeof song === "object") {
      const oldSongPath = path.join(
        process.cwd(),
        "public/uploads/song",
        songData?.song
      );
      if (fs.existsSync(oldSongPath)) {
        fs.unlinkSync(oldSongPath);
      }
      const songBuffer = Buffer.from(await song.arrayBuffer());
      const songUploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "song"
      );
      if (!fs.existsSync(songUploadDir)) {
        fs.mkdirSync(songUploadDir, { recursive: true });
      }
      songName = `${Date.now()}-${song.name}`;
      const songFilePath = path.join(songUploadDir, songName);
      fs.writeFileSync(songFilePath, songBuffer);
    }

    songData.title = title;
    songData.thumbnail = thumbnailName;
    songData.song = songName;
    await songData.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Song updated successfully!",
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
