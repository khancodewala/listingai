import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { checkAndTrackUsage } from "@/lib/checkUsage";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── SYSTEM PROMPTS (existing + new) ─────────────────────────────────────────

const SYSTEM_PROMPTS = {
  // existing
  listing:
    "You are an expert real estate copywriter. Write professional, engaging, and persuasive property listing descriptions that highlight key features, benefits, and lifestyle appeal. Format with a compelling headline, main description (150-200 words), and a bullet-point highlights section.",
  social:
    "You are a social media expert for real estate. Create engaging posts for Instagram and Facebook. Include relevant emojis, a strong hook, property highlights, a call-to-action, and 5-8 relevant hashtags.",
  email:
    "You are a professional real estate agent writing buyer follow-up emails. Write warm, personalized, and professional emails that build rapport and include a clear next step. Keep it concise but persuasive.",
  contract:
    "You are a real estate attorney assistant. Summarize contracts in plain English. Structure: 1) Key Parties, 2) Property Details, 3) Price and Payment Terms, 4) Important Dates, 5) Key Conditions, 6) Important Clauses.",

  // new
  openhouse:
    "You are a real estate marketing expert. Write compelling open house announcements suitable for WhatsApp, SMS, social media, and printed flyers. Include: a strong attention-grabbing headline, property highlights, date/time/location clearly formatted, the agent's contact info, and a warm call-to-action. Keep it concise, exciting, and professional. Works for any country.",
  neighborhood:
    "You are a real estate area specialist. Write an engaging, informative neighborhood or area description for use in property listings and marketing materials. Cover: overall lifestyle and vibe, proximity to key amenities (schools, hospitals, malls, transport), investment potential, and who the area is ideal for. Keep it 150-200 words, persuasive and factual. Works for any city or country worldwide.",
  pricedrop:
    "You are a real estate marketing copywriter. Write a tactful, positive, and motivating price reduction announcement. Frame the reduced price as an exciting opportunity — not a failure. Include: a compelling headline highlighting the new price, the savings amount, key property features, urgency/call-to-action, and the agent's name. Suitable for social media, WhatsApp, and email. Works for any country or currency.",
  videoscript:
    "You are a real estate video script writer. Write a natural, engaging video walkthrough script for the given property. Structure: 1) Hook opening (5-10 sec grab), 2) Welcome & property intro, 3) Room-by-room walkthrough narration with vivid descriptions, 4) Key features highlight, 5) Neighborhood mention, 6) Price & contact CTA. Match the duration requested. Use conversational, enthusiastic tone. Works for any country.",
};

// ─── PROMPT BUILDER (existing + new) ─────────────────────────────────────────

function buildPrompt(feature, data) {
  // existing
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

  // new
  if (feature === "openhouse") {
    return "Write an open house announcement for: Property Type: " + (data.propertyType || "Property") + ", Address/Location: " + (data.location || "Not specified") + ", Date: " + (data.date || "This weekend") + ", Time: " + (data.time || "To be confirmed") + ", Asking Price: " + (data.price || "N/A") + ", Key Highlights: " + (data.highlights || "N/A") + ", Agent Name: " + (data.agentName || "Your Agent") + ", Phone/WhatsApp: " + (data.agentPhone || "N/A");
  }
  if (feature === "neighborhood") {
    return "Write a neighborhood/area description for a property listing. Neighborhood: " + (data.neighborhood || "Not specified") + ", City/Country: " + (data.city || "Not specified") + ", Property Type: " + (data.propertyType || "Property") + ", Target Buyer: " + (data.targetBuyer || "General buyers") + ", Nearby Places/Amenities: " + (data.nearbyPlaces || "N/A") + ", Area Vibe: " + (data.vibe || "N/A");
  }
  if (feature === "pricedrop") {
    return "Write a price reduction announcement for: Property Type: " + (data.propertyType || "Property") + ", Location: " + (data.location || "Not specified") + ", Original Price: " + (data.oldPrice || "N/A") + ", New Reduced Price: " + (data.newPrice || "N/A") + ", Reason for Reduction: " + (data.reason || "Motivated seller") + ", Key Features: " + (data.features || "N/A") + ", Agent Name: " + (data.agentName || "Agent");
  }
  if (feature === "videoscript") {
    return "Write a property video walkthrough script for: Property Type: " + (data.propertyType || "Property") + ", Location: " + (data.location || "Not specified") + ", Price: " + (data.price || "N/A") + ", Bedrooms: " + (data.bedrooms || "N/A") + ", Key Features: " + (data.features || "N/A") + ", Target Buyer/Audience: " + (data.targetBuyer || "General buyers") + ", Presenter/Agent Name: " + (data.agentName || "Agent") + ", Video Duration: " + (data.duration || "60-90 seconds");
  }

  return "Please provide details.";
}

// ─── API ROUTE (unchanged) ────────────────────────────────────────────────────

export async function POST(request) {
  try {

    // ---- STEP 1: Check if user is logged in ----
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return Response.json({ error: "Please log in to generate content." }, { status: 401 });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return Response.json({ error: "Session expired. Please log in again." }, { status: 401 });
    }

    // ---- STEP 2: Check usage limit ----
    const usageResult = await checkAndTrackUsage(user.id);

    if (!usageResult.allowed) {
      return Response.json({
        error: "limit_reached",
        message: `You have used all ${usageResult.limit} generations on your ${usageResult.plan} plan this month. Please upgrade to continue.`,
        used: usageResult.used,
        limit: usageResult.limit,
        plan: usageResult.plan,
      }, { status: 429 });
    }

    // ---- STEP 3: Generate with Claude ----
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

    // ---- STEP 4: Save to generations history ----
    await supabaseAdmin.from('generations').insert({
      user_id: user.id,
      type: feature,
      input: data,
      output: result,
    });

    return Response.json({ success: true, result });

  } catch (error) {
    console.error("Claude API error:", error);
    if (error.status === 401) {
      return Response.json({ error: "Invalid API key." }, { status: 401 });
    }
    return Response.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
}
