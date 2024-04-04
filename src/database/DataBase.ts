import mongoose,{ConnectOptions} from "mongoose";
import CONFIDENCE from "../config/config_conexion";


export const conexionBBD = mongoose.connect(`${CONFIDENCE.URLDB}`,{
    } as ConnectOptions)
.then(()=>console.log('BBD ok'))
.catch((e)=>console.log('error BBD!' + e))
export default conexionBBD