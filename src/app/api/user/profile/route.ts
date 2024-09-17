import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";

interface Profile {
  _id: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
  likedSongs: Object[] | null;
  playlist: Object[] | null;
  followedArtist: Object[] | null;
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
    const decodedToken:any = jwt.decode(token) 
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

    const userProfile: Profile = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      image: `${process.env.URL}/uploads/image/${user.image}`,
      likedSongs: user?.likedSongs || [],
      playlist: user?.playlist || [],
      followedArtist: user?.followedArtist || [],
    };


    return new Response(
      JSON.stringify({
        success: true,
        message: "User profile fetched successfully",
        userProfile,
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
