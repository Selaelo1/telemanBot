import { NextRequest, NextResponse } from 'next/server';
import { applicationStore } from '@/lib/applicationStore';

export async function GET() {
  try {
    console.log('=== FETCHING APPLICATIONS ===');
    const applications = applicationStore.getAll();
    console.log('Found applications:', applications.length);
    console.log('Applications data:', applications.map(app => ({
      id: app.id,
      firstName: app.firstName,
      lastName: app.lastName,
      status: app.status,
      submittedAt: app.submittedAt
    })));
    return NextResponse.json(applications);
  } catch (error) {
    console.error('=== ERROR FETCHING APPLICATIONS ===', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}