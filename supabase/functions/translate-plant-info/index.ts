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
    const { plantData, targetLanguage } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const languageNames: Record<string, string> = {
      hi: 'Hindi',
      mr: 'Marathi'
    };

    const systemPrompt = `You are a botanical translation expert. Translate the following plant information to ${languageNames[targetLanguage]}.

CRITICAL RULES:
1. Keep all scientific names (Latin) UNCHANGED
2. Maintain exact JSON structure
3. Preserve botanical accuracy
4. Keep array formatting (lists remain lists)
5. Translate naturally, not word-by-word

Return the translated data as JSON with the exact same structure.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Translate this plant data to ${languageNames[targetLanguage]}:\n\n${JSON.stringify(plantData, null, 2)}` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "translate_plant_data",
            description: `Translate plant information to ${languageNames[targetLanguage]}`,
            parameters: {
              type: "object",
              properties: {
                commonName: { type: "string" },
                scientificName: { type: "string", description: "Keep in Latin, unchanged" },
                family: { type: "string" },
                confidence: { type: "string", enum: ["high", "medium", "low"] },
                identification: { type: "string" },
                medicinalUses: { type: "array", items: { type: "string" } },
                activeCompounds: { type: "array", items: { type: "string" } },
                preparation: { type: "array", items: { type: "string" } },
                dosage: { type: "string" },
                safetyWarnings: { type: "array", items: { type: "string" } },
                habitat: { type: "string" },
                culturalSignificance: { type: "string" },
                conservationStatus: { type: "string" }
              },
              required: [
                "commonName", "scientificName", "family", "confidence",
                "identification", "medicinalUses", "activeCompounds",
                "preparation", "dosage", "safetyWarnings", "habitat",
                "culturalSignificance", "conservationStatus"
              ],
              additionalProperties: false
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "translate_plant_data" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many translation requests. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Translation service unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall || !toolCall.function?.arguments) {
      throw new Error('No translation returned from AI');
    }

    const translatedData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ translatedData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Translation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
