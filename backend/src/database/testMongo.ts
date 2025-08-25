import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function testMongo() {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log("✅ MongoDB Atlas conectado com sucesso!");
    await mongoose.connection.close();
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB Atlas:", err);
  }
}

testMongo();
