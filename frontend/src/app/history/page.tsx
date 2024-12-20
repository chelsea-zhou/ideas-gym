'use client'

import { useAuth } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ENDPOINT } from '../constant'

interface Conversation {
  id: string
  createdAt: string
  title: string
  topic?: string
  duration: string
  messageCount: number
}

export default function HistoryPage() {
  const [chatInfos, setChatInfos] = useState<Conversation[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchChatInfos = async () => {
      const token = await getToken();
      const response = await fetch(`${ENDPOINT.PROD}/chats`,
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

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (!confirm('Are you sure you want to delete this chat?')) return;

    const token = await getToken();
    const response = await fetch(`${ENDPOINT.PROD}/chats/${chatId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      setChatInfos(chatInfos.filter(chat => chat.id !== chatId));
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <div className="max-w-6xl mx-auto pt-20">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Previous workouts</h1>
          <Link 
            href="/chat"
            className="px-4 py-2 font-bold bg-purple-300 rounded-lg hover:bg-purple-700 transition-colors text-black"
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
                <button 
                  className="text-gray-400 hover:text-red-300 transition-colors text-2xl"
                  onClick={(e) => deleteChat(conversation.id, e)}
                  >x
                  </button>
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