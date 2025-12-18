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
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const { messages, stream = false, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      throw new Error('Messages array is required');
    }

    // Build system prompt with herbal expertise
    const systemPrompt = `You are Herbiverse AI, an expert herbal medicine assistant with deep knowledge of:
- Ayurveda, Traditional Chinese Medicine, and Western herbalism
- Medicinal plants, their properties, uses, and preparations
- Safety considerations, contraindications, and drug interactions
- Evidence-based research on herbal remedies

${context?.healthProfile ? `
User Health Context:
- Chronic conditions: ${context.healthProfile.chronicConditions?.join(', ') || 'None specified'}
- Allergies: ${context.healthProfile.allergies?.join(', ') || 'None specified'}
- Current medications: ${context.healthProfile.medications?.join(', ') || 'None specified'}
- Pregnancy status: ${context.healthProfile.isPregnant ? 'Pregnant' : 'Not pregnant'}

IMPORTANT: Always consider these health factors when making recommendations. Flag any potential contraindications.
` : ''}

Guidelines:
- Provide helpful, accurate information about herbs and natural remedies
- Always include safety warnings and contraindications
- Use gentle language like "may help", "traditionally used for"
- Recommend consulting healthcare providers for serious conditions
- Keep responses conversational and friendly
- When discussing plants, mention preparation methods and dosages where appropriate`;

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    console.log('Calling OpenRouter API (Claude 3.5 Sonnet) with', messages.length, 'messages');

    if (stream) {
      // Streaming response
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://herbiverse.lovable.app',
          'X-Title': 'Herbiverse AI Assistant',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: apiMessages,
          stream: true,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error:', response.status, errorText);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
        },
      });
    } else {
      // Non-streaming response
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://herbiverse.lovable.app',
          'X-Title': 'Herbiverse AI Assistant',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
          messages: apiMessages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter API error:', response.status, errorText);
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      console.log('Claude 3.5 Sonnet response received, length:', content.length);

      return new Response(JSON.stringify({ content }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in voice assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
