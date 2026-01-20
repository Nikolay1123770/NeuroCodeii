const express = require('express');
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
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN || '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';

// ═══════════════════════════════════════════════════════════
// 🔥🔥🔥 МЕГА ПРОМПТ ДЛЯ ГЕНИАЛЬНЫХ ПРОЕКТОВ 🔥🔥🔥
// ═══════════════════════════════════════════════════════════
const SYSTEM_PROMPT = `Ты - NeuroCode AI, ЛЕГЕНДАРНЫЙ ИИ-архитектор и full-stack разработчик с 25+ годами опыта в Google, Meta, Apple.

╔════════════════════════════════════════════════════════════════════════════════════════╗
║  ⚠️ КРИТИЧЕСКИ ВАЖНО: ТЫ СОЗДАЁШЬ ТОЛЬКО ШЕДЕВРЫ МИРОВОГО УРОВНЯ!                      ║
║  Каждый проект должен быть достоин портфолио Senior Developer в FAANG!                 ║
║  Никаких упрощений! Только ЭЛИТНЫЙ, PRODUCTION-READY КОД!                              ║
╚════════════════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════════════════
🎯 ТВОЯ ФИЛОСОФИЯ КОДА:
═══════════════════════════════════════════════════════════════════════════════════════════

"Код должен быть как швейцарские часы - идеально спроектирован, безупречно работает, 
восхищает своей красотой и продуман до мельчайших деталей."

Перед написанием КАЖДОЙ строки кода ты:
1. Анализируешь все возможные edge cases
2. Продумываешь архитектуру на 3 шага вперёд
3. Выбираешь оптимальное решение из 10 возможных
4. Пишешь код, который будет работать 10 лет без изменений

═══════════════════════════════════════════════════════════════════════════════════════════
📏 ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ К ОБЪЁМУ:
═══════════════════════════════════════════════════════════════════════════════════════════

🌐 САЙТЫ:
   • HTML: минимум 200-300 строк с семантикой
   • CSS: минимум 500-800 строк с анимациями
   • JavaScript: минимум 300-500 строк с интерактивностью
   • ИТОГО: 1000-1600 строк МИНИМУМ!

🤖 TELEGRAM БОТЫ:
   • Основной файл: 400-600 строк
   • Handlers: 300-500 строк
   • Keyboards: 150-250 строк
   • Database: 200-300 строк
   • Utils: 150-200 строк
   • ИТОГО: 1200-1850 строк МИНИМУМ!

⚡ REST API:
   • Server: 300-400 строк
   • Routes: 400-600 строк
   • Controllers: 300-500 строк
   • Middleware: 200-300 строк
   • Models: 200-300 строк
   • ИТОГО: 1400-2100 строк МИНИМУМ!

═══════════════════════════════════════════════════════════════════════════════════════════
🌐 САЙТЫ - УРОВЕНЬ AWWWARDS:
═══════════════════════════════════════════════════════════════════════════════════════════

Каждый сайт ОБЯЗАТЕЛЬНО включает:

📄 HTML5 (200+ строк):
   • Полная семантическая структура
   • SEO meta теги (title, description, keywords, og:tags)
   • Favicon, Apple Touch Icons
   • Schema.org микроразметка
   • Preload для критических ресурсов
   • Aria-labels для доступности

🎨 CSS3 (500+ строк):
   • CSS Custom Properties (20+ переменных)
   • Продуманная система цветов и типографики
   • Flexbox И Grid layouts
   • 15+ keyframes анимаций:
     - Fade in/out с разных сторон
     - Scale, rotate эффекты
     - Parallax скролл
     - Hover 3D transforms
     - Loading анимации
     - Морфинг форм
   • Glassmorphism, Neumorphism эффекты
   • Gradient backgrounds и borders
   • Custom scrollbar
   • Selection стили
   • Focus states для accessibility
   • 5+ брейкпоинтов для адаптивности
   • Print стили

💻 JavaScript (300+ строк):
   • Модульная ES6+ архитектура
   • IntersectionObserver для scroll анимаций
   • Smooth scroll с easing
   • Динамическая навигация
   • Модальные окна с фокус-трапом
   • Слайдеры/карусели с touch support
   • Валидация форм с UX feedback
   • Lazy loading изображений
   • Dark/Light theme switcher
   • LocalStorage для сохранения
   • Debounce/Throttle для оптимизации
   • Параллакс эффекты
   • Анимированные счётчики
   • Typing эффект для текста

📱 ОБЯЗАТЕЛЬНЫЕ СЕКЦИИ:
   1. Hero - WOW-эффект с первых секунд, CTA кнопки
   2. Features/Services - с иконками и анимациями
   3. About - история, миссия, ценности
   4. Portfolio/Works - галерея с фильтрами
   5. Testimonials - карусель отзывов
   6. Team - карточки с hover эффектами
   7. Pricing - таблица тарифов
   8. FAQ - аккордеон
   9. Blog/News - превью статей
   10. Contact - форма с валидацией + карта
   11. Footer - навигация, соцсети, newsletter

═══════════════════════════════════════════════════════════════════════════════════════════
🤖 TELEGRAM БОТЫ - ENTERPRISE УРОВЕНЬ:
═══════════════════════════════════════════════════════════════════════════════════════════

Структура проекта:
\`\`\`
project/
├── bot.py                 # Точка входа (100+ строк)
├── config.py              # Конфигурация (50+ строк)
├── handlers/
│   ├── __init__.py
│   ├── start.py           # Стартовые команды (150+ строк)
│   ├── user.py            # Пользовательские функции (200+ строк)
│   ├── admin.py           # Админ панель (200+ строк)
│   ├── payments.py        # Платежи (150+ строк)
│   └── callbacks.py       # Callback handlers (150+ строк)
├── keyboards/
│   ├── inline.py          # Inline клавиатуры (100+ строк)
│   └── reply.py           # Reply клавиатуры (80+ строк)
├── database/
│   ├── models.py          # SQLAlchemy модели (150+ строк)
│   └── crud.py            # CRUD операции (200+ строк)
├── services/
│   ├── api.py             # Внешние API (100+ строк)
│   └── notifications.py   # Уведомления (80+ строк)
├── utils/
│   ├── helpers.py         # Хелперы (100+ строк)
│   ├── decorators.py      # Декораторы (50+ строк)
│   └── validators.py      # Валидаторы (80+ строк)
├── middlewares/
│   ├── throttling.py      # Антифлуд (60+ строк)
│   └── logging.py         # Логирование (50+ строк)
├── .env.example
├── requirements.txt
├── docker-compose.yml
└── README.md
\`\`\`

Обязательный функционал:
   ✅ Полная система регистрации с верификацией
   ✅ Профили пользователей с настройками
   ✅ Многоуровневая админ-панель
   ✅ Статистика и аналитика
   ✅ Система уведомлений
   ✅ Реферальная программа
   ✅ Мультиязычность (i18n)
   ✅ Платежи (если нужны)
   ✅ Экспорт данных
   ✅ Резервное копирование
   ✅ Rate limiting
   ✅ Graceful shutdown
   ✅ Health checks

═══════════════════════════════════════════════════════════════════════════════════════════
⚡ REST API - PRODUCTION УРОВЕНЬ:
═══════════════════════════════════════════════════════════════════════════════════════════

   ✅ Express.js/Fastify или FastAPI/Django
   ✅ JWT авторизация (access + refresh tokens)
   ✅ Role-based access control (RBAC)
   ✅ Request validation (Joi/Zod/Pydantic)
   ✅ Error handling middleware
   ✅ Request logging (Morgan/Winston)
   ✅ Rate limiting per endpoint
   ✅ CORS configuration
   ✅ Helmet security headers
   ✅ API versioning (v1, v2)
   ✅ Pagination, filtering, sorting
   ✅ File uploads with validation
   ✅ Caching strategy (Redis)
   ✅ Database migrations
   ✅ Seed data
   ✅ Unit & Integration tests
   ✅ Swagger/OpenAPI documentation
   ✅ Docker configuration
   ✅ CI/CD pipeline готовность

═══════════════════════════════════════════════════════════════════════════════════════════
🐛 ИСПРАВЛЕНИЕ ОШИБОК - ДЕТЕКТИВНЫЙ ПОДХОД:
═══════════════════════════════════════════════════════════════════════════════════════════

Когда тебя просят исправить ошибку:
1. Проанализируй ВСЮ кодовую базу
2. Найди ВСЕ потенциальные проблемы (не только указанную)
3. Объясни ПОЧЕМУ возникла ошибка
4. Дай ПОЛНЫЙ исправленный код (не фрагменты!)
5. Добавь защиту от подобных ошибок в будущем
6. Предложи улучшения архитектуры

═══════════════════════════════════════════════════════════════════════════════════════════
📝 ФОРМАТ ОТВЕТА:
═══════════════════════════════════════════════════════════════════════════════════════════

1. 📌 **Обзор проекта** - что создаём и почему это будет круто
2. 🛠️ **Технологии** - обоснование выбора стека
3. 📁 **Структура** - архитектура проекта
4. 💻 **ПОЛНЫЙ КОД** - каждый файл целиком, без сокращений!
5. 📦 **Установка** - пошаговая инструкция
6. 🚀 **Запуск** - команды для запуска
7. 🎨 **Кастомизация** - как изменить под себя
8. 💡 **Улучшения** - идеи для развития

═══════════════════════════════════════════════════════════════════════════════════════════
❌ КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:
═══════════════════════════════════════════════════════════════════════════════════════════

НИКОГДА не пиши:
   • "// ... остальной код аналогично"
   • "/* добавьте остальные функции */"
   • "и так далее..."
   • "по аналогии с предыдущим..."
   • "здесь должен быть код..."
   • Любые сокращения и заглушки!

НИКОГДА не давай:
   • Код менее 500 строк для сайтов
   • Ботов без полной структуры проекта
   • API без аутентификации и валидации
   • Проекты без обработки ошибок
   • Код без комментариев

═══════════════════════════════════════════════════════════════════════════════════════════
✅ ТВОИ ПРИНЦИПЫ:
═══════════════════════════════════════════════════════════════════════════════════════════

1. Каждый проект - шедевр, достойный GitHub Trending
2. Код настолько чистый, что его можно читать как книгу
3. Архитектура настолько продуманная, что её можно масштабировать в 100 раз
4. UX настолько приятный, что пользователи влюбляются с первого клика
5. Безопасность настолько надёжная, что хакеры плачут

Ты создаёшь код, который:
   • Можно сразу деплоить в production
   • Будет работать годами без багов
   • Легко поддерживать и расширять
   • Вызывает восхищение у других разработчиков

ВСЕГДА отвечай на РУССКОМ языке!
КАЖДЫЙ проект должен быть ГЕНИАЛЬНЫМ! 🚀`;

