import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header navigation */}
      <header className="bg-white text-black py-5 px-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-500">Course Central</h1>
          <nav className="hidden sm:flex space-x-8">
            <Link href="/" className="text-black font-medium relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-500 after:rounded-full">Home</Link>
            <Link href="/view-courses" className="text-gray-500 hover:text-red-500 font-medium transition-colors">View Courses</Link>
            <Link href="/add-courses" className="text-gray-500 hover:text-red-500 font-medium transition-colors">Add Courses</Link>
            <Link href="/chatbot" className="text-gray-500 hover:text-red-500 font-medium transition-colors">Chatbot</Link>
            <Link href="/about" className="text-gray-500 hover:text-red-500 font-medium transition-colors">About</Link>
          </nav>
          <button className="sm:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="bg-gradient-to-br from-red-50 to-red-100 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
            {/* Left side content */}
            <div className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Plan your courses in one place!</h2>
                <div className="w-24 h-1.5 bg-red-500 mb-8 rounded-full"></div>
                <p className="text-gray-700 text-lg mb-8 leading-relaxed">
                  CourseCentral helps students track, organize, and
                  visualize their academic journey with smart course planning
                  and insights - so you never miss important deadlines!
                </p>
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link 
                    href="/get-started" 
                    className="bg-red-500 text-white px-8 py-3.5 rounded-full inline-block font-medium hover:bg-red-600 transition-colors shadow-lg hover:shadow-xl hover:shadow-red-200 transform hover:-translate-y-0.5 transition-all w-full sm:w-auto text-center"
                  >
                    Get Started
                  </Link>
                  <Link 
                    href="/learn-more" 
                    className="text-red-500 px-8 py-3.5 rounded-full inline-block font-medium border border-red-200 hover:border-red-300 hover:bg-red-50 transition-colors w-full sm:w-auto text-center"
                  >
                    Learn More
                  </Link>
                </div>
                <p className="text-sm text-red-500 mt-6">
                  Create your free account now! No credit card required.
                </p>
              </div>
            </div>

            {/* Right side placeholder for image */}
            <div className="w-full md:w-1/2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transform rotate-1 hover:rotate-0 transition-all duration-300">
                <div className="aspect-video flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className="text-gray-400 font-medium">Course planning visualization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="bg-white py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Join more than 5,000 students!</h2>
              <p className="text-gray-600 max-w-xl mx-auto">Discover how our platform is helping students across the country plan their academic journey more efficiently.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 hover:border-red-100 group">
                <div className="h-14 w-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">Detailed Course Info</h3>
                <p className="text-gray-600">Access up-to-date information on every course, including prerequisites, content, and schedules.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 hover:border-red-100 group">
                <div className="h-14 w-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">AI Course Assistant</h3>
                <p className="text-gray-600">Get insights about courses and professors based on Reddit comments and RateMyProf reviews.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 hover:border-red-100 group">
                <div className="h-14 w-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">Course Statistics</h3>
                <p className="text-gray-600">View historical data from over 10 semesters to make informed decisions about your courses.</p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100 hover:border-red-100 group">
                <div className="h-14 w-14 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">Mobile Compatible</h3>
                <p className="text-gray-600">Access Course Central on any device - plan your schedule anywhere, anytime.</p>
              </div>
            </div>
          </div>
        </div>

        {/* University logos */}
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-center text-gray-500 mb-10 text-sm uppercase tracking-widest font-medium">Trusted by students from top universities</p>
            <div className="flex flex-wrap justify-center items-center gap-12">
              <div className="w-32 h-20 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                <span className="text-gray-400 text-sm text-center">University Logo</span>
              </div>
              <div className="w-32 h-20 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                <span className="text-gray-400 text-sm text-center">University Logo</span>
              </div>
              <div className="w-32 h-20 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                <span className="text-gray-400 text-sm text-center">University Logo</span>
              </div>
              <div className="w-32 h-20 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                <span className="text-gray-400 text-sm text-center">University Logo</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-red-500">Course Central</h3>
              <p className="text-gray-500 text-sm mt-1">© 2023 Course Central. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-500 hover:text-red-500 text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-red-500 text-sm">Terms of Service</Link>
              <Link href="/contact" className="text-gray-500 hover:text-red-500 text-sm">Contact Us</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
