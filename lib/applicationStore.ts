import { Application } from '@/types/application';

// In-memory store for demo purposes
// In production, use a proper database
class ApplicationStore {
  private applications: Application[] = [];

  getAll(): Application[] {
    return this.applications.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  getById(id: string): Application | undefined {
    return this.applications.find(app => app.id === id);
  }

  create(application: Omit<Application, 'id' | 'submittedAt' | 'status'>): Application {
    console.log('=== CREATING APPLICATION ===');
    console.log('Input data:', application);
    
    const newApplication: Application = {
      ...application,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date(),
    };

    console.log('New application object:', newApplication);
    this.applications.push(newApplication);
    console.log('Total applications after push:', this.applications.length);
    console.log('All applications:', this.applications.map(app => ({ id: app.id, firstName: app.firstName, status: app.status })));
    
    return newApplication;
  }

  update(id: string, updates: Partial<Application>): Application | null {
    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) return null;

    this.applications[index] = {
      ...this.applications[index],
      ...updates,
      processedAt: new Date(),
    };

    return this.applications[index];
  }

  getByTelegramId(telegramId: string): Application | undefined {
    return this.applications.find(app => app.telegramId === telegramId);
  }

  getPendingCount(): number {
    return this.applications.filter(app => app.status === 'pending').length;
  }

  getAcceptedCount(): number {
    return this.applications.filter(app => app.status === 'accepted').length;
  }

  getDeclinedCount(): number {
    return this.applications.filter(app => app.status === 'declined').length;
  }
}

export const applicationStore = new ApplicationStore();