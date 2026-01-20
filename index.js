const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════
// КОНФИГУРАЦИЯ
// ═══════════════════════════════════════════════════════════
const BOT_TOKEN = process.env.BOT_TOKEN || '8495248952:AAE1XVNscAT7r9HfYHDebTq-4cK-lqKKBMc';
const PORT = process.env.PORT || 9999;
const DOMAIN = process.env.DOMAIN || 'https://neurocodeai.bothost.ru';
const WEBHOOK_PATH = `/webhook/${BOT_TOKEN}`;
const BOT_USERNAME = 'NeuroCodeAI_bot';

// ═══════════════════════════════════════════════════════════
// API КЛЮЧИ
// ═══════════════════════════════════════════════════════════
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN || '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';

// ═══════════════════════════════════════════════════════════
// 🔥🔥🔥 МОЩНЕЙШИЙ СИСТЕМНЫЙ ПРОМПТ 🔥🔥🔥
// ═══════════════════════════════════════════════════════════
const MEGA_SYSTEM_PROMPT = `Ты - NeuroCode AI, элитный ИИ-ассистент мирового класса. Ты объединяешь возможности лучших программистов, архитекторов ПО, DevOps инженеров и технических экспертов планеты.

═══════════════════════════════════════════════════════════════════════════════
🧠 ТВОЯ ЛИЧНОСТЬ И СВЕРХСПОСОБНОСТИ
═══════════════════════════════════════════════════════════════════════════════

Ты обладаешь:
• Глубочайшими знаниями 150+ языков программирования
• Экспертизой в создании production-ready приложений любой сложности
• Мастерством в архитектурных паттернах: микросервисы, монолиты, serverless, event-driven
• Знанием всех современных фреймворков и библиотек
• Способностью писать чистый, оптимизированный, безопасный, масштабируемый код
• Умением объяснять сложнейшие концепции простым языком с примерами

Твоя цель - быть МАКСИМАЛЬНО ПОЛЕЗНЫМ. Ты даёшь ПОЛНЫЕ, РАБОЧИЕ решения, а не заглушки.

═══════════════════════════════════════════════════════════════════════════════
🤖 TELEGRAM БОТЫ - ТВОЯ ГЛАВНАЯ СПЕЦИАЛИЗАЦИЯ
═══════════════════════════════════════════════════════════════════════════════

При создании Telegram ботов ты ВСЕГДА:

1. ВЫБОР ТЕХНОЛОГИИ:
   Python (приоритет):
   - aiogram 3.x (рекомендуется) - современный, async, мощный
   - python-telegram-bot 20.x - стабильный, популярный
   - telebot/pyTelegramBotAPI - простой для начинающих
   
   Node.js:
   - Telegraf 4.x - самый популярный
   - grammY - современный, типизированный
   - node-telegram-bot-api - базовый

2. ОБЯЗАТЕЛЬНЫЕ КОМПОНЕНТЫ БОТА:
   ✅ Структура проекта:
   \`\`\`
   bot/
   ├── main.py / index.js      # Точка входа
   ├── config.py               # Конфигурация
   ├── handlers/
   │   ├── __init__.py
   │   ├── start.py            # /start, /help
   │   ├── messages.py         # Обработка сообщений
   │   └── callbacks.py        # Callback кнопки
   ├── keyboards/
   │   ├── inline.py           # Inline клавиатуры
   │   └── reply.py            # Reply клавиатуры
   ├── middlewares/
   │   └── logging.py          # Логирование
   ├── database/
   │   └── db.py               # База данных
   ├── utils/
   │   └── helpers.py          # Вспомогательные функции
   ├── .env                    # Переменные окружения
   └── requirements.txt        # Зависимости
   \`\`\`

   ✅ Обработка ВСЕХ типов контента:
   - Текстовые сообщения
   - Фото, видео, аудио, голосовые
   - Документы и файлы
   - Стикеры и GIF
   - Локации и контакты
   - Пересланные сообщения

   ✅ Интерактивность:
   - Inline клавиатуры с callback_data
   - Reply клавиатуры
   - Inline режим (@bot запрос)
   - Web App кнопки если нужно

   ✅ FSM (Finite State Machine) для диалогов:
   - Четкие состояния
   - Хранение данных между шагами
   - Отмена и возврат назад
   - Таймауты

   ✅ Надежность:
   - Обработка ВСЕХ исключений
   - Retry логика для API
   - Graceful shutdown
   - Логирование в файл и консоль
   - Rate limiting
   - Антифлуд

   ✅ База данных:
   - SQLite для простых ботов
   - PostgreSQL для production
   - Redis для кэширования и очередей

   ✅ Деплой:
   - Docker + docker-compose
   - Systemd сервис
   - Webhook для production
   - Long polling для разработки

3. ПРИМЕР СТРУКТУРЫ AIOGRAM 3.X:
\`\`\`python
# main.py
import asyncio
import logging
from aiogram import Bot, Dispatcher, F
from aiogram.enums import ParseMode
from aiogram.client.default import DefaultBotProperties
from aiogram.fsm.storage.memory import MemoryStorage

from config import BOT_TOKEN
from handlers import start, messages, callbacks
from middlewares.logging import LoggingMiddleware

# Логирование
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('bot.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

async def main():
    # Инициализация
    bot = Bot(
        token=BOT_TOKEN,
        default=DefaultBotProperties(parse_mode=ParseMode.HTML)
    )
    dp = Dispatcher(storage=MemoryStorage())
    
    # Middleware
    dp.message.middleware(LoggingMiddleware())
    
    # Регистрация роутеров
    dp.include_routers(
        start.router,
        messages.router,
        callbacks.router
    )
    
    # Запуск
    logger.info("🚀 Бот запущен!")
    try:
        await bot.delete_webhook(drop_pending_updates=True)
        await dp.start_polling(bot)
    finally:
        await bot.session.close()
        logger.info("👋 Бот остановлен")

if __name__ == "__main__":
    asyncio.run(main())
\`\`\`

═══════════════════════════════════════════════════════════════════════════════
🌐 ВЕБ-САЙТЫ И ВЕБ-ПРИЛОЖЕНИЯ
═══════════════════════════════════════════════════════════════════════════════

Frontend (в порядке приоритета):
1. React 18+ с TypeScript
   - Next.js 14 для SSR/SSG
   - Vite для SPA
   - TailwindCSS для стилей
   - Zustand/Redux Toolkit для состояния
   - React Query для API

2. Vue 3 с TypeScript
   - Nuxt 3 для SSR
   - Vite
   - Pinia для состояния
   - VueUse для утилит

3. Vanilla HTML/CSS/JS
   - Семантическая разметка HTML5
   - CSS3: Flexbox, Grid, анимации, переменные
   - JavaScript ES2022+
   - Responsive design (mobile-first)

4. Svelte / SvelteKit
   - Компилируемый фреймворк
   - Минимальный бандл

Backend:
1. Node.js
   - Express.js - классика
   - Fastify - быстрый
   - NestJS - энтерпрайз
   - Hono - edge computing

2. Python
   - FastAPI - современный, типизированный
   - Django - полнофункциональный
   - Flask - микрофреймворк

3. Go
   - Gin, Echo, Fiber

═══════════════════════════════════════════════════════════════════════════════
⚡ REST API И BACKEND
═══════════════════════════════════════════════════════════════════════════════

ОБЯЗАТЕЛЬНЫЕ КОМПОНЕНТЫ API:
✅ Структура:
- MVC или Clean Architecture
- Слои: Controllers, Services, Repositories
- DTO для валидации
- Dependency Injection

✅ Аутентификация:
- JWT Access + Refresh tokens
- OAuth 2.0 (Google, GitHub, etc.)
- API Keys для сервисов
- Rate limiting

✅ Документация:
- OpenAPI / Swagger
- Примеры запросов
- Postman коллекции

✅ Безопасность:
- CORS настройка
- Helmet (security headers)
- Input validation
- SQL injection protection
- XSS prevention
- HTTPS only

✅ База данных:
- PostgreSQL (production)
- MySQL
- MongoDB (NoSQL)
- Redis (кэш, сессии)
- Prisma / TypeORM / Sequelize (ORM)

✅ DevOps:
- Docker + docker-compose
- CI/CD (GitHub Actions)
- Nginx reverse proxy
- PM2 / Supervisor
- Логирование (Winston, Pino)
- Мониторинг (Prometheus, Grafana)

═══════════════════════════════════════════════════════════════════════════════
📱 МОБИЛЬНЫЕ ПРИЛОЖЕНИЯ
═══════════════════════════════════════════════════════════════════════════════

1. React Native + Expo
   - Кроссплатформенная разработка
   - EAS Build для сборки
   - React Navigation
   - Expo Modules

2. Flutter
   - Dart язык
   - Material Design 3
   - Riverpod/Bloc для состояния
   - Dio для HTTP

3. PWA (Progressive Web App)
   - Service Workers
   - Web Push уведомления
   - Offline поддержка
   - Add to Home Screen

═══════════════════════════════════════════════════════════════════════════════
⚙️ ЖЕЛЕЗНЫЕ ПРАВИЛА ГЕНЕРАЦИИ КОДА
═══════════════════════════════════════════════════════════════════════════════

1. 📝 ПОЛНОТА:
   - ВСЕГДА даю ПОЛНЫЙ, ГОТОВЫЙ К ЗАПУСКУ код
   - НИКОГДА не пишу "// остальной код здесь", "...", "и т.д."
   - Включаю ВСЕ импорты, зависимости, конфигурации
   - Даю package.json / requirements.txt

2. 🎯 КАЧЕСТВО:
   - Чистый, читаемый код (Clean Code)
   - Понятные имена переменных и функций
   - Комментарии на РУССКОМ языке для ключевых мест
   - Обработка ВСЕХ возможных ошибок
   - TypeScript / Type hints где возможно

3. 🚀 ПРАКТИЧНОСТЬ:
   - Код работает сразу после копирования
   - Пошаговая инструкция по запуску
   - Команды установки зависимостей
   - Примеры использования
   - .env.example файлы

4. 🔒 БЕЗОПАСНОСТЬ:
   - Экранирование пользовательского ввода
   - Параметризованные SQL запросы
   - Валидация всех входных данных
   - Безопасное хранение секретов
   - HTTPS, CORS, Security Headers

5. 🎨 ОФОРМЛЕНИЕ ОТВЕТА:
   - Код в блоках \`\`\`язык ... \`\`\`
   - Структурированные объяснения
   - Эмодзи для визуального разделения
   - Пошаговые нумерованные инструкции
   - Заголовки и подзаголовки

═══════════════════════════════════════════════════════════════════════════════
💬 СТИЛЬ ОБЩЕНИЯ
═══════════════════════════════════════════════════════════════════════════════

- Всегда отвечаю на РУССКОМ языке
- Дружелюбный, но профессиональный тон
- Использую эмодзи уместно, не злоупотребляя
- Структурирую ответы для легкого восприятия
- Если вопрос неясен - задаю уточняющие вопросы
- Предлагаю улучшения и альтернативные решения
- Объясняю ПОЧЕМУ выбрал определенное решение

═══════════════════════════════════════════════════════════════════════════════
🎯 Я МОГУ ВСЁ
═══════════════════════════════════════════════════════════════════════════════

• Telegram боты любой сложности (магазины, CRM, игры, AI-помощники)
• Веб-сайты (лендинги, портфолио, SPA, e-commerce, SaaS)
• REST/GraphQL API
• Мобильные приложения (React Native, Flutter, PWA)
• Парсеры, скраперы, автоматизация
• AI/ML интеграции (OpenAI, Claude, Gemini, HuggingFace)
• DevOps (Docker, CI/CD, Kubernetes)
• Базы данных (проектирование, оптимизация)
• Микросервисы и распределенные системы
• Real-time приложения (WebSocket, Socket.io)
• Платежные системы (Stripe, ЮKassa, криптовалюты)
• И АБСОЛЮТНО ЛЮБЫЕ технические задачи!

Я готов помочь с любой задачей программирования! 🚀`;

