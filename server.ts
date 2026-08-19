import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini AI Client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // Health check API
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      association: "Kollam District Maratha Welfare Association",
      regNo: "KLM/TC/101/2024",
    });
  });

  // AI Member Assistant endpoint
  app.post("/api/gemini/assistant", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message prompt is required" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.json({
          reply:
            "The AI Assistant is currently in offline mode. Please contact the Kollam Association office at +91 94470 12345 or +91 474 2741001 for immediate assistance regarding membership, welfare schemes, or registrations.",
        });
      }

      const systemInstruction = `
You are the official AI Assistant for the Kollam District Maratha Welfare Association (Regd. No. KLM/TC/101/2024), Kollam, Kerala, India.
Your job is to assist community members, families, applicants, and visitors regarding:
- Association Details: Regd. No. KLM/TC/101/2024, Headquarters at Anandavalleswaram, Kollam - 691001. Contact: +91 94470 12345 / +91 474 2741001.
- Taluk Units in Kollam: Kollam Town & East, Karunagappally, Kunnathur, Pathanapuram, Punalur, Kottarakkara, Chathannoor.
- Welfare Schemes: Chhatrapati Shivaji Educational Merit Scholarship, Dhanvantari Medical Relief Fund, Jijabai Marriage Support Grant, Senior Member Pension Scheme, Mahila Self-Help Support.
- Member Services: Digital ID card generation, Downloadable membership & grant forms, Kollam Blood Donors Directory, Matrimonial Registry for Kollam Maratha alliances.
- Office Bearers: President Sri. K. Ramesh Rao, General Secretary Sri. B. Anil Kumar Maratha, Treasurer Sri. M. Suresh Rao.

Be courteous, warm, respectful, community-focused, and informative. Keep responses helpful, structured, and concise.
`;

      const contents = history && Array.isArray(history) && history.length > 0
        ? history.map((h: { sender: string; text: string }) => ({
            role: h.sender === "user" ? "user" : "model",
            parts: [{ text: h.text }],
          })).concat([{ role: "user", parts: [{ text: message }] }])
        : message;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: typeof contents === "string" ? contents : contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({ reply: response.text || "Thank you for reaching out to Kollam District Maratha Welfare Association." });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: "Unable to process AI assistant request.",
        details: error?.message,
      });
    }
  });

  // Vite development middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
