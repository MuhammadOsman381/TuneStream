import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import jwt from "jsonwebtoken";
import SongModel from "@/models/Song";
import UserModel from "@/models/User";
import CommentModel from "@/models/Comment";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const formData = await request.formData();
    const comment: string | null = formData.get("comment") as string | null;
    const songId: string | null = formData.get("songId") as string | null;
    const token: any = request.headers.get("x-access-token");
    const decodedToken: any = jwt.decode(token);
    if (!comment) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please enter the comment!",
        }),
        { status: 404 }
      );
    }
    const userData: any = await UserModel.findOne({
      _id: decodedToken?.id,
    });
    const song: any = await SongModel.findOne({
      _id: songId,
    });
    const newComment: any = await CommentModel.create({
      content: comment,
      userId: userData._id,
      songId: songId,
    });
    song.comments.push(newComment._id);
    await song.save();
    userData.comments.push(newComment._id);
    await userData.save();

    let commentObj = {
      comment: newComment,
      user: { userData, image: `${process.env.URL}/uploads/image/${userData?.image}`},
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "comment added succesfully!",
        commentObj: commentObj
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
