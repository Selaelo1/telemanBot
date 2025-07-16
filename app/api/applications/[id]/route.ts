import { NextRequest, NextResponse } from 'next/server';
import { applicationStore } from '@/lib/applicationStore';
import { 
  sendTelegramMessage, 
  generateAcceptanceMessage, 
  generateRejectionMessage 
} from '@/lib/telegram';

export const dynamic = 'force-dynamic'; // Disable caching

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, adminNotes } = await request.json();

    console.log(`Updating application ${id} to ${status}`);

    const application = applicationStore.getById(id);
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const updatedApplication = applicationStore.update(id, {
      status,
      adminNotes,
    });

    if (!updatedApplication) {
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    // Send Telegram notification
    const chatId = parseInt(application.telegramId);
    try {
      const message = status === 'accepted'
        ? generateAcceptanceMessage(application.firstName, adminNotes)
        : generateRejectionMessage(application.firstName, adminNotes);
      
      await sendTelegramMessage(chatId, message);
    } catch (telegramError) {
      console.error('Telegram notification failed:', telegramError);
    }

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}