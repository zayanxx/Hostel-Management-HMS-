import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export let emailReady = false;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email Sender initialization failed:', error.message);
  } else {
    emailReady = true;
    console.log('Email Sender is ready');
  }
});

/**
 * Send an email message.
 * @param {Object} options - Message options.
 * @param {string} options.to - Recipient email address.
 * @param {string} options.subject - Email subject.
 * @param {string} options.html - Email HTML body.
 */
export const sendEmail = async ({ to, subject, html }) => {
  if (!to || typeof to !== 'string' || to.trim() === '') {
    throw new Error('No valid recipient email provided');
  }

  const mailOptions = {
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err.message);
    throw err;
  }
};
