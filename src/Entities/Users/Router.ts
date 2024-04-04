import express from "express";
import { data_user, delete_user, list_users, login, modify_user, register } from "./Controller";
import { validateToken } from "../../Middleware/Authorization";
import { AuthenticatedRequest } from "../../Types/Type_Auth";

const router = express.Router()

router.post('/register',async (req,res,next)=>{
    try{
        res.status(201).json(await register(req.body))
    }
    catch(e){
        next(e)
    }
})

router.post('/login',async (req,res,next)=>{
    try{
        res.status(201).json(await login(req.body))
    }
    catch(e){
        next(e)
    }
})

router.put('/modify_user/:id?', validateToken ,async (req:AuthenticatedRequest , res , next)=>{
    try{
        res.status(200).json(await modify_user(req.user! , req.params.id , req.body))
    }
    catch(e){
        next(e)
    }
})

router.put('/delete_user/:id?', validateToken ,async (req:AuthenticatedRequest , res , next)=>{
    try{
        res.status(200).json(await delete_user(req.user! , req.params.id ))
    }
    catch(e){
        next(e)
    }
})

router.get('/data_user/:id?', validateToken ,async (req:AuthenticatedRequest , res , next)=>{
    try{
        res.status(200).json(await data_user(req.user! , req.params.id ))
    }
    catch(e){
        next(e)
    }
})

router.get('/list_users/:page?', validateToken ,async (req:AuthenticatedRequest , res , next)=>{
    try{
        res.status(200).json(await list_users(req.user! , req.params.page ))
    }
    catch(e){
        next(e)
    }
})

export default router