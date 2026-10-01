import { NextResponse } from 'next/server';
import { getActualRegistrations } from '@/lib/registrations-db';
import { connectToDatabase } from '@/lib/mongodb';
import { WaitlistModel } from '@/models/Waitlist';

export const dynamic = 'force-dynamic';

interface SendEmailPayload {
  to?: string | string[];
  emails?: string | string[];
  addresses?: string | string[];
  sendToAll?: boolean;
  subject?: string;
  headline?: string;
  message?: string;
  htmlContent?: string;
  ctaText?: string;
  ctaUrl?: string;
  name?: string;
  serviceId?: string;
  templateId?: string;
  publicKey?: string;
  privateKey?: string;
}

/**
 * Builds responsive Starknet-branded HTML email for recipients
 */
function renderStarknetEmailHtml({
  subject,
  headline,
  message,
  ctaText,
  ctaUrl,
  recipientEmail,
}: {
  subject: string;
  headline?: string;
  message?: string;
  ctaText?: string;
  ctaUrl?: string;
  recipientEmail: string;
}): string {
  const displayTitle = headline || subject;
  const formattedMessage = (message || '')
    .split('\n\n')
    .map((p) => `<p style="font-size: 14.5px; line-height: 1.65; color: #cbd5e1; margin: 0 0 16px;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  const buttonHtml = ctaUrl
    ? `
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 20px;">
      <tr>
        <td align="center">
          <a href="${ctaUrl}" 
             target="_blank" 
             style="display: inline-block; padding: 14px 34px; background-color: #ec796b; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 8px; text-align: center; box-shadow: 0 6px 20px rgba(236, 121, 107, 0.35);">
            ${ctaText || 'Claim VIP Priority Access &rarr;'}
          </a>
        </td>
      </tr>
    </table>
    <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0 0 20px;">
      Takes less than 60 seconds • Direct access pass
    </p>`
    : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080c14; color: #f8fafc;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #080c14; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 640px; background-color: #0f172a; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; overflow: hidden; box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 28px 24px; text-align: center; background: linear-gradient(180deg, #18253d 0%, #0f172a 100%); border-bottom: 2px solid #ec796b;">
              <div style="display: inline-block; padding: 5px 14px; background-color: rgba(236, 121, 107, 0.15); border: 1px solid rgba(236, 121, 107, 0.35); border-radius: 9999px; font-size: 11px; font-weight: 800; color: #ec796b; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 14px;">
                ✦ INSTITUTIONAL ALLOCATION MEMO ✦
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.02em;">
                Stark<span style="color: #ec796b;">net</span> Bitcoin ZK-Vaults
              </h1>
              <p style="margin: 8px 0 0; font-size: 13.5px; color: #94a3b8; font-weight: 500;">
                Algorithmic Liquidity Strategies • Multi-Sig Cold Custody • Sub-Cent Gas Execution
              </p>
            </td>
          </tr>

          <!-- Metadata Bar -->
          <tr>
            <td style="background-color: #131d31; padding: 12px 28px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 11.5px; color: #94a3b8;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="left"><strong>REF:</strong> STARK-VIP-ALLOC-2026</td>
                  <td align="center"><strong>PHASE:</strong> Priority Allocation Window</td>
                  <td align="right"><strong>STATUS:</strong> <span style="color: #22c55e; font-weight: 700;">● Active Whitelist</span></td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 28px;">
              <h2 style="font-size: 18px; font-weight: 800; color: #ffffff; margin-top: 0; margin-bottom: 14px;">
                ${displayTitle}
              </h2>
              
              ${formattedMessage}

              <!-- Tiers Matrix -->
              <div style="margin-bottom: 26px;">
                <div style="font-size: 12px; font-weight: 800; text-transform: uppercase; color: #ec796b; letter-spacing: 0.05em; margin-bottom: 10px;">
                  Institutional Allocation Tiers
                </div>
                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; overflow: hidden; font-size: 13px;">
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
                    <td style="padding: 12px 14px; border-right: 1px solid rgba(255, 255, 255, 0.06);" width="35%">
                      <strong style="color: #ffffff; display: block; font-size: 13px;">Private Starter</strong>
                      <span style="color: #ec796b; font-weight: 700; font-size: 11.5px;">$200 – $1,000</span>
                    </td>
                    <td style="padding: 12px 14px; color: #94a3b8; font-size: 12px; line-height: 1.4;">
                      Direct ZK-vault participation, automated daily yield accrual, 0% platform deposit surcharge.
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
                    <td style="padding: 12px 14px; border-right: 1px solid rgba(255, 255, 255, 0.06);">
                      <strong style="color: #ffffff; display: block; font-size: 13px;">Growth Builder</strong>
                      <span style="color: #10b981; font-weight: 700; font-size: 11.5px;">$1,000 – $10,000</span>
                    </td>
                    <td style="padding: 12px 14px; color: #94a3b8; font-size: 12px; line-height: 1.4;">
                      Automated Dollar-Cost Averaging (DCA), multi-asset funding (USDT, BTC, ETH, STRK, Wire).
                    </td>
                  </tr>
                  <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
                    <td style="padding: 12px 14px; border-right: 1px solid rgba(255, 255, 255, 0.06);">
                      <strong style="color: #ffffff; display: block; font-size: 13px;">Institutional VIP</strong>
                      <span style="color: #f59e0b; font-weight: 700; font-size: 11.5px;">$10,000 – $50,000</span>
                    </td>
                    <td style="padding: 12px 14px; color: #94a3b8; font-size: 12px; line-height: 1.4;">
                      Guaranteed vault capacity, dedicated quant manager, priority multi-sig withdrawal routing.
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 12px 14px; border-right: 1px solid rgba(255, 255, 255, 0.06);">
                      <strong style="color: #ffffff; display: block; font-size: 13px;">White-Glove / OTC</strong>
                      <span style="color: #a855f7; font-weight: 700; font-size: 11.5px;">$50,000 – $250,000+</span>
                    </td>
                    <td style="padding: 12px 14px; color: #94a3b8; font-size: 12px; line-height: 1.4;">
                      Segregated non-commingled accounts, direct OTC block routing, master legal framework.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Action Call to Action Button Box -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" style="margin: 28px 0 20px; background: linear-gradient(135deg, rgba(236, 121, 107, 0.12) 0%, rgba(236, 121, 107, 0.04) 100%); border: 1px solid rgba(236, 121, 107, 0.35); border-radius: 12px; padding: 20px; text-align: center;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 4px; font-size: 15px; font-weight: 800; color: #ffffff;">
                      Register to Secure Your Allocation Tier
                    </h3>
                    <p style="margin: 0 0 16px; font-size: 12.5px; color: #cbd5e1;">
                      Select your entry tier from $200 and complete your onboarding profile to guarantee vault placement.
                    </p>
                    <a href="${ctaUrl || 'https://starknetsupport.netlify.app/register'}" 
                       target="_blank" 
                       style="display: inline-block; padding: 14px 34px; background: linear-gradient(135deg, #ec796b 0%, #ff8c7e 100%); color: #ffffff; font-size: 15px; font-weight: 800; text-decoration: none; border-radius: 8px; box-shadow: 0 6px 20px rgba(236, 121, 107, 0.35);">
                      ${ctaText || 'Register & Claim Priority Pass →'}
                    </a>
                  </td>
                </tr>
              </table>

              <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 18px; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                For OTC block allocation inquiries or technical assistance, contact our desk at: 
                <a href="https://starknetsupport.netlify.app/" style="color: #ec796b; text-decoration: none; font-weight: 600;">Starknet Institutional Desk</a> 
                or reply to this email.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #080c14; padding: 20px 28px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #64748b; line-height: 1.6;">
              <p style="margin: 0 0 4px; font-weight: 600; color: #94a3b8;">
                The Starknet Portal Team &bull; Bitcoin Layer-2 ZK-Rollup Protocol
              </p>
              <p style="margin: 0;">
                This institutional communication was prepared for ${recipientEmail}. Digital assets involve volatility and smart contract risk.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

/**
 * Extract clean, unique email addresses from multiple input formats
 */
function parseEmailList(input: any): string[] {
  if (!input) return [];

  let rawList: string[] = [];
  if (Array.isArray(input)) {
    rawList = input.flatMap((item) => (typeof item === 'string' ? item.split(/[\s,;]+/) : []));
  } else if (typeof input === 'string') {
    rawList = input.split(/[\s,;]+/);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const uniqueSet = new Set<string>();

  for (const item of rawList) {
    const clean = item.trim().toLowerCase();
    if (clean && emailRegex.test(clean)) {
      uniqueSet.add(clean);
    }
  }

  return Array.from(uniqueSet);
}

// GET: API documentation, config health check, and registered user count
export async function GET() {
  try {
    const localRecords = await getActualRegistrations();
    const count = localRecords.length;

    const emailJsConfigured = Boolean(
      process.env.EMAILJS_SERVICE_ID &&
      process.env.EMAILJS_TEMPLATE_ID &&
      process.env.EMAILJS_PUBLIC_KEY &&
      process.env.EMAILJS_PUBLIC_KEY !== 'your_public_key'
    );

    return NextResponse.json({
      status: 'active',
      service: 'Starknet EmailJS Direct & Broadcast Dispatcher',
      registeredUsersCount: count,
      emailJsConfig: {
        serviceId: process.env.EMAILJS_SERVICE_ID || null,
        templateId: process.env.EMAILJS_TEMPLATE_ID || null,
        isPublicKeySet: Boolean(process.env.EMAILJS_PUBLIC_KEY && process.env.EMAILJS_PUBLIC_KEY !== 'your_public_key'),
        isPrivateKeySet: Boolean(process.env.EMAILJS_PRIVATE_KEY && process.env.EMAILJS_PRIVATE_KEY !== 'your_private_key'),
        ready: emailJsConfigured,
      },
      usage: {
        endpoint: 'POST /api/email/send',
        examplePayload: {
          to: 'investor@example.com, partner@example.com',
          subject: 'Priority Access: Experience Bitcoin on Starknet Layer-2',
          headline: 'Exclusive Priority Access Invitation',
          message: 'You have been selected to access our high-speed Bitcoin Layer-2 ZK-Vault allocation window.',
          ctaText: 'Claim VIP Priority Ticket',
          ctaUrl: 'https://starknetsupport.netlify.app/register',
          sendToAll: false,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Send direct emails to pasted addresses or all registered users
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SendEmailPayload;

    // 1. Resolve recipients
    let targetEmails: string[] = [];

    if (body.sendToAll) {
      // Gather all registered users from database
      const registered = await getActualRegistrations();
      const mongoList: string[] = [];

      try {
        await connectToDatabase();
        const docs = await WaitlistModel.find({}, 'email').lean();
        docs.forEach((d: any) => {
          if (d.email) mongoList.push(d.email);
        });
      } catch {}

      const all = [...registered.map((r) => r.email), ...mongoList];
      targetEmails = parseEmailList(all);
    } else {
      // Gather from to / emails / addresses
      const rawInput = body.to || body.emails || body.addresses;
      targetEmails = parseEmailList(rawInput);
    }

    if (targetEmails.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid recipient email addresses found. Please paste at least one email address in the "to" field.',
        },
        { status: 400 }
      );
    }

    // 2. Resolve EmailJS credentials (from payload overrides or .env.local)
    const serviceId = body.serviceId || process.env.EMAILJS_SERVICE_ID;
    const templateId = body.templateId || process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = body.publicKey || process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = body.privateKey || process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || publicKey === 'your_public_key') {
      return NextResponse.json(
        {
          success: false,
          error: 'EmailJS credentials incomplete. Please configure EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY in .env.local or pass them in the request body.',
          requiredFields: ['serviceId', 'templateId', 'publicKey'],
        },
        { status: 400 }
      );
    }

    // 3. Resolve Email content
    const subject = body.subject?.trim() || 'Priority Access: Experience Bitcoin on Starknet Layer-2';
    const message = body.message?.trim() || 'You are invited to join the priority registration window for the Bitcoin & Starknet Layer-2 ecosystem.';
    const headline = body.headline?.trim() || subject;
    const ctaText = body.ctaText?.trim() || 'Claim VIP Priority Ticket →';
    const ctaUrl = body.ctaUrl?.trim() || 'https://starknetsupport.netlify.app/register';

    console.log(`[EmailJS Dispatch] Beginning dispatch of "${subject}" to ${targetEmails.length} recipient(s)...`);

    const results: Array<{ email: string; success: boolean; status?: number; error?: string }> = [];
    const originHeader = request.headers.get('origin') || 'http://localhost:3000';

    // 4. Dispatch to each recipient via EmailJS REST API
    for (const recipient of targetEmails) {
      const recipientHtml = body.htmlContent || renderStarknetEmailHtml({
        subject,
        headline,
        message,
        ctaText,
        ctaUrl,
        recipientEmail: recipient,
      });

      try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Origin: originHeader,
          },
          body: JSON.stringify({
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            ...(privateKey && privateKey !== 'your_private_key' ? { accessToken: privateKey } : {}),
            template_params: {
              // Common recipient parameter aliases supported by EmailJS templates
              to_email: recipient,
              email: recipient,
              to: recipient,
              recipient: recipient,
              recipient_email: recipient,
              user_email: recipient,
              dest_email: recipient,
              to_name: recipient.split('@')[0],
              name: recipient.split('@')[0],
              from_name: 'Starknet Portal Desk',
              subject,
              headline,
              message,
              html_content: recipientHtml,
              content: recipientHtml,
              body: recipientHtml,
              cta_text: ctaText,
              cta_url: ctaUrl,
              time: new Date().toUTCString(),
            },
          }),
        });

        if (response.ok) {
          results.push({ email: recipient, success: true, status: response.status });
          console.log(`[EmailJS Dispatch] ✅ Successfully delivered to ${recipient}`);
        } else {
          const errText = await response.text();
          results.push({ email: recipient, success: false, status: response.status, error: errText });
          console.warn(`[EmailJS Dispatch] ❌ Failed for ${recipient} (${response.status}): ${errText}`);
        }
      } catch (err: any) {
        results.push({ email: recipient, success: false, error: err.message });
        console.error(`[EmailJS Dispatch] Error sending to ${recipient}:`, err);
      }

      // Small throttling delay (200ms) between calls to respect EmailJS rate-limits
      if (targetEmails.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    const sentCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: sentCount > 0,
      total: targetEmails.length,
      sentCount,
      failedCount,
      subject,
      provider: 'emailjs',
      serviceId,
      templateId,
      results,
    });
  } catch (error: any) {
    console.error('[API /api/email/send] Unexpected error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to execute email dispatch',
      },
      { status: 500 }
    );
  }
}
