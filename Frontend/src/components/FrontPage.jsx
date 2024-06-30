/* eslint-disable react/prop-types */
import CreateRoom from "./Forms/CreateRoom/CreateRoom";
import JoinRoom from "./Forms/JoinForm/JoinRoom";

export default function FrontPage({ uuid, socket }) {
  return (
    <div className="flex justify-center items-center h-screen space-x-20 w-full">
      <CreateRoom uuid={uuid} socket={socket}></CreateRoom>
      <JoinRoom uuid={uuid} socket={socket}></JoinRoom>
    </div>
  );
}
