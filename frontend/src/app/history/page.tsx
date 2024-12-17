'use client'

import { useAuth } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Conversation {
  id: string
  createdAt: string
  title: string
  topic?: string
  duration: string
  messageCount: number
}

// This would eventually come from your database
const mockConversations: Conversation[] = [
  {
    id: '1',
    createdAt: '2024-03-20',
    title: 'Morning Workout Session',
    duration: '20:00',
    messageCount: 12
  },
]

export default function HistoryPage() {
  const [chatInfos, setChatInfos] = useState<Conversation[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchChatInfos = async () => {
      const token = await getToken();
      const response = await fetch(`http://localhost:8000/chats`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const data = await response.json();
      console.log("data is", data);
      setChatInfos(data.chatInfo);
    };
    fetchChatInfos();
  }, []);

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
          {chatInfos.map((conversation) => (
            <Link key={conversation.id} href={`/chat/${conversation.id}`} className="block">
            <div 
              key={conversation.id}
              className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm hover:bg-gray-800/70 
                transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 
                    transition-colors">
                    Gym Session {conversation.topic && `: ${conversation.topic}`}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {new Date(conversation.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    })}
                  </p>
                </div>
                {/* <div className="text-gray-400 text-sm">
                  {conversation.messageCount} messages
                </div> */}
              </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}