const API_URL = 'https://api.green-api.com'

function instanceUrl({ idInstance, apiTokenInstance }, method) {
  return `${API_URL}/waInstance${idInstance}/${method}/${apiTokenInstance}`
}

export async function sendMessage(credentials, chatId, message) {
  const response = await fetch(instanceUrl(credentials, 'sendMessage'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message }),
  })
  if (!response.ok) {
    throw new Error(`sendMessage: HTTP ${response.status}`)
  }
  return response.json()
}

export async function receiveNotification(credentials) {
  const response = await fetch(
    `${instanceUrl(credentials, 'receiveNotification')}?receiveTimeout=5`,
  )
  if (!response.ok) {
    throw new Error(`receiveNotification: HTTP ${response.status}`)
  }
  return response.json()
}

export async function deleteNotification(credentials, receiptId) {
  const response = await fetch(
    `${instanceUrl(credentials, 'deleteNotification')}/${receiptId}`,
    { method: 'DELETE' },
  )
  if (!response.ok) {
    throw new Error(`deleteNotification: HTTP ${response.status}`)
  }
  return response.json()
}
