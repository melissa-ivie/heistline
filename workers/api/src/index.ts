/**
 * Cloudflare Worker for Heistline API
 * Handles access code verification and Stripe payment integration
 */

export interface Env {
  DB: D1Database;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  HEISTLINE_ACCESS_TOKEN: string;
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Generate random access code
function generateAccessCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous chars
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
    if ((i + 1) % 4 === 0 && i < 11) code += '-';
  }
  return code;
}

// Handle OPTIONS request for CORS
function handleOptions() {
  return new Response(null, {
    headers: corsHeaders,
  });
}

// Verify access code
async function verifyAccess(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const heist = url.searchParams.get('heist');

  if (!code || !heist) {
    return new Response(JSON.stringify({ valid: false, error: 'Missing parameters' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const result = await env.DB.prepare(
      'SELECT * FROM access_codes WHERE code = ? AND heist_name = ? AND is_active = 1'
    )
      .bind(code, heist)
      .first();

    return new Response(JSON.stringify({ valid: !!result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ valid: false, error: 'Database error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Create Stripe Payment Intent
async function createPaymentIntent(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as { email: string; heistName: string };
    const { email, heistName } = body;

    if (!email || !heistName) {
      return new Response(JSON.stringify({ error: 'Missing email or heistName' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call Stripe API to create payment intent
    const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: '1000', // $10.00 in cents
        currency: 'usd',
        'metadata[email]': email,
        'metadata[heist_name]': heistName,
        'receipt_email': email,
      }),
    });

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.text();
      console.error('Stripe error:', errorData);
      return new Response(JSON.stringify({ error: 'Failed to create payment intent' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const paymentIntent = await stripeResponse.json() as { client_secret: string; id: string };

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Handle Stripe webhook
async function handleWebhook(request: Request, env: Env): Promise<Response> {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('No signature', { status: 400 });
  }

  const body = await request.text();

  try {
    // Verify webhook signature
    const verified = await verifyStripeSignature(body, signature, env.STRIPE_WEBHOOK_SECRET);
    if (!verified) {
      return new Response('Invalid signature', { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle successful payment
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const email = paymentIntent.metadata.email;
      const heistName = paymentIntent.metadata.heist_name;
      const paymentIntentId = paymentIntent.id;

      // Generate access code
      const accessCode = generateAccessCode();

      // Store in database
      await env.DB.prepare(
        'INSERT INTO access_codes (code, heist_name, email, payment_intent_id) VALUES (?, ?, ?, ?)'
      )
        .bind(accessCode, heistName, email, paymentIntentId)
        .run();

      // Send email with access code (using Cloudflare Email Workers or external service)
      await sendAccessCodeEmail(email, accessCode, heistName, env);

      console.log(`Access code created: ${accessCode} for ${email}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response('Webhook error', { status: 400 });
  }
}

// Verify Stripe webhook signature
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const signatureParts = signature.split(',');
  const timestamp = signatureParts.find((part) => part.startsWith('t='))?.split('=')[1];
  const signatures = signatureParts
    .filter((part) => part.startsWith('v1='))
    .map((part) => part.split('=')[1]);

  if (!timestamp || signatures.length === 0) {
    return false;
  }

  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
  const computedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return signatures.includes(computedSignature);
}

// Send access code email (placeholder - integrate with email service)
async function sendAccessCodeEmail(
  email: string,
  accessCode: string,
  heistName: string,
  env: Env
): Promise<void> {
  // TODO: Integrate with Cloudflare Email Workers, Resend, SendGrid, or Mailgun
  // For now, just log it
  console.log(`Would send email to ${email}: Access code ${accessCode} for ${heistName}`);

  // Example with a simple HTTP email service (you'll need to add your email service)
  // const emailResponse = await fetch('https://api.your-email-service.com/send', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     to: email,
  //     subject: `Your Heistline Access Code for ${heistName}`,
  //     text: `Your access code is: ${accessCode}\n\nUse this code to unlock ${heistName}.`,
  //   }),
  // });
}

// Main worker handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleOptions();
    }

    // Route requests
    if (url.pathname === '/api/verify-access' && request.method === 'GET') {
      return verifyAccess(request, env);
    }

    if (url.pathname === '/api/create-payment-intent' && request.method === 'POST') {
      return createPaymentIntent(request, env);
    }

    if (url.pathname === '/api/webhook' && request.method === 'POST') {
      return handleWebhook(request, env);
    }

    return new Response('Not Found', { status: 404 });
  },
};
