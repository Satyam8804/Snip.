import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import userRouter from "./routes/auth.routes.js";
import urlRouter from "./routes/url.route.js";
import redirectRouter from "./routes/redirect.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.set("trust proxy", 1);

await connectDB();

const PORT = process.env.PORT || 5000;

// routes 
app.use("/api/auth", userRouter);
app.use("/api", urlRouter);
app.use("", redirectRouter);


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});