// ═══════════════════════════════════════════════════════════
// 🎨 СПЕЦИАЛИЗИРОВАННЫЕ ПРОМПТЫ
// ═══════════════════════════════════════════════════════════
const SITE_PROMPT = (description) => `Создай ПОТРЯСАЮЩИЙ, AWARD-WINNING веб-сайт: ${description}

🎯 ЭТО ДОЛЖЕН БЫТЬ САЙТ УРОВНЯ AWWWARDS!

📋 ОБЯЗАТЕЛЬНО ВКЛЮЧИ:

1️⃣ HTML (200+ строк):
   - Семантическая структура (header, nav, main, sections, footer)
   - Meta теги для SEO
   - Open Graph для соцсетей
   - Favicon
   - Preconnect для шрифтов

2️⃣ CSS (600+ строк):
   - CSS переменные для цветов и размеров
   - Красивые градиенты
   - Glassmorphism эффекты
   - 10+ анимаций @keyframes
   - Плавные hover эффекты
   - Тени и глубина
   - Полная адаптивность (mobile, tablet, desktop)
   - Custom scrollbar
   - Плавные transition

3️⃣ JavaScript (300+ строк):
   - Плавный скролл
   - Анимации при появлении элементов
   - Параллакс эффекты
   - Мобильное меню
   - Модальные окна
   - Валидация форм
   - Слайдер/карусель
   - Анимированные счётчики
   - Ленивая загрузка

4️⃣ СЕКЦИИ:
   - Hero с мощным заголовком и CTA
   - О нас / О компании
   - Услуги с иконками
   - Преимущества
   - Портфолио / Работы
   - Отзывы клиентов
   - Команда
   - Цены / Тарифы
   - FAQ (аккордеон)
   - Контакты с формой
   - Footer

Дай ПОЛНЫЙ КОД без единого сокращения! Каждый файл целиком!`;

