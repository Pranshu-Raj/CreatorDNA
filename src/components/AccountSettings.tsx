'use client';

import { useSession } from 'next-auth/react';
import { signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export function AccountSettings() {
  const { data: session, update } = useSession();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleDisconnectTwitter = async () => {
    try {
      setIsDisconnecting(true);
      
      const response = await fetch('/api/twitter/disconnect', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        await update();
      }
    } catch (error) {
      console.error('Failed to disconnect Twitter:', error);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleConnectTwitter = async () => {
    await signIn('twitter', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Settings</h3>
      
      <div className="space-y-6">
        {/* Current Account */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Current Account</h4>
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            {session?.user?.image && (
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
            )}
            <div>
              <div className="font-medium text-gray-900">{session?.user?.name}</div>
              <div className="text-sm text-gray-600">{session?.user?.email}</div>
            </div>
          </div>
        </div>

        {/* Connected Accounts */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Connected Accounts</h4>
          <div className="space-y-3">
            {/* Google Account */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Google</div>
                  <div className="text-sm text-gray-600">{session?.user?.email}</div>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Connected
              </span>
            </div>

            {/* Twitter Account */}
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Twitter</div>
                  <div className="text-sm text-gray-600">
                    {session?.user?.twitterConnected 
                      ? `@${session.user.twitterHandle}`
                      : 'Not connected'
                    }
                  </div>
                </div>
              </div>
              
              {session?.user?.twitterConnected ? (
                <button
                  onClick={handleDisconnectTwitter}
                  disabled={isDisconnecting}
                  className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                </button>
              ) : (
                <button
                  onClick={handleConnectTwitter}
                  className="px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-red-900 mb-3">Danger Zone</h4>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-medium text-red-900">Sign Out</h5>
                <p className="text-sm text-red-700">This will sign you out of your account</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 