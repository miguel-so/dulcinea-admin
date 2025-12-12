const nodemailer = require("nodemailer");
require("dotenv").config({ path: __dirname + "/.env" });

async function testSMTP() {
  console.log("Testing Microsoft 365 SMTP Login...");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,        // smtp.office365.com
    port: Number(process.env.SMTP_PORT),// 587
    secure: false,                      // must be false for STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false
    }
  });

  try {
    // verify() checks login without sending an email
    await transporter.verify();
    console.log("SUCCESS: SMTP login successful!");
  } catch (err) {
    console.log("ERROR: SMTP login failed!");
    console.error(err);
  }
}

testSMTP();
