# TelemanBot - Telegram Application Management System

A comprehensive Telegram bot system built with Next.js that handles application submissions and provides an admin dashboard for managing applications.

## Features

### 🤖 Telegram Bot
- **Application Submission**: Users can submit applications by sending messages to the bot
- **Welcome Messages**: Automatic greeting and instructions for new users
- **Status Notifications**: Real-time notifications when applications are accepted or declined
- **Duplicate Prevention**: Prevents multiple pending applications from the same user

### 📊 Admin Dashboard
- **Application Management**: View, accept, or decline applications with admin notes
- **Real-time Stats**: Track total, pending, accepted, and declined applications
- **Search & Filter**: Find applications by name, username, or content
- **Status Tracking**: Monitor application status and processing history
- **Responsive Design**: Works perfectly on desktop and mobile devices

### 🔧 Technical Features
- **Next.js 13+**: Modern React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Beautiful, responsive styling
- **Shadcn/ui**: Premium UI components
- **Webhook Integration**: Secure Telegram webhook handling
- **In-memory Storage**: Easy to extend to any database

## Directory Structure

```
├── app/
│   ├── api/
│   │   ├── applications/
│   │   │   ├── [id]/route.ts      # Update specific application
│   │   │   └── route.ts           # Get all applications
│   │   ├── stats/route.ts         # Application statistics
│   │   └── webhook/route.ts       # Telegram webhook handler
│   ├── dashboard/
│   │   └── page.tsx               # Admin dashboard
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── components/
│   ├── ApplicationCard.tsx        # Individual application display
│   ├── ApplicationsList.tsx       # List of applications with filters
│   └── StatsCard.tsx             # Statistics display card
├── lib/
│   ├── applicationStore.ts        # In-memory data store
│   ├── telegram.ts               # Telegram API integration
│   └── utils.ts                  # Utility functions
└── types/
    └── application.ts            # TypeScript type definitions
```

## Setup Instructions

### 1. Bot Configuration
- Bot Token: `7656479673:AAH1s-9DwI294MZoMnvKNSnzyHhi_zRxjj8`
- Bot URL: `t.me/telemadeBot`

### 2. Webhook Setup
To set up the webhook for production, you'll need to configure it to point to your deployed application:

```bash
curl -X POST "https://api.telegram.org/bot7656479673:AAH1s-9DwI294MZoMnvKNSnzyHhi_zRxjj8/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.com/api/webhook"}'
```

### 3. Development
```bash
npm install
npm run dev
```

### 4. Production Build
```bash
npm run build
npm start
```

## Bot Commands

### For Users
- `/start` - Get welcome message and instructions
- Send any message - Submit an application

### Bot Responses
- **Welcome**: Instructions on how to submit applications
- **Application Received**: Confirmation when application is submitted
- **Status Updates**: Notifications when applications are accepted/declined

## Admin Dashboard Features

### Statistics Overview
- Total applications count
- Pending applications requiring review
- Accepted applications
- Declined applications

### Application Management
- View all applications in chronological order
- Filter by status (pending, accepted, declined)
- Search by name, username, or content
- Add admin notes when accepting/declining
- Real-time status updates

### Application Actions
- **Accept**: Approve application and notify user
- **Decline**: Reject application with optional reason
- **Add Notes**: Include feedback for the applicant

## API Endpoints

### GET /api/applications
Returns all applications sorted by submission date

### PATCH /api/applications/[id]
Updates application status and sends notification to user

### GET /api/stats
Returns application statistics

### POST /api/webhook
Handles incoming Telegram webhook updates

## Database Schema

The application uses an in-memory store for demo purposes. In production, you can easily extend it to use any database by modifying the `applicationStore.ts` file.

### Application Object
```typescript
interface Application {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName?: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  submittedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
}
```

## Extending the System

### Adding Database Support
1. Install your preferred database client (e.g., Prisma, MongoDB)
2. Replace the in-memory store in `lib/applicationStore.ts`
3. Update the API routes to use the database

### Adding Authentication
1. Install Next-Auth or similar authentication library
2. Add middleware to protect the dashboard routes
3. Implement admin user management

### Adding More Features
- Email notifications for admins
- Application categories
- File attachments support
- Multi-language support
- Application analytics

## Security Considerations

- Webhook validation (recommended for production)
- Rate limiting on API endpoints
- Admin authentication
- Input sanitization
- HTTPS enforcement

## Support

For questions or issues, please check the code comments and structure. The system is designed to be easily extendable and maintainable.