'use client'

import { useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react'

interface Message {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT';
}

interface Chat {
  messages: Message[];
}

export default function WorkoutPage() {
  const params = useParams();
  const chatSessionId = params.chatId as string;
  const { getToken } = useAuth();
  const [time, setTime] = useState(1200)
  const [timerState, setTimerState] = useState<'initial' | 'running' | 'paused'>('initial')
  const [messages, setMessages] = useState<{ text: string, role: 'USER' | 'ASSISTANT' }[]>([])
  const [inputMessage, setInputMessage] = useState('');

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (timerState === 'running' && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0) {
      setTimerState('initial')
    }
    return () => clearInterval(interval)
  }, [timerState, time])

  const handleTimerControl = () => {
    switch (timerState) {
      case 'initial':
        setTimerState('running');
        break
      case 'running':
        setTimerState('paused');
        break
      case 'paused':
        setTimerState('running');
        break
    }
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const fetchChatDetails = async () => {
    const token = await getToken();
    const response = await fetch(`http://localhost:8000/chats/${chatSessionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data: Chat = await response.json();
    console.log(data);
    data.messages.forEach((message) => {
      setMessages((prev) => [...prev, { text: message.content, role: message.role}]);
    });
  }

  useEffect(() => {
    fetchChatDetails();
  }, []);

  const sendMessage = async (message: string) => {
      try {
        const token = await getToken();
        console.log("sending message", message);
        const response = await fetch(`http://localhost:8000/chats/${chatSessionId}`, {
          method: 'PUT',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        });
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error('Error sending message:', error);
      };
  };
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      console.log(inputMessage);
      setMessages((prev) => [...prev, { text: inputMessage, role: 'USER' }]);
      setInputMessage('');
      if (chatSessionId) {
        // system response
        const data = await sendMessage(inputMessage);
        setMessages((prev) => [...prev, { text: data!, role: 'ASSISTANT' }]);
      }
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
        <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-center">
              <div className="text-3xl font-bold font-mono">{formatTime(time)}</div>
              <div className="ml-8">
                <button
                  onClick={handleTimerControl}
                  className="px-8 py-1 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {timerState === 'initial' ? 'Start' : timerState === 'running' ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>
        </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 pt-20">
        {/* Chat Section with Timer at Top */}
        <div className="bg-gray-800/50 rounded-xl backdrop-blur-sm flex flex-col h-[600px]">
          {/* Timer Section */}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.role === 'USER'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}