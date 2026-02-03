import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendVerificationEmail = async (email, fullName, verificationLink) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Welcome to Campus Echo!</h2>
            <p>Hello ${fullName},</p>
            <p>Thank you for registering with Campus Echo. To complete your registration, please verify your email address by clicking the link below:</p>
            <p style="margin: 30px 0;">
              <a href="${verificationLink}" 
                 style="background-color: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Verify Email
              </a>
            </p>
            <p style="color: #7f8c8d; font-size: 12px;">
              Or copy this link in your browser: <br/>
              ${verificationLink}
            </p>
            <p style="color: #7f8c8d; font-size: 12px;">
              This link will expire in 24 hours.
            </p>
            <hr style="border: none; border-top: 1px solid #ecf0f1;" />
            <p style="color: #7f8c8d; font-size: 12px;">
              © 2026 Campus Echo. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - Campus Echo',
      html: htmlContent
    });

    return { success: true, message: 'Verification email sent' };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: 'Failed to send verification email', error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, fullName, resetLink) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <div style="max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Password Reset Request</h2>
            <p>Hello ${fullName},</p>
            <p>We received a request to reset your password. Click the link below to proceed:</p>
            <p style="margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #06b6d4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Reset Password
              </a>
            </p>
            <p style="color: #7f8c8d; font-size: 12px;">
              Or copy this link in your browser: <br/>
              ${resetLink}
            </p>
            <p style="color: #7f8c8d; font-size: 12px;">
              This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #ecf0f1;" />
            <p style="color: #7f8c8d; font-size: 12px;">
              © 2026 Campus Echo. All rights reserved.
            </p>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset - Campus Echo',
      html: htmlContent
    });

    return { success: true, message: 'Password reset email sent' };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, message: 'Failed to send password reset email', error: error.message };
  }
};
