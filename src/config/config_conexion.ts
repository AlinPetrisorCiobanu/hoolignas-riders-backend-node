import dotenv from "dotenv"
dotenv.config()
const CONFIDENCE  = {
    URLDB: process.env.DDBB_URL,
    USERDB: process.env.DDBB_USER,
    PASSWORDDB: process.env.DDBB_PASSWORD,
    LOOPDB: Number(process.env.BCRYTP_LOOP),
    SECRETDB: String( process.env.JWT_SECRET),
    PORTDB: Number(process.env.JWT_PORT),
  };
  export default CONFIDENCE;