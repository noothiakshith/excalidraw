import { io } from "socket.io-client";
const token = localStorage.getItem('token')
export const socket = io(url,{
    extraHeaders:token?{
        Authorization:`Bearer ${token}`
    }:{}
})