import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  const recipientEmail = process.argv[2] || 'h1448425@gmail.com';
  const templatePath = path.resolve(process.cwd(), 'email-template.html');

  if (!fs.existsSync(templatePath)) {
    console.error('Template file not found at:', templatePath);
    process.exit(1);
  }

  const htmlContent = fs.readFileSync(templatePath, 'utf8');
  console.log(`Loaded updated email template (${htmlContent.length} bytes). Sending via EmailJS to ${recipientEmail}...`);

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.error('❌ Missing EmailJS environment variables in .env.local!');
    process.exit(1);
  }

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'http://localhost:3000',
      },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        ...(privateKey ? { accessToken: privateKey } : {}),
        template_params: {
          to_email: recipientEmail,
          email: recipientEmail,
          from_name: 'StarknetDev',
          subject: 'StarknetDev — Web3 Insights',
          message: htmlContent,
          html_message: htmlContent,
        },
      }),
    });

    if (response.ok) {
      console.log(`✅ Email successfully sent via EmailJS to ${recipientEmail}! (Status ${response.status})`);
    } else {
      const errText = await response.text();
      console.error(`❌ EmailJS returned error status ${response.status}:`, errText);
    }
  } catch (error: any) {
    console.error('❌ EmailJS exception:', error?.message || error);
  }
}

main();
