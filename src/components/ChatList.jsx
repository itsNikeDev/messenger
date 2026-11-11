import { useState } from 'react'
import Avatar from './Avatar.jsx'

function normalizePhone(value) {
  return value.replace(/\D/g, '')
}

export default function ChatList({ chats, activeChatId, onSelect, onCreate, onLogout }) {
  const [phone, setPhone] = useState('')

  const handleCreate = (event) => {
    event.preventDefault()
    const digits = normalizePhone(phone)
    if (!digits) return
    onCreate(digits)
    setPhone('')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">MAX</span>
        <button className="btn-logout" onClick={onLogout} title="Выйти">Выйти</button>
      </div>

      <form className="new-chat-form" onSubmit={handleCreate}>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Новый чат: 79991234567"
        />
        <button type="submit" className="btn-primary" disabled={!normalizePhone(phone)}>
          Создать
        </button>
      </form>

      <ul className="chat-list">
        {chats.length === 0 && (
          <li className="chat-list-empty">Чатов пока нет. Создайте чат по номеру телефона.</li>
        )}
        {chats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1]
          return (
            <li key={chat.chatId}>
              <button
                className={`chat-item${chat.chatId === activeChatId ? ' chat-item--active' : ''}`}
                onClick={() => onSelect(chat.chatId)}
              >
                <Avatar name={chat.name} />
                <span className="chat-item-body">
                  <span className="chat-item-name">{chat.name}</span>
                  <span className="chat-item-preview">
                    {lastMessage ? lastMessage.text : 'Нет сообщений'}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