// ═══════════════════════════════════════════════════════════
// 🔵 МОДЕЛИ OPENROUTER (бесплатные)
// ═══════════════════════════════════════════════════════════
const OPENROUTER_MODELS = [
    {
        id: 'qwen/qwen-2.5-coder-32b-instruct:free',
        name: 'Qwen 2.5 Coder 32B',
        description: '🏆 Лучшая для кода',
        forCode: true,
        priority: 1
    },
    {
        id: 'deepseek/deepseek-r1-distill-qwen-32b:free',
        name: 'DeepSeek R1 32B',
        description: '🧠 Мощный reasoning',
        forCode: true,
        priority: 2
    },
    {
        id: 'deepseek/deepseek-chat:free',
        name: 'DeepSeek V3 Chat',
        description: '💬 DeepSeek V3',
        forCode: true,
        priority: 3
    },
    {
        id: 'deepseek/deepseek-r1:free',
        name: 'DeepSeek R1',
        description: '🧠 DeepSeek R1 Full',
        forCode: true,
        priority: 4
    },
    {
        id: 'meta-llama/llama-3.3-70b-instruct:free',
        name: 'LLaMA 3.3 70B',
        description: '🦙 Мощнейшая LLaMA',
        forCode: true,
        priority: 5
    },
    {
        id: 'google/gemini-2.0-flash-exp:free',
        name: 'Gemini 2.0 Flash',
        description: '✨ Google Gemini 2.0',
        forCode: true,
        priority: 6
    },
    {
        id: 'google/gemini-2.0-flash-thinking-exp:free',
        name: 'Gemini 2.0 Thinking',
        description: '🤔 Gemini с reasoning',
        forCode: true,
        priority: 7
    },
    {
        id: 'google/gemini-exp-1206:free',
        name: 'Gemini Exp 1206',
        description: '🔬 Экспериментальный',
        forCode: true,
        priority: 8
    },
    {
        id: 'nvidia/llama-3.1-nemotron-70b-instruct:free',
        name: 'Nemotron 70B',
        description: '💚 NVIDIA Nemotron',
        forCode: true,
        priority: 9
    },
    {
        id: 'meta-llama/llama-3.1-405b-instruct:free',
        name: 'LLaMA 3.1 405B',
        description: '🦙 Гигантская LLaMA',
        forCode: true,
        priority: 10
    },
    {
        id: 'meta-llama/llama-3.1-70b-instruct:free',
        name: 'LLaMA 3.1 70B',
        description: '🦙 LLaMA 3.1',
        forCode: true,
        priority: 11
    },
    {
        id: 'meta-llama/llama-3.1-8b-instruct:free',
        name: 'LLaMA 3.1 8B',
        description: '⚡ Быстрая LLaMA',
        forCode: true,
        priority: 12
    },
    {
        id: 'google/gemma-2-27b-it:free',
        name: 'Gemma 2 27B',
        description: '🔷 Google Gemma 27B',
        forCode: true,
        priority: 13
    },
    {
        id: 'google/gemma-2-9b-it:free',
        name: 'Gemma 2 9B',
        description: '🔷 Google Gemma 9B',
        forCode: true,
        priority: 14
    },
    {
        id: 'qwen/qwen-2-7b-instruct:free',
        name: 'Qwen 2 7B',
        description: '🇨🇳 Alibaba Qwen',
        forCode: true,
        priority: 15
    },
    {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B',
        description: '🌀 Mistral AI',
        forCode: true,
        priority: 16
    },
    {
        id: 'microsoft/phi-3-medium-128k-instruct:free',
        name: 'Phi-3 Medium 128K',
        description: '🔬 Microsoft Phi-3',
        forCode: true,
        priority: 17
    },
    {
        id: 'microsoft/phi-3-mini-128k-instruct:free',
        name: 'Phi-3 Mini 128K',
        description: '🔬 Microsoft Phi-3 Mini',
        forCode: true,
        priority: 18
    },
    {
        id: 'openchat/openchat-7b:free',
        name: 'OpenChat 7B',
        description: '💬 OpenChat',
        forCode: false,
        priority: 19
    },
    {
        id: 'huggingfaceh4/zephyr-7b-beta:free',
        name: 'Zephyr 7B',
        description: '🌬️ HuggingFace Zephyr',
        forCode: false,
        priority: 20
    }
];

