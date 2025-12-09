import express from "express";
import { WebSocketServer } from "ws";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();

// WebSocket Server
const wss = new WebSocketServer({ noServer: true });

const client = createClient({ apiKey: process.env.GEMINI_API_KEY });

wss.on("connection", async (ws) => {
  // Başlat Gemini Live
  const session = client.live.connect({
    model: "gemini-2.0-flash-exp",  // veya güncel modeli kullan
  });

  ws.on("message", (msg) => {
    // Kullanıcıdan gelen ses verisi → Gemini’ye gönder
    session.send({ audio: { data: msg, mimeType: "audio/pcm" } });
  });

  for await (const ev of session) {
    // Gelen yanıtı gönder
    if (ev.audio) ws.send(ev.audio.data);
    if (ev.text) ws.send(JSON.stringify({ text: ev.text }));
  }
});

// Express HTTP + WebSocket upgrade
const server = app.listen(3000, () =>
  console.log("Mutfak Asistanı API çalışıyor: http://localhost:3000")
);

server.on("upgrade", (req, socket, head) => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit("connection", ws, req);
  });
});
