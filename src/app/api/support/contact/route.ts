import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getEnv } from '@/lib/telegram-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, category, subject, message } = body as {
      name?: string;
      email: string;
      category?: string;
      subject?: string;
      message: string;
    };

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message cannot be empty.' },
        { status: 400 }
      );
    }

    const ticketId = `SPT-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toUTCString();
    const userDisplayName = name?.trim() || 'Valued User';
    const inquiryTopic = category || subject || 'General Inquiry';
    const supportDestination =
      process.env.SUPPORT_RECEIVER_EMAIL ||
      process.env.SUPPORT_EMAIL ||
      'support@bitcoinpro.local';

    console.log(`[SUPPORT EMAIL TICKET #${ticketId}] Received inquiry from ${email} (${userDisplayName}): Topic: ${inquiryTopic}`);

    let mailSent = false;
    let mailError: string | null = null;

    // 1. Attempt delivery via Nodemailer if SMTP configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
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

        await transporter.sendMail({
          from: `"Support Desk Desk" <${smtpUser}>`,
          to: supportDestination,
          replyTo: email,
          subject: `[Ticket #${ticketId}] ${inquiryTopic} - ${userDisplayName}`,
          text: `Support Ticket: #${ticketId}\nFrom: ${userDisplayName} <${email}>\nCategory: ${inquiryTopic}\nDate: ${timestamp}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
              <h2 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
                Support Inquiry [Ticket #${ticketId}]
              </h2>
              <p><strong>From:</strong> ${userDisplayName} (&lt;${email}&gt;)</p>
              <p><strong>Category:</strong> ${inquiryTopic}</p>
              <p><strong>Received At:</strong> ${timestamp}</p>
              <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 16px 0;" />
              <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p style="white-space: pre-wrap; margin: 0;">${message}</p>
              </div>
              <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
                Direct reply to this email will reply directly to <strong>${email}</strong>.
              </p>
            </div>
          `,
        });
        mailSent = true;
      } catch (err: any) {
        console.error('[SMTP ERROR]', err);
        mailError = err?.message || 'SMTP delivery failed';
      }
    }

    // 2. Fallback to EmailJS if configured
    const emailJsServiceId = process.env.EMAILJS_SERVICE_ID;
    const emailJsTemplateId = process.env.EMAILJS_TEMPLATE_ID;
    const emailJsPublicKey = process.env.EMAILJS_PUBLIC_KEY;
    const emailJsPrivateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!mailSent && emailJsServiceId && emailJsTemplateId && emailJsPublicKey && emailJsServiceId !== 'your_emailjs_service_id') {
      try {
        const originHeader = request.headers.get('origin') || 'http://localhost:3000';
        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Origin: originHeader,
          },
          body: JSON.stringify({
            service_id: emailJsServiceId,
            template_id: emailJsTemplateId,
            user_id: emailJsPublicKey,
            ...(emailJsPrivateKey ? { accessToken: emailJsPrivateKey } : {}),
            template_params: {
              from_name: userDisplayName,
              from_email: email,
              reply_to: email,
              subject: `[Ticket #${ticketId}] ${inquiryTopic}`,
              ticket_id: ticketId,
              category: inquiryTopic,
              message: message,
              timestamp,
            },
          }),
        });

        if (res.ok) {
          mailSent = true;
        } else {
          const errText = await res.text();
          console.warn('[EMAILJS SUPPORT ERROR]', errText);
        }
      } catch (e) {
        console.warn('[EMAILJS DISPATCH EXCEPTION]', e);
      }
    }

    // 3. Forward ticket notification to admin Telegram (if configured) so staff is notified instantly
    const botToken = getEnv('TELEGRAM_BOT_TOKEN');
    const chatId = getEnv('TELEGRAM_CHAT_ID');

    if (botToken && chatId && botToken !== 'your_telegram_bot_token') {
      try {
        const escapeMd = (s: string) => s.replace(/[_*[\]()`~>#+=|{}.!\\-]/g, '\\$&');
        const telegramText = [
          '📨 *New Email Support Inquiry*',
          '',
          `*Ticket:* \`#${ticketId}\``,
          `*User:* ${escapeMd(userDisplayName)}`,
          `*Email:* \`${escapeMd(email)}\``,
          `*Category:* ${escapeMd(inquiryTopic)}`,
          `*Time:* ${escapeMd(timestamp)}`,
          '',
          '*Message:*',
          `_${escapeMd(message)}_`,
          '',
          `_Reply directly via email to: ${escapeMd(email)}_`,
        ].join('\n');

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramText,
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
          }),
        });
      } catch (tgErr) {
        console.warn('[TELEGRAM DISPATCH NOTICE]', tgErr);
      }
    }

    return NextResponse.json({
      success: true,
      ticketId,
      email,
      timestamp,
      message: `Your inquiry has been registered. Our support desk will reply to ${email} shortly.`,
      mailDispatched: mailSent,
    });
  } catch (error: any) {
    console.error('Support email route error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
}
