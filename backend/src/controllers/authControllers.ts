import { Request, Response } from "express";
import { prisma } from "../db/db";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"

export async function userLogin(req: Request, res: Response) {

  const body = req.body;
  try {
    if (!body.email || !body.password) {
      res.status(400).json({ msg: "Email or password does not exist" });
      return
    }

    const user = await prisma.user.findFirst({
      where: {
        email: body.email
      }
    })

    const isPassword = await bcryptjs.compare(body.password, user?.password as string)

    if (!isPassword) {
      res.status(400).json({ msg: "Password is incorrect" })
    }

    //create a jwt token and send to browser
    const token = jwt.sign({
      username: user?.name,
      email: user?.email,
    },
      process.env.JWT_SECRET as string,
      {
        expiresIn: 15 * 60 * 1000 // jwt expirations time 
      }
    );

    if (!token) {
      res.status(400).json({ msg: "Could not authenticate" })
      return
    }

    res.cookie("token", token, {
      // httpOnly: true, //prevents xss attacks, js access but when disable use auth headers
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, //set the maxage in the browser
      path: "/"
    })

    res.status(200).json({ msg: "Log in successfull", token: token })
  } catch (error) {
    console.log(error)
    res.status(400).json({ msg: "Something went wrong" })
  }
}

export async function addUser(req: Request, res: Response) {
  const body = req.body;
  try {

    if (!body.name || !body.password || !body.email) {
      res.status(400).json({ msg: "Username or password or email does not exist" })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: body.email,
      }
    });

    if (existingUser) {
      res.status(400).json({ msg: "User with this email already exists" })
    }

    const hashedPassword = await bcryptjs.hash(body.password, 10)

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      }
    });

    if (!user) {
      res.status(400).json({ msg: "Could not register user" })
    }

    res.status(200).json({ msg: "User registered Successfully" })
  } catch (error) {
    res.status(400).json({ msg: "Something went wrong" })
  }
}
