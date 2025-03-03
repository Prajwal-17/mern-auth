import { Request, Response } from "express";
import { prisma } from "../db/db";

export async function getAllTodos(req: Request, res: Response) {

  const userId = req.params.userId;
  try {

    console.log("req.cookies", req)

    if (!userId) {
      res.status(400).json({ msg: "User id does not exist" })
      return
    }
    const todos = await prisma.todo.findMany();

    if (!todos) {
      res.status(400).json({ msg: "Todos does not exist" })
      return
    }

    res.status(400).json({ msg: "Fetched Todos", todos: todos })
  } catch (error) {
    res.status(400).json({ msg: "Something went wrong" })
  }
}

export async function addTodo(req: Request, res: Response) {

  const userId = req.params.userId;
  const body = req.body;
  try {

    if (!body.todo || !userId) {
      res.status(400).json({ msg: "User id ,Todos does not exist" })
      return;
    }

    const todo = await prisma.todo.create({
      data: {
        todo: body.todo,
        userId: userId,
      }
    })

    if (!todo) {
      res.status(400).json({ msg: "Could not register user" })
    }

    res.status(200).json({ msg: "Todo added successfully", todo: todo })
  } catch (error) {
    console.log(error)
    res.status(400).json({ msg: "Something went wrong" })
  }
}
