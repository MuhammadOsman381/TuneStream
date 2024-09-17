import dbConnection from "@/lib/dbConnection";
import SongModel from "@/models/Song";
import path from "path";
import fs from "fs";
import ArtistModel from "@/models/Artist";

export async function GET(request: Request) {
  await dbConnection();
  try {
    const id = request.url.split("gotoProfile/")[1];
    const artist: any = await ArtistModel.findOne({ _id: id });
    console.log(artist)
    
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
