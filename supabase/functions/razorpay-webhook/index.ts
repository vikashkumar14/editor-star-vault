import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-razorpay-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('x-razorpay-signature');
    const body = await req.text();
    
    if (!signature) {
      console.error('Missing Razorpay signature');
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify webhook signature
    const razorpayWebhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET') || Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!razorpayWebhookSecret) {
      console.error('Razorpay webhook secret not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const expectedSignature = createHmac('sha256', razorpayWebhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('Webhook signature verification failed');
      return new Response(
        JSON.stringify({ error: 'Invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = JSON.parse(body);
    console.log('Webhook event received:', payload.event);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle different webhook events
    if (payload.event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      console.log('Payment captured:', paymentId, 'for order:', orderId);

      // Update purchase status
      const { error: updateError } = await supabaseClient
        .from('premium_purchases')
        .update({
          status: 'success',
          razorpay_payment_id: paymentId,
          payment_method: payment.method || 'unknown',
          updated_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', orderId);

      if (updateError) {
        console.error('Failed to update purchase:', updateError);
      }
    } else if (payload.event === 'payment.failed') {
      const payment = payload.payload.payment.entity;
      const orderId = payment.order_id;

      console.log('Payment failed for order:', orderId);

      // Update purchase status
      await supabaseClient
        .from('premium_purchases')
        .update({
          status: 'failed',
          razorpay_payment_id: payment.id,
          updated_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', orderId);
    }

    return new Response(
      JSON.stringify({ status: 'ok' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in razorpay-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});