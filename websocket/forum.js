export default (ws, message) => {
  /* Register the event listeners */
  ws.on("message", data => {
    message(data);
  });
};
