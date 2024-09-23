import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import SongModel from "@/models/Song";
import UserModel from "@/models/User";
import CommentModel from "@/models/Comment";

export async function DELETE(request: Request) {
    await dbConnection();
    try {
        const commentId = request.url.split("delete/")[1];
        const comment = await CommentModel.findOne({ _id: commentId });
        if (!comment) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Comment not found!",
                }),
                { status: 404 }
            );
        }
        const { userId, songId } = comment;
        await CommentModel.deleteOne({ _id: commentId });
        await UserModel.updateOne(
            { _id: userId },
            { $pull: { comments: commentId } }
        );
        await SongModel.updateOne(
            { _id: songId },
            { $pull: { comments: commentId } }
        );
        return new Response(
            JSON.stringify({
                success: true,
                message: "Comment deleted successfully!",
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
