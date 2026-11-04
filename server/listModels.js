require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

(async () => {
  const pager = await ai.models.list();
  for await (const m of pager) {
    if (m.name.includes("flash")) console.log(m.name);
  }
})();