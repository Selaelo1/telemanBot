import { NextRequest, NextResponse } from 'next/server';
import { TelegramUpdate } from '@/types/application';
import { applicationStore } from '@/lib/applicationStore';
import { sessionStore } from '@/lib/sessionStore';
import { 
  sendTelegramMessage, 
  generateWelcomeMessage, 
  generateStepMessage,
  generateApplicationSummary,
  validateEmail,
  validateDateOfBirth,
  validateAge
} from '@/lib/telegram';

export async function POST(request: NextRequest) {
  try {
    console.log('=== WEBHOOK RECEIVED ===', new Date().toISOString());
    const body: TelegramUpdate = await request.json();
    console.log('Full Telegram update:', JSON.stringify(body, null, 2));
    
    if (!body.message || !body.message.text) {
      console.log('No message or text found');
      return NextResponse.json({ success: true });
    }

    const { message } = body;
    const chatId = message.chat.id;
    const userId = message.from.id.toString();
    const firstName = message.from.first_name;
    const username = message.from.username;
    const messageText = message.text.trim();

    console.log('Processing message from user:', {
      userId,
      firstName,
      username,
      messageText,
      chatId
    });

    // Handle /start command
    if (messageText === '/start') {
      // Check if user already has a pending application
      const existingApplication = applicationStore.getByTelegramId(userId);
      if (existingApplication && existingApplication.status === 'pending') {
        console.log('User already has pending application:', existingApplication.id);
        await sendTelegramMessage(
          chatId, 
          `📋 You already have a pending application submitted on ${existingApplication.submittedAt.toLocaleDateString()}. You will receive a response within 48 hours.`
        );
        return NextResponse.json({ success: true });
      }

      // Start new application process
      console.log('Starting new application process for user:', userId);
      sessionStore.createSession(userId);
      await sendTelegramMessage(chatId, generateWelcomeMessage());
      return NextResponse.json({ success: true });
    }

    // Get or create session
    let session = sessionStore.getSession(userId);
    console.log('Current session:', session);
    
    if (!session) {
      // If no session exists, start the application process
      console.log('No session found, creating new session');
      session = sessionStore.createSession(userId);
      await sendTelegramMessage(chatId, generateWelcomeMessage());
      return NextResponse.json({ success: true });
    }

    // Process based on current step
    console.log('Processing step:', session.step, 'with message:', messageText);
    
    switch (session.step) {
      case 'name':
        if (messageText.length < 2) {
          await sendTelegramMessage(chatId, '❌ Please enter a valid first name (at least 2 characters).');
          return NextResponse.json({ success: true });
        }
        
        session.data.firstName = messageText;
        console.log('Saved firstName:', messageText);
        sessionStore.updateSession(userId, { 
          step: 'surname', 
          data: session.data 
        });
        await sendTelegramMessage(chatId, generateStepMessage('surname'));
        break;

      case 'surname':
        if (messageText.length < 2) {
          await sendTelegramMessage(chatId, '❌ Please enter a valid last name (at least 2 characters).');
          return NextResponse.json({ success: true });
        }
        
        session.data.lastName = messageText;
        console.log('Saved lastName:', messageText);
        sessionStore.updateSession(userId, { 
          step: 'age', 
          data: session.data 
        });
        await sendTelegramMessage(chatId, generateStepMessage('age'));
        break;

      case 'age':
        if (!validateAge(messageText)) {
          await sendTelegramMessage(chatId, '❌ Please enter a valid age (number between 1 and 119).');
          return NextResponse.json({ success: true });
        }
        
        session.data.age = parseInt(messageText);
        console.log('Saved age:', parseInt(messageText));
        sessionStore.updateSession(userId, { 
          step: 'dob', 
          data: session.data 
        });
        await sendTelegramMessage(chatId, generateStepMessage('dob'));
        break;

      case 'dob':
        if (!validateDateOfBirth(messageText)) {
          await sendTelegramMessage(chatId, '❌ Please enter a valid date of birth in DD/MM/YYYY format (e.g., 15/03/1995).');
          return NextResponse.json({ success: true });
        }
        
        session.data.dateOfBirth = messageText;
        console.log('Saved dateOfBirth:', messageText);
        sessionStore.updateSession(userId, { 
          step: 'email', 
          data: session.data 
        });
        await sendTelegramMessage(chatId, generateStepMessage('email'));
        break;

      case 'email':
        if (!validateEmail(messageText)) {
          await sendTelegramMessage(chatId, '❌ Please enter a valid email address (e.g., john@example.com).');
          return NextResponse.json({ success: true });
        }
        
        session.data.email = messageText;
        console.log('Saved email:', messageText);
        
        // Create application
        console.log('Creating application with data:', session.data);
        
        const application = applicationStore.create({
          telegramId: userId,
          username: username || '',
          firstName: session.data.firstName!,
          lastName: session.data.lastName!,
          age: session.data.age!,
          dateOfBirth: session.data.dateOfBirth!,
          email: session.data.email!,
        });

        console.log('Application created successfully:', {
          id: application.id,
          telegramId: application.telegramId,
          firstName: application.firstName,
          lastName: application.lastName,
          status: application.status
        });

        // Send confirmation to user
        await sendTelegramMessage(chatId, generateApplicationSummary(session.data));

        // Clean up session
        sessionStore.deleteSession(userId);
        console.log('Session cleaned up for user:', userId);

        break;

      default:
        await sendTelegramMessage(chatId, 'Something went wrong. Please send /start to begin again.');
        sessionStore.deleteSession(userId);
        break;
    }
    
    console.log('=== WEBHOOK PROCESSED SUCCESSFULLY ===');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('=== WEBHOOK ERROR ===', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}