import express from "express";
import dotenv from "dotenv"
import { authRoutes } from "./routes/authRoutes";
import { todoRoutes } from "./routes/todoRoutes";
import { verfiyToken } from "./middleware/cookieVerify";
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config();
const app = express();
app.use(cookieParser())
app.use(express.json())

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/", (req, res, next) => {
  console.log(req.method, req.originalUrl);
  console.log("cookies", req.cookies.token)
  next();
})

app.use("/auth", authRoutes)

app.use("/todos", verfiyToken, todoRoutes)

app.get("/", (req, res) => {
  res.json("done")
})

app.listen(3000, () => {
  console.log("Listening to port 3000")
})