// import express from "express";
// import cors from "cors";
// import institutionRouter from "./routes/institution.router";
// import userRouter from "./routes/user.router";

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.use("/institutions", institutionRouter);
// app.use("/users", userRouter);

// const PORT = 3000;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT} 🚀`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import institutionRouter from "./routes/institution.router";
import userRouter from "./routes/user.router";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/institutions", institutionRouter);
app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Conectar ao MongoDB Atlas antes de iniciar o servidor
    await mongoose.connect(process.env.DATABASE_URL as string, {
      serverSelectionTimeoutMS: 30000, // aumenta timeout se necessário
    });
    console.log("✅ MongoDB Atlas conectado com sucesso!");

    // Iniciar o servidor somente após a conexão
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 🚀`);
    });
  } catch (err) {
    console.error("❌ Erro ao conectar ao MongoDB Atlas:", err);
  }
}

startServer();
