import dbConnection from "@/lib/dbConnection";
import PlayListModel from "@/models/Playlist";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export async function DELETE(request: Request) {
    await dbConnection();
    try {
        const playListID = request.url.split("delete/")[1];
        if (!mongoose.Types.ObjectId.isValid(playListID)) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Invalid playlist ID.",
                }),
                { status: 400 }
            );
        }
        const playList: any = await PlayListModel.findOne({ _id: playListID });
        if (!playList) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Playlist not found.",
                }),
                { status: 404 }
            );
        }
        const user: any = await UserModel.findOne({ _id: playList.user });
        if (!user) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "User not found.",
                }),
                { status: 404 }
            );
        }
        user.playlist = user.playlist.filter((playlist: mongoose.Types.ObjectId) =>
            !playlist.equals(playList._id)
        );
        await user.save();
        await playList.deleteOne();

        return new Response(
            JSON.stringify({
                success: true,
                message: "Playlist removed successfully!",
                playList: playList,
            }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(
            JSON.stringify({
                success: false,
                message: "Internal Server Error.",
            }),
            { status: 500 }
        );
    }
}
