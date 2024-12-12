import {
  ClerkProvider,
  SignInButton,
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
          <nav className="fixed top-0 w-full p-4 flex justify-between items-center bg-white/80 backdrop-blur-sm border-b">
            <div className="flex gap-4">
              <Link 
                href="/history"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                History
              </Link>
            </div>
            <div>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
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
          <div className="pt-16">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}