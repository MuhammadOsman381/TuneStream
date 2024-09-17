import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
  if (connection.isConnected) {
    console.log("connection already exist");
    return;
  }

  try {
    const db = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}` || "",
      {}
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("database connected succesfully!");
  } catch (error) {
    console.log("database connection failed:", error);
    process.exit();
  }
}

export default dbConnection;
