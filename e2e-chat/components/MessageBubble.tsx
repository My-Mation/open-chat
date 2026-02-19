type Props = {
  sender: string
  content: string
  currentUser: string
}

export default function MessageBubble({
  sender,
  content,
  currentUser,
}: Props) {
  const isOwn = sender === currentUser

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[70%]
          px-4
          py-2
          rounded-2xl
          text-sm
          shadow
          ${isOwn
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-800 text-gray-200'}
        `}
      >
        <div className="font-medium text-xs mb-1 opacity-70">
          {sender}
        </div>
        <div>{content}</div>
      </div>
    </div>
  )
}
