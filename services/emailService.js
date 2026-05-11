import getTransporter from "../config/mail.js";

const fromEmail = process.env.FROM_EMAIL || "noreply@eventsphere.com";

/**
 * Send OTP verification email to user.
 */
const sendOTPEmail = async (toEmail, userName, otp) => {
  const mailOptions = {
    from: `"EventSphere" <${fromEmail}>`,
    to: toEmail,
    subject: "Verify Your EventSphere Account",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 26px;">EventSphere</h1>
          <p style="color: #e8e0ff; margin: 8px 0 0; font-size: 14px;">Smart Event & Ticket Booking</p>
        </div>
        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; color: #333;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 14px; color: #555;">Use the following OTP to verify your account. It is valid for <strong>5 minutes</strong>.</p>
          <div style="text-align: center; margin: 28px 0;">
            <span style="display: inline-block; background: #f3f0ff; color: #5b21b6; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 32px; border-radius: 8px; border: 2px dashed #a78bfa;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #888;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  await getTransporter().sendMail(mailOptions);
};

/**
 * Send booking confirmation email to user.
 */
const sendBookingConfirmation = async (toEmail, userName, bookingDetails) => {
  const { eventTitle, numberOfTickets, totalAmount, eventDate, location } = bookingDetails;

  const mailOptions = {
    from: `"EventSphere" <${fromEmail}>`,
    to: toEmail,
    subject: `Booking Confirmed – ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #22c55e 0%, #15803d 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 Booking Confirmed!</h1>
        </div>
        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; color: #333;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 14px; color: #555;">Your booking has been confirmed. Here are the details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Event</td><td style="padding: 8px 0; font-weight: bold; color: #333;">${eventTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Date</td><td style="padding: 8px 0; color: #333;">${new Date(eventDate).toLocaleDateString("en-IN", { dateStyle: "long" })}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Location</td><td style="padding: 8px 0; color: #333;">${location}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Tickets</td><td style="padding: 8px 0; color: #333;">${numberOfTickets}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Total</td><td style="padding: 8px 0; font-weight: bold; color: #22c55e;">₹${totalAmount}</td></tr>
          </table>
          <p style="font-size: 13px; color: #888;">Thank you for booking with EventSphere!</p>
        </div>
      </div>
    `,
  };

  await getTransporter().sendMail(mailOptions);
};

/**
 * Send password reset email.
 */
const sendPasswordResetEmail = async (toEmail, userName, otp) => {
  const mailOptions = {
    from: `"EventSphere" <${fromEmail}>`,
    to: toEmail,
    subject: "Reset Your Password – EventSphere",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🔒 Password Reset</h1>
        </div>
        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; color: #333;">Hello <strong>${userName}</strong>,</p>
          <p style="font-size: 14px; color: #555;">You requested a password reset. Use the following OTP to reset your password. It is valid for <strong>5 minutes</strong>.</p>
          <div style="text-align: center; margin: 28px 0;">
            <span style="display: inline-block; background: #fef2f2; color: #b91c1c; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 32px; border-radius: 8px; border: 2px dashed #f87171;">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #888;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  await getTransporter().sendMail(mailOptions);
};

export default { sendOTPEmail, sendBookingConfirmation, sendPasswordResetEmail };
