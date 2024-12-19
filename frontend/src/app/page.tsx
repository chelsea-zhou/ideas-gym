'use client'
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    SignUpButton,
    UserButton
  } from '@clerk/nextjs'
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function Home() {
  const { userId } = useAuth();
  
  if (userId) {
    redirect('/chat');
  }
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <div className="h-screen flex flex-col items-center justify-center px-4">
          {/* <div className="flex gap-4 justify-center">
              <SignInButton mode="modal">
                <button className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors">
                  Sign Up
                </button>
              </SignUpButton>
            </div> */}
          <div className="text-center space-y-8 max-w-2xl mx-auto">
            <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Welcome to Ideas Gym!
            </h1>
            
            <p className="text-gray-300 text-xl mb-8">
              Transform your ideas into reality. Your personal AI-powered brainstorming companion.
            </p>

  
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title="Thought partner"
                description="Write in convesation with an intelligent thought partner"
                icon="💡"
              />
              <FeatureCard 
                title="Time boxed"
                description="Actively work on your ideas in a time boxed session"
                icon="🕒"
              />
              <FeatureCard 
                title="Authenticity"
                description="Write honestly with unfiltered, open conversations."
                icon="✨"
              />
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
    return (
      <div className="p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm">
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    );
  }