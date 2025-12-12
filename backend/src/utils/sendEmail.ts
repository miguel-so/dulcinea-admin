import nodemailer from 'nodemailer';

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {

  // Microsoft 365 SMTP Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,            // smtp.office365.com
    port: Number(process.env.SMTP_PORT),    // 587
    secure: false,                          // MUST be false on port 587 (STARTTLS)
    auth: {
      user: process.env.SMTP_USER,          // Your Microsoft 365 email
      pass: process.env.SMTP_PASSWORD       // Microsoft 365 password or App Password
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false             // Prevents certificate issues
    }
  });

  // Email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    // cc: process.env.FROM_EMAIL,             // ALWAYS CC Kimberly
    subject: options.subject,
    text: options.message
  };

  // Send email
  await transporter.sendMail(mailOptions);
};
