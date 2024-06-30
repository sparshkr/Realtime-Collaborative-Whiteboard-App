/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useDraw } from "./useDraw";
import { ChromePicker } from "react-color";
import { useParams } from "react-router-dom";

const RoomPage = ({ socket }) => {
  const { roomId } = useParams();
  const [color, setColor] = useState("#000");
  const { canvasRef, onMouseDown, clear } = useDraw(drawLine);
  const colorRef = useRef(color); // Use a ref to keep track of the current color

  useEffect(() => {
    colorRef.current = color; // Update the ref whenever the color changes
  }, [color]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    socket.emit("Join Room", { roomId });
    socket.emit("client-ready", { roomId });

    const getCanvasStateListener = () => {
      if (!canvasRef.current) return;
      socket.emit("canvas-state", {
        img: canvasRef.current.toDataURL(),
        roomId: roomId,
      });
    };

    const canvasStateFromServerListener = (state) => {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
      };
    };

    const handleDrawingEvent = ({ prevPoint, currentPoint, color }) => {
      const ctx = canvasRef.current.getContext("2d");
      drawLine({ prevPoint, currentPoint, ctx, color });
    };

    socket.on("get-canvas-state", getCanvasStateListener);
    socket.on("canvas-state-from-server", canvasStateFromServerListener);
    socket.on("Someone is Drawing", handleDrawingEvent);
    socket.on("clear", clear);

    return () => {
      socket.off("get-canvas-state", getCanvasStateListener);
      socket.off("canvas-state-from-server", canvasStateFromServerListener);
      socket.off("Someone is Drawing", handleDrawingEvent);
      socket.off("clear", clear);
    };
  }, [canvasRef, socket, roomId, clear]);

  function drawLine({ prevPoint, currentPoint, ctx, color }) {
    socket.emit("Drawing", {
      prevPoint,
      currentPoint,
      color: colorRef.current, // Use the color from the ref
      roomId: roomId,
    });

    const { x: currX, y: currY } = currentPoint;
    const lineColor = color || colorRef.current; // Fallback to the ref color
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = lineColor;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  return (
    <>
      <p className="text-center font-bold mb-0 pb-0">Drawing Board</p>
      <div className="w-screen h-screen bg-white flex justify-center items-center">
        <div className="flex flex-col gap-10 pr-10">
          <ChromePicker
            color={color}
            onChange={(e) => {
              setColor(e.hex);
            }}
          />
          <button
            type="button"
            className="p-2 rounded-md border border-black"
            onClick={() => {
              clear();
              socket.emit("clear", { roomId });
            }}
          >
            Clear canvas
          </button>
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={(e) => onMouseDown(e, colorRef.current)} // Pass the color ref current value
          width={750}
          height={400}
          className="border border-black rounded-md"
        />
      </div>
    </>
  );
};

export default RoomPage;
