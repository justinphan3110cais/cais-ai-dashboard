import { NextResponse } from 'next/server';
import modelsData from '@/data/models.json';

// Define allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://agi.safe.ai',
  'https://lastexam.ai',
  'https://dashboard.safe.ai',
  'http://localhost:3000',
  'http://localhost:3001',
];

export async function GET(request: Request) {
  const origin = request.headers.get('origin') || '';
  
  // Check if origin is allowed
  const isAllowedOrigin = ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || origin.endsWith('.vercel.app')
  );
  
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    // Vary by Origin so CDN caches different responses for different origins
    'Vary': 'Origin',
  };

  // Only set CORS header if origin is allowed
  if (isAllowedOrigin && origin) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
    // Cache for allowed origins
    corsHeaders['Cache-Control'] = 'public, s-maxage=3600, stale-while-revalidate=86400';
  } else if (!origin) {
    // No origin (direct API call, not from browser) - allow and cache
    corsHeaders['Access-Control-Allow-Origin'] = '*';
    corsHeaders['Cache-Control'] = 'public, s-maxage=3600, stale-while-revalidate=86400';
  } else {
    // Disallowed origin - don't cache, don't set permissive CORS
    corsHeaders['Cache-Control'] = 'no-store';
  }

  return NextResponse.json(modelsData, { headers: corsHeaders });
}

// Handle preflight requests
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin') || '';
  
  const isAllowedOrigin = ALLOWED_ORIGINS.some(allowed => 
    origin === allowed || origin.endsWith('.vercel.app')
  );

  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };

  if (isAllowedOrigin && origin) {
    corsHeaders['Access-Control-Allow-Origin'] = origin;
  } else if (!origin) {
    corsHeaders['Access-Control-Allow-Origin'] = '*';
  }

  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

