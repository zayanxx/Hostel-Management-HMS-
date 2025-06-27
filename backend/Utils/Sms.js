import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

export let smsReady = false;

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

if (process.env.TWILIO_PHONE_NUMBER) {
  smsReady = true;
  console.log('SMS Sender is ready');
} else {
  console.error('SMS Sender initialization failed: Missing TWILIO_PHONE_NUMBER in .env');
  smsReady = false;
}

/**
 * Send an SMS message.
 * @param {Object} options - Message options.
 * @param {string} options.to - Recipient phone number.
 * @param {string} options.body - SMS message body.
 */
export const sendSMS = async ({ to, body }) => {
  if (!to || typeof to !== 'string' || to.trim() === '') {
    throw new Error('No valid recipient phone number provided');
  }
  try {
    const message = await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`SMS sent to ${to}`);
    return message;
  } catch (err) {
    console.error(`Failed to send SMS to ${to}:`, err.message);
    throw err;
  }
};
