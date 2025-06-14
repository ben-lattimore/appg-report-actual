import { getCachedAggregates } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getCachedAggregates();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching aggregated data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}