export const dynamic = 'force-dynamic'
export const revalidate = 0

'use client'

import { useEffect, useState } from 'react'
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

export default function ChatPage({
  searchParams,
}: {
  searchParams: { user?: string; room?: string }
}) {
  const currentUser = searchParams.user || 'anonymous'
  const room = searchParams.room || 'default'

  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!supabase) return

    async function fetchMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', room)
        .order('created_at', { ascending: true })

      setMessages(data || [])
    }

    fetchMessages()

    const channel = supabase
      .channel(`room-${room}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${room}`,
        },
        (payload: any) => {
          setMessages((prev) => [...prev, payload.new])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [room])

  async function handleSend(content: string) {
    if (!content.trim() || !supabase) return

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
      <div className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-lg font-semibold tracking-tight">
          Realtime Chat
        </h1>
        <p className="text-sm text-gray-400">
          Logged in as: {currentUser}
        </p>
      </div>

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

      <div className="border-t border-gray-800 p-4">
        <ChatInput onSend={handleSend} />
      </div>
    </div>
  )
}
