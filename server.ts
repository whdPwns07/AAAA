import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Warning: GEMINI_API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route: Analyze compatibility
app.post("/api/analyze", async (req, res) => {
  try {
    const {
      myMbti,
      myChatStyle,
      myKeywords = [],
      crushMbti,
      crushChatStyle,
      crushKeywords = [],
    } = req.body;

    // Validate inputs
    if (!myMbti || !crushMbti) {
      return res.status(400).json({ error: "나와 상대방의 MBTI는 필수 입력 사항입니다." });
    }

    const ai = getGeminiClient();

    const systemInstruction = `You are "Love Navigator", a humorous, witty, slightly cynical, and highly intuitive AI relationship coach popular with Gen Z and Millennials.
Your task is to analyze the romantic compatibility of two subjects based on their MBTI, texting styles, and interest keywords.
Provide a highly tailored, entertaining, and insightful diagnostic report in Korean.
Be witty, funny, yet surprisingly accurate (cynical but warm-hearted).
Keep "personalityStitch" description short & punchy under 25 characters (e.g. "불도저와 유리멘탈의 아슬아슬한 만남").
Keep "conflictSpot" and "futureSpoiler" details highly descriptive, modern (using Korean internet slang perfectly where appropriate, such as '칼답', '티키타카', '정색', '킹받네'), and relatable.
Maintain standard JSON format according to the specification. Output clean valid JSON matching responseSchema.`;

    const userPrompt = `Please analyze the compatibility with the following data:
[Subject 1 (User)]:
- MBTI: ${myMbti}
- Texting Style: ${myChatStyle || "Not specified (평범하고 자연스러운 대화 선호)"}
- Interests: ${myKeywords.join(", ") || "None specified"}

[Subject 2 (Crush)]:
- MBTI: ${crushMbti}
- Texting Style: ${crushChatStyle || "Not specified (평범하고 자연스러운 대화 선호)"}
- Interests: ${crushKeywords.join(", ") || "None specified"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 1.0,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "successRate",
            "stabilityIndex",
            "dopamineIndex",
            "personalityStitch",
            "conflictSpot",
            "futureSpoiler",
            "tags",
          ],
          properties: {
            successRate: {
              type: Type.INTEGER,
              description: "Romantic success or stability compatibility probability from 1 to 99.",
            },
            stabilityIndex: {
              type: Type.INTEGER,
              description: "Relationship stability index (0 to 100).",
            },
            dopamineIndex: {
              type: Type.INTEGER,
              description: "Dopamine excitement chemistry index (0 to 100).",
            },
            personalityStitch: {
              type: Type.STRING,
              description: "A single punchy sentence describing their dynamic relationship vibe.",
            },
            conflictSpot: {
              type: Type.STRING,
              description: "A detailed scenario of where and why their first big argument or friction will occur.",
            },
            futureSpoiler: {
              type: Type.STRING,
              description: "A funny and vivid relationship preview of what they will look like 3 months to 1 year later.",
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 highly specific and witty hashtag keywords starting with #.",
            },
          },
        },
      },
    });

    const bodyText = response.text;
    if (!bodyText) {
      throw new Error("Empty response from AI model.");
    }

    const parsedData = JSON.parse(bodyText);
    res.json(parsedData);
  } catch (error: any) {
    console.error("Analysis Error:", error);
    res.status(500).json({
      error: "AI 연애 네비게이터 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
      details: error.message,
    });
  }
});

// Vite/Static Setup
async function startServer() {
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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
