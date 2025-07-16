import { NextRequest, NextResponse } from 'next/server';
import { applicationStore } from '@/lib/applicationStore';
import { 
  sendTelegramMessage, 
  generateAcceptanceMessage, 
  generateRejectionMessage 
} from '@/lib/telegram';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { status, adminNotes } = body;

    const application = applicationStore.getById(id);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Update application
    const updatedApplication = applicationStore.update(id, {
      status,
      adminNotes,
    });

    if (!updatedApplication) {
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    // Send notification to user
    const chatId = parseInt(application.telegramId);
    let message: string;

    if (status === 'accepted') {
      message = generateAcceptanceMessage(application.firstName, adminNotes);
    } else if (status === 'declined') {
      message = generateRejectionMessage(application.firstName, adminNotes);
    } else {
      return NextResponse.json(updatedApplication);
    }

    try {
      await sendTelegramMessage(chatId, message);
    } catch (telegramError) {
      console.error('Error sending Telegram notification:', telegramError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}