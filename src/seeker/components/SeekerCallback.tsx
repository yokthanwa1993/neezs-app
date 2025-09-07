import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { seekerAuth } from '../lib/seekerFirebase';
import { buildCallbackUrl } from '@/shared/lib/codespaces';

const SeekerCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const processing = useRef(false);

  useEffect(() => {
    // Check if user is already authenticated
    const unsubscribe = onAuthStateChanged(seekerAuth, (user) => {
      if (user && !processing.current) {
        console.log('SeekerCallback: User already authenticated, redirecting...');
        window.location.href = '/seeker/home';
        return;
      }
    });

    const handleCallback = async () => {
      // Prevent re-processing if currently processing
      if (processing.current) {
        return;
      }
      processing.current = true;
      
      console.log('🔄 SeekerCallback: Processing LINE OAuth callback...');
      
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const callbackError = searchParams.get('error');

        if (callbackError) {
          throw new Error(`LINE OAuth Error: ${callbackError}`);
        }

        if (!code) {
          throw new Error('Authorization code not found in callback URL.');
        }

        let redirectPath = '/seeker/home';
        if (state) {
          try {
            const decodedState = JSON.parse(atob(state));
            redirectPath = decodedState.redirectPath || redirectPath;
          } catch (e) {
            console.warn('⚠️ Could not parse state parameter:', e);
          }
        }

        const redirectUri = (import.meta as any).env?.VITE_CODESPACES_BASE_DOMAIN
          ? buildCallbackUrl('seeker', 5000)
          : (import.meta as any).env?.VITE_LINE_REDIRECT_URI_SEEKER || `${window.location.origin}/seeker/auth/callback`;

        const response = await fetch('/api/auth/seeker-line-callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ code, redirectUri, role: 'seeker', state }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to exchange code for token.');
        }

        const { firebaseToken } = await response.json();
        if (!firebaseToken) {
          throw new Error('Firebase token not received from server.');
        }

        console.log('✅ SeekerCallback: Firebase token received. Signing in...');
        // Let the AuthProvider's onAuthStateChanged handle the user state update
        await signInWithCustomToken(seekerAuth, firebaseToken);
        
        console.log('✅ SeekerCallback: Sign-in successful. Redirecting...');
        // Use window.location.href for hard redirect to avoid context conflicts
        window.location.href = redirectPath;

      } catch (err) {
        console.error('❌ SeekerCallback: Authentication failed.', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();

    return () => {
      unsubscribe();
    };
  }, [searchParams]);

  const handleRetry = () => {
    // Go back to the home page, which will trigger the login flow again
    navigate('/seeker/home', { replace: true });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-mobile-lg text-center">
          <h2 className="text-xl font-bold text-red-800 mb-4">Login Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRetry}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-4 rounded-2xl shadow-xl w-full max-w-mobile-lg text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-gray-900">Processing Login...</h2>
        <p className="text-gray-600">Please wait while we securely log you in.</p>
      </div>
    </div>
  );
};

export default SeekerCallback;
