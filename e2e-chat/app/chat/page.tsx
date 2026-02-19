'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import MessageBubble from '@/components/MessageBubble'
import ChatInput from '@/components/ChatInput'

type Message = {
  id: string
  room_id: string
  sender: string
  content: string
  created_at: string
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const currentUser = searchParams.get('user') || 'anonymous'
  const room = searchParams.get('room') || 'default'
  const [messages, setMessages] = useState<Message[]>([])

  // 🔹 1. Fetch existing messages
  useEffect(() => {
    async function fetchMessages() {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', room)
        .order('created_at', { ascending: true })

      if (!error) setMessages(data || [])
    }

    fetchMessages()

    // 🔹 2. Realtime subscription
    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: 'room_id=eq.${room}',
        },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // 🔹 3. Send message handler
  async function handleSend(content: string) {
    if (!content.trim()) return

    await supabase.from('messages').insert([
      {
        room_id: room,
        sender: currentUser,
        content,
      },
    ])
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-lg font-semibold tracking-tight">
          Realtime Chat
        </h1>
        <p className="text-sm text-gray-400">
          Logged in as: {currentUser}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            sender={msg.sender}
            content={msg.content}
            currentUser={currentUser}
          />
        ))}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <ChatInput onSend={handleSend} />
      </div>

    </div>
  )
}
