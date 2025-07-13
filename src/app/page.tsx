import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Navbar />

      {/* Hero Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Unique
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> Content Angle</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop copying others. Discover content angles that match your unique story, 
            background, and personality. Stand out in a saturated market.
          </p>
          
          <Link 
            href="/quiz/step-1"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-colors shadow-lg"
          >
            Start Your Quiz →
          </Link>
          
          <p className="text-sm text-gray-500 mt-4">Takes 5-7 minutes • Get personalized results instantly</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
                             <h4 className="text-lg font-semibold mb-3 text-gray-900">Your Background</h4>
               <p className="text-gray-600 text-sm">Share your profession, experience, and life story.</p>
             </div>
             
             <div className="text-center">
               <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl font-bold text-blue-600">2</span>
               </div>
               <h4 className="text-lg font-semibold mb-3 text-gray-900">Skills & Interests</h4>
               <p className="text-gray-600 text-sm">Tell us about your hobbies, skills, and cultural background.</p>
             </div>
             
             <div className="text-center">
               <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl font-bold text-green-600">3</span>
               </div>
               <h4 className="text-lg font-semibold mb-3 text-gray-900">Your Personality</h4>
               <p className="text-gray-600 text-sm">Discover your communication style and core values.</p>
             </div>
             
             <div className="text-center">
               <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl font-bold text-orange-600">4</span>
               </div>
               <h4 className="text-lg font-semibold mb-3 text-gray-900">Content Goals</h4>
               <p className="text-gray-600 text-sm">Define your niche, audience, and platform preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Content Angle Examples</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-purple-600 mb-2">The Classroom Chef</h4>
              <p className="text-gray-700 mb-3">Former teacher + cooking interest = Teaching cooking like classroom lessons</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Breaking down knife skills into &lsquo;lessons&rsquo;</li>
                <li>• Cooking science explanations</li>
                <li>• Meal prep &lsquo;homework&rsquo; assignments</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h4 className="text-lg font-semibold text-blue-600 mb-2">The Tech Translator</h4>
              <p className="text-gray-700 mb-3">Engineer + accessibility focus = Making tech simple for everyone</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Explaining new apps in simple terms</li>
                <li>• Tech reviews for non-tech people</li>
                <li>• Digital life hacks and shortcuts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2024 Creator Personality Matcher. Built for creators, by creators.</p>
        </div>
      </footer>
    </div>
  );
}
