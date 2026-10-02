import { NextResponse } from 'next/server';

export interface PostmarkWebhookEvent {
  RecordType: 'Delivery' | 'Bounce' | 'SpamComplaint' | 'Open' | 'Click' | 'SubscriptionChange' | string;
  MessageID: string;
  Recipient?: string;
  Email?: string;
  Tag?: string;
  DeliveredAt?: string;
  BouncedAt?: string;
  ReceivedAt?: string;
  Description?: string;
  Details?: string;
  Type?: string;
  TypeCode?: number;
  [key: string]: any;
}

// In-memory set for basic idempotency tracking (in production, use database/Redis)
const processedMessageIds = new Set<string>();

export async function POST(request: Request) {
  try {
    // 1. Optional HTTP Basic Authentication check
    const webhookUser = process.env.POSTMARK_WEBHOOK_USER;
    const webhookPass = process.env.POSTMARK_WEBHOOK_PASS;

    if (webhookUser && webhookPass) {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return NextResponse.json(
          { error: 'Unauthorized: Missing or invalid Authorization header' },
          { status: 401 }
        );
      }

      const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8');
      const [username, password] = credentials.split(':');

      if (username !== webhookUser || password !== webhookPass) {
        return NextResponse.json(
          { error: 'Unauthorized: Invalid credentials' },
          { status: 401 }
        );
      }
    }

    // 2. Parse and validate payload
    const event = (await request.json()) as PostmarkWebhookEvent;

    if (!event || !event.RecordType || !event.MessageID) {
      console.warn('[POSTMARK WEBHOOK WARNING] Received malformed payload:', event);
      return NextResponse.json(
        { error: 'Invalid webhook payload format. Required fields: RecordType, MessageID' },
        { status: 400 }
      );
    }

    // 3. Idempotency Check
    if (processedMessageIds.has(event.MessageID)) {
      console.log(`[POSTMARK WEBHOOK IDEMPOTENT] Already processed event for MessageID: ${event.MessageID}`);
      return NextResponse.json({
        status: 'duplicate',
        messageId: event.MessageID,
        message: 'Event already processed'
      }, { status: 200 });
    }

    // Keep set size bounded
    if (processedMessageIds.size > 5000) {
      const firstKey = processedMessageIds.values().next().value;
      if (firstKey) processedMessageIds.delete(firstKey);
    }
    processedMessageIds.add(event.MessageID);

    // 4. Handle Event Types
    const recipient = event.Recipient || event.Email || 'Unknown Recipient';
    const timestamp = event.DeliveredAt || event.BouncedAt || event.ReceivedAt || new Date().toISOString();

    switch (event.RecordType) {
      case 'Delivery':
        console.log(`[POSTMARK WEBHOOK - DELIVERY] ✅ Email delivered to ${recipient} at ${timestamp} (MessageID: ${event.MessageID})`);
        break;

      case 'Bounce':
        console.error(`[POSTMARK WEBHOOK - BOUNCE] ❌ Email to ${recipient} bounced. Type: ${event.Type || 'Unknown'} (Code ${event.TypeCode}). Reason: ${event.Description || 'N/A'}`);
        break;

      case 'SpamComplaint':
        console.warn(`[POSTMARK WEBHOOK - SPAM] ⚠️ Spam complaint received from ${recipient} (MessageID: ${event.MessageID})`);
        break;

      case 'Open':
        console.log(`[POSTMARK WEBHOOK - OPEN] 👁️ Email opened by ${recipient} (MessageID: ${event.MessageID})`);
        break;

      case 'Click':
        console.log(`[POSTMARK WEBHOOK - CLICK] 🖱️ Link clicked by ${recipient} (MessageID: ${event.MessageID})`);
        break;

      case 'SubscriptionChange':
        console.log(`[POSTMARK WEBHOOK - UNSUBSCRIBE] 🔕 Subscription status changed for ${recipient}`);
        break;

      default:
        console.log(`[POSTMARK WEBHOOK - ${event.RecordType.toUpperCase()}] Handled event for MessageID: ${event.MessageID}`);
        break;
    }

    // 5. Always respond 200 OK so Postmark acknowledges successful processing
    return NextResponse.json(
      {
        success: true,
        status: 'processed',
        recordType: event.RecordType,
        messageId: event.MessageID,
        timestamp,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[POSTMARK WEBHOOK ERROR] Processing failure:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error processing webhook' },
      { status: 500 }
    );
  }
}
