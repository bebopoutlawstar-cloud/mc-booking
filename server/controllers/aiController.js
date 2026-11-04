const { GoogleGenAI } = require("@google/genai");
const Service = require("../models/Service");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Tried in order: if one is busy, the next one gets a go
const MODELS = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-2.5-flash"];

const createBrief = async (req, res) => {
  try {
    // 1. Get the client's description
    const { description } = req.body;

    // 2. Make sure there's enough to work with
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: "Tell us a bit more about your project" });
    }

    // Give the AI the real service list, so it can only pick services you offer
    const services = await Service.find().select("name category turnaround description priceMin priceMax");
    const list = services
      .map((s) => `- ${s.name} (${s.category}, ${s.turnaround}): ${s.description}`)
      .join("\n");

    const prompt = `You are the project brief assistant for MC Productions, a video editing studio.
A client described their project in their own words. Your job:
1. Pick the ONE best service from this list (use the exact name):
${list}
2. Write a short, clear project brief the editor can work from.
3. If the description is too vague to brief properly, ask ONE short follow-up question.

Rules: plain friendly language, no jargon. Never quote prices or promise dates.
If they ask for something that isn't video/audio/design work, pick the closest service and say so in "reason".

Reply ONLY with JSON in this shape:
{
  "service": "exact service name from the list",
  "reason": "one sentence on why this service fits",
  "brief": {
    "goal": "", "footage": "", "tone": "", "deliverables": "", "length": ""
  },
  "followUp": "a question, or empty string if none is needed"
}

Client description: """${description}"""`;

    // Try each model until one answers
    let result;
    let lastErr;
    for (const model of MODELS) {
      try {
        result = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" },
        });
        break; // it worked, stop trying
      } catch (e) {
        lastErr = e;
        console.error(`${model} failed, trying next...`);
      }
    }
    if (!result) throw lastErr; // every model failed, so send the friendly 503

    const data = JSON.parse(result.text);

    // 3. Match the AI's pick to a real service
    const match = services.find((s) =>
      (data.service || "").toLowerCase().startsWith(s.name.toLowerCase())
    );

    // 4. Send it all back, with the real ID and prices from the database
    res.json({
      ...data,
      service: match ? match.name : data.service,
      serviceId: match ? match._id : null,
      priceMin: match ? match.priceMin : null,
      priceMax: match ? match.priceMax : null,
    });
  } catch (err) {
    console.error("AI error:", err.message);
    res.status(503).json({ message: "The AI assistant is busy right now. You can still book without a brief." });
  }
};

module.exports = { createBrief };