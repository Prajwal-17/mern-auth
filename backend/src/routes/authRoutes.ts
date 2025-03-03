import express from "express"
import { addUser, userLogin } from "../controllers/authControllers";

const router = express.Router();

router.post("/login", userLogin)

router.post("/register", addUser)

export { router as authRoutes }