# Локомотив × SWM — React-версия

Самостоятельная React-копия исходного лендинга из соседней папки `landing/`.
Стили и медиа используются из исходника, поэтому редактировать их для поддержки
двух версий не требуется.

```bash
cd landing-react
npm install
npm run dev
```

Для production-сборки:

```bash
npm run build
```

Перед публикацией укажите реальные ссылки Telegram и MAX в константе
`CHANNEL_LINKS` файла `src/App.jsx`.
