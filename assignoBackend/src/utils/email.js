import nodemailer from "nodemailer";

let transporterPromise = null;

// Initialize or retrieve the Nodemailer transporter
const getTransporter = async () => {
  if (transporterPromise) {
    return transporterPromise;
  }

  transporterPromise = (async () => {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASSWORD;

    if (host && port && user && pass) {
      console.log("SMTP Configured using environment variables.");
      return nodemailer.createTransport({
        host,
        port: parseInt(port),
        secure: parseInt(port) === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });
    }

    console.log("No SMTP environment variables found. Initializing Ethereal Mail...");
    try {
      const testAccount = await nodemailer.createTestAccount();
      console.log("Ethereal Mail initialized successfully.");
      console.log(`Ethereal User: ${testAccount.user}`);
      return nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (err) {
      console.error("Failed to initialize Ethereal Mail. Using stub transport.", err);
      // Stub transporter so application does not crash
      return {
        sendMail: async (mailOptions) => {
          console.log("[EMAIL STUB] Could not send email via transporter. Options:", mailOptions);
          return { messageId: "stub-id" };
        }
      };
    }
  })();

  return transporterPromise;
};

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to Recipient email
 * @param {string} options.subject Email subject
 * @param {string} options.html HTML content of the email
 * @param {string} options.text Text fallback content
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = await getTransporter();
    const fromName = process.env.EMAIL_FROM_NAME || "Assigno";
    const fromAddress = process.env.EMAIL_FROM_ADDRESS || "noreply@assigno.com";
    
    const mailOptions = {
      from: `"${fromName}" <${fromAddress}>`,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // If Ethereal test mail is used, log the preview URL
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`\n==================================================`);
      console.log(`✉️  Ethereal Email Preview: ${previewUrl}`);
      console.log(`==================================================\n`);
    }
    
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * Send Email OTP for registration verification
 * @param {string} email 
 * @param {string} otpCode 
 */
export const sendVerificationOTP = async (email, otpCode) => {
  // Always output OTP in the console in big blocks for the developer
  console.log(`\n==================================================`);
  console.log(`🔑  OTP VERIFICATION CODE FOR ${email.toUpperCase()}`);
  console.log(`    CODE: [ ${otpCode} ]`);
  console.log(`    Expires in: 5 minutes`);
  console.log(`==================================================\n`);

  const subject = `${otpCode} is your Assigno verification code`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body { font-family: 'Inter', sans-serif; background-color: #ECE5E7; color: #00311F; margin: 0; padding: 0; }
        .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid rgba(0, 49, 31, 0.08); box-shadow: 0 4px 12px rgba(0, 49, 31, 0.03); }
        .logo { font-size: 24px; font-weight: 800; color: #00311F; margin-bottom: 24px; letter-spacing: -0.5px; }
        .title { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .text { font-size: 15px; color: #315347; line-height: 1.5; margin-bottom: 24px; }
        .otp-box { background-color: #041D15; color: #ECE5E7; font-size: 32px; font-weight: 800; text-align: center; padding: 16px; border-radius: 12px; letter-spacing: 6px; margin: 24px 0; }
        .footer { font-size: 12px; color: #7F9990; margin-top: 32px; border-top: 1px solid rgba(0, 49, 31, 0.08); padding-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Assigno</div>
        <div class="title">Verify Your Email Address</div>
        <p class="text">Thank you for registering! Use the security verification code below to verify your account. This code is valid for <strong>5 minutes</strong>.</p>
        <div class="otp-box">${otpCode}</div>
        <p class="text">If you did not request this verification, please ignore this email.</p>
        <div class="footer">
          This is an automated message from Assigno. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `Verify Your Email: Your OTP verification code is ${otpCode}. It is valid for 5 minutes.`;

  return sendEmail({ to: email, subject, html, text });
};

/**
 * Send Password Reset Link
 * @param {string} email 
 * @param {string} resetLink 
 */
export const sendPasswordResetEmail = async (email, resetLink) => {
  // Output link in the console for the developer
  console.log(`\n==================================================`);
  console.log(`🔗  PASSWORD RESET LINK FOR ${email.toUpperCase()}`);
  console.log(`    LINK: ${resetLink}`);
  console.log(`    Expires in: 15 minutes`);
  console.log(`==================================================\n`);

  const subject = "Reset your Assigno password";
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
      <style>
        body { font-family: 'Inter', sans-serif; background-color: #ECE5E7; color: #00311F; margin: 0; padding: 0; }
        .container { max-width: 500px; margin: 40px auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid rgba(0, 49, 31, 0.08); box-shadow: 0 4px 12px rgba(0, 49, 31, 0.03); }
        .logo { font-size: 24px; font-weight: 800; color: #00311F; margin-bottom: 24px; letter-spacing: -0.5px; }
        .title { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
        .text { font-size: 15px; color: #315347; line-height: 1.5; margin-bottom: 28px; }
        .btn-wrapper { text-align: center; margin: 28px 0; }
        .btn { background: linear-gradient(135deg, #A63B12 0%, #B65A1B 100%); color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(166, 59, 12, 0.2); }
        .footer { font-size: 12px; color: #7F9990; margin-top: 32px; border-top: 1px solid rgba(0, 49, 31, 0.08); padding-top: 16px; }
        .link-text { word-break: break-all; font-size: 13px; color: #7F9990; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">Assigno</div>
        <div class="title">Reset Your Password</div>
        <p class="text">We received a request to reset the password associated with your account. Click the button below to secure your account and set a new password. This link is valid for <strong>15 minutes</strong>.</p>
        <div class="btn-wrapper">
          <a href="${resetLink}" class="btn" target="_blank">Reset Password</a>
        </div>
        <p class="text">If the button above does not work, copy and paste this URL into your browser:</p>
        <p class="link-text"><a href="${resetLink}">${resetLink}</a></p>
        <p class="text">If you did not request a password reset, please ignore this email safely.</p>
        <div class="footer">
          This is an automated message from Assigno. Please do not reply.
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Reset Your Password: Copy and paste this link into your browser to reset your password: ${resetLink}. The link is valid for 15 minutes.`;

  return sendEmail({ to: email, subject, html, text });
};
