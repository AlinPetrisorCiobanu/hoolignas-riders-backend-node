import express from "express";
import CONFIDENCE from "./src/config/config_conexion";
import conexionBBD from "./src/database/DataBase";
import cors from "cors";
import router_user from "./src/Entities/Users/Router";
import router_event from "./src/Entities/Events/Router";
import errorHandler from "./src/Middleware/Middleware";


//initalization
const app = express();
app.listen(CONFIDENCE.PORTDB,()=>{
    console.log("Servidor OK")
})

app.get('/', (_req, res) => {
    res.status(200).json({ status: 'OK' });
  });

//middlewares
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(cors())
app.use('/api/user',router_user)
app.use('/api/event',router_event)

//instancio la base de datos
conexionBBD;

//errores://
app.use(errorHandler)

export default app