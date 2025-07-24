
import express, { json } from "express";
import cors from "cors";
import dotenv from 'dotenv'
import authroutes from './routes/useroutes.js'
import cookieParser from "cookie-parser";
import canvasroutes from './routes/canvasroutes.js'
dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use('/auth',authroutes);
app.use('/api',canvasroutes)
app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
