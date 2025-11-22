import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

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
    console.log('Using Lovable AI key:', lovableApiKey ? 'API key present' : 'No API key');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant for a creative materials and resources platform. You help users understand and use the website effectively.

**WEBSITE FEATURES:**

**1. Materials & Downloads**
- Free and Premium materials available (overlays, LUTs, presets, SFX, transitions, templates)
- How to download: Click on any material card → Click "Download" button → File downloads automatically
- Premium materials require payment via Razorpay
- All downloads are tracked

**2. AI Gallery & Images**
- Browse AI-generated images by category
- View prompts used to generate each image
- Download images for inspiration
- Featured images showcased on homepage

**3. Code Snippets & Tutorials**
- HTML, CSS, JavaScript code examples
- Copy code directly from code preview
- Tutorials with step-by-step instructions
- Software compatibility info (Premiere Pro, After Effects, DaVinci Resolve, etc.)

**4. User Features**
- Create account/login to access premium content
- Track download history
- Like, comment, and rate materials
- Share materials on social media

**5. Search & Filter**
- Search materials by title, description, tags
- Filter by category (overlays, LUTs, presets, etc.)
- Filter by software compatibility
- View featured and trending materials

**COMMON USER QUESTIONS:**

**Q: How to download materials?**
A: 1) Browse materials on homepage or Materials page
   2) Click on any material card to view details
   3) Click "Download" button (free materials) or "Purchase" (premium materials)
   4) File downloads automatically

**Q: How to download image prompts?**
A: 1) Go to Gallery page
   2) Click on any image
   3) View the prompt text displayed
   4) Copy the prompt or download the image

**Q: How to purchase premium materials?**
A: 1) Click on premium material
   2) Click "Purchase" button
   3) Complete payment via Razorpay
   4) Download becomes available after successful payment

**Q: How to search for specific materials?**
A: Use the search bar at the top of the page or on Materials page, type keywords, and filter by category

**Q: What software is supported?**
A: Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro, Photoshop, and more

**FORMATTING RULES:**
- Use **bold** for important headings and key points
- Use \`code\` for inline code snippets
- Use \`\`\`language for code blocks (like \`\`\`javascript, \`\`\`python, etc.)
- Use numbered lists (1. 2. 3.) for step-by-step instructions
- Use bullet points (-) for lists
- Break your answer into clear sections with headings
- Keep paragraphs short and readable
- Always respond in the same language the user asks in (Hindi, English, etc.)`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      }),
    });

    console.log('Lovable AI response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error response:', errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          reply: "Rate limit exceeded. Please try again later.",
          error: "rate_limit"
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          reply: "Payment required. Please add credits to your workspace.",
          error: "payment_required"
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Lovable AI error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Lovable AI response data:', JSON.stringify(data, null, 2));
    
    const generatedText = data.choices?.[0]?.message?.content || "Sorry, I couldn't process your message. Please try again.";

    return new Response(JSON.stringify({ 
      reply: generatedText,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-with-gemini function:', error);
    
    return new Response(JSON.stringify({ 
      reply: "Sorry, I encountered an error. Please try again.",
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});