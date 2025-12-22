import { NextRequest, NextResponse } from 'next/server';
import { writeFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    // Check if edit mode is enabled
    if (process.env.NEXT_PUBLIC_ENABLE_EDIT_MODE !== 'true') {
      return NextResponse.json({ error: 'Edit mode is disabled' }, { status: 403 });
    }

    const models = await request.json();
    
    // Path to the models.json file
    const filePath = join(process.cwd(), 'data', 'models.json');
    
    // Write the updated models data to the JSON file
    writeFileSync(filePath, JSON.stringify(models, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save models:', error);
    return NextResponse.json({ error: 'Failed to save models' }, { status: 500 });
  }
}