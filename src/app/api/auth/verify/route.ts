import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/auth-helpers';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { type, email, token, code } = await request.json();
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    let result;

    switch (type) {
      case 'signup':
        result = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'signup',
        });
        break;
      case 'recovery':
        result = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'recovery',
        });
        break;
      case 'email_change':
        result = await supabase.auth.verifyOtp({
          email,
          token,
          type: 'email_change',
        });
        break;
      case 'code_exchange':
        result = await supabase.auth.exchangeCodeForSession(code);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid verification type' },
          { status: 400 }
        );
    }

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
} 