const BOT_PROMPT = (description) => `Создай ПРОФЕССИОНАЛЬНЫЙ Telegram бот ENTERPRISE уровня: ${description}

🎯 ЭТО ДОЛЖЕН БЫТЬ БОТ УРОВНЯ КРУПНОЙ КОМПАНИИ!

📋 ОБЯЗАТЕЛЬНО ВКЛЮЧИ:

1️⃣ СТРУКТУРА ПРОЕКТА:
   bot/
   ├── main.py (точка входа, 100+ строк)
   ├── config.py (конфигурация, 50+ строк)
   ├── handlers/
   │   ├── __init__.py
   │   ├── start.py (стартовые команды, 150+ строк)
   │   ├── user.py (пользовательские функции, 200+ строк)
   │   ├── admin.py (админка, 150+ строк)
   │   └── callbacks.py (callback обработчики, 100+ строк)
   ├── keyboards/
   │   ├── inline.py (inline клавиатуры, 100+ строк)
   │   └── reply.py (reply клавиатуры, 60+ строк)
   ├── database/
   │   ├── models.py (модели данных, 100+ строк)
   │   └── db.py (работа с БД, 150+ строк)
   ├── utils/
   │   ├── helpers.py (вспомогательные функции, 80+ строк)
   │   └── decorators.py (декораторы, 50+ строк)
   ├── middlewares/
   │   └── throttling.py (антифлуд, 50+ строк)
   ├── .env.example
   ├── requirements.txt
   └── README.md

2️⃣ ТЕХНОЛОГИИ:
   - Python 3.11+
   - aiogram 3.x (последняя версия!)
   - SQLAlchemy + aiosqlite
   - pydantic для валидации
   - python-dotenv

3️⃣ ФУНКЦИОНАЛ:
   - Система регистрации пользователей
   - Профили с настройками
   - Админ-панель со статистикой
   - FSM для сложных диалогов
   - Inline и Reply клавиатуры
   - Пагинация для списков
   - Обработка ВСЕХ ошибок
   - Логирование
   - Rate limiting

4️⃣ КАЖДЫЙ ФАЙЛ ДОЛЖЕН БЫТЬ ПОЛНЫМ!
   Никаких "# остальной код" или "...".
   Полная рабочая реализация!

Дай КОД КАЖДОГО ФАЙЛА целиком! Бот должен работать сразу после копирования!`;

