const express = require("express")

const app = express()

const server = require("http").createServer(app)

const io = require("socket.io")(server,{
    cors: {
        origin:["http://localhost:3000","https://video-call-react-jet.vercel.app/","https://video-call-react-jet.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true
      }
})

const cors = require("cors")

app.use(cors({
    origin:["http://localhost:3000","https://video-call-react-jet.vercel.app/","https://video-call-react-jet.vercel.app"],
    methods:["POST","GET"],
  
}));

const PORT = process.env.PORT


io.on("connection",(socket)=>{
    socket.emit("me",socket.id)

    socket.on("disconnect",()=>{
        socket.broadcast.emit("callended")
    })

    socket.on("calluser",({userToCall,signalData,from,name})=>{

    
        io.to(userToCall).emit("calluser",{signal:signalData,from,name})

    })

    socket.on("answercall",(data)=>{
        console.log("ANSWERCALL",data.to);
        io.to(data.to).emit("callaccepted",data.signal)
    })

})

app.get("/",(req,res)=>{
    res.send("VIDEO CALL SERVER")
})

server.listen(PORT,()=>{
    console.log("I am listening to",PORT);
})