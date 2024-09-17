import dbConnection from "@/lib/dbConnection";
import SongModel from "@/models/Song";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  await dbConnection();

  try {
    const token = request.headers.get("x-access-token");
    const songId: string = request.url.split("likedOrDislikedStatus/")[1];

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No token provided",
        }),
        { status: 401 }
      );
    }

    const decodedToken: any = jwt.decode(token);
    if (!decodedToken?.id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid token",
        }),
        { status: 401 }
      );
    }

    const user = await UserModel.findById(decodedToken.id).lean();
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    const song = await SongModel.findOne({ _id: songId });
    const isLikedStatus = user.likedSongs.some(
      (id: any) => id.toString() === songId
    );
    const isDislikedStatus = user.dislikedSongs.some(
      (id: any) => id.toString() === songId
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: "Status found successfully",
        likedStatus: isLikedStatus,
        dislikedStatus: isDislikedStatus,
        likes: song?.likes.length,
        dislikes: song?.dislikes.length,
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
