const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer();
const io = socketIo(server);

module.exports = io;
