'use client'

import { ENDPOINT } from '@/app/constant';
import { useAuth } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react'

interface Message {
  id: string;
  content: string;
  role: 'USER' | 'ASSISTANT';
}

// temporary type, represents chat object returned from the server
interface Chat {
  createdAt: string;
  messages: Message[];
  topic: string;
  title: string;
}

export const useAutoResize = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return textareaRef;
};

export default function WorkoutPage() {
  const params = useParams();
  const chatSessionId = params.chatId as string;
  const { getToken } = useAuth();
  const [time, setTime] = useState(1200)
  const [messages, setMessages] = useState<{ text: string, role: 'USER' | 'ASSISTANT' }[]>([])
  const [inputMessage, setInputMessage] = useState('');
  const [startTime, setStartTime] = useState(Date.now());
  const [isSummaryGenerated, setIsSummaryGenerated] = useState(false);
  const [summary, setSummary] = useState('');
  const textareaRef = useAutoResize(inputMessage);


  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (time > 0 && !isGymEnded()) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } 
    return () => clearInterval(interval)
  }, [time]);


  useEffect(() => {
    if (isGymEndedInMinutes(2) && !isSummaryGenerated) {
      console.log("generating summary");
      generateSummary();
      setIsSummaryGenerated(true);
    }
  }, [time]);

  const generateSummary = async () => {
    const token = await getToken();
    const response = await fetch(`${ENDPOINT.PROD}/chats/${chatSessionId}/summary`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    console.log(data);
    //setSummary(data.summary);
  }

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const fetchChatDetails = async () => {
    const token = await getToken();
    const response = await fetch(`${ENDPOINT.PROD}/chats/${chatSessionId}`, {
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
    
    if (data.title || data.topic) {
      setIsSummaryGenerated(true);
    }
    setStartTime(new Date(data.createdAt).getTime());
    const timePassed = Math.floor((Date.now() - new Date(data.createdAt).getTime()) / 1000);
    const timeLeft = Math.max(1200 - timePassed, 0);
    console.log("time left", timeLeft);
    setTime(timeLeft);
  }

  useEffect(() => {
    fetchChatDetails();
  }, []);

  const isGymEnded = () => {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime)/1000;
    return elapsedTime >= 1200;
  }

  const isGymEndedInMinutes = (minutes: number) => {
    const currentTime = Date.now();
    const timeLeft = 1200 - (currentTime - startTime)/1000;
    return timeLeft <= minutes * 60;
  }
  const sendMessage = async (message: string) => {
      try {
        const token = await getToken();
        const response = await fetch(`${ENDPOINT.PROD}/chats/${chatSessionId}`, {
          method: 'PUT',
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ message }),
        });
        const data = await response.json();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // Add useEffect to scroll on messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]); 

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
        <div className="p-4  border-gray-700  mt-16">
            <div className="flex items-center justify-center">
              <div className="text-3xl font-bold font-mono">{formatTime(time)}</div>
            </div>
        </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 pt-4">
        <div className="bg-gray-800/50 rounded-xl backdrop-blur-sm flex flex-col h-[66vh]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 text-lg ${
                    message.role === 'USER'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />

          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className={`flex-1 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500
                ${
                  isGymEnded() ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gray-700 text-white'
                }`}
                placeholder="Type your message..."
                disabled={isGymEnded()}
              />
              <button
                type="submit"
                className={`px-6 py-2 rounded-lg transition-colors ${
                  isGymEnded() ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={isGymEnded()}
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