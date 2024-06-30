const app = require("express")();
const httpServer = require("http").createServer(app);
const cors = require("cors");
app.use(cors());

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", (socket) => {
  socket.on("Join Room", ({ roomId }) => {
    console.log("Joining Room", roomId);
    // const { name, roomId, userId, host, presenter } = data;

    socket.join(roomId);
    socket.to(roomId).emit("User has Joined", {
      success: true,
    });
  });
  // socket.on("Drawing", (prevPoint, currentPoint, ctx, color, roomId) => {
  //   socket.join(roomId);
  //   socket
  //     .to(roomId)
  //     .emit("Someone is Drawing", prevPoint, currentPoint, ctx, color, roomId);
  // });

  socket.on("Drawing", ({ prevPoint, currentPoint, color, roomId }) => {
    // Join the room
    console.log("dsS", roomId);
    socket.join(roomId);

    // Emit event to all clients in the room except the sender
    socket.to(roomId).emit("Someone is Drawing", {
      prevPoint,
      currentPoint,
      color,
      roomId,
    });
  });
  socket.on("clear", (obj) => {
    socket.to(obj.roomId).emit("clear");
  });

  socket.on("client-ready", (obj) => {
    console.log("client-ready");
    socket.to(obj.roomId).emit("get-canvas-state");
  });

  socket.on("canvas-state", (state) => {
    console.log("received canvas state");
    socket.to(state.roomId).emit("canvas-state-from-server", state.img);
  });
  // socket.on("User Joined", (data) => {
  //   console.log("User Joined");
  //   const { name, roomId, userId, host, presenter } = data;
  //   socket.join(roomId);
  //   socket.emit("User has Joined", {
  //     success: true,
  //   });
  // });
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });
httpServer.listen(3000);
