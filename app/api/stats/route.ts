import { NextResponse } from 'next/server';
import { applicationStore } from '@/lib/applicationStore';

export async function GET() {
  try {
    const stats = {
      total: applicationStore.getAll().length,
      pending: applicationStore.getPendingCount(),
      accepted: applicationStore.getAcceptedCount(),
      declined: applicationStore.getDeclinedCount(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}