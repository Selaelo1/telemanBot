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

    console.log(`=== UPDATING APPLICATION ${id} ===`);
    console.log('Update data:', { status, adminNotes });

    const application = applicationStore.getById(id);
    if (!application) {
      console.error('Application not found:', id);
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const updatedApplication = applicationStore.update(id, {
      status,
      adminNotes,
    });

    if (!updatedApplication) {
      console.error('Failed to update application:', id);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    console.log('Application updated successfully:', updatedApplication);

    // Send Telegram notification
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
      console.log('Sending Telegram notification to:', chatId);
      await sendTelegramMessage(chatId, message);
      console.log('Telegram notification sent successfully');
    } catch (telegramError) {
      console.error('Error sending Telegram notification:', telegramError);
    }

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}