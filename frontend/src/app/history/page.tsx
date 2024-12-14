'use client'

import Link from 'next/link'

interface Conversation {
  id: string
  date: string
  title: string
  duration: string
  messageCount: number
}

// This would eventually come from your database
const mockConversations: Conversation[] = [
  {
    id: '1',
    date: '2024-03-20',
    title: 'Morning Workout Session',
    duration: '20:00',
    messageCount: 12
  },
  // Add more mock data as needed
]

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto pt-20">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Workout History</h1>
          <Link 
            href="/chat"
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            New Workout
          </Link>
        </div>

        <div className="grid gap-4">
          {mockConversations.map((conversation) => (
            <div 
              key={conversation.id}
              className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/70 
                transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 
                    transition-colors">
                    {conversation.title}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {new Date(conversation.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{conversation.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>{conversation.messageCount} messages</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}