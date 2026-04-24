const ws = require("ws");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Message = require("./models/messageModel");
const { User } = require("./models/userModel");

const createWebSocketServer = (server) => {
  const wss = new ws.WebSocketServer({ server });

  wss.on("connection", (connection, req) => {
    const notifyAboutOnlinePeople = async () => {
      const onlineUsers = await Promise.all(
        Array.from(wss.clients).map(async (client) => {
          const { userId, username } = client;

          if (!userId) {
            return null;
          }

          const user = await User.findById(userId);
          return {
            userId,
            username,
            avatarLink: user ? user.avatarLink : null,
          };
        })
      );

      const uniqueOnlineUsers = Array.from(
        new Map(
          onlineUsers
            .filter(Boolean)
            .map((user) => [String(user.userId), user])
        ).values()
      );

      [...wss.clients].forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(
            JSON.stringify({
              online: uniqueOnlineUsers,
            })
          );
        }
      });
    };

    connection.isAlive = true;

    connection.timer = setInterval(() => {
      connection.ping();
      connection.deathTimer = setTimeout(() => {
        connection.isAlive = false;
        clearInterval(connection.timer);
        connection.terminate();
        notifyAboutOnlinePeople();
        console.log("dead");
      }, 5000);
    }, 5000);

    connection.on("pong", () => {
      clearTimeout(connection.deathTimer);
    });

    connection.on("close", () => {
      clearInterval(connection.timer);
      clearTimeout(connection.deathTimer);
      notifyAboutOnlinePeople();
    });

    const cookies = req.headers.cookie;

    if (cookies) {
      const tokenString = cookies
        .split(";")
        .map((str) => str.trim())
        .find((str) => str.startsWith("authToken="));

      if (tokenString) {
        const token = tokenString.split("=")[1];
        jwt.verify(token, process.env.JWTPRIVATEKEY, {}, (err, userData) => {
          if (err || !userData) {
            console.log(err);
            return;
          }

          const { _id, firstName, lastName } = userData;
          connection.userId = String(_id);
          connection.username = `${firstName} ${lastName}`;
          notifyAboutOnlinePeople();
        });
      }
    }

    notifyAboutOnlinePeople();

    connection.on("message", async (message) => {
      const messageData = JSON.parse(message.toString());
      const { recipient, text } = messageData;

      if (
        !connection.userId ||
        !mongoose.Types.ObjectId.isValid(recipient) ||
        typeof text !== "string" ||
        !text.trim()
      ) {
        return;
      }

      const msgDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text: text.trim(),
      });

      if (recipient && text.trim()) {
        [...wss.clients].forEach((client) => {
          if (client.userId === recipient) {
            client.send(
              JSON.stringify({
                sender: connection.username,
                text: text.trim(),
                id: msgDoc._id,
              })
            );
          }
        });
      }
    });
  });
};

module.exports = createWebSocketServer;
