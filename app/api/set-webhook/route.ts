import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '7656479673:AAH1s-9DwI294MZoMnvKNSnzyHhi_zRxjj8';

export async function POST(request: NextRequest) {
  try {
    const { webhookUrl } = await request.json();
    
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL is required' }, { status: 400 });
    }

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
      }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.error('Failed to set webhook:', result);
      return NextResponse.json({ error: 'Failed to set webhook', details: result }, { status: 500 });
    }

    console.log('Webhook set successfully:', result);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Error setting webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Get current webhook info
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
    const result = await response.json();
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting webhook info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}