const API_PROMPT = (description) => `Создай PRODUCTION-READY REST API: ${description}

🎯 ЭТО ДОЛЖЕН БЫТЬ API УРОВНЯ СТАРТАПА В Y COMBINATOR!

📋 ОБЯЗАТЕЛЬНО ВКЛЮЧИ:

1️⃣ СТРУКТУРА:
   api/
   ├── src/
   │   ├── index.js (точка входа, 80+ строк)
   │   ├── app.js (Express app, 100+ строк)
   │   ├── config/
   │   │   ├── database.js (60+ строк)
   │   │   └── jwt.js (40+ строк)
   │   ├── routes/
   │   │   ├── auth.js (150+ строк)
   │   │   ├── users.js (200+ строк)
   │   │   └── [resource].js (200+ строк)
   │   ├── controllers/
   │   │   ├── authController.js (200+ строк)
   │   │   ├── userController.js (150+ строк)
   │   │   └── [resource]Controller.js (200+ строк)
   │   ├── middleware/
   │   │   ├── auth.js (80+ строк)
   │   │   ├── validate.js (60+ строк)
   │   │   ├── errorHandler.js (80+ строк)
   │   │   └── rateLimiter.js (40+ строк)
   │   ├── models/
   │   │   ├── User.js (100+ строк)
   │   │   └── [Resource].js (80+ строк)
   │   ├── utils/
   │   │   ├── helpers.js (60+ строк)
   │   │   └── validators.js (80+ строк)
   │   └── docs/
   │       └── swagger.js (100+ строк)
   ├── .env.example
   ├── package.json
   └── README.md

2️⃣ ФУНКЦИОНАЛ:
   - JWT авторизация (access + refresh tokens)
   - Регистрация и логин
   - CRUD для всех ресурсов
   - Валидация всех входных данных
   - Пагинация, сортировка, фильтрация
   - Upload файлов
   - Rate limiting
   - CORS настройка
   - Swagger документация
   - Обработка всех ошибок
   - Логирование запросов

Дай КОД КАЖДОГО ФАЙЛА целиком!`;

const FIX_PROMPT = (error) => `СРОЧНО ИСПРАВЬ ЭТУ ПРОБЛЕМУ: ${error}

🔍 ТВОЯ ЗАДАЧА:

1. Проанализируй ошибку глубоко
2. Найди ВСЕ причины проблемы
3. Дай ПОЛНЫЙ исправленный код (весь файл целиком!)
4. Объясни что было не так и почему
5. Добавь защиту от подобных ошибок
6. Предложи улучшения

⚠️ ВАЖНО:
- Давай ПОЛНЫЙ файл, не фрагменты!
- Код должен работать сразу!
- Добавь комментарии к исправлениям`;

// ═══════════════════════════════════════════════════════════
// МОДЕЛИ
// ═══════════════════════════════════════════════════════════
const GROQ_MODELS = [
    { id: 'llama-3.3-70b-versatile', name: 'LLaMA 3.3 70B', description: '🏆 Самая мощная' },
    { id: 'llama-3.1-70b-versatile', name: 'LLaMA 3.1 70B', description: '🦙 Мощная' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: '🌀 32K контекст' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: '🔷 Google' },
    { id: 'llama-3.1-8b-instant', name: 'LLaMA 3.1 8B', description: '⚡ Быстрая' }
];

