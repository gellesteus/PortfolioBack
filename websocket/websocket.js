import WebSocket from "ws";
import registerForumListener from "./forum";
import conn from "./conn.js";
const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT });

wss.on("connection", ws => {
  /* Global transformations for outgoing data */
  const sendMessage = (message, target, callback) => {
    if (target === conn.ALL) {
      try {
        ws.send(message);
      } catch (e) {
        callback(e);
        return;
      }
      callback(conn.SUCCESS);
    } else if (target === conn.SENDER) {
    }
  };

  /* Check authentication */

  /* Subscribe the socket to all listeners */
  registerForumListener(ws, sendMessage);
});

console.log(`Websocket running on port ${process.env.WEBSOCKET_PORT}`);