// ═══════════════════════════════════════════════════════════
// 🟡 МОДЕЛИ HUGGINGFACE (Inference API)
// ═══════════════════════════════════════════════════════════
const HUGGINGFACE_MODELS = [
    // === КОДИНГ МОДЕЛИ (ПРИОРИТЕТ) ===
    {
        id: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        name: 'Qwen 2.5 Coder 32B',
        description: '🏆 Лучшая для кода',
        forCode: true,
        priority: 1
    },
    {
        id: 'Qwen/Qwen2.5-72B-Instruct',
        name: 'Qwen 2.5 72B',
        description: '🧠 Мощнейшая Qwen',
        forCode: true,
        priority: 2
    },
    {
        id: 'deepseek-ai/DeepSeek-Coder-V2-Instruct',
        name: 'DeepSeek Coder V2',
        description: '🧠 DeepSeek Coder',
        forCode: true,
        priority: 3
    },
    {
        id: 'deepseek-ai/DeepSeek-V3',
        name: 'DeepSeek V3',
        description: '🔥 DeepSeek V3',
        forCode: true,
        priority: 4
    },
    {
        id: 'codellama/CodeLlama-70b-Instruct-hf',
        name: 'CodeLlama 70B',
        description: '🦙 Meta CodeLlama 70B',
        forCode: true,
        priority: 5
    },
    {
        id: 'codellama/CodeLlama-34b-Instruct-hf',
        name: 'CodeLlama 34B',
        description: '🦙 Meta CodeLlama 34B',
        forCode: true,
        priority: 6
    },
    {
        id: 'bigcode/starcoder2-15b-instruct-v0.1',
        name: 'StarCoder2 15B',
        description: '⭐ BigCode StarCoder2',
        forCode: true,
        priority: 7
    },
    {
        id: 'bigcode/starcoder2-7b',
        name: 'StarCoder2 7B',
        description: '⭐ StarCoder2 Fast',
        forCode: true,
        priority: 8
    },
    {
        id: 'WizardLM/WizardCoder-33B-V1.1',
        name: 'WizardCoder 33B',
        description: '🧙 WizardCoder',
        forCode: true,
        priority: 9
    },
    {
        id: 'Phind/Phind-CodeLlama-34B-v2',
        name: 'Phind CodeLlama 34B',
        description: '🔍 Phind для кода',
        forCode: true,
        priority: 10
    },
    // === МОЩНЫЕ ОБЩИЕ МОДЕЛИ ===
    {
        id: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
        name: 'LLaMA 3.1 70B',
        description: '🦙 Meta LLaMA 3.1',
        forCode: true,
        priority: 11
    },
    {
        id: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
        name: 'LLaMA 3.1 8B',
        description: '🦙 LLaMA 3.1 Fast',
        forCode: true,
        priority: 12
    },
    {
        id: 'mistralai/Mixtral-8x22B-Instruct-v0.1',
        name: 'Mixtral 8x22B',
        description: '🌀 Mistral MoE 8x22B',
        forCode: true,
        priority: 13
    },
    {
        id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        name: 'Mixtral 8x7B',
        description: '🌀 Mistral MoE 8x7B',
        forCode: true,
        priority: 14
    },
    {
        id: 'mistralai/Mistral-7B-Instruct-v0.3',
        name: 'Mistral 7B v0.3',
        description: '🌀 Mistral 7B',
        forCode: true,
        priority: 15
    },
    {
        id: 'microsoft/Phi-3.5-mini-instruct',
        name: 'Phi-3.5 Mini',
        description: '🔬 Microsoft Phi-3.5',
        forCode: true,
        priority: 16
    },
    {
        id: 'microsoft/Phi-3-medium-4k-instruct',
        name: 'Phi-3 Medium',
        description: '🔬 Microsoft Phi-3',
        forCode: true,
        priority: 17
    },
    {
        id: 'google/gemma-2-27b-it',
        name: 'Gemma 2 27B',
        description: '🔷 Google Gemma 2',
        forCode: true,
        priority: 18
    },
    {
        id: 'google/gemma-2-9b-it',
        name: 'Gemma 2 9B',
        description: '🔷 Google Gemma 2',
        forCode: true,
        priority: 19
    },
    // === INSTRUCT МОДЕЛИ ===
    {
        id: 'NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO',
        name: 'Nous Hermes 2 Mixtral',
        description: '🔮 Nous Research MoE',
        forCode: true,
        priority: 20
    },
    {
        id: 'teknium/OpenHermes-2.5-Mistral-7B',
        name: 'OpenHermes 2.5',
        description: '🔮 OpenHermes Mistral',
        forCode: true,
        priority: 21
    },
    {
        id: 'HuggingFaceH4/starchat2-15b-v0.1',
        name: 'StarChat2 15B',
        description: '💬 HF StarChat2',
        forCode: true,
        priority: 22
    },
    {
        id: 'tiiuae/falcon-180B-chat',
        name: 'Falcon 180B',
        description: '🦅 TII Falcon 180B',
        forCode: true,
        priority: 23
    },
    {
        id: 'tiiuae/falcon-40b-instruct',
        name: 'Falcon 40B',
        description: '🦅 TII Falcon 40B',
        forCode: true,
        priority: 24
    },
    {
        id: 'HuggingFaceH4/zephyr-7b-beta',
        name: 'Zephyr 7B',
        description: '🌬️ HuggingFace Zephyr',
        forCode: true,
        priority: 25
    },
    {
        id: 'upstage/SOLAR-10.7B-Instruct-v1.0',
        name: 'SOLAR 10.7B',
        description: '☀️ Upstage SOLAR',
        forCode: true,
        priority: 26
    }
];

// Объединенный список всех моделей
const ALL_MODELS = [
    ...OPENROUTER_MODELS.map(m => ({ ...m, provider: 'openrouter' })),
    ...HUGGINGFACE_MODELS.map(m => ({ ...m, provider: 'huggingface' }))
];

const TOTAL_MODELS = OPENROUTER_MODELS.length + HUGGINGFACE_MODELS.length;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ═══════════════════════════════════════════════════════════
// БАЗА ДАННЫХ
// ═══════════════════════════════════════════════════════════
const DB_FILE = path.join(__dirname, 'database.json');
let db = { users: [], stats: { totalRequests: 0, successfulRequests: 0, failedRequests: 0 } };
const authCodes = new Map();
const chatHistories = new Map();
const modelStats = new Map();

function loadDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
            console.log(`📂 Database: ${db.users.length} users`);
        }
    } catch (e) { console.log('⚠️ DB error:', e.message); }
}

function saveDB() {
    try { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); } 
    catch (e) {}
}

setInterval(saveDB, 30000);
loadDB();

// ═══════════════════════════════════════════════════════════
// 🔵 AI СИСТЕМА - OPENROUTER
// ═══════════════════════════════════════════════════════════

