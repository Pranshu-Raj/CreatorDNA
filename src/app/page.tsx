import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen nature-bg">
      <Navbar />

      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-800 font-medium text-sm">
                  <span className="cute-illustration">🌱</span>
                  Discover Your Creative DNA
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find Your Unique
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500 block">
                  Content Angle
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
            Stop copying others. Discover content angles that match your unique story, 
            background, and personality. Stand out in a saturated market.
                <span className="cute-illustration">🚀</span>
          </p>
          
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <Link 
            href="/quiz/step-1"
                  className="btn btn-primary px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl"
          >
                  Start Your Quiz 
                  <span className="ml-2">🎯</span>
          </Link>
                <button className="btn btn-secondary px-8 py-4 rounded-full font-semibold text-lg">
                  Learn More
                  <span className="ml-2">📚</span>
                </button>
              </div>
              
              <p className="text-sm text-gray-500 mt-6 flex items-center justify-center lg:justify-start">
                <span className="cute-illustration">⏰</span>
                Takes 5-7 minutes • Get personalized results instantly
              </p>
            </div>

            {/* Right side - Illustration */}
            <div className="relative">
              <div className="gamified-card p-8 text-center">
                <div className="space-y-6">
                  <div className="text-6xl mb-4">🎭</div>
                  <h3 className="text-heading text-gray-900 mb-4">Your Creative Journey</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-emerald-50 rounded-2xl p-4">
                      <span className="text-2xl">📖</span>
                      <span className="text-body font-medium">Your Story</span>
                      <span className="text-2xl">✨</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-teal-50 rounded-2xl p-4">
                      <span className="text-2xl">🎨</span>
                      <span className="text-body font-medium">Creative Skills</span>
                      <span className="text-2xl">💡</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-emerald-50 rounded-2xl p-4">
                      <span className="text-2xl">🎪</span>
                      <span className="text-body font-medium">Unique Angle</span>
                      <span className="text-2xl">🌟</span>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-8 -right-8 text-4xl cute-illustration">🌳</div>
                <div className="absolute -bottom-8 -left-8 text-4xl cute-illustration">🐸</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
              <span className="cute-illustration">🛠️</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our simple 4-step process helps you discover your unique creative identity
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center">
              <div className="gamified-card p-6 mb-6 hover:scale-102 transition-transform">
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-subheading font-semibold mb-4 text-gray-900">Your Background</h3>
                <p className="text-body text-gray-600">Share your profession, experience, and life story that makes you unique.</p>
              </div>
             </div>
             
             <div className="text-center">
              <div className="gamified-card p-6 mb-6 hover:scale-102 transition-transform">
                <div className="bg-gradient-to-br from-teal-400 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-subheading font-semibold mb-4 text-gray-900">Skills & Interests</h3>
                <p className="text-body text-gray-600">Tell us about your hobbies, skills, and cultural background.</p>
               </div>
             </div>
             
             <div className="text-center">
              <div className="gamified-card p-6 mb-6 hover:scale-102 transition-transform">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🎭</span>
                </div>
                <h3 className="text-subheading font-semibold mb-4 text-gray-900">Your Personality</h3>
                <p className="text-body text-gray-600">Discover your communication style and creative preferences.</p>
               </div>
             </div>
             
             <div className="text-center">
              <div className="gamified-card p-6 mb-6 hover:scale-102 transition-transform">
                <div className="bg-gradient-to-br from-teal-500 to-emerald-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-subheading font-semibold mb-4 text-gray-900">Content Goals</h3>
                <p className="text-body text-gray-600">Define your niche and target audience for maximum impact.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Angle Examples */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 bg-white/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Content Angle Examples
              <span className="cute-illustration">💡</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how unique backgrounds create compelling content angles
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="gamified-card p-8 hover:scale-102 transition-all">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl">👨‍🏫</span>
                </div>
                <div>
                  <h3 className="text-heading font-semibold text-gray-900">The Classroom Chef</h3>
                  <p className="text-body text-gray-600">Former teacher + cooking = Educational content</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start bg-emerald-50 rounded-xl p-3">
                  <span className="text-emerald-600 mr-3 text-lg">🔪</span>
                  <span className="text-body">Breaking down knife skills into 'lessons'</span>
                </div>
                <div className="flex items-start bg-teal-50 rounded-xl p-3">
                  <span className="text-teal-600 mr-3 text-lg">🧪</span>
                  <span className="text-body">Cooking science explanations</span>
                </div>
                <div className="flex items-start bg-emerald-50 rounded-xl p-3">
                  <span className="text-emerald-600 mr-3 text-lg">📚</span>
                  <span className="text-body">Meal prep 'homework' assignments</span>
                </div>
              </div>
            </div>
            
            <div className="gamified-card p-8 hover:scale-102 transition-all">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-2xl">👩‍💻</span>
                </div>
                <div>
                  <h3 className="text-heading font-semibold text-gray-900">The Mindful Coder</h3>
                  <p className="text-body text-gray-600">Software engineer + meditation = Zen productivity</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start bg-pink-50 rounded-xl p-3">
                  <span className="text-pink-600 mr-3 text-lg">🧘</span>
                  <span className="text-body">Mindful debugging techniques</span>
                </div>
                <div className="flex items-start bg-rose-50 rounded-xl p-3">
                  <span className="text-rose-600 mr-3 text-lg">⚡</span>
                  <span className="text-body">Stress-free coding practices</span>
                </div>
                <div className="flex items-start bg-pink-50 rounded-xl p-3">
                  <span className="text-pink-600 mr-3 text-lg">🎯</span>
                  <span className="text-body">Work-life balance for developers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="gamified-card text-center p-8 lg:p-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            <div className="mb-6">
              <span className="text-6xl cute-illustration">🌟</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Find Your Content Angle?</h2>
            <p className="text-lg sm:text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who've discovered their unique voice and built authentic audiences
            </p>
            <Link 
              href="/quiz/step-1"
              className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Your Quiz Now
              <span className="ml-2">🚀</span>
            </Link>
            
            <div className="mt-8 flex justify-center space-x-8">
              <span className="text-4xl cute-illustration">🌳</span>
              <span className="text-4xl cute-illustration">🐸</span>
              <span className="text-4xl cute-illustration">🦋</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 lg:px-8 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <span className="text-3xl cute-illustration">🌱</span>
          </div>
          <p className="text-gray-400">
            &copy; 2024 CreatorDNA. Built for creators, by creators.
            <span className="cute-illustration">💚</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
