import { UserSession } from '@/types/application';

// In-memory session store for demo purposes
// In production, use Redis or a proper database
class SessionStore {
  private sessions: Map<string, UserSession> = new Map();

  getSession(telegramId: string): UserSession | undefined {
    const session = this.sessions.get(telegramId);
    if (session) {
      // Clean up old sessions (older than 1 hour)
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      if (session.lastActivity < oneHourAgo) {
        this.sessions.delete(telegramId);
        return undefined;
      }
    }
    return session;
  }

  createSession(telegramId: string): UserSession {
    const session: UserSession = {
      telegramId,
      step: 'name',
      data: {},
      lastActivity: new Date(),
    };
    this.sessions.set(telegramId, session);
    return session;
  }

  updateSession(telegramId: string, updates: Partial<UserSession>): UserSession | null {
    const session = this.sessions.get(telegramId);
    if (!session) return null;

    const updatedSession = {
      ...session,
      ...updates,
      lastActivity: new Date(),
    };

    this.sessions.set(telegramId, updatedSession);
    return updatedSession;
  }

  deleteSession(telegramId: string): void {
    this.sessions.delete(telegramId);
  }

  // Clean up old sessions periodically
  cleanupOldSessions(): void {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    for (const [telegramId, session] of this.sessions.entries()) {
      if (session.lastActivity < oneHourAgo) {
        this.sessions.delete(telegramId);
      }
    }
  }
}

export const sessionStore = new SessionStore();

// Clean up old sessions every 30 minutes
setInterval(() => {
  sessionStore.cleanupOldSessions();
}, 30 * 60 * 1000);