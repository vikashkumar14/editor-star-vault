import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyB1sX2JDb3FPy0xY0B_2ORQsg8faRl6LaY';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history = [] } = await req.json();
    
    console.log('Received message:', message);
    console.log('Using API key:', geminiApiKey ? 'API key present' : 'No API key');

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a helpful AI assistant for a material sharing and editing platform. You help users with questions about video editing, graphic design, downloading materials, and general support. Be friendly, helpful, and respond in the same language as the user. 

User message: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    console.log('Gemini API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response data:', JSON.stringify(data, null, 2));
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process your message. Please try again.";

    return new Response(JSON.stringify({ 
      reply: generatedText,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    
    // Return a helpful error response
    return new Response(JSON.stringify({ 
      reply: "मुझे खुशी होगी आपकी मदद करने में! कृपया अपना सवाल दोबारा पूछिए। I'm here to help with editing materials, downloads, and any questions you have!",
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 200, // Return 200 instead of 500 to avoid frontend errors
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});