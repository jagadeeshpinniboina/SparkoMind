import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER || 'pinniboinajagadeesh76@gmail.com';
const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD || 'jitpirxzsafqnnqj';

// Create persistent Gmail SMTP transporter
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_APP_PASSWORD
  }
});

/**
 * Mask an email address for refined privacy display (e.g. pinniboinajagadeesh76@gmail.com -> pi***76@gmail.com)
 */
export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}*@${domain}`;
  }
  if (local.length <= 4) {
    return `${local[0]}**${local[local.length - 1]}@${domain}`;
  }
  return `${local.slice(0, 2)}***${local.slice(-2)}@${domain}`;
};

/**
 * Dispatch real 6-digit OTP email via Nodemailer Gmail SMTP
 */
export const sendOtpEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"SparkoMind" <${EMAIL_USER}>`,
    to: toEmail,
    subject: "SparkoMind Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 40px 15px; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 540px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1.5px solid #E2E8F0; padding: 40px 32px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);">
          
          <!-- Brand Header Lockup -->
          <div style="text-align: center; margin-bottom: 28px;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #4F46E5; letter-spacing: -0.5px;">
              🧠 SparkoMind
            </h1>
            <p style="margin: 6px 0 0 0; font-size: 14px; font-weight: 500; color: #64748B;">
              Cognitive Development & Brain Training Platform
            </p>
          </div>

          <!-- Greeting & Body -->
          <p style="margin: 0 0 12px 0; font-size: 15px; color: #334155;">Hello,</p>
          <p style="margin: 0 0 24px 0; font-size: 15px; color: #475569; line-height: 1.6;">
            Your SparkoMind verification code is:
          </p>

          <!-- Centered OTP Box (Clean Dashed Border) -->
          <div style="margin: 28px 0; text-align: center;">
            <div style="display: inline-block; background-color: #EEF2FF; border: 2px dashed #6366F1; border-radius: 16px; padding: 18px 42px;">
              <span style="font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #4338CA; text-indent: 12px; display: inline-block;">
                ${otp}
              </span>
            </div>
          </div>

          <!-- Validity & Warning Note -->
          <p style="margin: 0 0 32px 0; font-size: 13.5px; text-align: center; color: #64748B;">
            Valid for <strong style="color: #1E293B;">5 minutes</strong>. Do not share this code with anyone.
          </p>

          <!-- Footer Notice -->
          <div style="border-top: 1px solid #F1F5F9; padding-top: 20px; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 12.5px; color: #94A3B8;">
              If you did not request this verification code, please ignore this email.
            </p>
            <p style="margin: 0; font-size: 12px; color: #CBD5E1; font-weight: 500;">
              © 2026 SparkoMind — Cognitive & Interactive Learning Systems
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
    text: `Your SparkoMind verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Dispatch real 6-digit Password Reset OTP email via Nodemailer Gmail SMTP
 */
export const sendPasswordResetEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: `"SparkoMind" <${EMAIL_USER}>`,
    to: toEmail,
    subject: "Your SparkoMind Password Reset Code",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 40px 15px; background-color: #070A11; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 520px; margin: 0 auto; background: #0F172A; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); padding: 40px 32px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);">
          
          <!-- Brand Header Lockup -->
          <div style="text-align: center; margin-bottom: 28px;">
            <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">
              🧠 <span style="color: #FFFFFF;">Sparko</span><span style="color: #818CF8;">Mind</span>
            </h1>
            <p style="margin: 6px 0 0 0; font-size: 14px; font-weight: 500; color: #94A3B8;">
              Cognitive Development & Brain Training Platform
            </p>
          </div>

          <!-- Greeting & Body -->
          <p style="margin: 0 0 12px 0; font-size: 15px; color: #F1F5F9;">Hello,</p>
          <p style="margin: 0 0 24px 0; font-size: 15px; color: #94A3B8; line-height: 1.6;">
            We received a request to reset your SparkoMind password. Use the 6-digit verification code below to complete your password reset:
          </p>

          <!-- Centered OTP Box (SparkoMind Obsidian & Purple Neon Glow) -->
          <div style="margin: 28px 0; text-align: center;">
            <div style="display: inline-block; background-color: #1E1B4B; border: 2px dashed #6366F1; border-radius: 16px; padding: 18px 42px;">
              <span style="font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #A5B4FC; text-indent: 12px; display: inline-block;">
                ${otp}
              </span>
            </div>
          </div>

          <!-- Validity & Warning Note -->
          <p style="margin: 0 0 32px 0; font-size: 13.5px; text-align: center; color: #94A3B8;">
            Valid for <strong style="color: #F8FAFC;">10 minutes</strong>. Do not share this code with anyone.
          </p>

          <!-- Footer Notice -->
          <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px; text-align: center;">
            <p style="margin: 0 0 8px 0; font-size: 12.5px; color: #64748B;">
              If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
            <p style="margin: 0; font-size: 12px; color: #475569; font-weight: 500;">
              © 2026 SparkoMind — Cognitive & Interactive Learning Systems
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
    text: `Your SparkoMind password reset code is: ${otp}. Valid for 10 minutes. Do not share this code with anyone.`
  };

  return transporter.sendMail(mailOptions);
};

export default {
  sendOtpEmail,
  sendPasswordResetEmail,
  maskEmail
};
