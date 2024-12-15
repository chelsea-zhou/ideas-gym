'use client'

import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';

export default function Home() {
  const router = useRouter();
  const { getToken } = useAuth();

  const handleStartWorkout = async () => {
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:8000/chats', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      router.push(`/chat/${data.id}`);
    } catch (error) {
      console.error('Error starting workout:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Welcome to Ideas Gym!
          </h1>
          
          <p className="text-gray-300 text-xl">
            Transform your ideas into reality. Start your mental workout today.
          </p>

          <button
            onClick={handleStartWorkout}
            className="group relative inline-flex items-center justify-center px-8 py-4 
              text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 
              rounded-full hover:scale-105 transition-all"
          >
            Start a new workout session
          </button>
        </div>
      </div>
    </main>
  );
}