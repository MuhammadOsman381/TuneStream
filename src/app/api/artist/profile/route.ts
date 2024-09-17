import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import jwt from "jsonwebtoken";

interface Profile {
  _id: string;
  name: string;
  email: string;
  image: string;
  songs: string[];
  followers: string[];
}

export async function GET(request: Request) {
  await dbConnection();
  try {
    const token: any = request.headers.get("x-access-token");
    const decodedToken: any = jwt.decode(token);
    const artist: any = await ArtistModel.findOne({
      _id: decodedToken?.id,
    });
    const newObject: Profile = {
      _id: artist._id,
      name: artist.name,
      email: artist.email,
      image: `${process.env.URL}/uploads/image/${artist.image}`,
      songs: artist.songs,
      followers: artist.followers,
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: "working fine!",
        artistProfile: newObject,
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
