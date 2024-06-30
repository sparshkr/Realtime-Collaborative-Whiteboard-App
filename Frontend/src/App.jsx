import { BrowserRouter, Route, Routes } from "react-router-dom";
import FrontPage from "./components/FrontPage";
import RoomPage from "./components/WhiteBoard/RoomPage";
// import io from "socket.io-client";
import { io } from "socket.io-client";
import { useEffect } from "react";

const server = "http://localhost:3000/";

const socket = io(server);

export default function App() {
  useEffect(() => {
    socket.on("User has Joined", (data) => {
      if (data.success) {
        console.log("user joined");
      } else {
        console.log("error");
      }
    });
  }, []);
  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<FrontPage uuid={uuid} socket={socket}></FrontPage>}
        ></Route>
        <Route
          path="/:roomId"
          element={<RoomPage socket={socket}></RoomPage>}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}
