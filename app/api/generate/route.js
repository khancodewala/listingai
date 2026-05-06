import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPTS = {
  listing: "You are an expert real estate copywriter. Write professional, engaging, and persuasive property listing descriptions that highlight key features, benefits, and lifestyle appeal. Format with a compelling headline, main description (150-200 words), and a bullet-point highlights section.",
  social: "You are a social media expert for real estate. Create engaging posts for Instagram and Facebook. Include relevant emojis, a strong hook, property highlights, a call-to-action, and 5-8 relevant hashtags.",
  email: "You are a professional real estate agent writing buyer follow-up emails. Write warm, personalized, and professional emails that build rapport and include a clear next step. Keep it concise but persuasive.",
  contract: "You are a real estate attorney assistant. Summarize contracts in plain English. Structure: 1) Key Parties, 2) Property Details, 3) Price and Payment Terms, 4) Important Dates, 5) Key Conditions, 6) Important Clauses.",
};

function buildPrompt(feature, data) {
  if (feature === "listing") {
    return "Write a property listing for: Property Type: " + (data.propertyType || "Property") + ", Location: " + (data.location || "Not specified") + ", Bedrooms: " + (data.bedrooms || "N/A") + ", Bathrooms: " + (data.bathrooms || "N/A") + ", Size: " + (data.size || "N/A") + " sq ft, Price: " + (data.price || "N/A") + ", Key Features: " + (data.features || "N/A") + ", Notes: " + (data.notes || "None");
  }
  if (feature === "social") {
    return "Create Instagram and Facebook posts for: Property Type: " + (data.propertyType || "Property") + ", Location: " + (data.location || "Not specified") + ", Price: " + (data.price || "N/A") + ", Highlights: " + (data.highlights || "N/A") + ", Target Buyer: " + (data.targetBuyer || "General buyers");
  }
  if (feature === "email") {
    return "Write a buyer follow-up email. Agent: " + (data.agentName || "Agent") + ", Buyer: " + (data.buyerName || "Valued Client") + ", Property: " + (data.propertyAddress || "the property") + ", Showing Date: " + (data.showingDate || "recent showing") + ", Buyer Interests: " + (data.buyerInterests || "N/A") + ", Next Step: " + (data.nextStep || "schedule a follow-up call");
  }
  if (feature === "contract") {
    return "Summarize this real estate contract in plain English: " + (data.contractText || "No contract text provided.");
  }
  return "Please provide details.";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const feature = body.feature;
    const data = body;

    if (!feature || !SYSTEM_PROMPTS[feature]) {
      return Response.json({ error: "Invalid feature." }, { status: 400 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPTS[feature],
      messages: [{ role: "user", content: buildPrompt(feature, data) }],
    });

    const result = message.content[0].text;
    return Response.json({ success: true, result });

  } catch (error) {
    console.error("Claude API error:", error);
    if (error.status === 401) {
      return Response.json({ error: "Invalid API key." }, { status: 401 });
    }
    return Response.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
}