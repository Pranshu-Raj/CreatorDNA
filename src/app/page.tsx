import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Find Your Unique
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-400"> Content Angle</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Stop copying others. Discover content angles that match your unique story, 
                background, and personality. Stand out in a saturated market.
              </p>
              
              <Link 
                href="/quiz/step-1"
                className="inline-block bg-gradient-to-r from-orange-400 to-pink-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-500 hover:to-pink-500 transition-all shadow-lg transform hover:scale-105"
              >
                Start Your Quiz →
              </Link>
              
              <p className="text-sm text-gray-500 mt-4">Takes 5-7 minutes • Get personalized results instantly</p>
            </div>

            {/* Right side - Illustration */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Background blob */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full transform scale-110 opacity-60"></div>
                
                {/* Illustration container */}
                <div className="relative z-10 p-20">
                  <div className="relative">
                    {/* Main stack */}
                    <div className="w-40 h-10 bg-gray-900 rounded-xl shadow-lg"></div>
                    <div className="w-32 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-xl shadow-lg absolute -top-5 left-4"></div>
                    <div className="w-24 h-10 bg-gray-900 rounded-xl shadow-lg absolute -top-10 left-8"></div>
                    
                    {/* Arrow pointing up */}
                    <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
                      <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-gray-900"></div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-24 -left-10 w-8 h-8 bg-orange-400 rounded-full"></div>
                    <div className="absolute -top-16 -right-8 w-6 h-6 bg-pink-400 rounded-full"></div>
                    <div className="absolute -top-30 left-16">
                      <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[15px] border-l-transparent border-r-transparent border-b-orange-400"></div>
                    </div>
                    
                    {/* Sparkle effect */}
                    <div className="absolute -top-32 -left-6">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0L14.7 9.3L24 12L14.7 14.7L12 24L9.3 14.7L0 12L9.3 9.3L12 0Z" fill="#FB923C"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Your Background</h3>
              <p className="text-gray-600">Share your profession, experience, and life story that makes you unique.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Skills & Interests</h3>
              <p className="text-gray-600">Tell us about your hobbies, skills, and cultural background.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Your Personality</h3>
              <p className="text-gray-600">Discover your communication style and core values.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gradient-to-br from-orange-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">Content Goals</h3>
              <p className="text-gray-600">Define your niche, audience, and platform preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">Content Angle Examples</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white font-bold">👨‍🏫</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Classroom Chef</h3>
              <p className="text-gray-700 mb-4">Former teacher + cooking interest = Teaching cooking like classroom lessons</p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Breaking down knife skills into 'lessons'</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Cooking science explanations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Meal prep 'homework' assignments</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
                <span className="text-white font-bold">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Tech Translator</h3>
              <p className="text-gray-700 mb-4">Engineer + accessibility focus = Making tech simple for everyone</p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Explaining new apps in simple terms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Tech reviews for non-tech people</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Digital life hacks and shortcuts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-orange-400 to-pink-400">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Find Your Content Angle?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of creators who've discovered their unique voice
          </p>
          <Link 
            href="/quiz/step-1"
            className="inline-block bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg transform hover:scale-105"
          >
            Start Your Quiz Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">&copy; 2024 Creator Personality Matcher. Built for creators, by creators.</p>
        </div>
      </footer>
    </div>
  );
}
