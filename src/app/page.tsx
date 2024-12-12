import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="h-screen flex flex-col items-center justify-center px-4">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4 animate-fade-in">
            Welcome to Ideas Gym!
          </h1>
          
          <p className="text-gray-300 text-xl mb-8">
            Transform your ideas into reality. Start your mental workout today.
          </p>

          <Link href="/chat" className="group relative inline-flex items-center justify-center px-8 py-4 
            text-lg font-bold tracking-wider text-white bg-gradient-to-r from-blue-500 
            to-purple-600 rounded-full overflow-hidden transition-all duration-300 
            ease-out hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 
              to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
              ease-out"></span>
            <span className="relative flex items-center gap-2">
              Start a new workout session
              <svg 
                className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
          </Link>
        </div>

        {/* Optional: Decorative Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
      </div>
    </main>
  )
}