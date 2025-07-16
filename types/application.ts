export interface Application {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: string;
  email: string;
  status: 'pending' | 'accepted' | 'declined';
  submittedAt: Date;
  processedAt?: Date;
  adminNotes?: string;
}

export interface UserSession {
  telegramId: string;
  step: 'name' | 'surname' | 'age' | 'dob' | 'email' | 'completed';
  data: {
    firstName?: string;
    lastName?: string;
    age?: number;
    dateOfBirth?: string;
    email?: string;
  };
  lastActivity: Date;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
}

export interface TelegramMessage {
  message_id: number;
  from: TelegramUser;
  chat: {
    id: number;
    type: string;
  };
  date: number;
  text: string;
}

export interface TelegramUpdate {
  update_id: number;
  message: TelegramMessage;
}