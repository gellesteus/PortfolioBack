import WebSocket from "ws";
import registerForumListener from "./forum";
import conn from "./conn.js";
const wss = new WebSocket.Server({ port: process.env.WEBSOCKET_PORT });

wss.on("connection", ws => {
  /* Global transformations for outgoing data */
  const sendMessage = (message, callback) => {
    const defaultSend = message => ws.send(message);

    if (target in message) {
      if (message.target === conn.ALL) {
        wss.clients.forEach(client => client.send(message.data));
      } else if (message.target === conn.SENDER) {
        defaultSend(message.data);
      }
    } else {
      /* Use default target */
      defaultSend(message);
    }
  };

  /* Check authentication */

  /* Subscribe the socket to all listeners */
  registerForumListener(ws, sendMessage);
});

console.log(`Websocket running on port ${process.env.WEBSOCKET_PORT}`);
