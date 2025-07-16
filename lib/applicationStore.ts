import { Application } from '@/types/application';

class ApplicationStore {
  private applications: Application[] = [];
  private static instance: ApplicationStore;

  private constructor() {}

  public static getInstance(): ApplicationStore {
    if (!ApplicationStore.instance) {
      ApplicationStore.instance = new ApplicationStore();
      console.log('Created new ApplicationStore instance');
    }
    return ApplicationStore.instance;
  }

  getAll(): Application[] {
    console.log('Current applications count:', this.applications.length);
    return [...this.applications].sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  }

  getById(id: string): Application | undefined {
    return this.applications.find(app => app.id === id);
  }

  create(application: Omit<Application, 'id' | 'submittedAt' | 'status'>): Application {
    const newApplication: Application = {
      ...application,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date(),
    };

    this.applications.push(newApplication);
    console.log('Created application:', {
      id: newApplication.id,
      name: `${newApplication.firstName} ${newApplication.lastName}`,
      status: newApplication.status
    });
    
    // Persist to localStorage in development
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('telemanbot-applications', JSON.stringify(this.applications));
    }
    
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
    
    // Persist to localStorage in development
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('telemanbot-applications', JSON.stringify(this.applications));
    }
    
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

  // Initialize from localStorage in development
  initialize() {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const stored = localStorage.getItem('telemanbot-applications');
      if (stored) {
        try {
          this.applications = JSON.parse(stored).map((app: any) => ({
            ...app,
            submittedAt: new Date(app.submittedAt),
            processedAt: app.processedAt ? new Date(app.processedAt) : undefined
          }));
          console.log('Initialized store from localStorage:', this.applications.length);
        } catch (e) {
          console.error('Failed to parse stored applications:', e);
        }
      }
    }
  }
}

const applicationStore = ApplicationStore.getInstance();
applicationStore.initialize(); // Load from localStorage if available

export { applicationStore };