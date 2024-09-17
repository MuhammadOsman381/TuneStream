import dbConnection from "@/lib/dbConnection";
import ArtistModel from "@/models/Artist";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import SongModel from "@/models/Song";

export async function POST(request: Request) {
    await dbConnection();
    try {
        const formData = await request.formData();
        const title: string | null = formData.get("title") as string | null;
        const token: any = request.headers.get("x-access-token");
        const decodedToken: any = jwt.decode(token);
        
        console.log(title)

        return new Response(
            JSON.stringify({
                success: true,
                message: "working fine!",
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
