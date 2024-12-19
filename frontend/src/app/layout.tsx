import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut
} from '@clerk/nextjs'
import './globals.css'
import Link from 'next/link'
import CustomUserButton from '@/components/ProfileButton'

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
            <div className="flex gap-4">
              <Link 
                href="/history"
                className="px-4 hover:text-purple-400 transition-colors text-purple-200 text-lg"
              >
                Previous Workouts
              </Link>
            </div>
            
            <div className="ml-auto">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <CustomUserButton />
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