
import express, { json } from "express";
import cors from "cors";
import dotenv from 'dotenv'
import authroutes from './routes/useroutes.js'
import canvasroutes from './routes/canvasroutes.js'
import {createServer} from 'http'
import {Server} from 'socket.io'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import verifyToken from "./middlewares/authmiddleware.js";
dotenv.config()
const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use('/auth',authroutes);
app.use('/api',canvasroutes);
const httpserver = createServer();
const io = new Server(httpserver,{
  cors:{
    origin:"*"
  }
})
const canvasdata = []
io.on('connection',(socket)=>{
  socket.on('joincanvas',verifyToken,async ({canvasid})=>{
    console.log(canvasid);
    const canvas = await prisma.canvas.findUnique({
      where:{
        id:canvasid
      }
    })
    console.log(canvas)
    socket.join(canvasid);
    console.log(socket.rooms)
    if(canvasdata[canvasid]){
      socket.emit('canvasdata',canvasdata[canvasid])
    }
    else{
      socket.emit('canvasdata',canvas.elements)
    }

  })
  socket.on('drawingupdate',verifyToken,async({canvasid,elements})=>{
    try{
      canvasdata[canvasid] = elements;
      socket.to(canvasid).emit('recieveupdate',elements);
      await prisma.canvas.update({
        where:{
          id:canvasid
        },
        data:{
          elements:elements
        }
      })
    }
    catch(err){
      console.log(err)
    }

    socket.on('disconnect',()=>{
      console.log('user disconnected')
    })
  })
})
app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);

