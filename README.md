# MAX Chat — тестовое задание (React + GREEN-API)

Пользовательский интерфейс для отправки и получения текстовых сообщений в мессенджере MAX через сервис [GREEN-API](https://green-api.com/max).

Прототип интерфейса — [web.max.ru](https://web.max.ru/).

## Функциональность

- Вход по учётным данным инстанса GREEN-API (`idInstance`, `apiTokenInstance`)
- Создание чата по номеру телефона получателя
- Отправка текстовых сообщений методом [SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/)
- Получение входящих сообщений по технологии HTTP API ([ReceiveNotification](https://green-api.com/v3/docs/api/receiving/technology-http-api/ReceiveNotification/) + DeleteNotification)

## Стек

- React 18
- Vite
- Чистый CSS, без UI-библиотек

## Локальный запуск

Требуется Node.js 18+.

```bash
npm install
npm run dev
```

Приложение откроется на http://localhost:5173

Сборка для продакшена:

```bash
npm run build
npm run preview
```

## Настройка инстанса GREEN-API

1. Зарегистрируйтесь в [личном кабинете GREEN-API](https://console.green-api.com) и создайте инстанс для MAX.
2. Авторизуйте инстанс (сканируйте QR-код из приложения MAX).
3. В настройках инстанса включите получение уведомлений о входящих сообщениях и файлах (`incomingWebhook`), а поле `webhookUrl` оставьте пустым — иначе ReceiveNotification не будет работать.
4. Скопируйте `idInstance` и `apiTokenInstance` и введите их на экране входа.

## Как пользоваться

1. Введите `idInstance` и `apiTokenInstance` на экране входа.
2. В панели слева введите номер телефона получателя (например, `79991234567`) и нажмите «Создать».
3. Напишите сообщение и отправьте — оно придёт получателю в MAX.
4. Ответ получателя появится в чате автоматически (опрос уведомлений каждые несколько секунд).

## Структура проекта

```
src/
├── api/greenApi.js        # методы GREEN-API: sendMessage, receiveNotification, deleteNotification
├── components/
│   ├── LoginForm.jsx      # экран входа по учётным данным инстанса
│   ├── ChatList.jsx       # список чатов и создание чата по номеру
│   ├── ChatWindow.jsx     # окно переписки и отправка сообщений
│   └── Avatar.jsx         # аватар с инициалом
├── App.jsx                # состояние приложения и поллинг уведомлений
├── main.jsx
└── styles.css
```
