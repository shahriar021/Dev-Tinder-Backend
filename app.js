// const express = require("express");
// const connectDb = require("../devTinder/src/config/database");
// const User = require("../devTinder/src/model/User");

// const app = express();
// app.use(express.json());

// // routing is very very important...................
// // app.get("/yoo/23/:userId", (req, res) => {
// //   console.log(req.params);
// //   res.send("yoo yoo from the 23");
// // });

// // app.use("/admin/getData", authCheck, (req, res) => {
// //   res.status(200).send("get all data...");
// // });

// // app.use("/admin/deleteData", authCheck, (req, res) => {
// //   res.send("deleted data..");
// // });
// const authRouter = require("../devTinder/src/routes/auth.js");

// app.use("/", authRouter);

// app.post("/user", (req, res) => {
//   console.log(req.body);
//   const user = new User(req.body);
//   user.save();
//   res.send("user added.");
// });

// app.use("/specifcuser", async (req, res) => {
//   try {
//     const specificUser = await User.find({ name: "dhruvo   " });
//     res.status(200).send(specificUser);
//   } catch (err) {
//     console.log("relax..");
//   }
// });

// app.use("/", (err, req, res, next) => {
//   if (err) {
//     res.send("something went wrong..");
//   }
// });

// connectDb().then(() => {
//   console.log("database conncted");
//   app.listen(4000, () => {
//     console.log("server is connected...");
//   });
// });

// -------------------------------------------------------------

// const express = require("express");
// const http = require("http"); // ✅ Add this
// const { Server } = require("socket.io"); // ✅ Add this
// const connectDb = require("../devTinder/src/config/database");
// const User = require("../devTinder/src/model/User");
// const Message = require("../devTinder/src/model/Message"); // ✅ We'll create this

// const app = express();
// const server = http.createServer(app); // ✅ Create HTTP server
// const io = new Server(server, {
//   cors: {
//     origin: "*", // or add your frontend domain
//     methods: ["GET", "POST"],
//   },
// });

// app.use(express.json());

// const authRouter = require("../devTinder/src/routes/auth.js");
// app.use("/", authRouter);

// // ✅ Create a new user
// app.post("/user", async (req, res) => {
//   const user = new User(req.body);
//   await user.save();
//   res.send("user added.");
// });

// // ✅ Fetch a specific user
// app.get("/specifcuser", async (req, res) => {
//   try {
//     const specificUser = await User.find({ name: "dhruvo" });
//     res.status(200).send(specificUser);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send("something went wrong.");
//   }
// });

// // ✅ Real-time chat with Socket.IO
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Send previous messages
//   Message.find()
//     .sort({ timestamp: 1 })
//     .limit(50)
//     .then((messages) => {
//       socket.emit("chat_history", messages);
//     });

//   // On message
//   socket.on("send_message", async (data) => {
//     const newMsg = new Message({
//       sender: data.sender,
//       text: data.text,
//     });
//     await newMsg.save();
//     io.emit("receive_message", newMsg);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// connectDb().then(() => {
//   console.log("database connected");
//   server.listen(4000, () => {
//     console.log("server running on port 4000...");
//   });
// });
// --------------------------------------------------------------------------------

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDb = require("../devTinder/src/config/database");
const Message = require("../devTinder/src/model/Message"); // ✅ We'll create this

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for testing
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId}`);

    // Send previous messages
    Message.find()
      .sort({ timestamp: 1 })
      .limit(50)
      .then((messages) => {
        socket.emit("chat_history", messages);
      });
  });

  socket.on("send_message", async ({ roomId, sender, text }) => {
    const message = new Message({
      roomId,
      sender,
      text,
      timestamp: new Date(),
    });

    await message.save(); // ✅ persist it

    io.to(roomId).emit("receive_message", { sender, text });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

connectDb().then(() => {
  console.log("database connected");
  server.listen(4000, () => {
    console.log("server running on port 4000...");
  });
});
