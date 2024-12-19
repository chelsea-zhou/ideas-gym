import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'
import Link from 'next/link'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <nav className="fixed top-0 w-full p-4 flex justify-between items-center  backdrop-blur-sm border-b">
            {
            <div className="flex gap-4">
              <Link 
                href="/history"
                className="px-4 hover:text-purple-400 transition-colors text-purple-200 text-lg"
              >
                Previous Workouts
              </Link>
            </div>
            /*
            <div className="flex gap-4">
              <Link 
                href="/stripe"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Pricing
              </Link>
            </div>
            <div className="flex gap-4">
              <Link 
                href="/stripe/billing"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                BillingInfo
              </Link>
            </div> */}
            <div className="ml-auto"> {/* Added ml-auto to push content to the right */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10 rounded-full",
                      userButtonTrigger: "hover:opacity-80 transition-opacity"
                    }
                  }}
                  afterSignOutUrl="/"
                />
              </SignedIn>
            </div>
          </nav>

          <div className="">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}