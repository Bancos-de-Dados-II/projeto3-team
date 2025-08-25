import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.DATABASE_URL as string)
  .then(() => console.log("MongoDB Atlas conectado!"))
  .catch(err => console.error("Erro MongoDB Atlas:", err));