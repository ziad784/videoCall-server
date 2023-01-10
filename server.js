const express = require("express")

const app = express()

const server = require("http").createServer(app)

const io = require("socket.io")(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
})

const cors = require("cors")

app.use(cors())

const PORT = 5001


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