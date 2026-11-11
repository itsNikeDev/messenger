import { useState } from 'react'

export default function LoginForm({ onLogin }) {
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!idInstance.trim() || !apiTokenInstance.trim()) return
    onLogin({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() })
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Вход в чат MAX</h1>
        <p className="login-hint">
          Введите учётные данные инстанса из личного кабинета GREEN-API
        </p>
        <label className="field">
          <span>idInstance</span>
          <input
            type="text"
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            placeholder="1101000001"
            required
          />
        </label>
        <label className="field">
          <span>apiTokenInstance</span>
          <input
            type="text"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            placeholder="d75b3a66..."
            required
          />
        </label>
        <button type="submit" className="btn-primary">Войти</button>
      </form>
    </div>
  )
}
