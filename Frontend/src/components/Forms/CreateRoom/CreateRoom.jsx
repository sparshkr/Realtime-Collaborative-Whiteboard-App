/* eslint-disable react/prop-types */
import { Clipboard } from "flowbite-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRoom({ uuid, socket }) {
  const navigate = useNavigate();
  const [roomid, setRoomId] = useState(uuid());
  const [, setName] = useState("");

  const handleGenerate = (e) => {
    e.preventDefault();
    setRoomId(uuid());
  };

  const handleCreateRoom = (e) => {
    e.preventDefault();
    let obj = {
      roomId: roomid,
    };
    console.log(obj);
    socket.emit("Join Room", obj);
    navigate(`/${roomid}`);
  };

  useEffect(() => {
    console.log(roomid, "sdf");
  }, [roomid]);

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-20 py-8 mx-auto md:h-screen lg:py-0">
        {/* Create Room */}

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create Room
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your name
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name"
                  required=""
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid w-full max-w-64">
                <div className="relative">
                  <label htmlFor="npm-install" className="sr-only">
                    Label
                  </label>
                  <input
                    type="text"
                    id="npm-install"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pr-10 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    // placeholder="code"
                    disabled
                    value={roomid}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
                    <Clipboard.WithIcon valueToCopy={roomid} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-black bg-cyan-500"
                // onClick={setroomid(uuid())}
                onClick={handleGenerate}
              >
                Generate
              </button>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 text-black bg-cyan-500"
                onClick={handleCreateRoom}
              >
                Create Room
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
