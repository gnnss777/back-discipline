import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Don't expose full keys in production, just show if they exist and first few chars
  return NextResponse.json({
    hasUrl: !!supabaseUrl,
    urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : null,
    hasKey: !!supabaseAnonKey,
    keyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : null,
    urlLength: supabaseUrl ? supabaseUrl.length : 0,
    keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0
  })
}