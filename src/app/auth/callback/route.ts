import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_code = requestUrl.searchParams.get('error_code');
  const error_description = requestUrl.searchParams.get('error_description');
  const type = requestUrl.searchParams.get('type');
  const redirectTo = requestUrl.searchParams.get('redirect_to') || '/';

  // Determine redirect path based on success or error
  let redirectPath = redirectTo;
  
  if (error || error_code || error_description) {
    // There was an error with the callback
    redirectPath = `/auth/confirmation?status=error&error=${error || ''}&error_code=${error_code || ''}&error_description=${encodeURIComponent(error_description || '')}`;
  } else if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      // Exchange code for session
      await supabase.auth.exchangeCodeForSession(code);
      
      // If this is a password reset, send them to the reset password page
      if (type === 'recovery') {
        redirectPath = '/auth/reset-password';
      } else {
        // Default success - account confirmation
        // We can include the redirect back to the original page
        redirectPath = `/auth/confirmation?status=success&redirect_to=${encodeURIComponent(redirectTo)}`;
      }
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      redirectPath = `/auth/confirmation?status=error&error=exception&error_description=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error occurred')}`;
    }
  } else {
    // No code or error - just redirect to homepage
    redirectPath = '/';
  }

  // Redirect to the determined path
  return NextResponse.redirect(new URL(redirectPath, request.url));
} 