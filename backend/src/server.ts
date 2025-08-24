import express from "express";
import cors from "cors";
import institutionRouter from "./routes/institution.router";
import userRouter from "./routes/user.router";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/institutions", institutionRouter);
app.use("/users", userRouter);

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});