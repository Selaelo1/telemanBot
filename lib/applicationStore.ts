import { Application } from '@/types/application';

class ApplicationStore {
  private static instance: ApplicationStore;
  private applications: Application[] = [];

  private constructor() {}

  public static getInstance(): ApplicationStore {
    if (!ApplicationStore.instance) {
      ApplicationStore.instance = new ApplicationStore();
    }
    return ApplicationStore.instance;
  }

  getAll(): Application[] {
    console.log('=== GETTING ALL APPLICATIONS ===');
    console.log('Current applications:', this.applications.map(app => ({
      id: app.id,
      firstName: app.firstName,
      lastName: app.lastName,
      status: app.status,
      submittedAt: app.submittedAt
    })));
    return this.applications.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  getById(id: string): Application | undefined {
    return this.applications.find(app => app.id === id);
  }

  create(application: Omit<Application, 'id' | 'submittedAt' | 'status'>): Application {
    console.log('=== CREATING APPLICATION ===');
    const newApplication: Application = {
      ...application,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date(),
    };

    this.applications.push(newApplication);
    console.log('Application created:', newApplication);
    console.log('Total applications now:', this.applications.length);
    return newApplication;
  }

  update(id: string, updates: Partial<Application>): Application | null {
    const index = this.applications.findIndex(app => app.id === id);
    if (index === -1) return null;

    const updatedApp = {
      ...this.applications[index],
      ...updates,
      processedAt: updates.status ? new Date() : this.applications[index].processedAt,
    };

    this.applications[index] = updatedApp;
    console.log('Application updated:', updatedApp);
    return updatedApp;
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

export const applicationStore = ApplicationStore.getInstance();