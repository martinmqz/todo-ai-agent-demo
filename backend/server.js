import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
app.use(express.json());

let tasks = [];

app.post("/api/agent", async (req, res) => {
  const { input } = req.body;
  const prompt = `
You are a simple task agent.
Decide if the user wants to ADD, REMOVE, or LIST tasks.
Tasks: ${JSON.stringify(tasks)}
User: "${input}"
Respond with a JSON object: {"action":"ADD|REMOVE|LIST","task":"..."}
`;

  const result = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  const decision = JSON.parse(result.choices[0].message.content);

  if (decision.action === "ADD") tasks.push(decision.task);
  if (decision.action === "REMOVE") tasks = tasks.filter(t => t !== decision.task);

  res.json({ decision, tasks });
});

app.listen(5000, () => console.log("Agent API running on http://localhost:5000"));
