# 🚀 Coworking Space Booking Platform  

<div align="center">
  <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis">
  <img src="https://img.shields.io/badge/gRPC-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="gRPC">
  <img src="https://img.shields.io/badge/Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white" alt="Kafka">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue.js">
  <img src="https://img.shields.io/badge/Nuxt.js-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white" alt="Nuxt.js">
</div>  

Микросервисная платформа для поиска и бронирования мест в коворкинг-пространствах.  

## 📦 Технологический стек  
- **Backend:**  
  - **NestJS** – фреймворк для построения серверной части  
  - **gRPC** – межсервисное взаимодействие  
  - **Kafka** – обработка событий и асинхронные задачи  
  - **Redis** – кэширование и управление сессиями  
  - **PostgreSQL** – основная база данных  
  - **Prisma** – ORM  

- **Frontend:**  
  - **Vue.js + Nuxt.js** – клиентская часть  

## 🛠 Установка и запуск  

### 🔧 Предварительные требования  
- Node.js (v18+)  
- Docker (для Redis, Kafka, PostgreSQL)  
- Установленные глобальные пакеты:  

```bash
npm run install:global-pckg
```

### 🚀 Запуск проекта  

1. **Установка зависимостей**  
```bash
npm install
```

2. **Сборка проекта**  
```bash
npm run build
```

3. **Настройка базы данных (Prisma)**  
```bash
npx prisma generate
npm run prisma:push
```

4. **Настройка окружения**  
```bash
cp .env-example .env
```
Отредактируйте `.env` под свои настройки.  

5. **Запуск в режиме разработки**  
```bash
npm run start:dev
```

### 🏗 Production-сборка  
```bash
npm run build
npm run start:prod
```

## 📂 Структура проекта  
```  
├── apps/  
│   ├── api/          # Основной API-сервис  
│   ├── auth/         # Сервис аутентификации  
│   └── grpc/         # gRPC-шлюз  
├── libs/             # Общие модули  
├── prisma/          # Схема БД и миграции  
└── client/          # Vue/Nuxt фронтенд  
```  

## 🧪 Тестирование  
```bash
npm run test          # Unit-тесты  
npm run test:e2e      # E2E-тесты  
npm run test:cov      # Покрытие кода  
```  

## 🤝 Участие в разработке  
1. Форкните репозиторий  
2. Создайте ветку (`git checkout -b feature/your-feature`)  
3. Зафиксируйте изменения (`git commit -am 'Add some feature'`)  
4. Запушьте (`git push origin feature/your-feature`)  
5. Откройте Pull Request  

## 📄 Лицензия  
MIT  

---  
💻 **Happy coding!** 🚀
