require("dotenv").config();
const express = require("express")
const app = express();
const cors = require("cors");
const connection = require("./db/db.js");
const userRoute = require("./routes/userRoute.js");
const avatarRoute = require("./routes/avatarRoute.js");
const cookieParser = require("cookie-parser");
const createWebSocketServer = require("./wsServer.js");
const path = require("path");

connection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//middlewares
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    "https://swift-chat-app-xiit.vercel.app",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204,
    credentials: true, // Allow credentials like cookies
};

app.use(cors(corsOptions));

app.use("/api/user", userRoute);
app.use("/api/avatar", avatarRoute);

const port = process.env.PORT || 8000;

const server = app.listen(port , () => {
  console.log(`Server is listening to port ${port}`);
})

createWebSocketServer(server);
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

app.use((req, res, next) => {
    if (req.method !== "GET") {
        return next();
    }

    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"), (err) => {
        if (err) {
            console.error("Error sending file:", err);
            next(err);
        }
    });
});

