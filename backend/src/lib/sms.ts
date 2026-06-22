// Pluggable SMS sender for OTP delivery.
//
// In development (or when no provider is configured) the code is logged to the
// server console and also returned to the caller so it can be shown on-screen.
// To enable real SMS in production, set OTP_PROVIDER and the matching
// credentials, then implement the branch below (Twilio / MSG91 / etc.).

const PROVIDER = process.env.OTP_PROVIDER || 'dev';

export interface SendResult {
  delivered: boolean;
  // Present only in dev so the UI can display it without real SMS.
  devCode?: string;
}

export async function sendOtp(phone: string, code: string): Promise<SendResult> {
  if (PROVIDER === 'dev') {
    console.log(`[OTP] (dev) code for ${phone}: ${code}`);
    return { delivered: true, devCode: code };
  }

  // Example wiring points for later — fill in with real credentials:
  // if (PROVIDER === 'twilio') {
  //   const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
  //   await client.messages.create({ to: `+91${phone}`, from: process.env.TWILIO_FROM, body: `Your Vertex OTP is ${code}` });
  //   return { delivered: true };
  // }
  // if (PROVIDER === 'msg91') { /* call MSG91 OTP API with DLT template */ }

  console.warn(`[OTP] provider "${PROVIDER}" not implemented; code for ${phone}: ${code}`);
  return { delivered: false };
}

export const isDevOtp = () => PROVIDER === 'dev';
