import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import UserModel from "@/models/User";
import jwt from "jsonwebtoken";



export async function GET(request: Request) {
  await dbConnection();
  try {
    const token = request.headers.get("x-access-token");
    let isFollowed: Boolean = false;
    const artistID = request.url.split("follow-artist/")[1];
    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No token provided",
        }),
        { status: 401 }
      );
    }
    const decodedToken: any = jwt.decode(token)
    const user = await UserModel.findById(decodedToken?.id);
    const artist = await ArtistModel.findOne({ _id: artistID });

    if (!user || !artist) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "user and artist not found",
        }),
        { status: 404 }
      );
    }
    if (user.followedArtist.includes(artist?._id) || artist.followers.includes(user?._id)) {
      user.followedArtist = user.followedArtist.filter((id) => id.toString() !== artist._id.toString())
      user.save()
      artist.followers = artist.followers.filter((id) => id.toString() !== user._id.toString())
      artist.save()
    }
    else {
      user.followedArtist.push(artist?._id)
      user.save()
      artist.followers.push(user?._id)
      artist.save()
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "User profile fetched successfully",
        followStatus: isFollowed,
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
