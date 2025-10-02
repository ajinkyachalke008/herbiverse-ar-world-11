import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image } = await req.json();
    
    if (!image) {
      throw new Error("Image is required");
    }

    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!openRouterApiKey) {
      throw new Error("OpenRouter API key not configured");
    }

    console.log("Processing plant identification request...");

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://herbiverse-ar-world.lovable.app',
        'X-Title': 'Herbiverse Plant Identifier',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are a professional botanist and herbalist specializing in medicinal plants. Analyze this plant image and provide detailed information in the following JSON format:

{
  "commonName": "Common name of the plant",
  "scientificName": "Scientific name (genus and species)",
  "family": "Plant family",
  "confidence": "high/medium/low",
  "identification": "Brief description of key identifying features",
  "medicinalUses": ["List of medicinal uses and health benefits"],
  "activeCompounds": ["Key medicinal compounds present"],
  "preparation": ["Traditional preparation methods"],
  "dosage": "Traditional dosage information",
  "safetyWarnings": ["Important safety warnings, contraindications, or toxicity information"],
  "habitat": "Natural habitat and growing conditions",
  "culturalSignificance": "Traditional and cultural importance",
  "conservationStatus": "Conservation status if applicable"
}

If you cannot confidently identify the plant, set confidence to "low" and explain why in the identification field. Always prioritize safety - if there's any doubt, mention it in safetyWarnings.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received response from OpenRouter");
    
    const content = data.choices[0].message.content;
    
    // Extract JSON from the response (it might be wrapped in markdown code blocks)
    let plantData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        plantData = JSON.parse(jsonMatch[0]);
      } else {
        plantData = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Error parsing plant data:", parseError);
      // If parsing fails, create a structured response from the text
      plantData = {
        commonName: "Unable to identify",
        scientificName: "Unknown",
        family: "Unknown",
        confidence: "low",
        identification: content,
        medicinalUses: [],
        activeCompounds: [],
        preparation: [],
        dosage: "Not available",
        safetyWarnings: ["Could not parse identification data. Please consult an expert."],
        habitat: "Unknown",
        culturalSignificance: "Unknown",
        conservationStatus: "Unknown"
      };
    }

    return new Response(
      JSON.stringify({ success: true, data: plantData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in identify-plant function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to identify plant';
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
