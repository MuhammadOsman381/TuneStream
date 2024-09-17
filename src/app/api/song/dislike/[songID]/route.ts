import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/User";
import SongModel from "@/models/Song";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string | null;
  userType: string | null;
  iat: string | null;
  exp: string | null;
}

export async function GET(request: Request) {
  await dbConnection();
  try {
    const songId: string = request.url.split("like/")[1];
    const token: string | null = request.headers.get("x-access-token");
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Token not provided" }),
        { status: 400 }
      );
    }
    const decodedToken = jwt.decode(token) as DecodedToken | null;
    if (!decodedToken || !decodedToken.id) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token" }),
        { status: 401 }
      );
    }
    const user: any = await UserModel.findById(decodedToken.id);
    const song: any = await SongModel.findById(songId);

    if (!user || !song) {
      return new Response(
        JSON.stringify({ success: false, message: "User or song not found" }),
        { status: 404 }
      );
    }
    if (user.likedSongs.includes(song._id)) {
      user.likedSongs = user.likedSongs.filter(
        (id: string) => id.toString() !== song._id.toString()
      );
      song.likes = song.likes.filter(
        (id: string) => id.toString() !== user._id.toString()
      );
      user.dislikedSongs.push(song._id);
      song.dislikes.push(user._id);
    } else if (user.dislikedSongs.includes(song._id)) {
      user.dislikedSongs = user.dislikedSongs.filter(
        (id: string) => id.toString() !== song._id.toString()
      );
      song.dislikes = song.dislikes.filter(
        (id: string) => id?.toString() !== user?._id?.toString()
      );
    } else {
      user.dislikedSongs.push(song._id);
      song.dislikes.push(user._id);
    }
    await user.save();
    await song.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Operation successful",
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
