const { GoogleGenAI } = require("@google/genai");
const Service = require("../models/Service");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = "gemini-3.6-flash";

const createBrief = async (req, res) => {
  try {
    const { description } = req.body;

    // 1. Pull description out of req.body
    if (!description) {
      return res.status(400).json({ message: "Tell us a bit more about your project" });
    }
    // 2. If it's missing or shorter than 10 characters, send 400
    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: "Tell us a bit more about your project" });
    }

    // Give the AI the real service list, so it can only pick services you offer
    const services = await Service.find().select("name category turnaround description");
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

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });
    const data = JSON.parse(result.text);

    // 3. Find the matching service in your list
    const match = services.find((s) =>
  (data.service || "").toLowerCase().startsWith(s.name.toLowerCase())
);
    //    (hint: services.find((s) => s.name === data.service))

    // 4. Send back everything the AI gave, plus that service's _id
    res.json({ ...data, service: match ? match.name : data.service, serviceId: match ? match._id : null });
    //    (hint: res.json({ ...data, serviceId: match ? match._id : null }))
  } catch (err) {
    console.error("AI error:", err.message);
    res.status(503).json({ message: "The AI assistant is busy right now. You can still book without a brief." });
  }
};

module.exports = { createBrief };