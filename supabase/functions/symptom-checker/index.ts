import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYMPTOM_ANALYSIS_PROMPT = `You are an expert herbalist and traditional medicine consultant. Analyze the user's symptoms and recommend suitable medicinal plants.

IMPORTANT GUIDELINES:
- Always use gentle, non-medical language like "may help", "traditionally used for", "considered helpful for"
- Include safety warnings and contraindications
- Mention evidence levels (Traditional, Anecdotal, Emerging Research, Clinically Supported)
- Never claim to cure or treat diseases
- Always recommend consulting a healthcare professional

For each recommendation, provide:
1. Plant name (common and scientific)
2. Relevance score (1-100) based on symptom match
3. Traditional uses related to the symptoms
4. Evidence level
5. Suggested preparation methods
6. Dosage guidelines (conservative)
7. Safety warnings and contraindications
8. Duration of use recommendation

Respond in this exact JSON format:
{
  "parsed_symptoms": {
    "primary": ["main symptom 1", "main symptom 2"],
    "secondary": ["related symptom"],
    "body_systems": ["respiratory", "digestive", etc.],
    "severity_assessment": "mild/moderate/severe",
    "urgency_note": "string if medical attention needed, null otherwise"
  },
  "recommendations": [
    {
      "plant_name": "Common Name",
      "scientific_name": "Scientific name",
      "hindi_name": "Hindi name",
      "relevance_score": 85,
      "traditional_uses": "Brief description of traditional uses for these symptoms",
      "evidence_level": "Traditional | Anecdotal | Emerging Research | Clinically Supported",
      "preparation": ["Tea/Infusion", "Decoction", "Powder", "Oil", "Paste"],
      "dosage": {
        "adult": "1-2 grams dried herb, 2-3 times daily",
        "duration": "Up to 14 days, then reassess"
      },
      "safety": {
        "warnings": ["Warning 1", "Warning 2"],
        "contraindications": ["Pregnancy", "Certain medications", etc.],
        "interactions": ["Drug interactions if any"]
      },
      "ayurvedic_properties": {
        "rasa": "Taste",
        "virya": "Potency",
        "dosha_effect": "Effect on doshas"
      }
    }
  ],
  "lifestyle_tips": ["Tip 1", "Tip 2"],
  "disclaimer": "This information is for educational purposes only. Always consult a qualified healthcare practitioner before using any herbal remedies."
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptoms, user_context } = await req.json();
    
    if (!symptoms || symptoms.trim().length === 0) {
      throw new Error('Please describe your symptoms');
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing symptom query:", symptoms.substring(0, 100));

    // Build user context string if provided
    let contextStr = "";
    if (user_context) {
      const parts = [];
      if (user_context.age) parts.push(`Age: ${user_context.age}`);
      if (user_context.gender) parts.push(`Gender: ${user_context.gender}`);
      if (user_context.conditions) parts.push(`Existing conditions: ${user_context.conditions.join(", ")}`);
      if (user_context.medications) parts.push(`Current medications: ${user_context.medications.join(", ")}`);
      if (user_context.allergies) parts.push(`Allergies: ${user_context.allergies.join(", ")}`);
      if (user_context.pregnancy) parts.push(`Pregnancy status: ${user_context.pregnancy}`);
      if (parts.length > 0) {
        contextStr = `\n\nUser Health Context:\n${parts.join("\n")}`;
      }
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYMPTOM_ANALYSIS_PROMPT },
          { role: "user", content: `User's symptoms: ${symptoms}${contextStr}\n\nProvide 3-5 herbal recommendations based on these symptoms. Be thorough with safety information.` }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to analyze symptoms");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let result;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Raw content:", content);
      throw new Error("Failed to process recommendations");
    }

    console.log("Successfully generated recommendations");

    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Symptom checker error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
