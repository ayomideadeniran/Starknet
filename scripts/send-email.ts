import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

import * as postmark from 'postmark';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function sendEmailTo(recipientEmail: string, htmlContent: string) {
  console.log(`\n--------------------------------------------------`);
  console.log(`Sending template to ${recipientEmail}...`);

  // 1. Try Postmark API if POSTMARK_SERVER_TOKEN exists
  const postmarkToken = process.env.POSTMARK_SERVER_TOKEN;
  const postmarkFrom = process.env.POSTMARK_FROM_EMAIL || 'info@starknetdev.online';

  if (postmarkToken && postmarkToken !== 'your_postmark_server_token') {
    console.log(`[Postmark] Attempting delivery via Postmark Server API...`);
    try {
      const client = new postmark.ServerClient(postmarkToken);
      const res = await client.sendEmail({
        From: postmarkFrom,
        To: recipientEmail,
        Subject: 'StarknetDev — Web3 Investment Insights',
        HtmlBody: htmlContent,
        TextBody: 'StarknetDev - Web3 Investment Insights',
        MessageStream: 'outbound',
      });
      console.log(`✅ Email successfully sent via Postmark to ${recipientEmail}! MessageID:`, res.MessageID);
      return true;
    } catch (err: any) {
      console.error(`❌ Postmark dispatch failed for ${recipientEmail}:`, err?.message || err);
    }
  }

  // 2. Try Nodemailer if SMTP configuration exists
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    console.log(`[SMTP] Attempting delivery via ${smtpHost}:${smtpPort}...`);
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: `"StarknetDev" <${smtpUser}>`,
        to: recipientEmail,
        subject: 'StarknetDev — Web3 Investment Insights',
        html: htmlContent,
      });

      console.log(`✅ Email successfully sent via SMTP to ${recipientEmail}! Message ID:`, info.messageId);
      return true;
    } catch (err: any) {
      console.error(`❌ SMTP dispatch failed for ${recipientEmail}:`, err?.message || err);
    }
  }

  // 2. Try EmailJS API
  const emailJsServiceId = process.env.EMAILJS_SERVICE_ID;
  const emailJsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
  const emailJsPublicKey = process.env.EMAILJS_PUBLIC_KEY;
  const emailJsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (emailJsServiceId && emailJsTemplateId && emailJsPublicKey) {
    console.log(`[EmailJS] Attempting delivery via EmailJS service (${emailJsServiceId})...`);
    try {
      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000',
        },
        body: JSON.stringify({
          service_id: emailJsServiceId,
          template_id: emailJsTemplateId,
          user_id: emailJsPublicKey,
          ...(emailJsPrivateKey ? { accessToken: emailJsPrivateKey } : {}),
          template_params: {
            to_email: recipientEmail,
            email: recipientEmail,
            from_name: 'StarknetDev',
            subject: 'StarknetDev — Web3 Investment Insights',
            message: htmlContent,
            html_message: htmlContent,
          },
        }),
      });

      if (res.ok) {
        console.log(`✅ Email successfully sent via EmailJS API to ${recipientEmail}!`);
        return true;
      } else {
        const errorText = await res.text();
        console.error(`❌ EmailJS API returned error for ${recipientEmail}:`, res.status, errorText);
      }
    } catch (err: any) {
      console.error(`❌ EmailJS dispatch exception for ${recipientEmail}:`, err?.message || err);
    }
  }

  console.error(`⚠️ Could not send email to ${recipientEmail}: No working email transport available.`);
  return false;
}

async function main() {
  const cliArgs = process.argv.slice(2);
  let recipientEmails: string[] = [];

  if (cliArgs.length > 0) {
    recipientEmails = cliArgs.flatMap(arg => arg.split(',')).map(e => e.trim()).filter(Boolean);
  } else {
    recipientEmails = ['infoaboutknights@gmail.com'];
  }

  const templatePath = path.resolve(process.cwd(), 'email-template.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Email template file not found at:', templatePath);
    process.exit(1);
  }

  const htmlContent = fs.readFileSync(templatePath, 'utf8');
  console.log(`Loaded email template (${htmlContent.length} bytes). Processing ${recipientEmails.length} recipient(s)...`);

  for (const email of recipientEmails) {
    await sendEmailTo(email, htmlContent);
  }
}

main();
