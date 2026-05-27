import { Handler } from "@netlify/functions";
import { GoogleGenAI, Type } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

export const handler: Handler = async (event) => {
  // POST 요청이 아니면 차단
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const {
      myMbti,
      myChatStyle,
      myKeywords = [],
      crushMbti,
      crushChatStyle,
      crushKeywords = [],
    } = JSON.parse(event.body || "{}");

    if (!myMbti || !crushMbti) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "나와 상대방의 MBTI는 필수 입력 사항입니다." }),
      };
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

    // 💡 모델 이름을 실존하는 최신 'gemini-2.5-flash'로 완벽 교정!
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(JSON.parse(bodyText)),
    };
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "AI 연애 네비게이터 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        details: error.message,
      }),
    };
  }
};
