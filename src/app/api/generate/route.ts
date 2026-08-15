import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jobDescription, userProposal, apiKey: userApiKey } = body;

    if (!jobDescription) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API Key is missing. Please configure it in your environment variables or enter it in the AI Assistant sidebar." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      generationConfig: {
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    });

    const systemPrompt = `
You are an expert freelance proposal assistant. You will analyze a Client Job Description (JD) and a draft Proposal written by the user.
Your goal is to extract and generate structured proposal content to fit a specific JSON schema.

Here is the JSON schema you must return:
{
  "clientName": "Client Name or Company (or empty string if not found)",
  "totalPrice": "Estimated project budget/amount as a string (number only, e.g. '1200' or '3500'. If not specified in JD or proposal, estimate a reasonable price based on the work, or default to '1500')",
  "phases": [
    {
      "name": "Phase Title (e.g. Phase 1 - Strategy & Design)",
      "duration": "Timeline duration (e.g. 1 Week, 2 Weeks)",
      "deliverables": [
        {
          "label": "Deliverable Title",
          "description": "1 sentence description of what will be delivered"
        }
      ]
    }
  ],
  "paymentMilestones": [
    {
      "name": "Milestone title (e.g. Advance Payment)",
      "percentage": "Percentage as a string, e.g. '50' or '20' (must be a number only, without % symbol)"
    }
  ],
  "customScopeContent": "Additional Notes or Future Scope Details. Followed by a 'Complete list of Deliverables List (Comma Separated)'.",
  "portfolioLinks": [
    {
      "name": "Project/Work Title",
      "url": "Reference Link URL"
    }
  ],
  "previewText": "A clean, beautiful Markdown preview representing the generated proposal content in normal text. Do not show the JSON structure here. Make it clean, readable, and structured for the user to preview. Summarize the Client Name, Phases, Budget, Milestones, and Portfolio."
}

Rules for generating the content:
1. CLIENT NAME: Extract the client/company name from the JD or proposal. If not found, leave as empty string "".
2. PHASES: Create logical project phases based on the JD requirements. Each phase must have a title, timeline (e.g., '2 Weeks'), and deliverables. Each deliverable must have a title and a 1-sentence description.
3. BUDGET: Extract the budget from the JD or proposal. Return only the numeric amount as a string (e.g. '1200').
4. MILESTONES:
   - If the totalPrice is under USD 1500, the Advance payment milestone must be 50%.
   - If the totalPrice is USD 1500 or more, the Advance payment milestone must be 20%.
   - The final handoff/deployment phase milestone must be 5%.
   - If Phase 1 is Strategy & Research (or similar setup/discovery phase), combine/consider it as part of the Advance milestone.
   - Distribute the remaining percentage logically among the intermediate phases/milestones. All milestone percentages must sum up to exactly 100%.
5. CUSTOM SCOPE: List any additional notes, assumptions, or future scope details, and end with a comma-separated list of all deliverables.
6. PORTFOLIO LINKS: Extract any portfolio names and links mentioned in the user's proposal or JD. If none are found, return an empty array.

Return ONLY a valid JSON object matching this schema. Do not enclose it in markdown blocks except returning json format.
`;

    const prompt = `
=== CLIENT JOB DESCRIPTION ===
${jobDescription}

=== USER WRITTEN PROPOSAL DRAFT ===
${userProposal || "None provided"}
`;

    const result = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: systemPrompt }, { text: prompt }] }
      ]
    });

    const responseText = result.response.text();

    // Clean codeblock markers if any
    let cleanedJsonText = responseText.trim();
    if (cleanedJsonText.startsWith("```")) {
      cleanedJsonText = cleanedJsonText.replace(/^```json\s*/, "").replace(/```$/, "").trim();
    }

    const parsedData = JSON.parse(cleanedJsonText);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Gemini generation error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during content generation." },
      { status: 500 }
    );
  }
}
