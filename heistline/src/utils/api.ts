/**
 * API utility for Heistline
 * Handles all backend API calls with fallback support
 */

// Use environment variable for API URL, fallback to Render.com for now
const API_URL = import.meta.env.VITE_API_URL || 'https://heistline-access-api.onrender.com';

export interface VerifyAccessResponse {
  valid: boolean;
  error?: string;
}

export interface CreatePaymentIntentResponse {
  clientSecret?: string;
  error?: string;
}

/**
 * Verify an access code for a heist
 */
export async function verifyAccessCode(
  code: string,
  heistName: string
): Promise<VerifyAccessResponse> {
  try {
    const response = await fetch(
      `${API_URL}/api/verify-access?code=${encodeURIComponent(code)}&heist=${encodeURIComponent(heistName)}`
    );

    if (!response.ok) {
      return { valid: false, error: 'Failed to verify access code' };
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying access code:', error);
    return { valid: false, error: 'Network error' };
  }
}

/**
 * Create a Stripe payment intent
 */
export async function createPaymentIntent(
  email: string,
  heistName: string
): Promise<CreatePaymentIntentResponse> {
  try {
    const response = await fetch(`${API_URL}/api/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, heistName }),
    });

    if (!response.ok) {
      return { error: 'Failed to create payment intent' };
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return { error: 'Network error' };
  }
}
