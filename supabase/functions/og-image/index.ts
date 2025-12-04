import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const materialId = url.searchParams.get("id");

    if (!materialId) {
      return new Response("Missing material ID", { status: 400 });
    }

    console.log("Fetching OG data for material:", materialId);

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch material data
    const { data: material, error } = await supabase
      .from("content")
      .select("id, title, description, thumbnail_url, price, is_premium")
      .eq("id", materialId)
      .single();

    if (error || !material) {
      console.error("Material not found:", error);
      return new Response("Material not found", { status: 404 });
    }

    const title = `${material.title} - Gyaan Repo`;
    const description = material.description || `Download ${material.title} - Professional coding material from Gyaan Repo. Instant digital download.`;
    const imageUrl = material.thumbnail_url || "https://i.ibb.co/XkjPcgsv/icon.jpg";
    const pageUrl = `https://gyaanrepo.netlify.app/material/${material.id}`;
    const priceText = material.is_premium ? `₹${material.price || 0} INR` : "Free";

    // Return HTML with proper OG tags for social media crawlers
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${pageUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Gyaan Repo">
  <meta property="product:price:amount" content="${material.price || 0}">
  <meta property="product:price:currency" content="INR">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${pageUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <!-- Redirect to actual page -->
  <meta http-equiv="refresh" content="0; url=${pageUrl}">
  <link rel="canonical" href="${pageUrl}">
</head>
<body>
  <h1>${material.title}</h1>
  <p>${description}</p>
  <p>Price: ${priceText}</p>
  <img src="${imageUrl}" alt="${material.title}">
  <p>Redirecting to <a href="${pageUrl}">Gyaan Repo</a>...</p>
</body>
</html>`;

    return new Response(html, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating OG page:", error);
    return new Response("Internal server error", { status: 500 });
  }
});
