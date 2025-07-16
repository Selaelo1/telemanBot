const TELEGRAM_BOT_TOKEN = '7656479673:AAH1s-9DwI294MZoMnvKNSnzyHhi_zRxjj8';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

export async function sendTelegramMessage(chatId: number, message: string) {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    throw error;
  }
}

export async function setTelegramWebhook(webhookUrl: string) {
  try {
    const response = await fetch(`${TELEGRAM_API_URL}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: webhookUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set webhook: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error setting webhook:', error);
    throw error;
  }
}

export function generateWelcomeMessage(): string {
  return `🤖 <b>Welcome to TelemanBot!</b>

I'll help you submit your application. Let's start by collecting some basic information.

📝 <b>Step 1 of 5:</b> What's your <b>first name</b>?

Please type your first name and press send.`;
}

export function generateStepMessage(step: string): string {
  switch (step) {
    case 'surname':
      return `📝 <b>Step 2 of 5:</b> What's your <b>last name/surname</b>?

Please type your last name and press send.`;
    
    case 'age':
      return `📝 <b>Step 3 of 5:</b> What's your <b>age</b>?

Please enter your age as a number (e.g., 25).`;
    
    case 'dob':
      return `📝 <b>Step 4 of 5:</b> What's your <b>date of birth</b>?

Please enter your date of birth in DD/MM/YYYY format (e.g., 15/03/1995).`;
    
    case 'email':
      return `📝 <b>Step 5 of 5:</b> What's your <b>email address</b>?

Please enter a valid email address (e.g., john@example.com).`;
    
    default:
      return 'Please provide the requested information.';
  }
}

export function generateApplicationSummary(data: any): string {
  return `📋 <b>Application Summary</b>

Please review your information:

👤 <b>Name:</b> ${data.firstName} ${data.lastName}
🎂 <b>Age:</b> ${data.age}
📅 <b>Date of Birth:</b> ${data.dateOfBirth}
📧 <b>Email:</b> ${data.email}

✅ <b>Application Submitted Successfully!</b>

Your application has been received and is now under review. You will receive a response within <b>48 hours</b>.

Thank you for your application! 🙏`;
}

export function generateAcceptanceMessage(firstName: string, adminNotes?: string): string {
  let message = `🎉 <b>Application Accepted!</b>

Congratulations ${firstName}! Your application has been approved.`;

  if (adminNotes) {
    message += `\n\n📝 <b>Admin Notes:</b>\n${adminNotes}`;
  }

  message += `\n\n🚀 Welcome aboard!`;
  return message;
}

export function generateRejectionMessage(firstName: string, adminNotes?: string): string {
  let message = `❌ <b>Application Declined</b>

Hi ${firstName}, unfortunately your application has been declined.`;

  if (adminNotes) {
    message += `\n\n📝 <b>Reason:</b>\n${adminNotes}`;
  }

  message += `\n\n💡 You can submit a new application at any time by sending /start.`;
  return message;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateDateOfBirth(dob: string): boolean {
  const dobRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!dobRegex.test(dob)) return false;
  
  const [day, month, year] = dob.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  
  // Check if date is valid and not in the future
  return date.getDate() === day && 
         date.getMonth() === month - 1 && 
         date.getFullYear() === year &&
         date <= new Date();
}

export function validateAge(age: string): boolean {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum > 0 && ageNum < 120;
}