import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

// here auth header and cookie are headers set in a http 
// auth header - auth {Bearer_token}  -> primarily used for (stateless)
// cookie header - set-cookie header ->  primarily used for session management (statefull)
// in the FE jwt token is sent manually in headers , but session, cookies can be sent automatically using credential:true in fetch api
// also configure the cors to credentials:true

//using auth headers 
export const verfiyToken = async (req: Request, res: Response, next: NextFunction) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(400).json({ msg: "Auth header does no exists" })
    return
  }
  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded) {
      res.status(400).json({ msg: "Token is invalid. You need to login " })
      return;
    }

    next();
  } catch (error) {
    res.status(400).json({ msg: "Something went wrong" })
  }
}

//using req.cookies.token
// export const verfiyToken = async (req: Request, res: Response, next: NextFunction) => {

//   const token = req.cookies.token;

//   if (!token) {
//     res.status(400).json({ msg: "Auth token does no exists" })
//     return
//   }
//   try {

//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

//     if (!decoded) {
//       res.status(400).json({ msg: "Token is invalid. You need to login " })
//       return;
//     }

//     next();
//   } catch (error) {
//     res.status(400).json({ msg: "Something went wrong" })
//   }
// }
