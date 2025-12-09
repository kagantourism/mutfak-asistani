import cors from "cors";
app.use(cors());
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await model.generateContent(message);
    const text = response.response.text();
    res.json({ reply: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gemini bağlantısı hata" });
  }
});

app.get("/", (req, res) => res.send("Mutfak Asistanı Gemini API Çalışıyor 🚀"));

app.listen(3000, () => console.log("API 3000 portunda çalışıyor"));
