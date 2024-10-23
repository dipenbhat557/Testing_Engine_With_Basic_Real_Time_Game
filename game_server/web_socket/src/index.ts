import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from 'crypto'

const app = express();
const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const wss = new WebSocketServer({ server });

const rooms: Rooms = {};
const roomWebSocketMap: Map<string, Set<WebSocket>> = new Map(); 

const sendMessage = (ws: WebSocket, event: string, data: any) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ event, data }));
  }
};

wss.on("connection", (ws: WebSocket) => {
  let currentUserId: string | null = null;
  let currentRoomId: string | null = null;

  ws.on("message", (message: string) => {
    try {
      const { event, data } = JSON.parse(message);

      switch (event) {
        case "join":
          handleJoinRoom(ws, data.roomId);
          break;

        case "position":
          handlePositionUpdate(ws, data.x, data.y);
          break;

        default:
          console.log("Unknown event received:", event);
          break;
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  const handleJoinRoom = (ws: WebSocket, roomId: string) => {
    if (!currentUserId) {
      currentUserId = randomUUID(); 
    }

    currentRoomId = roomId;

    if (!rooms[roomId]) {
      rooms[roomId] = {};
    }

    const spawnPosition: Position = { x: 0, y: 0 };
    rooms[roomId][currentUserId] = { userId: currentUserId, position: spawnPosition };

    if (!roomWebSocketMap.has(roomId)) {
      roomWebSocketMap.set(roomId, new Set());
    }
    roomWebSocketMap.get(roomId)?.add(ws);

    sendMessage(ws, "ack", { x: spawnPosition.x, y: spawnPosition.y });
  };

  const handlePositionUpdate = (ws: WebSocket, x: number, y: number) => {
    if (!currentUserId || !currentRoomId) {
      return;
    }

    const room = rooms[currentRoomId];

    const isValidPosition =
      x >= 0 && y >= 0 && x <= 100 && y <= 100 && !isPositionOccupied(currentRoomId, x, y, currentUserId);

    if (isValidPosition) {
      room[currentUserId].position = { x, y };

      broadcastPositionUpdate(currentRoomId, currentUserId, x, y);
    } else {
      const originalPosition = room[currentUserId].position;
      sendMessage(ws, "position-update", {
        userId: currentUserId,
        x: originalPosition.x,
        y: originalPosition.y,
      });
    }
  };

  const isPositionOccupied = (roomId: string, x: number, y: number, currentUserId: string) => {
    const room = rooms[roomId];
    for (const userId in room) {
      if (userId !== currentUserId && room[userId].position.x === x && room[userId].position.y === y) {
        return true;
      }
    }
    return false;
  };

  const broadcastPositionUpdate = (roomId: string, userId: string, x: number, y: number) => {
    const wsSet = roomWebSocketMap.get(roomId);

    if (!wsSet) return;

    const updateMessage = JSON.stringify({
      event: "position-update",
      data: { userId, x, y },
    });

    wsSet.forEach((clientWs) => {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(updateMessage);
      }
    });
  };

  ws.on("close", () => {
    if (currentRoomId && currentUserId) {
      delete rooms[currentRoomId][currentUserId];

      const wsSet = roomWebSocketMap.get(currentRoomId);
      if (wsSet) {
        wsSet.delete(ws);
        if (wsSet.size === 0) {
          roomWebSocketMap.delete(currentRoomId);
        }
      }
    }
  });
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
