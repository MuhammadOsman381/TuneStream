import dbConnection from "@/lib/dbConnection";
import UserModel from "@/models/User";
import ArtistModel from "@/models/Artist";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await dbConnection();

  try {
    const formData = await request.formData();
    const email: string | null = formData.get("email") as string | null;
    const password: string | null = formData.get("password") as string | null;

    if (!email || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Email and password are required",
        }),
        { status: 400 }
      );
    }

    // Check if the user exists in the UserModel or ArtistModel
    let user = await UserModel.findOne({ email });
    let userType = "user"; // default to user

    if (!user) {
      user = await ArtistModel.findOne({ email });
      if (user) {
        userType = "artist";
      }
    }

    // If user or artist is not found
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        { status: 404 }
      );
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid password",
        }),
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, userType },
      process.env.JWT_SECRET || "yourSecretKey",
      {
        expiresIn: "1h", // Token expires in 1 hour
      }
    );

    // Send user data and token in response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          userType,
        },
        token,
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
