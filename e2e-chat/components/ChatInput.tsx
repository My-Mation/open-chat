'use client'

import { useState } from 'react'

type Props = {
  onSend: (message: string) => void
}

export default function ChatInput({ onSend }: Props) {
  const [message, setMessage] = useState('')

  function handleSend() {
    if (!message.trim()) return

    onSend(message)
    setMessage('')
  }

  return (
    <div className="flex gap-3">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <button
        onClick={handleSend}
        className="bg-indigo-600 hover:bg-indigo-500 transition px-4 py-2 rounded-xl text-sm font-medium"
      >
        Send
      </button>
    </div>
  )
}
