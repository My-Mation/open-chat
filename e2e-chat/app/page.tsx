'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const router = useRouter()

  function handleEnter() {
    if (!username.trim() || !room.trim()) return

    router.push(`/chat?user=${username}&room=${room}`)
  }


  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-80">
        <h1 className="text-white text-lg mb-4 font-semibold">
          Enter Username
        </h1>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Your name..."
        />

        <input
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Room name..."
        />


        <button
          onClick={handleEnter}
          className="w-full bg-indigo-600 hover:bg-indigo-500 transition rounded-lg py-2 text-white"
        >
          Enter Chat
        </button>
      </div>
    </div>
  )
}
