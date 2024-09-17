import dbConnection from "@/lib/dbConnection";
import SongModel from "@/models/Song";
import ArtistModel from "@/models/Artist";


interface ArtistData {
  id: string;
  name: string;
  email: string;
  image: string;
  songs: number,
  followers: number,
}

interface ArtistProfileDetails {
  artistProfile: ArtistData | null | undefined;
  artistSong: any[];
}

export async function GET(request: Request) {
  await dbConnection();
  try {
    const id = request.url.split("gotoProfile/")[1];

    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Artist ID not provided",
        }),
        { status: 400 }
      );
    }
    const artist = await ArtistModel.findOne({ _id: id });
    if (!artist) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Artist not found",
        }),
        { status: 404 }
      );
    }
    const artistData: ArtistData = {
      id: artist?._id.toString(),
      name: artist?.name,
      email: artist?.email,
      image: `${process.env.URL}/uploads/image/${artist?.image}`,
      songs: artist.songs.length,
      followers: artist.followers.length,

    };
    const artistProfileDetails: ArtistProfileDetails = {
      artistProfile: artistData,
      artistSong: [],
    };
    artistProfileDetails.artistSong = await Promise.all(
      artist.songs.map(async (id) => {
        let song: any = await SongModel.findOne({ _id: id })
        return ({
          _id: song._id,
          title: song.title,
          thumbnail: `${process.env.URL}/uploads/thumbnail/${song.thumbnail}`,
          song: `${process.env.URL}/uploads/song/${song.song}`,
          likes: song.likes,
          dislikes: song.dislikes,
          artistId: song.artistId,
          artistName: song.artistName,
          createdAt:song.createdAt,
        })
      })
    )
    return new Response(
      JSON.stringify({
        success: true,
        message: "Artist profile fetched successfully!",
        artistProfile: artistProfileDetails,
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
