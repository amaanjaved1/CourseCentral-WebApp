import { createRouteHandlerClient } from '@/lib/auth-helpers';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Add logging to diagnose the issue
  console.log('Auth callback route hit:', request.url);
  
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_code = requestUrl.searchParams.get('error_code');
  const error_description = requestUrl.searchParams.get('error_description');
  const type = requestUrl.searchParams.get('type');
  const redirectTo = requestUrl.searchParams.get('redirect_to') || '/';

  // Log the parameters
  console.log('Auth callback parameters:', { 
    code: code ? 'present' : 'not present',
    error, 
    error_code, 
    error_description, 
    type,
    redirectTo 
  });

  // IMPORTANT: We need to force the redirect to the success page for email verification
  // This will bypass any potential routing issues
  if (code && !type) {
    try {
      console.log('Processing verification code...');
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      // Exchange code for session
      console.log('Exchanging code for session...');
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        return NextResponse.redirect(new URL(`/auth/confirmation?status=error&error=exchange_error&error_description=${encodeURIComponent(exchangeError.message)}`, request.url));
      }
      
      console.log('Code exchange successful, redirecting to success page');
      
      // FORCE REDIRECT: Use direct URL construction to go to success page
      // We'll use the standalone success page to ensure it works
      return NextResponse.redirect(new URL('/auth/success-page', request.url));
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      return NextResponse.redirect(new URL(`/auth/confirmation?status=error&error=exception&error_description=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error occurred')}`, request.url));
    }
  }

  // Determine redirect path based on success or error
  let redirectPath = redirectTo;
  
  if (error || error_code || error_description) {
    // There was an error with the callback
    redirectPath = `/auth/confirmation?status=error&error=${error || ''}&error_code=${error_code || ''}&error_description=${encodeURIComponent(error_description || '')}`;
    console.log('Error detected, redirecting to:', redirectPath);
  } else if (code) {
    try {
      console.log('Processing verification code...');
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      // Exchange code for session
      console.log('Exchanging code for session...');
      await supabase.auth.exchangeCodeForSession(code);
      console.log('Code exchange successful');
      
      // If this is a password reset, send them to the reset password page
      if (type === 'recovery') {
        redirectPath = '/auth/reset-password';
        console.log('Recovery flow detected, redirecting to reset password');
      } else {
        // Default success - account confirmation
        // Try the standalone success page instead of verification-success
        redirectPath = `/auth/success-page`;
        console.log('Verification successful, redirecting to success page:', redirectPath);
      }
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      redirectPath = `/auth/confirmation?status=error&error=exception&error_description=${encodeURIComponent(error instanceof Error ? error.message : 'Unknown error occurred')}`;
      console.log('Exception occurred, redirecting to error page:', redirectPath);
    }
  } else {
    // No code or error - just redirect to homepage
    redirectPath = '/';
    console.log('No code or error provided, redirecting to homepage');
  }

  // Log the final redirect destination
  console.log('Final redirect path:', redirectPath);

  // Redirect to the determined path
  const redirectUrl = new URL(redirectPath, request.url);
  console.log('Full redirect URL:', redirectUrl.toString());
  return NextResponse.redirect(redirectUrl);
} 