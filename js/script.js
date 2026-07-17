document.addEventListener("DOMContentLoaded", function () {
  // 🌐 BROWSER CLIENT (Vanilla JavaScript)

  const button = document.getElementById("btn");
  button.addEventListener("click", (event) => {
    event.preventDefault();
    console.log("button clicked");

    const msg = {
      type: "chat",
      text: "button clicked",
    };
    socket.send(JSON.stringify(msg));
  });

  // 1. Establish a WebSocket connection
  // Tip: Use 'wss://' for secure HTTPS sites, 'ws://' for HTTP
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const serverUrl = `${protocol}//${window.location.host}`;

  console.log("Connecting to:", serverUrl);
  const socket = new WebSocket(serverUrl);

  // 2. Connection Opened event handler
  socket.addEventListener("open", (event) => {
    console.log("Connected to the WebSocket server! 🎉");

    // Send a text message or JSON payload to the server
    const greeting = {
      type: "chat",
      text: "Hello, World! 👋",
    };
    socket.send(JSON.stringify(greeting));
  });

  // 3. Receive message event handler
  socket.addEventListener("message", (event) => {
    try {
      // Parse the incoming JSON message from the server
      const data = JSON.parse(event.data);
      console.log("Received from server:", data);

      let ul = document.getElementById("messages");
      let li = document.createElement("li");
      li.textContent = JSON.stringify(data);
      ul.appendChild(li);
    } catch (err) {
      // Fallback for raw text payloads
      console.log("Received raw message:", event.data);
    }
  });

  // 4. Connection Closed event handler
  socket.addEventListener("close", (event) => {
    console.log("WebSocket connection closed.", event.reason);
  });

  // 5. Connection Error event handler
  socket.addEventListener("error", (error) => {
    console.error("WebSocket encountered an error:", error);
  });

  // 💡 Quick API Methods Cheatsheet:
  // - socket.send(data)       -> Send data (string, Blob, or ArrayBuffer)
  // - socket.close(code, msg) -> Close the connection gracefully
  // - socket.readyState       -> Check state: 0 (CONNECTING), 1 (OPEN), 2 (CLOSING), 3 (CLOSED)
});
