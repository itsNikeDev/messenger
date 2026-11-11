import { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar.jsx'

function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ChatWindow({ chat, onSend }) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat?.messages.length])

  if (!chat) {
    return (
      <main className="chat-window chat-window--empty">
        <p>Выберите чат или создайте новый по номеру телефона</p>
      </main>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const message = text.trim()
    if (!message || sending) return
    setSending(true)
    try {
      await onSend(message)
      setText('')
    } catch (error) {
      alert(`Не удалось отправить сообщение: ${error.message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="chat-window">
      <header className="chat-header">
        <Avatar name={chat.name} />
        <span className="chat-header-name">{chat.name}</span>
      </header>

      <div className="messages">
        {chat.messages.map((message) => (
          <div
            key={message.id}
            className={`message${message.outgoing ? ' message--outgoing' : ' message--incoming'}`}
          >
            <div className="message-bubble">
              <span className="message-text">{message.text}</span>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сообщение"
          autoFocus
        />
        <button type="submit" className="btn-primary" disabled={!text.trim() || sending}>
          Отправить
        </button>
      </form>
    </main>
  )
}
