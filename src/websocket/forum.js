import conn from "./conn.js";

export default (ws, message) => {
  /* Register the event listeners */
  ws.on("message", data => {
    message({ data, target: conn.SENDER }, (res, message) => {
      if (res === conn.FAILURE) {
        console.log(message);
      }
    });
  });
};
