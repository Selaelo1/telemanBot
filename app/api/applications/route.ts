import { NextRequest, NextResponse } from 'next/server';
import { applicationStore } from '@/lib/applicationStore';

export async function GET() {
  try {
    const applications = applicationStore.getAll();
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}