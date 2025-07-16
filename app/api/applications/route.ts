import { NextResponse } from 'next/server';
import { applicationStore } from '@/lib/applicationStore';

export async function GET() {
  try {
    console.log('=== FETCHING ALL APPLICATIONS ===');
    const applications = applicationStore.getAll();
    console.log('Returning applications:', applications.length);
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}