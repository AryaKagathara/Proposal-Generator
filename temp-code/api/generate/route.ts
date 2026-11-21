import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobDescription,
      apiKey: userApiKey,
      clientName,
      clientLocation,
      modelName = "gemini-4-neon",
      temperature,
      topP,
      maxOutputTokens,
      extraContext,
      thinkingLevel = "medium"
    } = body;

    if (!jobDescription) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API Key is missing. Please configure it in your environment variables or enter it in the UI." }, { status: 400 });
    }

    // Read instructions from Instruction-1.txt dynamically
    let instructions = "";
    try {
      const filePath = path.join(process.cwd(), "Instruction-1.txt");
      instructions = fs.readFileSync(filePath, "utf-8");
    } catch (err) {
      console.error("Failed to read Instruction-1.txt:", err);
      return NextResponse.json({ error: "Could not read Instruction-1.txt instruction file. Make sure it exists in the root directory." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });

    const systemPrompt = `
You are an AI assistant designed to generate personalized freelance project proposals from Arya.
You MUST strictly follow the instructions, rules, and guidelines provided in the following reference document:

=== BEGIN INSTRUCTIONS ===
${instructions}
=== END INSTRUCTIONS ===

Additional overrides or user preferences (if any):
- Client Name: ${clientName || "Not provided (infer from JD)"}
- Client Location/Country: ${clientLocation || "Not provided (infer from JD)"}
- Extra Context / Custom Offers / Specific Experience: ${extraContext || "None provided"}

Please process the following Job Description (JD) and write the proposal. Remember to integrate the extra context / past experience info naturally into the proposal.
Remember, the output MUST be divided into two distinct parts matching the character limit requirements exactly:
Part 1 (Work Description): 500-800 characters including spaces.
Part 2 (Personal Message): 300-400 characters including spaces.

Ensure you include 2-3 minor spelling mistakes naturally so it looks human-written, and strictly avoid em-dashes.
Use the clickable portfolio URLs from the appropriate section in the instructions depending on the project category.

Output format:
Provide the output in plain text. Divide the two parts using the exact separator "=== PART 2 ===" on a line by itself.
Do not wrap it in JSON. Just return the text.

Example format:
[Part 1 Work Description text here]
=== PART 2 ===
[Part 2 Personal Message text here]
`;

    const prompt = `
Job Description (JD) to process:
${jobDescription}
`;

    const config: any = {
      thinkingConfig: {
        thinkingLevel: thinkingLevel || "medium"
      }
    };

    if (temperature !== undefined) config.temperature = Number(temperature);
    if (topP !== undefined) config.topP = Number(topP);
    if (maxOutputTokens !== undefined) config.maxOutputTokens = Number(maxOutputTokens);

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt }, { text: prompt }] }
      ],
      generationConfig: config
    });

    const responseText = result.response.text();
    console.log("--- RAW GEMINI RESPONSE ---");
    console.log(responseText);
    console.log("----------------------------");

    // Robust separator parsing
    let part1 = "";
    let part2 = "";
    const separators = [
      "=== PART 2 ===",
      "=== Part 2 ===",
      "===PART 2===",
      "===PART2===",
      "PART 2:",
      "Part 2:",
      "PART 2\n",
      "Part 2\n",
      "PART 2",
      "Part 2"
    ];

    let foundSeparator = false;
    for (const sep of separators) {
      if (responseText.includes(sep)) {
        const idx = responseText.indexOf(sep);
        part1 = responseText.substring(0, idx).trim();
        part2 = responseText.substring(idx + sep.length).trim();
        foundSeparator = true;
        break;
      }
    }

    if (!foundSeparator) {
      if (responseText.includes("Skip guesswork")) {
        const idx = responseText.indexOf("Skip guesswork");
        part1 = responseText.substring(0, idx).trim();
        part2 = responseText.substring(idx).trim();
      } else {
        part1 = responseText.trim();
        part2 = "";
      }
    }

    return NextResponse.json({ part1, part2, raw: responseText });
  } catch (error: any) {
    console.error("API error during generation:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}
