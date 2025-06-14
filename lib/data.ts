import fs from 'node:fs/promises';
import path from 'node:path';
import { AggregatedData } from '@/types/appg';

const CACHE_FILE = path.join(process.cwd(), 'data', 'cache', 'aggregates.json');

export async function getCachedAggregates(): Promise<AggregatedData> {
  try {
    const content = await fs.readFile(CACHE_FILE, 'utf8');
    return JSON.parse(content) as AggregatedData;
  } catch (error) {
    console.error('Error reading cached aggregates:', error);
    throw new Error('Failed to load aggregated data. Make sure to run the build script first.');
  }
}

export async function getYearData(year: number): Promise<any> {
  const data = await getCachedAggregates();
  return data.yearSummaries.find(y => y.year === year);
}