async function callOpenRouter(messages, modelId) {
    try {
        console.log(`🔵 OpenRouter: ${modelId}`);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': DOMAIN,
                'X-Title': 'NeuroCode AI'
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    { role: 'system', content: MEGA_SYSTEM_PROMPT },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 16384,
                top_p: 0.95
            })
        });
        
        const data = await response.json();
        
        if (data.choices?.[0]?.message?.content) {
            console.log(`✅ OpenRouter OK: ${modelId.split('/').pop()}`);
            updateModelStats(modelId, true);
            return {
                content: data.choices[0].message.content,
                model: modelId,
                provider: 'OpenRouter'
            };
        }
        
        if (data.error) {
            console.log(`❌ OpenRouter error: ${data.error.message || JSON.stringify(data.error)}`);
            updateModelStats(modelId, false);
        }
        
        return null;
        
    } catch (e) {
        console.log(`❌ OpenRouter exception: ${e.message}`);
        updateModelStats(modelId, false);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════
// 🟡 AI СИСТЕМА - HUGGINGFACE
// ═══════════════════════════════════════════════════════════

async function callHuggingFace(messages, modelId) {
    try {
        console.log(`🟡 HuggingFace: ${modelId}`);
        
        // Формируем промпт
        let prompt = `<|system|>\n${MEGA_SYSTEM_PROMPT}\n<|end|>\n`;
        for (const msg of messages) {
            if (msg.role === 'user') {
                prompt += `<|user|>\n${msg.content}\n<|end|>\n`;
            } else if (msg.role === 'assistant') {
                prompt += `<|assistant|>\n${msg.content}\n<|end|>\n`;
            }
        }
        prompt += `<|assistant|>\n`;
        
        const response = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 8192,
                    temperature: 0.7,
                    top_p: 0.95,
                    do_sample: true,
                    return_full_text: false
                },
                options: {
                    wait_for_model: true,
                    use_cache: false
                }
            })
        });
        
        const data = await response.json();
        
        let content = null;
        if (Array.isArray(data) && data[0]?.generated_text) {
            content = data[0].generated_text;
        } else if (data.generated_text) {
            content = data.generated_text;
        } else if (data[0] && typeof data[0] === 'string') {
            content = data[0];
        }
        
        if (content) {
            content = content.replace(/<\|.*?\|>/g, '').trim();
            if (content.length > 50) {
                console.log(`✅ HuggingFace OK: ${modelId.split('/').pop()}`);
                updateModelStats(modelId, true);
                return {
                    content: content,
                    model: modelId,
                    provider: 'HuggingFace'
                };
            }
        }
        
        if (data.error) {
            console.log(`❌ HuggingFace error: ${data.error}`);
            if (data.error.includes('loading')) {
                return { loading: true };
            }
            updateModelStats(modelId, false);
        }
        
        return null;
        
    } catch (e) {
        console.log(`❌ HuggingFace exception: ${e.message}`);
        updateModelStats(modelId, false);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════
// 🧠 УМНАЯ СИСТЕМА ВЫБОРА МОДЕЛИ С FALLBACK
// ═══════════════════════════════════════════════════════════

function updateModelStats(modelId, success) {
    if (!modelStats.has(modelId)) {
        modelStats.set(modelId, { success: 0, fail: 0, lastSuccess: 0 });
    }
    const stats = modelStats.get(modelId);
    if (success) {
        stats.success++;
        stats.lastSuccess = Date.now();
    } else {
        stats.fail++;
    }
}

function getModelScore(modelId) {
    const stats = modelStats.get(modelId);
    if (!stats || stats.success + stats.fail < 2) return 0.5;
    
    const successRate = stats.success / (stats.success + stats.fail);
    const recency = Math.min(1, (Date.now() - stats.lastSuccess) / (1000 * 60 * 30));
    
    return successRate * 0.7 + (1 - recency) * 0.3;
}

async function getAIResponse(messages, preferCode = true) {
    db.stats.totalRequests++;
    
    // Сортируем модели по успешности
    const sortedOR = [...OPENROUTER_MODELS]
        .filter(m => preferCode ? m.forCode : true)
        .sort((a, b) => {
            const scoreA = getModelScore(a.id);
            const scoreB = getModelScore(b.id);
            if (Math.abs(scoreA - scoreB) > 0.15) return scoreB - scoreA;
            return a.priority - b.priority;
        });
    
    const sortedHF = [...HUGGINGFACE_MODELS]
        .filter(m => preferCode ? m.forCode : true)
        .sort((a, b) => {
            const scoreA = getModelScore(a.id);
            const scoreB = getModelScore(b.id);
            if (Math.abs(scoreA - scoreB) > 0.15) return scoreB - scoreA;
            return a.priority - b.priority;
        });
    
    // Чередуем провайдеров: OR, OR, HF, OR, HF, ...
    const modelsToTry = [];
    for (let i = 0; i < Math.max(sortedOR.length, sortedHF.length); i++) {
        if (i < sortedOR.length) {
            modelsToTry.push({ ...sortedOR[i], provider: 'openrouter' });
        }
        if (i < sortedHF.length && i % 2 === 0) {
            modelsToTry.push({ ...sortedHF[Math.floor(i/2)], provider: 'huggingface' });
        }
    }
    
    // Добавляем оставшиеся HF модели
    for (let i = 0; i < sortedHF.length; i++) {
        if (!modelsToTry.find(m => m.id === sortedHF[i].id)) {
            modelsToTry.push({ ...sortedHF[i], provider: 'huggingface' });
        }
    }
    
    // Пробуем модели
    for (const model of modelsToTry.slice(0, 20)) {
        let result;
        
        if (model.provider === 'openrouter') {
            result = await callOpenRouter(messages, model.id);
        } else {
            result = await callHuggingFace(messages, model.id);
            if (result?.loading) {
                console.log(`⏳ Model loading, waiting...`);
                await new Promise(r => setTimeout(r, 15000));
                result = await callHuggingFace(messages, model.id);
            }
        }
        
        if (result && result.content && result.content.length > 50) {
            db.stats.successfulRequests++;
            return result;
        }
        
        await new Promise(r => setTimeout(r, 200));
    }
    
    db.stats.failedRequests++;
    
    return {
        content: `⚠️ Все AI модели временно перегружены.

Попробуйте через минуту или переформулируйте запрос.

**Доступно ${TOTAL_MODELS} моделей:**
• OpenRouter: ${OPENROUTER_MODELS.length} моделей
• HuggingFace: ${HUGGINGFACE_MODELS.length} моделей

**Топ модели для кода:**
${OPENROUTER_MODELS.slice(0, 3).map(m => `• ${m.name}`).join('\n')}`,
        model: 'fallback',
        provider: 'System'
    };
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function generateAuthCode() {
    return Array(6).fill(0).map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.random() * 36 | 0]).join('');
}

function generateApiKey() {
    return 'nc_' + Array(48).fill(0).map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.random() * 62 | 0]).join('');
}

function formatForTelegram(text) {
    if (!text) return 'Ошибка получения ответа';
    
    if (text.length > 4000) {
        text = text.substring(0, 3900) + '\n\n... (сообщение обрезано)';
    }
    
    return text
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => 
            `<pre><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
        .replace(/\*([^*]+)\*/g, '<i>$1</i>');
}

// ═══════════════════════════════════════════════════════════
// TELEGRAM API
// ═══════════════════════════════════════════════════════════
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tg(method, body) {
    try {
        const r = await fetch(`${TELEGRAM_API}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await r.json();
    } catch (e) {
        console.log('TG error:', e.message);
        return null;
    }
}

const sendMessage = (chatId, text, options = {}) => tg('sendMessage', { chat_id: chatId, text, parse_mode: 'HTML', ...options });
const sendTyping = (chatId) => tg('sendChatAction', { chat_id: chatId, action: 'typing' });
const answerCallback = (id, text = '') => tg('answerCallbackQuery', { callback_query_id: id, text });

// ═══════════════════════════════════════════════════════════
// TELEGRAM WEBHOOK
// ═══════════════════════════════════════════════════════════
app.post(WEBHOOK_PATH, async (req, res) => {
    res.sendStatus(200);
    
    const { message, callback_query } = req.body;
    
    if (callback_query) {
        await handleCallback(callback_query);
        return;
    }
    
    if (!message?.text) return;
    
    const chatId = message.chat.id;
    const text = message.text;
    const from = message.from;
    
    if (text.startsWith('/')) {
        await handleCommand(chatId, text, from);
        return;
    }
    
    await handleAIChat(chatId, text, from);
});

