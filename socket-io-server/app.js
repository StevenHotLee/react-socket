const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", socket => {
    console.log("New client connected"), setInterval(
        () => getApiAndEmit(socket),
        10000
    );
    socket.on("disconnect",() => console.log("Client disconnected"));
});

const getApiAndEmit = async socket => {
    try {
        const res = await axios.get(
            "https://api.darksky.net/forecast/5b3999fd954906c9dd49976def3c2ccb/37.8267,-122.4233" 
        );
        console.log('axios.get : res.data.currently ->',res.data.currently);
        socket.emit("FromAPI", res.data.currently.temperature);

    }catch(error){
        console.error(`Error: ${error}`);
    }
}



server.listen(port, () => console.log(`Listening on port ${port}`));