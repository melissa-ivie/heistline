/**
 * Cloudflare Worker for Heistline API
 * Handles access code verification and Stripe payment integration
 */

export interface Env {
  DB: D1Database;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  HEISTLINE_ACCESS_TOKEN: string;
  RESEND_API_KEY?: string; // Optional: for Resend email service
  EMAIL_FROM?: string; // Email address to send from (e.g., "Heistline <codes@heistline.com>")
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

// Send access code email
async function sendAccessCodeEmail(
  email: string,
  accessCode: string,
  heistName: string,
  env: Env
): Promise<void> {
  const fromEmail = env.EMAIL_FROM || 'noreply@heistline.com';
  const subject = `Your Heistline Access Code for ${heistName}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0f1a; color: #e3eaf3; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #121e30; border-radius: 12px; padding: 40px; }
        .code { font-size: 32px; font-weight: bold; color: #4a9eff; letter-spacing: 2px; text-align: center; padding: 20px; background: #0f1c2f; border-radius: 8px; margin: 30px 0; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .message { line-height: 1.6; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #2a3244; font-size: 14px; color: #8b95a5; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="title">🎯 Mission Unlocked!</div>
        <div class="message">
          Thank you for purchasing access to <strong>${heistName}</strong>!
        </div>
        <div class="message">
          Your access code is:
        </div>
        <div class="code">${accessCode}</div>
        <div class="message">
          Use this code to unlock and start your mission at <a href="https://heistline.com" style="color: #4a9eff;">heistline.com</a>
        </div>
        <div class="footer">
          This is an automated email. Please save this code for your records.
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
🎯 Mission Unlocked!

Thank you for purchasing access to ${heistName}!

Your access code is: ${accessCode}

Use this code to unlock and start your mission at https://heistline.com

---
This is an automated email. Please save this code for your records.
  `.trim();

  // Try Resend first if API key is available
  if (env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: email,
          subject: subject,
          html: htmlContent,
          text: textContent,
        }),
      });

      if (response.ok) {
        console.log(`Email sent successfully to ${email} via Resend`);
        return;
      } else {
        const errorData = await response.text();
        console.error('Resend API error:', errorData);
      }
    } catch (error) {
      console.error('Failed to send email via Resend:', error);
    }
  }

  // Fallback: Log the email (for testing without email service)
  console.log(`
    ===== EMAIL TO SEND =====
    To: ${email}
    Subject: ${subject}
    Access Code: ${accessCode}
    Heist: ${heistName}
    =========================
  `);
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
