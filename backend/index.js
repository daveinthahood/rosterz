const express = require("express");
const http = require("http");
const socket = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors")
//manca il db
const pool = require('./db')

//routes
const userRouter = require("./routes/users")
const teamRouter = require("./routes/teams")
const artistRouter = require("./routes/artists");
const championshipRouter = require("./routes/championships")


//cors options





const app = express();
const server = http.createServer(app);
const {Server} = require("socket.io")
const io = new Server(server, {
    cors: { origin: "*" },
  });



app.use(express.json());
app.use(cors());


// utilizziamo le route
app.use('/api/users', userRouter);
app.use('/api/teams', teamRouter);
app.use('/api/championships', championshipRouter);

app.use((req, res, next) => {
    req.io = io;
    next();
  });


//Gestione di socket.io

app.use((req, res, next) => {
    req.io = io;
    next();
  });



io.on('connection', (socket) => {
    console.log('Users Connected');

    // utente partecipa la campionato
    socket.on('joinChampionship', (championshipId) => {
        console.log(`User joined championship ${championshipId}`);
        socket.join(`championship_${championshipId}`)
    })

    // utente lascia campionato
    socket.on('leaveChampionship', (championshipId) => {
        console.log(`User left championship ${championshipId}`);
        socket.leave(`championship_${championshipId}`)
    })

    // update score
    //socket.on()
    socket.on('championshipUpdated', (data) => {
        // Broadcast to all clients
        io.emit('championshipUpdated', data);
      });

    socket.on('discconect', () => {
        console.log("User discconnected");
    });
});


//AVvio server

const PORT = 3000 ;
console.log(PORT);
server.listen(PORT, () => {
    console.log("Server Avviato");
})
