import { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm.jsx'
import ChatList from './components/ChatList.jsx'
import ChatWindow from './components/ChatWindow.jsx'
import { sendMessage, receiveNotification, deleteNotification } from './api/greenApi.js'

function extractText(messageData) {
  if (messageData?.typeMessage === 'textMessage') {
    return messageData.textMessageData.textMessage
  }
  if (messageData?.typeMessage === 'extendedTextMessage') {
    return messageData.extendedTextMessageData.text
  }
  return null
}

export default function App() {
  const [credentials, setCredentials] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('greenApiCredentials'))
    } catch {
      return null
    }
  })
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)

  useEffect(() => {
    if (!credentials) return

    let cancelled = false

    const handleNotification = (body) => {
      if (body.typeWebhook !== 'incomingMessageReceived') return
      const text = extractText(body.messageData)
      if (!text) return

      const sender = body.senderData
      const message = {
        id: body.idMessage,
        text,
        outgoing: false,
        timestamp: body.timestamp,
      }

      setChats((prev) => {
        const existing =
          prev.find((chat) => chat.chatId === sender.chatId) ??
          prev.find(
            (chat) =>
              sender.senderPhoneNumber &&
              chat.chatId.startsWith(`${sender.senderPhoneNumber}@`),
          )
        if (existing) {
          return prev.map((chat) =>
            chat === existing && !chat.messages.some((m) => m.id === message.id)
              ? { ...chat, messages: [...chat.messages, message] }
              : chat,
          )
        }
        return [
          ...prev,
          {
            chatId: sender.chatId,
            name: sender.senderName || sender.chatName || sender.chatId,
            messages: [message],
          },
        ]
      })
    }

    const poll = async () => {
      while (!cancelled) {
        try {
          const notification = await receiveNotification(credentials)
          if (notification) {
            handleNotification(notification.body)
            await deleteNotification(credentials, notification.receiptId)
          }
        } catch (error) {
          console.error('Ошибка получения уведомлений:', error)
          await new Promise((resolve) => setTimeout(resolve, 5000))
        }
      }
    }

    poll()
    return () => {
      cancelled = true
    }
  }, [credentials])

  const handleLogin = (creds) => {
    localStorage.setItem('greenApiCredentials', JSON.stringify(creds))
    setCredentials(creds)
  }

  const handleLogout = () => {
    localStorage.removeItem('greenApiCredentials')
    setCredentials(null)
    setChats([])
    setActiveChatId(null)
  }

  const handleCreateChat = (phone) => {
    const chatId = `${phone}@c.us`
    setChats((prev) =>
      prev.some((chat) => chat.chatId === chatId)
        ? prev
        : [...prev, { chatId, name: `+${phone}`, messages: [] }],
    )
    setActiveChatId(chatId)
  }

  const handleSend = async (text) => {
    const { idMessage } = await sendMessage(credentials, activeChatId, text)
    const message = {
      id: idMessage,
      text,
      outgoing: true,
      timestamp: Math.floor(Date.now() / 1000),
    }
    setChats((prev) =>
      prev.map((chat) =>
        chat.chatId === activeChatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat,
      ),
    )
  }

  if (!credentials) {
    return <LoginForm onLogin={handleLogin} />
  }

  const activeChat = chats.find((chat) => chat.chatId === activeChatId) ?? null

  return (
    <div className="app-layout">
      <ChatList
        chats={chats}
        activeChatId={activeChatId}
        onSelect={setActiveChatId}
        onCreate={handleCreateChat}
        onLogout={handleLogout}
      />
      <ChatWindow chat={activeChat} onSend={handleSend} />
    </div>
  )
}
