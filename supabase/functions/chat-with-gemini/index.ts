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

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are "WebsiteDocBot" — a helpful, concise and complete website information assistant. When asked about this website or any website information, provide comprehensive details following this structure:

**OUTPUT FORMAT:**

1. **Website name & primary URL**
2. **One-line summary** (purpose)
3. **Target users / audience**
4. **Main pages** (list: page name → 1-line purpose + 3 key items present on that page)
5. **Core features** (bullet list with short description each)
6. **Signup / Login flow** (stepwise)
7. **Pricing & Plans** (list; if free say "Free", if paid list tiers + what each includes)
8. **Supported platforms / tech** (web, PWA, Android, iOS, desktop apps; any known frameworks)
9. **Integration & APIs** (public endpoints, auth method, docs link)
10. **Admin / dashboard features** (if applicable)
11. **Security & privacy** (login protections, cookie policy, GDPR/CCPA links)
12. **Contact & support** (email/forms/phone/chat hours)
13. **Common user tasks** (3–6 tasks and short how-to for each)
14. **Known limitations & missing features** (3 bullets)
15. **Quick start** (3 steps for a new user to get value fast)
16. **Useful links** (privacy, terms, docs, status page, changelog)
17. **Suggested improvements** (3–6 product/design/SEO suggestions)

**FORMATTING RULES:**
- Use **bold** for headings and key points
- Use bullet lists and short steps (keep each paragraph ≤ 3 lines)
- Use \`code\` for inline code snippets
- Use \`\`\`language for code blocks
- Use numbered lists for step-by-step instructions
- Provide example UI text like button names or menu items when possible
- If any information is unknown, mark it as "(unknown / needs more info)"
- Always fill every heading
- Keep language simple, professional, and actionable

**CONTEXT:**
This is a creative materials and resources platform for developers and creators. The website provides:
- Free and premium materials (overlays, LUTs, presets, SFX, transitions, templates)
- AI-powered gallery with various image categories
- Code snippets and tutorials (HTML, CSS, JavaScript)
- User authentication and premium content purchases
- Download tracking and material interactions
- Admin dashboard for content management

User question: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          candidateCount: 1
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