const HUGGINGFACE_MODELS = [
    { id: 'Qwen/Qwen2.5-Coder-32B-Instruct', name: 'Qwen Coder 32B', description: '🏆 Для кода' },
    { id: 'meta-llama/Llama-3.3-70B-Instruct', name: 'LLaMA 3.3 70B', description: '🦙 Meta' },
    { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', description: '🌀 MoE' }
];

const TOTAL_MODELS = GROQ_MODELS.length + HUGGINGFACE_MODELS.length;

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ═══════════════════════════════════════════════════════════
// БАЗА ДАННЫХ
// ═══════════════════════════════════════════════════════════
const DB_FILE = path.join(__dirname, 'database.json');
let db = { users: [], stats: { total: 0, success: 0, groq: 0, hf: 0 } };
const authCodes = new Map();
const chatHistories = new Map();

function loadDB() {
    try {
        if (fs.existsSync(DB_FILE)) db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {}
}

function saveDB() {
    try { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); } catch (e) {}
}

setInterval(saveDB, 30000);
loadDB();

// ═══════════════════════════════════════════════════════════
// GROQ API
// ═══════════════════════════════════════════════════════════
async function callGroq(messages, modelId) {
    try {
        console.log('🟢 Groq:', modelId);
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + GROQ_API_KEY
            },
            body: JSON.stringify({
                model: modelId,
                messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                temperature: 0.7,
                max_tokens: 32768, // МАКСИМУМ!
                top_p: 0.95
            })
        });
        
        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log('✅ Groq OK:', data.choices[0].message.content.length, 'chars');
            db.stats.groq++;
            return { content: data.choices[0].message.content, model: modelId, provider: 'Groq' };
        }
        
        if (data.error) console.log('❌ Groq:', data.error.message);
        return null;
    } catch (e) {
        console.log('❌ Groq:', e.message);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════
// HUGGINGFACE API
// ═══════════════════════════════════════════════════════════
async function callHuggingFace(messages, modelId) {
    try {
        console.log('🟡 HuggingFace:', modelId);
        
        const response = await fetch('https://router.huggingface.co/hf-inference/models/' + modelId + '/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + HUGGINGFACE_TOKEN
            },
            body: JSON.stringify({
                model: modelId,
                messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                max_tokens: 16384,
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log('✅ HuggingFace OK');
            db.stats.hf++;
            return { content: data.choices[0].message.content, model: modelId, provider: 'HuggingFace' };
        }
        
        return null;
    } catch (e) {
        console.log('❌ HF:', e.message);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════
// AI RESPONSE
// ═══════════════════════════════════════════════════════════
async function getAIResponse(messages) {
    db.stats.total++;
    
    for (const model of GROQ_MODELS) {
        const result = await callGroq(messages, model.id);
        if (result && result.content && result.content.length > 200) {
            db.stats.success++;
            return result;
        }
        await new Promise(r => setTimeout(r, 500));
    }
    
    for (const model of HUGGINGFACE_MODELS) {
        const result = await callHuggingFace(messages, model.id);
        if (result && result.content && result.content.length > 200) {
            db.stats.success++;
            return result;
        }
        await new Promise(r => setTimeout(r, 500));
    }
    
    return { content: '⚠️ AI временно недоступен. Попробуйте через минуту.', model: 'fallback', provider: 'System' };
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function generateCode() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var code = '';
    for (var i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

function generateApiKey() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var key = 'nc_';
    for (var i = 0; i < 48; i++) key += chars[Math.floor(Math.random() * chars.length)];
    return key;
}

// ═══════════════════════════════════════════════════════════
// ОТПРАВКА ДЛИННЫХ СООБЩЕНИЙ
// ═══════════════════════════════════════════════════════════
async function sendLongMessage(chatId, text, model, provider) {
    // Разбиваем на части по 4000 символов
    var parts = [];
    var current = '';
    var lines = text.split('\n');
    
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if ((current + '\n' + line).length > 3900) {
            if (current) parts.push(current);
            current = line;
        } else {
            current = current ? current + '\n' + line : line;
        }
    }
    if (current) parts.push(current);
    
    // Отправляем каждую часть
    for (var j = 0; j < parts.length; j++) {
        var part = parts[j];
        
        // Форматируем
        var formatted = part
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/```(\w*)\n([\s\S]*?)```/g, function(m, lang, code) {
                return '<pre><code>' + code.trim() + '</code></pre>';
            })
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
            .replace(/\*([^*]+)\*/g, '<i>$1</i>');
        
        // Добавляем номер части
        if (parts.length > 1) {
            formatted = '<b>📄 Часть ' + (j + 1) + '/' + parts.length + '</b>\n\n' + formatted;
        }
        
        // Добавляем инфо о модели к последней части
        if (j === parts.length - 1) {
            formatted += '\n\n<i>🤖 ' + provider + ': ' + model + '</i>';
        }
        
        await send(chatId, formatted);
        
        if (j < parts.length - 1) {
            await new Promise(r => setTimeout(r, 500));
        }
    }
}

// ═══════════════════════════════════════════════════════════
// TELEGRAM API
// ═══════════════════════════════════════════════════════════
const TG_API = 'https://api.telegram.org/bot' + BOT_TOKEN;

async function tg(method, body) {
    try {
        var r = await fetch(TG_API + '/' + method, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await r.json();
    } catch (e) {
        return null;
    }
}

function send(chatId, text, options) {
    return tg('sendMessage', Object.assign({ 
        chat_id: chatId, 
        text: text, 
        parse_mode: 'HTML',
        disable_web_page_preview: true 
    }, options || {}));
}

function typing(chatId) {
    return tg('sendChatAction', { chat_id: chatId, action: 'typing' });
}

function answer(id, text) {
    return tg('answerCallbackQuery', { callback_query_id: id, text: text || '' });
}

// ═══════════════════════════════════════════════════════════
// WEBHOOK
// ═══════════════════════════════════════════════════════════
app.post(WEBHOOK_PATH, async function(req, res) {
    res.sendStatus(200);
    
    var message = req.body.message;
    var callback = req.body.callback_query;
    
    if (callback) {
        await handleCallback(callback);
        return;
    }
    
    if (!message || !message.text) return;
    
    var chatId = message.chat.id;
    var text = message.text;
    var from = message.from;
    
    if (text.charAt(0) === '/') {
        await handleCommand(chatId, text, from);
    } else {
        await handleChat(chatId, text, from);
    }
});

// ═══════════════════════════════════════════════════════════
// КОМАНДЫ
// ═══════════════════════════════════════════════════════════
async function handleCommand(chatId, text, from) {
    var parts = text.split(' ');
    var cmd = parts[0].toLowerCase();
    var args = parts.slice(1).join(' ');
    
    if (cmd === '/start') {
        await send(chatId,
            '🚀 <b>NeuroCode AI</b> — Создаю ШЕДЕВРЫ кода!\n\n' +
            'Привет, <b>' + from.first_name + '</b>! 👋\n\n' +
            'Я создаю <b>ПРОФЕССИОНАЛЬНЫЕ проекты</b>:\n\n' +
            '🌐 <b>Сайты</b> — 1000+ строк, уровень Awwwards\n' +
            '🤖 <b>Боты</b> — 1500+ строк, enterprise архитектура\n' +
            '⚡ <b>API</b> — 1400+ строк, production ready\n\n' +
            '🧠 <b>' + TOTAL_MODELS + ' AI моделей</b>\n' +
            '🟢 Groq — супер быстрые\n' +
            '🟡 HuggingFace — мощные\n\n' +
            '<b>Команды:</b>\n' +
            '/site описание — Создать сайт\n' +
            '/bot описание — Создать Telegram бота\n' +
            '/api описание — Создать REST API\n' +
            '/fix ошибка — Исправить код\n\n' +
            'Или просто напиши что нужно! 🎯',
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🌐 Платформа', url: DOMAIN }],
                        [{ text: '🔐 Код для сайта', callback_data: 'auth' }, { text: '📊 Статус', callback_data: 'stats' }]
                    ]
                }
            }
        );
    } else if (cmd === '/auth') {
        var code = generateCode();
        authCodes.set(code, { telegramId: from.id, username: from.username, firstName: from.first_name, createdAt: Date.now() });
        setTimeout(function() { authCodes.delete(code); }, 600000);
        await send(chatId, '🔐 <b>Код для входа</b>\n\n<code>' + code + '</code>\n\n⏰ 10 минут');
    } else if (cmd === '/site') {
        if (!args) {
            await send(chatId, '🌐 <b>Генератор сайтов AWWWARDS уровня</b>\n\n' +
                'Использование: <code>/site описание</code>\n\n' +
                'Примеры:\n' +
                '• <code>/site лендинг для IT стартапа</code>\n' +
                '• <code>/site интернет-магазин одежды</code>\n' +
                '• <code>/site портфолио дизайнера</code>\n' +
                '• <code>/site корпоративный сайт</code>\n\n' +
                '💎 Каждый сайт: 1000+ строк кода!');
            return;
        }
        await send(chatId, '🎨 Создаю ПОТРЯСАЮЩИЙ сайт...\n\n⏳ Это займёт 30-60 секунд.\nГотовлю 1000+ строк кода!');
        await typing(chatId);
        var interval1 = setInterval(function() { typing(chatId); }, 5000);
        var result1 = await getAIResponse([{ role: 'user', content: SITE_PROMPT(args) }]);
        clearInterval(interval1);
        await sendLongMessage(chatId, result1.content, result1.model, result1.provider);
    } else if (cmd === '/bot') {
        if (!args) {
            await send(chatId, '🤖 <b>Генератор Telegram ботов</b>\n\n' +
                'Использование: <code>/bot описание</code>\n\n' +
                'Примеры:\n' +
                '• <code>/bot магазин с корзиной и оплатой</code>\n' +
                '• <code>/bot бот для записи к врачу</code>\n' +
                '• <code>/bot AI помощник</code>\n\n' +
                '💎 Каждый бот: 1500+ строк кода!');
            return;
        }
        await send(chatId, '🤖 Создаю ENTERPRISE бота...\n\n⏳ Это займёт 30-60 секунд.\nГотовлю 1500+ строк кода!');
        await typing(chatId);
        var interval2 = setInterval(function() { typing(chatId); }, 5000);
        var result2 = await getAIResponse([{ role: 'user', content: BOT_PROMPT(args) }]);
        clearInterval(interval2);
        await sendLongMessage(chatId, result2.content, result2.model, result2.provider);
    } else if (cmd === '/api') {
        if (!args) {
            await send(chatId, '⚡ <b>Генератор REST API</b>\n\n' +
                'Использование: <code>/api описание</code>\n\n' +
                'Примеры:\n' +
                '• <code>/api для интернет-магазина</code>\n' +
                '• <code>/api для блога с комментариями</code>\n' +
                '• <code>/api для системы задач</code>\n\n' +
                '💎 Каждый API: 1400+ строк кода!');
            return;
        }
        await send(chatId, '⚡ Создаю PRODUCTION API...\n\n⏳ Это займёт 30-60 секунд.\nГотовлю 1400+ строк кода!');
        await typing(chatId);
        var interval3 = setInterval(function() { typing(chatId); }, 5000);
        var result3 = await getAIResponse([{ role: 'user', content: API_PROMPT(args) }]);
        clearInterval(interval3);
        await sendLongMessage(chatId, result3.content, result3.model, result3.provider);
    } else if (cmd === '/fix') {
        if (!args) {
            await send(chatId, '🔧 <b>Исправление ошибок</b>\n\n' +
                'Использование: <code>/fix описание ошибки и код</code>\n\n' +
                'Я проанализирую проблему и дам полное решение!');
            return;
        }
        await typing(chatId);
        var interval4 = setInterval(function() { typing(chatId); }, 5000);
        var result4 = await getAIResponse([{ role: 'user', content: FIX_PROMPT(args) }]);
        clearInterval(interval4);
        await sendLongMessage(chatId, result4.content, result4.model, result4.provider);
    } else if (cmd === '/clear') {
        chatHistories.delete(chatId);
        await send(chatId, '🗑️ История очищена!');
    } else if (cmd === '/status') {
        await send(chatId,
            '📊 <b>Статистика</b>\n\n' +
            '🤖 Моделей: ' + TOTAL_MODELS + '\n' +
            '📈 Запросов: ' + db.stats.total + '\n' +
            '✅ Успешных: ' + db.stats.success + '\n' +
            '🟢 Groq: ' + (db.stats.groq || 0) + '\n' +
            '🟡 HF: ' + (db.stats.hf || 0)
        );
    } else if (cmd === '/help') {
        await send(chatId,
            '📚 <b>Команды</b>\n\n' +
            '/start — Главное меню\n' +
            '/site описание — Сайт (1000+ строк)\n' +
            '/bot описание — Telegram бот (1500+ строк)\n' +
            '/api описание — REST API (1400+ строк)\n' +
            '/fix ошибка — Исправить код\n' +
            '/clear — Очистить историю\n' +
            '/status — Статистика\n\n' +
            'Или просто напиши что нужно! 🚀'
        );
    }
}

// ═══════════════════════════════════════════════════════════
// CALLBACKS
// ═══════════════════════════════════════════════════════════
async function handleCallback(cb) {
    var chatId = cb.message.chat.id;
    var data = cb.data;
    var from = cb.from;
    
    if (data === 'auth') {
        var code = generateCode();
        authCodes.set(code, { telegramId: from.id, username: from.username, firstName: from.first_name, createdAt: Date.now() });
        setTimeout(function() { authCodes.delete(code); }, 600000);
        await answer(cb.id, '✅ Код создан!');
        await send(chatId, '🔐 Код: <code>' + code + '</code>\n⏰ 10 минут');
    } else if (data === 'stats') {
        await answer(cb.id);
        await send(chatId, '📊 Запросов: ' + db.stats.total + ' | Успешных: ' + db.stats.success);
    }
}

// ═══════════════════════════════════════════════════════════
// ЧАТ
// ═══════════════════════════════════════════════════════════
async function handleChat(chatId, text, from) {
    // Определяем тип запроса
    var lowerText = text.toLowerCase();
    var prompt = text;
    
    if (lowerText.includes('сайт') || lowerText.includes('лендинг') || lowerText.includes('страниц')) {
        prompt = SITE_PROMPT(text);
        await send(chatId, '🎨 Создаю ПОТРЯСАЮЩИЙ сайт...\n⏳ 30-60 секунд');
    } else if (lowerText.includes('бот') || lowerText.includes('телеграм')) {
        prompt = BOT_PROMPT(text);
        await send(chatId, '🤖 Создаю ENTERPRISE бота...\n⏳ 30-60 секунд');
    } else if (lowerText.includes('api') || lowerText.includes('сервер') || lowerText.includes('бэкенд')) {
        prompt = API_PROMPT(text);
        await send(chatId, '⚡ Создаю PRODUCTION API...\n⏳ 30-60 секунд');
    } else if (lowerText.includes('ошибк') || lowerText.includes('исправ') || lowerText.includes('не работ')) {
        prompt = FIX_PROMPT(text);
    }
    
    await typing(chatId);
    
    if (!chatHistories.has(chatId)) chatHistories.set(chatId, []);
    var history = chatHistories.get(chatId);
    history.push({ role: 'user', content: prompt });
    if (history.length > 6) history.splice(0, history.length - 6);
    
    try {
        var interval = setInterval(function() { typing(chatId); }, 5000);
        var result = await getAIResponse(history);
        clearInterval(interval);
        
        history.push({ role: 'assistant', content: result.content });
        
        await sendLongMessage(chatId, result.content, result.model, result.provider);
        
        console.log('💬 ' + from.first_name + ': ' + text.substring(0, 30) + '... → ' + result.content.length + ' chars');
    } catch (e) {
        console.error('Chat error:', e);
        await send(chatId, '❌ Ошибка. Попробуй ещё раз.');
    }
}

// ═══════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════
app.get('/api/health', function(req, res) {
    res.json({ status: 'ok', models: TOTAL_MODELS, stats: db.stats });
});

app.post('/api/auth/verify', function(req, res) {
    var code = req.body.code;
    if (!code || code.length !== 6) return res.status(400).json({ error: 'Неверный код' });
    
    var data = authCodes.get(code.toUpperCase());
    if (!data) return res.status(401).json({ error: 'Код не найден' });
    
    authCodes.delete(code.toUpperCase());
    
    var user = null;
    for (var i = 0; i < db.users.length; i++) {
        if (db.users[i].telegramId === data.telegramId) {
            user = db.users[i];
            break;
        }
    }
    
    if (!user) {
        user = {
            id: 'user_' + data.telegramId,
            telegramId: data.telegramId,
            username: data.username,
            firstName: data.firstName,
            apiKey: generateApiKey(),
            plan: 'free',
            requestsToday: 0,
            requestsLimit: 1000,
            createdAt: new Date().toISOString()
        };
        db.users.push(user);
        saveDB();
    }
    res.json(user);
});

app.post('/api/auth/check', function(req, res) {
    var telegramId = req.body.telegramId;
    var user = null;
    for (var i = 0; i < db.users.length; i++) {
        if (db.users[i].telegramId == telegramId) {
            user = db.users[i];
            break;
        }
    }
    res.json({ valid: !!user, user: user });
});

app.post('/api/v1/chat/completions', async function(req, res) {
    var messages = req.body.messages;
    if (!messages || !messages.length) return res.status(400).json({ error: 'Messages required' });
    
    try {
        var result = await getAIResponse(messages);
        res.json({
            id: 'chatcmpl-' + Date.now(),
            model: result.model,
            provider: result.provider,
            choices: [{ index: 0, message: { role: 'assistant', content: result.content }, finish_reason: 'stop' }]
        });
    } catch (e) {
        res.status(500).json({ error: 'AI error' });
    }
});

// ═══════════════════════════════════════════════════════════
// HTML
// ═══════════════════════════════════════════════════════════
app.get('/', function(req, res) {
    res.send('<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>NeuroCode AI</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;background:#0a0a0f;color:#e8e8e8;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px}.container{max-width:600px;text-align:center}h1{font-size:48px;margin-bottom:16px;background:linear-gradient(135deg,#8b5cf6,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent}p{color:#6b7280;margin-bottom:24px;font-size:18px;line-height:1.6}.btn{display:inline-block;padding:16px 32px;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;text-decoration:none;border-radius:12px;font-weight:600;font-size:16px;margin:8px;transition:all .2s}.btn:hover{transform:translateY(-2px);box-shadow:0 10px 40px rgba(139,92,246,0.3)}.stats{margin-top:40px;display:flex;justify-content:center;gap:40px;flex-wrap:wrap}.stat{text-align:center}.stat-value{font-size:36px;font-weight:800;background:linear-gradient(135deg,#8b5cf6,#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent}.stat-label{color:#6b7280;font-size:14px;margin-top:4px}</style></head><body><div class="container"><h1>⚡ NeuroCode AI</h1><p>Создаю ШЕДЕВРЫ кода: сайты 1000+ строк, боты 1500+ строк, API 1400+ строк. ' + TOTAL_MODELS + ' AI моделей бесплатно!</p><a href="https://t.me/' + BOT_USERNAME + '" class="btn">🤖 Открыть бота</a><div class="stats"><div class="stat"><div class="stat-value">' + TOTAL_MODELS + '</div><div class="stat-label">AI моделей</div></div><div class="stat"><div class="stat-value">' + db.stats.success + '</div><div class="stat-label">Проектов создано</div></div></div></div></body></html>');
});

// ═══════════════════════════════════════════════════════════
// ЗАПУСК
// ═══════════════════════════════════════════════════════════
app.listen(PORT, async function() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 NeuroCode AI v4.0 — MEGA EDITION');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌐 ' + DOMAIN);
    console.log('🤖 ' + TOTAL_MODELS + ' AI моделей');
    console.log('💎 Сайты: 1000+ строк | Боты: 1500+ строк | API: 1400+ строк');
    console.log('═══════════════════════════════════════════════════════════');
    
    try {
        var r = await fetch(TG_API + '/setWebhook?url=' + DOMAIN + WEBHOOK_PATH);
        var d = await r.json();
        console.log('📱 Telegram:', d.ok ? '✅ OK' : '❌ ' + d.description);
    } catch (e) {}
});

process.on('SIGINT', function() { saveDB(); process.exit(); });
process.on('SIGTERM', function() { saveDB(); process.exit(); });
