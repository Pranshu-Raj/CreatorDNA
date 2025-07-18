'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const { data: session } = useSession();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-xl">🌱</span>
            </div>
            <span className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
              CreatorDNA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="px-4 py-2 rounded-full text-gray-700 hover:text-emerald-600 hover:bg-green-50 font-medium transition-all duration-200"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/quiz/step-1" 
                  className="px-4 py-2 rounded-full text-gray-700 hover:text-emerald-600 hover:bg-green-50 font-medium transition-all duration-200"
                >
                  Take Quiz
                </Link>
                <div className="ml-4 flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium hidden lg:block">
                      {session.user?.name?.split(' ')[0] || 'Creator'}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="px-4 py-2 rounded-full text-gray-600 hover:text-emerald-600 hover:bg-green-50 font-medium transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="btn btn-primary px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl"
              >
                Sign In 🚀
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-green-50 transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-emerald-100">
            <div className="flex flex-col space-y-2 pt-4">
              {session ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="px-4 py-3 rounded-2xl text-gray-700 hover:text-emerald-600 hover:bg-green-50 font-medium transition-all"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/quiz/step-1" 
                    className="px-4 py-3 rounded-2xl text-gray-700 hover:text-emerald-600 hover:bg-green-50 font-medium transition-all"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Take Quiz
                  </Link>
                  <div className="px-4 py-3 bg-emerald-50 rounded-2xl mt-2">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-gray-700 font-medium">
                        {session.user?.name || 'Creator'}
                      </span>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="w-full px-4 py-2 rounded-full text-gray-600 hover:text-emerald-600 hover:bg-green-50 font-medium transition-all"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="btn btn-primary mx-4 py-3 rounded-2xl font-medium shadow-lg"
                >
                  Sign In 🚀
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 