import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import jwt from "jsonwebtoken";
import SongModel from "@/models/Song";
import UserModel from "@/models/User";
import CommentModel from "@/models/Comment";

export async function GET(request: Request) {
  await dbConnection();
  try {
    const songId: any = request.url.split("get/")[1];
    const song: any = await SongModel.findOne({ _id: songId });
    if (song?.comments?.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Comments not found!",
        }),
        { status: 404 }
      );
    }
    const comments = await Promise.all(
      song.comments.map(async (id: string) => {
        let commentObj: any = await CommentModel.findOne({ _id: id });
        let userObj: any = await UserModel.findOne({ _id: commentObj.userId });
        return {
          comment: commentObj,
          user: {
            userData: userObj,
            image: `${process.env.URL}/uploads/image/${userObj.image}`,
          },
        };
      })
    );
    return new Response(
      JSON.stringify({
        success: true,
        message: "Comments found succesfully!",
        comments: comments,
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
