import { NextResponse } from 'next/server';
import { applicationStore } from '@/lib/applicationStore';

export const dynamic = 'force-dynamic'; // Disable caching

export async function GET() {
  try {
    const applications = applicationStore.getAll();
    
    console.log('Returning applications:', applications.length);
    if (applications.length > 0) {
      console.log('Sample application:', {
        id: applications[0].id,
        name: `${applications[0].firstName} ${applications[0].lastName}`,
        status: applications[0].status
      });
    }
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}