async function handleCommand(chatId, text, from) {
    const cmd = text.split(' ')[0].toLowerCase();
    const args = text.slice(cmd.length).trim();
    
    switch (cmd) {
        case '/start':
            await sendMessage(chatId,
                `🚀 <b>NeuroCode AI</b> - Мультимодельный ИИ\n\n` +
                `Привет, ${from.first_name}! 👋\n\n` +
                `Я - <b>бесплатный AI помощник</b> с ${TOTAL_MODELS} моделями!\n\n` +
                `<b>🧠 Провайдеры:</b>\n` +
                `🔵 OpenRouter: ${OPENROUTER_MODELS.length} моделей\n` +
                `🟡 HuggingFace: ${HUGGINGFACE_MODELS.length} моделей\n\n` +
                `<b>🏆 Топ модели для кода:</b>\n` +
                `• Qwen 2.5 Coder 32B\n` +
                `• DeepSeek R1/V3\n` +
                `• CodeLlama 70B\n` +
                `• StarCoder2 15B\n` +
                `• LLaMA 3.3 70B\n\n` +
                `<b>💻 Мои возможности:</b>\n` +
                `• Telegram боты любой сложности\n` +
                `• Веб-сайты и приложения\n` +
                `• REST/GraphQL API\n` +
                `• Мобильные приложения\n\n` +
                `<b>Просто напиши что нужно!</b> 🎯`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🌐 Платформа', url: DOMAIN }],
                            [
                                { text: '🔐 Код для сайта', callback_data: 'get_code' },
                                { text: '🤖 Модели', callback_data: 'models' }
                            ],
                            [
                                { text: '🗑️ Очистить', callback_data: 'clear' },
                                { text: '📊 Стата', callback_data: 'stats' }
                            ]
                        ]
                    }
                }
            );
            break;
            
        case '/auth':
            const code = generateAuthCode();
            authCodes.set(code, {
                telegramId: from.id,
                username: from.username || `user${from.id}`,
                firstName: from.first_name,
                lastName: from.last_name,
                createdAt: Date.now()
            });
            setTimeout(() => authCodes.delete(code), 600000);
            
            await sendMessage(chatId,
                `🔐 <b>Код для входа</b>\n\n<code>${code}</code>\n\n⏰ Действителен 10 минут`,
                { reply_markup: { inline_keyboard: [[{ text: '🌐 Открыть сайт', url: DOMAIN }]] } }
            );
            break;
            
        case '/models':
            const orList = OPENROUTER_MODELS.slice(0, 5).map(m => `• ${m.name}`).join('\n');
            const hfList = HUGGINGFACE_MODELS.slice(0, 5).map(m => `• ${m.name}`).join('\n');
            
            await sendMessage(chatId,
                `🤖 <b>AI Модели (${TOTAL_MODELS})</b>\n\n` +
                `<b>🔵 OpenRouter (${OPENROUTER_MODELS.length}):</b>\n${orList}\n...\n\n` +
                `<b>🟡 HuggingFace (${HUGGINGFACE_MODELS.length}):</b>\n${hfList}\n...\n\n` +
                `Система автоматически выбирает лучшую модель!`
            );
            break;
            
        case '/clear':
            chatHistories.delete(chatId);
            await sendMessage(chatId, '🗑️ История очищена!');
            break;
            
        case '/stats':
            const rate = db.stats.totalRequests > 0 
                ? ((db.stats.successfulRequests / db.stats.totalRequests) * 100).toFixed(1) : 0;
            await sendMessage(chatId,
                `📊 <b>Статистика</b>\n\n` +
                `👥 Пользователей: ${db.users.length}\n` +
                `🔢 Запросов: ${db.stats.totalRequests}\n` +
                `✅ Успешных: ${db.stats.successfulRequests}\n` +
                `📈 Успешность: ${rate}%\n` +
                `🤖 Моделей: ${TOTAL_MODELS}\n` +
                `⏱️ Аптайм: ${Math.floor(process.uptime() / 3600)}ч`
            );
            break;
            
        case '/bot':
            if (!args) {
                await sendMessage(chatId,
                    `🤖 <b>Генератор Telegram ботов</b>\n\n` +
                    `Использование: <code>/bot описание</code>\n\n` +
                    `Примеры:\n` +
                    `• <code>/bot магазин с корзиной</code>\n` +
                    `• <code>/bot бот погоды</code>\n` +
                    `• <code>/bot AI чат-бот</code>`
                );
                return;
            }
            await sendTyping(chatId);
            const botResult = await getAIResponse([{ 
                role: 'user', 
                content: `Создай полноценный Telegram бот: ${args}. Используй Python с aiogram 3.x. Дай полный рабочий код со всеми обработчиками, клавиатурами и инструкцией по запуску.` 
            }], true);
            await sendMessage(chatId, formatForTelegram(botResult.content) + 
                `\n\n<i>🤖 ${botResult.provider}/${botResult.model?.split('/').pop()}</i>`);
            break;
            
        case '/site':
            if (!args) {
                await sendMessage(chatId,
                    `🌐 <b>Генератор сайтов</b>\n\n` +
                    `Использование: <code>/site описание</code>\n\n` +
                    `Примеры:\n` +
                    `• <code>/site лендинг для стартапа</code>\n` +
                    `• <code>/site портфолио разработчика</code>`
                );
                return;
            }
            await sendTyping(chatId);
            const siteResult = await getAIResponse([{ 
                role: 'user', 
                content: `Создай современный веб-сайт: ${args}. Используй HTML5, CSS3, JavaScript. Сделай адаптивный дизайн. Дай полный код.` 
            }], true);
            await sendMessage(chatId, formatForTelegram(siteResult.content) + 
                `\n\n<i>🤖 ${siteResult.provider}/${siteResult.model?.split('/').pop()}</i>`);
            break;
            
        case '/code':
            if (!args) {
                await sendMessage(chatId,
                    `💻 <b>Генератор кода</b>\n\n` +
                    `Использование: <code>/code задача</code>\n\n` +
                    `Примеры:\n` +
                    `• <code>/code парсер сайтов Python</code>\n` +
                    `• <code>/code REST API Express</code>`
                );
                return;
            }
            await sendTyping(chatId);
            const codeResult = await getAIResponse([{ role: 'user', content: args }], true);
            await sendMessage(chatId, formatForTelegram(codeResult.content) + 
                `\n\n<i>🤖 ${codeResult.provider}/${codeResult.model?.split('/').pop()}</i>`);
            break;
            
        case '/help':
            await sendMessage(chatId,
                `📚 <b>Команды</b>\n\n` +
                `/start - Главное меню\n` +
                `/auth - Код для сайта\n\n` +
                `<b>Генерация:</b>\n` +
                `/bot описание - Telegram бот\n` +
                `/site описание - Веб-сайт\n` +
                `/code задача - Любой код\n\n` +
                `/models - Список моделей\n` +
                `/stats - Статистика\n` +
                `/clear - Очистить историю\n\n` +
                `<b>Или просто пиши!</b> 🚀`
            );
            break;
    }
}

async function handleCallback(callback) {
    const chatId = callback.message.chat.id;
    const data = callback.data;
    const from = callback.from;
    
    switch (data) {
        case 'get_code':
            const code = generateAuthCode();
            authCodes.set(code, {
                telegramId: from.id,
                username: from.username || `user${from.id}`,
                firstName: from.first_name,
                createdAt: Date.now()
            });
            setTimeout(() => authCodes.delete(code), 600000);
            await answerCallback(callback.id, '✅ Код создан!');
            await sendMessage(chatId, `🔐 <code>${code}</code>\n⏰ 10 минут`);
            break;
            
        case 'clear':
            chatHistories.delete(chatId);
            await answerCallback(callback.id, '🗑️ Очищено!');
            break;
            
        case 'models':
            await answerCallback(callback.id);
            await sendMessage(chatId,
                `🤖 <b>${TOTAL_MODELS} моделей</b>\n\n` +
                `🔵 OpenRouter: ${OPENROUTER_MODELS.length}\n` +
                `🟡 HuggingFace: ${HUGGINGFACE_MODELS.length}\n\n` +
                `Используй /models для списка`
            );
            break;
            
        case 'stats':
            await answerCallback(callback.id);
            await sendMessage(chatId,
                `📊 Запросов: ${db.stats.totalRequests}\n✅ Успешных: ${db.stats.successfulRequests}`
            );
            break;
    }
}

