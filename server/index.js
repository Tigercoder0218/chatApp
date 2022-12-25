const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { createServer } = require("http");
const app = express();

const server = createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const routes = require('./routes/routes');
const chatRoutes = require('./routes/chatRoutes');

require('dotenv').config();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Headers']
}));

app.use('/api/', routes);
app.use('/api/chat', chatRoutes);

mongoose.set("strictQuery", false);
// mongoose.connect(process.env.MONGO_LOCAL_URL, {
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

//Chat Socket.IO Config
global.onlineUsers = new Map();
io.on('connection', (socket) => {
    console.log('New user connected');
    global.chatSocket = socket;
    socket.on("addUser", (userId) => {
        global.onlineUsers.set(userId, socket.id);
    });

    socket.on("sendMessage", ({ from, to, text }) => {
        const receiverSocketId = global.onlineUsers.get(to);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("getMessage", {
                from,
                text,
            });
        }
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});