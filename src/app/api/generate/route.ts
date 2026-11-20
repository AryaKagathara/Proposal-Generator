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
      model: "gemini-4-carbon",
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
  "projectDetails": "The formatted Client Job Description. Keep the original requirements and details clear, but remove unnecessary or useless details that are irrelevant. Formatted with clean paragraphs and bullet points.",
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
  "customScopeContent": "Revision round policy (3 revision rounds for the scope of work), followed by the list of all deliverables line-by-line in a readable list, along with any additional notes or future scope details.",
  "portfolioLinks": [
    {
      "name": "Project/Work Title",
      "url": "Reference Link URL"
    }
  ],
  "previewText": "A clean, beautiful Markdown preview representing the generated proposal content in normal text. Do not show the JSON structure here. Make it clean, readable, and structured for the user to preview. Summarize the Client Name, Project Requirements / Details, Phases, Budget, Milestones, and Portfolio."
}

Rules for generating the content:
1. CLIENT NAME: Extract the client/company name from the JD or proposal. If not found, leave as empty string "".
2. PROJECT REQUIREMENTS / DETAILS:
   - Keep the original project requirements and details clear, structured, and easy to read.
   - Remove any unnecessary, useless, or irrelevant details/fluff that are not relevant to be part of the PROJECT REQUIREMENTS / DETAILS.
   - Format cleanly with proper spacing, readable paragraphs, and bullet points where appropriate (e.g. using '-' for bullet items), while retaining all genuine scope, technical criteria, and reference links.
3. PHASES: Create logical project phases based on the JD requirements. Each phase must have a title, timeline (e.g., '2 Weeks'), and deliverables. Each deliverable must have a title and a 1-sentence description.
4. BUDGET: Extract the budget from the JD or proposal. Return only the numeric amount as a string (e.g. '1200').
5. MILESTONES:
   - Create multiple part-by-part milestones with a minimum of 3 to 4 milestones, ensuring work completed at each stage is covered for payment in case the project stops or fails.
   - If the totalPrice is under USD 1500, the Advance payment milestone must be 50%.
   - If the totalPrice is USD 1500 or more, the Advance payment milestone must be 20%.
   - The final handoff/deployment phase milestone must be 5%.
   - If Phase 1 is Strategy & Research (or similar setup/discovery phase), combine/consider it as part of the Advance milestone.
   - Distribute the remaining percentage logically across the intermediate milestones/phases so there are at least 3-4 distinct milestones total. All milestone percentages must sum up to exactly 100%.
6. CUSTOM SCOPE:
   - Explicitly include: 'There will be 3 revision rounds for the scope of work.'
   - Mention all deliverables line-by-line in a clean list so it is easy to read.
   - List any additional notes
7. PORTFOLIO LINKS: Extract any portfolio names and links mentioned in the user's proposal or JD. If none are found, return an empty array.

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
