'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const { data: session } = useSession();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-purple-600 transition-colors">
            Creator Personality Matcher
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/quiz/step-1" 
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                >
                  Take Quiz
                </Link>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {session.user.image && (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'User'} 
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-gray-700 font-medium">
                      {session.user.name || session.user.email}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => signIn()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            {session ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2 mb-4">
                  {session.user.image && (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-gray-700 font-medium">
                    {session.user.name || session.user.email}
                  </span>
                </div>
                <Link 
                  href="/dashboard" 
                  className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  href="/quiz/step-1" 
                  className="block text-gray-700 hover:text-purple-600 font-medium py-2"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Take Quiz
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    setShowMobileMenu(false);
                  }}
                  className="block text-gray-700 hover:text-red-600 font-medium py-2 w-full text-left"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  signIn();
                  setShowMobileMenu(false);
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
} 