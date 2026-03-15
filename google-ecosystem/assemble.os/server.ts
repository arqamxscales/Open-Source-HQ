import express from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  const PORT = 3000;

  // Server-side state
  let tasks = [
    { id: 1, title: 'Neural Engine Optimization', status: 'IN_PROGRESS', assignee: 'Sarah K.', progress: 65 },
    { id: 2, title: 'Auth Service Refactor', status: 'REVIEW', assignee: 'Marcus V.', progress: 100 },
    { id: 3, title: 'Database Migration', status: 'TODO', assignee: 'Elena R.', progress: 0 },
  ];

  const events = [
    { id: 1, title: 'Architecture Sync', time: '15:00', location: 'Conference Room 404 (Virtual)', color: '#ff00e5' },
    { id: 2, title: 'DevOps Standup', time: 'TOMORROW', location: 'Huddle: Operations Hub', color: '#00f2ff' },
    { id: 3, title: 'Security Audit', time: 'WEDNESDAY', location: 'Secure Vault A', color: '#ec5b13' },
    { id: 4, title: 'Product Review', time: 'FRIDAY', location: 'Main Hall', color: '#fbff00' },
  ];

  // API routes
  app.get("/api/events", (req, res) => {
    res.json(events);
  });

  // WebSocket logic
  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");
    
    // Send initial state
    ws.send(JSON.stringify({ type: "INIT_STATE", data: { tasks } }));

    ws.on("message", (message) => {
      try {
        const payload = JSON.parse(message.toString());
        
        if (payload.type === "UPDATE_TASK") {
          const updatedTask = payload.data;
          tasks = tasks.map(t => t.id === updatedTask.id ? updatedTask : t);
          // Broadcast to all clients
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "TASK_UPDATED", data: updatedTask }));
            }
          });
        }

        if (payload.type === "CHAT_MESSAGE") {
          // Broadcast chat message to all clients
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: "CHAT_MESSAGE", data: payload.data }));
            }
          });
        }
      } catch (err) {
        console.error("Error processing WS message:", err);
      }
    });
    
    const sendHealthUpdate = () => {
      if (ws.readyState === WebSocket.OPEN) {
        const healthData = {
          cpu: Math.floor(Math.random() * 30) + 30, // 30-60%
          ram: Math.floor(Math.random() * 20) + 50, // 50-70%
          gpu: Math.floor(Math.random() * 40) + 10, // 10-50%
        };
        ws.send(JSON.stringify({ type: "HEALTH_UPDATE", data: healthData }));
      }
    };

    const interval = setInterval(sendHealthUpdate, 2000); // Slower updates for stability
    
    ws.on("close", () => {
      clearInterval(interval);
      console.log("Client disconnected");
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
