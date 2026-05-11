import authService from "../services/authService.js";
import otpService from "../services/otpService.js";
import emailService from "../services/emailService.js";

/**
 * POST /api/auth/signup — User signup only.
 */
export const signup = async (req, res, next) => {
  try {
    const result = await authService.signup(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login — All roles.
 */
export const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/verify-otp — Verify user OTP.
 */
export const verifyOTP = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const result = await otpService.verifyOTP(userId, otp);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/resend-otp — Resend OTP to user.
 */
export const resendOTP = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const result = await otpService.resendOTP(userId);
    await emailService.sendOTPEmail(result.email, result.name, result.otp);
    res.status(200).json({ success: true, data: { message: "OTP resent successfully." } });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/forgot-password — Request password reset email
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/verify-password-otp
 */
export const verifyPasswordOtp = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;
    const result = await authService.verifyPasswordOtp(userId, otp);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/resend-password-otp
 */
export const resendPasswordOtp = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const result = await authService.resendPasswordOtp(userId);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/reset-password — Reset password
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};
