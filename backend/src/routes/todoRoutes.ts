import express from "express"
import { addTodo, getAllTodos } from "../controllers/todoControllers";

const router = express.Router();

router.get("/:userId", getAllTodos)

router.post("/:userId", addTodo)

export { router as todoRoutes }