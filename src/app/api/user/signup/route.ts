import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/User";
import ArtistModel from "@/models/Artist";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnection();

  try {
    const formData = await request.formData();
    const name: string | null = formData.get("name") as string | null;
    const email: string | null = formData.get("email") as string | null;
    const password: string | null = formData.get("password") as string | null;
    const image: File | null = formData.get("image") as File | null;
    const usertype: string | null = formData.get("usertype") as string | null;

    // Check if user or artist with the given email already exists
    const isUserExist = await UserModel.findOne({ email });
    const isArtistExist = await ArtistModel.findOne({ email });

    if (isArtistExist || isUserExist) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "This email is already taken!",
        }),
        { status: 409 }
      );
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password!, saltRounds);

    let imageName = null;
    if (image) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const imageUploadDir = path.join(
        process.cwd(),
        "public",
        "uploads",
        "image"
      );
      imageName = `${Date.now()}-${image.name}`;
      const imageFilePath = path.join(imageUploadDir, imageName);

      if (!fs.existsSync(imageUploadDir)) {
        fs.mkdirSync(imageUploadDir, { recursive: true });
      }

      fs.writeFileSync(imageFilePath, imageBuffer);
    }

    if (usertype === "artist") {
      const newArtist = await ArtistModel.create({
        name: name,
        email: email,
        password: hashedPassword,
        image: imageName,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "Artist signed up successfully!",
          user: newArtist,
        }),
        { status: 201 }
      );
    } else if (usertype === "user") {
      const newUser = await UserModel.create({
        name: name,
        email: email,
        password: hashedPassword,
        image: imageName,
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "User signed up successfully!",
          user: newUser,
        }),
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error registering user",
      }),
      { status: 500 }
    );
  }
}
