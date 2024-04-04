import { Request, Response, NextFunction } from "express";
import { UserModel } from "../Entities/Users/Modelo";

export interface AuthenticatedRequest extends Request {
    user?: UserModel;
  }

  export interface DataToken extends UserModel {
    user?: UserModel;
  }