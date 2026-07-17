
// 💻 NODE.JS SERVER (Express + native 'ws' library)
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use('/js', express.static('js'));

const __dirname = dirname(fileURLToPath(import.meta.url));
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

// 1. Initialize WebSocket Server attached to the HTTP server
const wss = new WebSocketServer({ noServer: true });

// 2. Handle the HTTP upgrade handshake
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// 3. Handle incoming client connections
wss.on("connection", (ws) => {
  console.log("New client connected!");

  // Send a welcoming hello-world message to the client
  ws.send(JSON.stringify({
    type: "system",
    text: "Hello, Client! Welcome to the WebSocket server. 🚀"
  }));

  // 4. Handle incoming messages from this client
  ws.on("message", (rawMessage) => {
    try {
      const data = JSON.parse(rawMessage.toString());
      console.log("Received payload:", data);

      if (data.type === "chat") {
        // Echo back to the sending client
        ws.send(JSON.stringify({
          type: "echo",
          text: `Echo: "${data.text}"`
        }));
      }
    } catch (err) {
      console.log("Received raw message:", rawMessage.toString());
    }
  });

  // 5. Handle client disconnects
  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});

// Start listening
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});
