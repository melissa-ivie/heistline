# Cloudflare Migration Setup Guide

This guide will walk you through migrating your Heistline backend from Render.com to Cloudflare.

## Prerequisites

- Cloudflare account
- Cloudflare Pages already set up (✅ Done!)
- Node.js and npm installed
- Wrangler CLI installed (`npm install -g wrangler`)

---

## Step 1: Create Cloudflare D1 Database

### 1.1 Login to Wrangler
```bash
wrangler login
```

### 1.2 Create the D1 Database
```bash
wrangler d1 create heistline-db
```

You'll get output like:
```
✅ Successfully created DB 'heistline-db'!

[[d1_databases]]
binding = "DB"
database_name = "heistline-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### 1.3 Copy the database_id
Copy the `database_id` and update it in `workers/api/wrangler.toml`

### 1.4 Initialize the Database Schema
```bash
wrangler d1 execute heistline-db --file=schema.sql
```

This creates the `access_codes` table.

### 1.5 Verify Database (Optional)
```bash
wrangler d1 execute heistline-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

---

## Step 2: Deploy the Cloudflare Worker

### 2.1 Install Dependencies
```bash
cd workers/api
npm install
```

### 2.2 Set Environment Variables (Secrets)

Set your Stripe secret key:
```bash
wrangler secret put STRIPE_SECRET_KEY
```
Enter your Stripe secret key when prompted (starts with `sk_test_` or `sk_live_`)

Set your Stripe webhook secret (we'll get this in Step 3):
```bash
wrangler secret put STRIPE_WEBHOOK_SECRET
```
Enter your webhook signing secret (starts with `whsec_`)

Set your Heistline access token:
```bash
wrangler secret put HEISTLINE_ACCESS_TOKEN
```
Enter: `TwinkleLittle5tars!`

### 2.3 Deploy the Worker
```bash
wrangler deploy
```

You'll get a URL like: `https://heistline-api.YOUR-SUBDOMAIN.workers.dev`

**Save this URL!** You'll need it for the frontend.

---

## Step 3: Set Up Stripe Webhook

### 3.1 Go to Stripe Dashboard
- Login to https://dashboard.stripe.com
- Go to **Developers** → **Webhooks**

### 3.2 Add Endpoint
- Click **Add endpoint**
- Enter URL: `https://heistline-api.YOUR-SUBDOMAIN.workers.dev/api/webhook`
- Select events to listen for:
  - `payment_intent.succeeded`
- Click **Add endpoint**

### 3.3 Get Webhook Signing Secret
- Click on your newly created webhook
- Click **Reveal** next to "Signing secret"
- Copy the secret (starts with `whsec_`)

### 3.4 Update Worker Secret
```bash
cd workers/api
wrangler secret put STRIPE_WEBHOOK_SECRET
```
Paste the webhook signing secret

### 3.5 Redeploy Worker
```bash
wrangler deploy
```

---

## Step 4: Update Frontend to Use Cloudflare API

### 4.1 Create Environment Variable
In your Cloudflare Pages project:
- Go to **Settings** → **Environment variables**
- Add new variable:
  - Name: `VITE_API_URL`
  - Value: `https://heistline-api.YOUR-SUBDOMAIN.workers.dev`
  - Environment: Production & Preview

### 4.2 Update Frontend Code
The frontend files need to be updated to use the new API URL. This will be done in the next step.

---

## Step 5: Add Custom Domain to Worker (Optional)

If you want your API at `heistline.com/api/*` instead of the workers.dev URL:

### 5.1 In Cloudflare Dashboard
- Go to **Workers & Pages** → **heistline-api**
- Click **Settings** → **Triggers** → **Add Custom Domain**
- Enter: `api.heistline.com` or set up a route

### 5.2 Update wrangler.toml
Uncomment and configure the routes section in `workers/api/wrangler.toml`

### 5.3 Update Frontend
Change `VITE_API_URL` to `https://heistline.com/api` or `https://api.heistline.com`

---

## Step 6: Set Up Email Service (Required for sending access codes)

The Worker currently logs emails instead of sending them. You need to integrate an email service:

### Option 1: Cloudflare Email Workers (Recommended)
- Follow: https://developers.cloudflare.com/email-routing/email-workers/

### Option 2: Resend (Simple & Free tier)
1. Sign up at https://resend.com
2. Get API key
3. Add secret: `wrangler secret put RESEND_API_KEY`
4. Update the `sendAccessCodeEmail` function in `workers/api/src/index.ts`

### Option 3: SendGrid or Mailgun
- Similar process: get API key, add as secret, update function

---

## Step 7: Test Everything

### 7.1 Test Access Code Verification
```bash
curl "https://heistline-api.YOUR-SUBDOMAIN.workers.dev/api/verify-access?code=TEST-CODE-HERE&heist=Test%20Heist"
```

Should return: `{"valid":false}` (since no codes exist yet)

### 7.2 Test Payment Intent Creation
```bash
curl -X POST https://heistline-api.YOUR-SUBDOMAIN.workers.dev/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","heistName":"Test Heist"}'
```

Should return a `clientSecret`

### 7.3 Test End-to-End
1. Go to your Heistline site
2. Try to purchase a heist
3. Complete payment with test card: `4242 4242 4242 4242`
4. Check Stripe Dashboard → Webhooks → verify webhook was called
5. Check Worker logs: `wrangler tail heistline-api`
6. Verify access code was created in database:
```bash
wrangler d1 execute heistline-db --command="SELECT * FROM access_codes"
```

---

## Step 8: Clean Up Old Backend

Once everything is working:
1. Delete or stop your Render.com backend
2. Remove the old API URL from your code
3. Update any documentation

---

## Troubleshooting

### Check Worker Logs
```bash
wrangler tail heistline-api
```

### Query Database
```bash
wrangler d1 execute heistline-db --command="SELECT * FROM access_codes ORDER BY created_at DESC LIMIT 10"
```

### Test Webhook Locally
```bash
cd workers/api
wrangler dev
```
Then use Stripe CLI to forward webhooks:
```bash
stripe listen --forward-to http://localhost:8787/api/webhook
```

---

## Cost Estimate

- **Cloudflare Pages**: Free (unlimited bandwidth)
- **Cloudflare Workers**: Free tier (100,000 requests/day)
- **Cloudflare D1**: Free tier (5GB storage, 5M reads/day)
- **Total**: $0/month for most usage! 🎉

---

## Next Steps

After completing this setup:
1. Update frontend code to use new API endpoints
2. Set up email service for access code delivery
3. Test thoroughly with Stripe test mode
4. Switch to Stripe live keys when ready for production
5. Monitor usage in Cloudflare Dashboard
