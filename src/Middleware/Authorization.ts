import jwt from "jsonwebtoken";
import CONFIDENCE from "../config/config_conexion";
import { Response, NextFunction } from "express";
import { UserModel } from "../Entities/Users/Modelo";
import { AuthenticatedRequest } from "../Types/Type_Auth";

const validateToken = (req:AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      console.log(token);
      return res.status(401).json({ msg: 'NO AUTORIZADO' });
    }

    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ msg: 'Formato de token inválido' });
    }

    const t = tokenParts[1];
    req.user = jwt.verify(t, CONFIDENCE.SECRETDB) as UserModel;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: "Token inválido" });
    }
    next(error);
  }
  return ""
};

export { validateToken };