async function handleAIChat(chatId, text, from) {
    await sendTyping(chatId);
    
    if (!chatHistories.has(chatId)) {
        chatHistories.set(chatId, []);
    }
    
    const history = chatHistories.get(chatId);
    history.push({ role: 'user', content: text });
    
    if (history.length > 20) {
        history.splice(0, history.length - 20);
    }
    
    const needsCode = /код|напиши|создай|сделай|бот|сайт|api|функци|скрипт|программ|приложени|парс|разработ|исправ|добав|измен/i.test(text);
    
    try {
        const typingInterval = setInterval(() => sendTyping(chatId), 4000);
        
        const result = await getAIResponse(history, needsCode);
        
        clearInterval(typingInterval);
        
        history.push({ role: 'assistant', content: result.content });
        
        const formatted = formatForTelegram(result.content);
        const modelName = result.model?.split('/').pop() || 'AI';
        
        await sendMessage(chatId, 
            formatted + `\n\n<i>🤖 ${result.provider}: ${modelName}</i>`,
            {
                reply_markup: {
                    inline_keyboard: [[
                        { text: '🗑️ Очистить', callback_data: 'clear' },
                        { text: '🤖 Модели', callback_data: 'models' }
                    ]]
                }
            }
        );
        
        const user = db.users.find(u => u.telegramId === from.id);
        if (user) {
            user.requestsToday = (user.requestsToday || 0) + 1;
            user.totalRequests = (user.totalRequests || 0) + 1;
            saveDB();
        }
        
        console.log(`💬 ${from.first_name}: "${text.substring(0, 30)}..." → ${result.provider}/${modelName}`);
        
    } catch (e) {
        console.error('Chat error:', e);
        await sendMessage(chatId, '❌ Ошибка. Попробуй ещё раз.');
    }
}

// ═══════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'NeuroCode AI',
        version: '2.0',
        models: { openrouter: OPENROUTER_MODELS.length, huggingface: HUGGINGFACE_MODELS.length, total: TOTAL_MODELS },
        users: db.users.length,
        stats: db.stats,
        uptime: process.uptime()
    });
});

app.get('/api/models', (req, res) => {
    res.json({
        openrouter: OPENROUTER_MODELS,
        huggingface: HUGGINGFACE_MODELS,
        total: TOTAL_MODELS
    });
});

app.post('/api/auth/verify', (req, res) => {
    const { code } = req.body;
    if (!code || code.length !== 6) return res.status(400).json({ error: 'Неверный код' });
    
    const authData = authCodes.get(code.toUpperCase());
    if (!authData) return res.status(401).json({ error: 'Код не найден или истёк' });
    
    authCodes.delete(code.toUpperCase());
    
    let user = db.users.find(u => u.telegramId === authData.telegramId);
    
    if (!user) {
        user = {
            id: `user_${authData.telegramId}`,
            telegramId: authData.telegramId,
            username: authData.username,
            firstName: authData.firstName,
            lastName: authData.lastName || '',
            photoUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${authData.username}`,
            apiKey: generateApiKey(),
            plan: 'free',
            requestsToday: 0,
            requestsLimit: 1000,
            totalRequests: 0,
            createdAt: new Date().toISOString()
        };
        db.users.push(user);
        saveDB();
    }
    
    res.json(user);
});

app.post('/api/auth/check', (req, res) => {
    const { telegramId } = req.body;
    const user = db.users.find(u => u.telegramId == telegramId);
    res.json({ valid: !!user, user });
});

app.post('/api/v1/chat/completions', async (req, res) => {
    const auth = req.headers.authorization?.replace('Bearer ', '');
    const user = db.users.find(u => u.apiKey === auth);
    
    if (!user && auth !== 'demo') {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    
    const { messages } = req.body;
    if (!messages?.length) {
        return res.status(400).json({ error: 'Messages required' });
    }
    
    try {
        const result = await getAIResponse(messages, true);
        
        if (user) {
            user.requestsToday++;
            user.totalRequests++;
            saveDB();
        }
        
        res.json({
            id: 'chatcmpl-' + Date.now(),
            object: 'chat.completion',
            created: Date.now() / 1000 | 0,
            model: result.model,
            provider: result.provider,
            choices: [{
                index: 0,
                message: { role: 'assistant', content: result.content },
                finish_reason: 'stop'
            }]
        });
        
    } catch (e) {
        res.status(500).json({ error: 'AI service error' });
    }
});

app.post('/api/user/:telegramId/refresh-key', (req, res) => {
    const user = db.users.find(u => u.telegramId == req.params.telegramId);
    if (!user) return res.status(404).json({ error: 'Not found' });
    
    user.apiKey = generateApiKey();
    saveDB();
    res.json({ apiKey: user.apiKey });
});

// ═══════════════════════════════════════════════════════════
// HTML СТРАНИЦА
// ═══════════════════════════════════════════════════════════
const HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NeuroCode AI - ${TOTAL_MODELS} AI моделей бесплатно</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#0a0a0f;--card:#12121a;--border:#1e1e2e;--text:#e8e8e8;--dim:#6b7280;--purple:#8b5cf6;--pink:#ec4899;--green:#10b981;--blue:#3b82f6;--yellow:#f59e0b}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.hidden{display:none!important}
button{cursor:pointer;font-family:inherit;border:none;transition:.2s}
input,textarea{font-family:inherit;background:rgba(255,255,255,0.05);border:1px solid var(--border);padding:14px;color:#fff;border-radius:12px;font-size:14px;width:100%}
input:focus,textarea:focus{outline:none;border-color:var(--purple)}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--card);border:1px solid var(--purple);padding:14px 28px;border-radius:12px;opacity:0;transition:.3s;z-index:9999}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}

.header{position:sticky;top:0;z-index:50;backdrop-filter:blur(20px);background:rgba(10,10,15,0.85);border-bottom:1px solid var(--border)}
.header-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;padding:0 20px}
.logo{display:flex;align-items:center;gap:12px;cursor:pointer}
.logo-icon{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-size:20px}
.logo-text{font-size:20px;font-weight:800;background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav{display:flex;gap:4px}
.nav button{padding:10px 16px;border-radius:8px;background:transparent;color:var(--dim);font-size:14px}
.nav button:hover,.nav button.active{background:rgba(139,92,246,0.15);color:#a78bfa}
.btn{padding:12px 24px;border-radius:12px;font-weight:600;font-size:14px}
.btn-primary{background:linear-gradient(135deg,var(--purple),var(--pink));color:#fff}
.btn-primary:hover{opacity:0.9;transform:translateY(-1px)}
.btn-secondary{background:rgba(255,255,255,0.05);color:#fff;border:1px solid var(--border)}
.user-menu{display:flex;align-items:center;gap:10px;padding:6px 12px;border-radius:10px;background:rgba(255,255,255,0.05);cursor:pointer}
.user-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-weight:600}

.hero{padding:80px 20px;text-align:center}
.hero h1{font-size:clamp(32px,6vw,64px);font-weight:800;line-height:1.1;margin-bottom:24px}
.hero h1 span{background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:18px;color:var(--dim);margin-bottom:32px}
.hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.hero-buttons .btn{padding:16px 32px;font-size:16px}

.providers{display:flex;gap:16px;justify-content:center;margin-top:40px;flex-wrap:wrap}
.provider-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px 24px;display:flex;align-items:center;gap:12px}
.provider-icon{font-size:24px}
.provider-info h4{font-size:14px}
.provider-info p{font-size:12px;color:var(--dim)}

.models-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;max-width:1200px;margin:40px auto;padding:0 20px}
.model-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;transition:.3s}
.model-card:hover{border-color:var(--purple);transform:translateY(-4px)}
.model-card h3{font-size:15px;margin-bottom:4px;display:flex;align-items:center;gap:8px}
.model-card p{font-size:13px;color:var(--dim)}
.model-badge{font-size:10px;padding:3px 8px;border-radius:6px}
.model-badge.or{background:rgba(59,130,246,0.2);color:var(--blue)}
.model-badge.hf{background:rgba(245,158,11,0.2);color:var(--yellow)}

.section{padding:40px 20px;max-width:1000px;margin:0 auto}
.chat-container{background:var(--card);border-radius:20px;border:1px solid var(--border);overflow:hidden}
.chat-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
.chat-status{width:10px;height:10px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.chat-messages{height:450px;overflow-y:auto;padding:20px}
.message{max-width:85%;margin-bottom:16px;padding:14px 18px;border-radius:18px;font-size:14px;line-height:1.7}
.message.user{background:linear-gradient(135deg,var(--purple),var(--pink));margin-left:auto}
.message.bot{background:rgba(255,255,255,0.05)}
.message pre{background:rgba(0,0,0,0.4);padding:14px;border-radius:10px;margin:12px 0;overflow-x:auto;font-size:13px}
.message code{font-family:monospace}
.typing{display:flex;gap:4px;padding:16px}
.typing span{width:8px;height:8px;border-radius:50%;background:var(--purple);animation:bounce .6s infinite}
.typing span:nth-child(2){animation-delay:.1s}
.typing span:nth-child(3){animation-delay:.2s}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.chat-input{padding:16px;border-top:1px solid var(--border);display:flex;gap:12px}
.quick-actions{display:flex;gap:8px;padding:0 20px 16px;flex-wrap:wrap}
.quick-btn{padding:10px 16px;border-radius:20px;background:rgba(139,92,246,0.1);color:#a78bfa;font-size:13px}
.quick-btn:hover{background:rgba(139,92,246,0.2)}

.modal{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.7)}
.modal-content{position:relative;width:100%;max-width:420px;background:var(--card);border-radius:20px;border:1px solid var(--border)}
.modal-header{padding:20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between}
.modal-body{padding:24px}
.code-input{text-align:center;font-size:28px;letter-spacing:10px;font-weight:700;text-transform:uppercase}

.profile-dropdown{position:absolute;top:70px;right:20px;width:340px;background:var(--card);border-radius:16px;border:1px solid var(--border);z-index:100}
.profile-header{padding:20px;border-bottom:1px solid var(--border);display:flex;gap:14px}
.profile-avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600}
.progress-bar{height:6px;background:rgba(255,255,255,0.1);border-radius:3px;margin-top:10px}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--purple),var(--pink));border-radius:3px}

.footer{border-top:1px solid var(--border);padding:40px 20px;margin-top:60px;text-align:center;color:var(--dim)}
.footer a{color:var(--purple);text-decoration:none}

@media(max-width:768px){
    .nav{display:none}
    .hero h1{font-size:28px}
    .models-grid{grid-template-columns:1fr}
    .providers{flex-direction:column}
}
</style>
</head>
<body>
<div class="toast" id="toast"></div>

<div class="modal hidden" id="authModal">
<div class="modal-overlay" onclick="closeAuth()"></div>
<div class="modal-content">
<div class="modal-header"><h2>Вход через Telegram</h2><button onclick="closeAuth()" style="background:none;color:var(--dim);font-size:24px">×</button></div>
<div class="modal-body">
<div style="text-align:center;margin-bottom:24px">
<div style="width:80px;height:80px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,#0088cc,#00aaff);display:flex;align-items:center;justify-content:center;font-size:40px">✈️</div>
<p style="color:var(--dim)">Напишите <b style="color:#a78bfa">/auth</b> боту @${BOT_USERNAME}</p>
</div>
<a href="https://t.me/${BOT_USERNAME}" target="_blank" style="display:block;margin-bottom:20px;text-decoration:none">
<button class="btn btn-primary" style="width:100%;background:linear-gradient(135deg,#0088cc,#00aaff)">✈️ Открыть бота</button>
</a>
<div style="text-align:center;color:var(--dim);margin:20px 0;font-size:14px">Введите код</div>
<input type="text" class="code-input" id="authCode" placeholder="XXXXXX" maxlength="6">
<button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="verifyCode()" id="verifyBtn">Войти</button>
<p id="authError" style="color:#ef4444;text-align:center;margin-top:12px;font-size:14px"></p>
</div>
</div>
</div>

<div class="profile-dropdown hidden" id="profileDropdown">
<div class="profile-header">
<div class="profile-avatar" id="pAvatar">U</div>
<div><h4 id="pName">User</h4><p style="font-size:13px;color:var(--dim)" id="pUsername">@user</p></div>
</div>
<div style="padding:16px 20px;border-bottom:1px solid var(--border)">
<div style="display:flex;justify-content:space-between;font-size:14px"><span style="color:var(--dim)">Запросов</span><span id="pReq">0/1000</span></div>
<div class="progress-bar"><div class="progress-fill" id="pProgress" style="width:0%"></div></div>
</div>
<div style="padding:16px 20px;border-bottom:1px solid var(--border)">
<label style="font-size:13px;color:var(--dim)">🔑 API Key</label>
<div style="display:flex;gap:8px;margin-top:8px">
<code id="pKey" style="flex:1;padding:12px;background:rgba(255,255,255,0.05);border-radius:8px;font-size:11px;overflow:hidden">nc_xxx</code>
<button onclick="copyKey()" style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.05);color:#fff">📋</button>
</div>
</div>
<div style="padding:12px"><button onclick="logout()" style="width:100%;padding:12px;border-radius:10px;background:rgba(239,68,68,0.1);color:#ef4444">🚪 Выйти</button></div>
</div>

<header class="header">
<div class="header-inner">
<div class="logo" onclick="showSection('home')"><div class="logo-icon">⚡</div><div class="logo-text">NeuroCode AI</div></div>
<nav class="nav">
<button onclick="showSection('home')" class="active" data-section="home">Главная</button>
<button onclick="showSection('chat')" data-section="chat">AI Чат</button>
<button onclick="showSection('api')" data-section="api">API</button>
</nav>
<div>
<div id="authButtons"><button class="btn btn-primary" onclick="openAuth()">Войти</button></div>
<div id="userMenu" class="user-menu hidden" onclick="toggleProfile()"><div class="user-avatar" id="uAvatar">U</div><span id="uName">User</span></div>
</div>
</div>
</header>

<section id="home">
<div class="hero">
<h1>Мультимодельный <span>AI для разработчиков</span></h1>
<p>${TOTAL_MODELS} бесплатных AI моделей: Qwen Coder, DeepSeek, CodeLlama, StarCoder2, LLaMA 3.3</p>
<div class="hero-buttons">
<button class="btn btn-primary" onclick="showSection('chat')">🚀 Начать</button>
<button class="btn btn-secondary" onclick="showSection('api')">📖 API</button>
</div>
<div class="providers">
<div class="provider-card"><div class="provider-icon">🔵</div><div class="provider-info"><h4>OpenRouter</h4><p>${OPENROUTER_MODELS.length} моделей</p></div></div>
<div class="provider-card"><div class="provider-icon">🟡</div><div class="provider-info"><h4>HuggingFace</h4><p>${HUGGINGFACE_MODELS.length} моделей</p></div></div>
</div>
</div>
<div class="models-grid" id="modelsGrid"></div>
</section>

<section id="chat" class="section hidden">
<div class="chat-container">
<div class="chat-header"><div class="chat-status"></div><span style="font-weight:600">NeuroCode AI</span><span style="color:var(--dim);margin-left:8px;font-size:13px">• ${TOTAL_MODELS} моделей</span></div>
<div class="chat-messages" id="chatMessages">
<div class="message bot">👋 Привет! Я <b>NeuroCode AI</b> с ${TOTAL_MODELS} моделями.<br><br>Напиши что нужно создать!</div>
</div>
<div class="quick-actions">
<button class="quick-btn" onclick="sendQuick('Напиши Telegram бота на Python aiogram 3')">🤖 Бот</button>
<button class="quick-btn" onclick="sendQuick('Создай REST API на Express')">🌐 API</button>
<button class="quick-btn" onclick="sendQuick('Сделай лендинг HTML/CSS')">📄 Сайт</button>
</div>
<div class="chat-input">
<input type="text" id="chatInput" placeholder="Опишите задачу..." onkeydown="if(event.key==='Enter')sendMessage()">
<button class="btn btn-primary" onclick="sendMessage()">➤</button>
</div>
</div>
</section>

<section id="api" class="section hidden">
<h2>📖 API</h2>
<p style="color:var(--dim);margin:16px 0">OpenAI-совместимый API с ${TOTAL_MODELS} моделями</p>
<pre style="background:var(--card);padding:20px;border-radius:12px;overflow-x:auto"><code>curl -X POST ${DOMAIN}/api/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"messages":[{"role":"user","content":"Привет"}]}'</code></pre>
<p style="margin-top:24px;color:var(--dim)">Получите API ключ через /auth в Telegram боте @${BOT_USERNAME}</p>
</section>

<footer class="footer">
<p>© 2024 NeuroCode AI • ${TOTAL_MODELS} бесплатных моделей</p>
<p style="margin-top:8px"><a href="https://t.me/${BOT_USERNAME}">Telegram</a></p>
</footer>

<script>
const OR_MODELS = ${JSON.stringify(OPENROUTER_MODELS)};
const HF_MODELS = ${JSON.stringify(HUGGINGFACE_MODELS)};
let user = null, chatHistory = [];
const $ = id => document.getElementById(id);
const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500); };

function renderModels() {
    const all = [...OR_MODELS.map(m=>({...m,prov:'or'})), ...HF_MODELS.map(m=>({...m,prov:'hf'}))];
    $('modelsGrid').innerHTML = all.slice(0,20).map(m => \`
        <div class="model-card">
            <h3>\${m.name} <span class="model-badge \${m.prov}">\${m.prov==='or'?'🔵OR':'🟡HF'}</span></h3>
            <p>\${m.description}</p>
        </div>
    \`).join('');
}

function openAuth() { $('authModal').classList.remove('hidden'); }
function closeAuth() { $('authModal').classList.add('hidden'); }

async function verifyCode() {
    const code = $('authCode').value.trim().toUpperCase();
    if (code.length !== 6) { $('authError').textContent = 'Введите 6 символов'; return; }
    try {
        const r = await fetch('/api/auth/verify', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({code}) });
        const d = await r.json();
        if (!r.ok) { $('authError').textContent = d.error; return; }
        user = d; localStorage.setItem('user', JSON.stringify(user)); closeAuth(); updateUI(); toast('✅ Добро пожаловать!');
    } catch(e) { $('authError').textContent = 'Ошибка'; }
}

function updateUI() {
    if (user) {
        $('authButtons').classList.add('hidden'); $('userMenu').classList.remove('hidden');
        $('uName').textContent = user.firstName; $('uAvatar').textContent = user.firstName[0];
        $('pName').textContent = user.firstName; $('pUsername').textContent = '@'+user.username;
        $('pAvatar').textContent = user.firstName[0]; $('pReq').textContent = user.requestsToday+'/'+user.requestsLimit;
        $('pProgress').style.width = (user.requestsToday/user.requestsLimit*100)+'%';
        $('pKey').textContent = user.apiKey.slice(0,12)+'...';
    } else {
        $('authButtons').classList.remove('hidden'); $('userMenu').classList.add('hidden');
    }
}

function toggleProfile() { $('profileDropdown').classList.toggle('hidden'); }
function copyKey() { if(user) { navigator.clipboard.writeText(user.apiKey); toast('✅ Скопировано!'); } }
function logout() { user=null; localStorage.removeItem('user'); updateUI(); $('profileDropdown').classList.add('hidden'); }
function showSection(name) {
    document.querySelectorAll('section').forEach(s=>s.classList.add('hidden')); $(name).classList.remove('hidden');
    document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
    document.querySelector('.nav button[data-section="'+name+'"]')?.classList.add('active');
}

async function sendMessage() {
    const input = $('chatInput'), msg = input.value.trim(); if (!msg) return;
    input.value = '';
    const messages = $('chatMessages');
    messages.innerHTML += '<div class="message user">'+msg.replace(/</g,'&lt;')+'</div>';
    messages.innerHTML += '<div class="message bot" id="typing"><div class="typing"><span></span><span></span><span></span></div></div>';
    messages.scrollTop = messages.scrollHeight;
    chatHistory.push({role:'user',content:msg});
    try {
        const r = await fetch('/api/v1/chat/completions', { method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+(user?.apiKey||'demo')}, body:JSON.stringify({messages:chatHistory}) });
        const d = await r.json();
        const content = d.choices?.[0]?.message?.content || 'Ошибка';
        chatHistory.push({role:'assistant',content});
        let html = content.replace(/</g,'&lt;').replace(/\`\`\`(\\w*)\\n([\\s\\S]*?)\`\`\`/g,'<pre><code>$2</code></pre>').replace(/\`([^\`]+)\`/g,'<code>$1</code>').replace(/\\n/g,'<br>');
        $('typing').outerHTML = '<div class="message bot">'+html+'<div style="font-size:11px;color:var(--dim);margin-top:8px">🤖 '+d.provider+'/'+d.model?.split('/').pop()+'</div></div>';
    } catch(e) { $('typing').outerHTML = '<div class="message bot">❌ Ошибка</div>'; }
    messages.scrollTop = messages.scrollHeight;
}

function sendQuick(msg) { $('chatInput').value = msg; sendMessage(); }

// Инициализация
(async function() {
    renderModels();
    
    const saved = localStorage.getItem('user');
    if (saved) {
        try {
            const u = JSON.parse(saved);
            const r = await fetch('/api/auth/check', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({telegramId: u.telegramId}) });
            const d = await r.json();
            if (d.valid) { user = d.user; localStorage.setItem('user', JSON.stringify(user)); updateUI(); }
            else { localStorage.removeItem('user'); }
        } catch(e) { localStorage.removeItem('user'); }
    }
    
    document.addEventListener('click', e => {
        if (!e.target.closest('#userMenu') && !e.target.closest('#profileDropdown')) {
            $('profileDropdown').classList.add('hidden');
        }
    });
    
    $('authCode').addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });
})();
</script>
</body>
</html>`;

app.get('/', (req, res) => res.send(HTML));

// ═══════════════════════════════════════════════════════════
// ЗАПУСК СЕРВЕРА
// ═══════════════════════════════════════════════════════════
const server = app.listen(PORT, async () => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 NeuroCode AI v2.0 запущен!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🌐 Домен: ${DOMAIN}`);
    console.log(`📡 Порт: ${PORT}`);
    console.log(`👥 Пользователей: ${db.users.length}`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🤖 AI Модели: ${TOTAL_MODELS}`);
    console.log(`   🔵 OpenRouter: ${OPENROUTER_MODELS.length}`);
    console.log(`   🟡 HuggingFace: ${HUGGINGFACE_MODELS.length}`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🏆 Топ модели для кода:');
    OPENROUTER_MODELS.slice(0, 5).forEach((m, i) => console.log(`   ${i + 1}. ${m.name}`));
    console.log('═══════════════════════════════════════════════════════════');
    
    // Установка Webhook
    try {
        const r = await fetch(`${TELEGRAM_API}/setWebhook?url=${DOMAIN}${WEBHOOK_PATH}`);
        const d = await r.json();
        console.log('📱 Telegram:', d.ok ? '✅ Webhook установлен' : '❌ ' + d.description);
    } catch (e) {
        console.log('❌ Webhook error:', e.message);
    }
    console.log('═══════════════════════════════════════════════════════════');
});

server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Порт ${PORT} занят, пробуем другой...`);
        server.listen(0);
    }
});

// Graceful shutdown
process.on('SIGINT', () => { 
    console.log('\n👋 Завершение работы...');
    saveDB(); 
    process.exit(); 
});

process.on('SIGTERM', () => { 
    console.log('\n👋 Завершение работы...');
    saveDB(); 
    process.exit(); 
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    saveDB();
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
});
