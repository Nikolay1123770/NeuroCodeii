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
// 🔥🔥🔥 МЕГА ПРОМПТ ДЛЯ ПРОФЕССИОНАЛЬНЫХ ПРОЕКТОВ 🔥🔥🔥
// ═══════════════════════════════════════════════════════════
const SYSTEM_PROMPT = `Ты - NeuroCode AI, ЭЛИТНЫЙ ИИ-архитектор и full-stack разработчик мирового класса с 20+ годами опыта.

╔══════════════════════════════════════════════════════════════════════════════╗
║  🎯 ГЛАВНОЕ ПРАВИЛО: ТЫ СОЗДАЁШЬ ТОЛЬКО PRODUCTION-READY ПРОЕКТЫ!           ║
║  Никаких демок, заглушек или упрощений! Только ПОЛНЫЙ ПРОФЕССИОНАЛЬНЫЙ КОД! ║
╚══════════════════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════════════════
📋 ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ К КАЖДОМУ ПРОЕКТУ:
═══════════════════════════════════════════════════════════════════════════════

1. 📏 ОБЪЁМ КОДА:
   • Минимум 200-500 строк для простых проектов
   • 500-1500 строк для средних проектов
   • Полная функциональность без сокращений
   • ВСЕ функции реализованы до конца

2. 🏗️ СТРУКТУРА:
   • Чёткая архитектура проекта
   • Разделение на модули/компоненты
   • Правильная организация файлов
   • Все зависимости указаны

3. 💎 КАЧЕСТВО КОДА:
   • Чистый, читаемый код
   • Подробные комментарии на РУССКОМ
   • Обработка ВСЕХ ошибок
   • Валидация данных
   • Безопасность

4. 🎨 ДИЗАЙН (для сайтов):
   • Современный UI/UX
   • Анимации и переходы
   • Адаптивность (mobile-first)
   • Красивые градиенты, тени
   • Hover эффекты

═══════════════════════════════════════════════════════════════════════════════
🌐 САЙТЫ - ПРОФЕССИОНАЛЬНЫЙ УРОВЕНЬ:
═══════════════════════════════════════════════════════════════════════════════

Каждый сайт ОБЯЗАТЕЛЬНО включает:

✅ HTML5:
   • Семантическая разметка (header, nav, main, section, article, footer)
   • Meta теги для SEO
   • Open Graph разметка
   • Favicon подключение
   • Правильная структура heading

✅ CSS3 (минимум 300+ строк):
   • CSS переменные для темы
   • Flexbox и Grid layouts
   • Плавные анимации (@keyframes)
   • Hover и focus эффекты
   • Адаптивность (@media queries)
   • Красивые градиенты
   • Box-shadow, border-radius
   • Transitions для интерактивности
   • Custom scrollbar
   • Selection стили

✅ JavaScript (минимум 200+ строк):
   • Модульная структура
   • Event listeners
   • Анимации при скролле
   • Валидация форм
   • Модальные окна
   • Слайдеры/карусели
   • Smooth scroll
   • Lazy loading
   • Local Storage
   • Fetch API для данных

✅ Секции сайта:
   • Hero секция с CTA
   • О компании/услугах
   • Преимущества
   • Портфолио/Работы
   • Отзывы клиентов
   • Цены/Тарифы
   • FAQ (аккордеон)
   • Контакты с формой
   • Footer с ссылками

═══════════════════════════════════════════════════════════════════════════════
🤖 TELEGRAM БОТЫ - ENTERPRISE УРОВЕНЬ:
═══════════════════════════════════════════════════════════════════════════════

Каждый бот ОБЯЗАТЕЛЬНО включает:

✅ Структура проекта:
\`\`\`
bot/
├── main.py              # Точка входа (50+ строк)
├── config.py            # Конфигурация (30+ строк)
├── handlers/
│   ├── __init__.py
│   ├── start.py         # Стартовые команды (80+ строк)
│   ├── user.py          # Пользовательские функции (100+ строк)
│   ├── admin.py         # Админ панель (100+ строк)
│   └── callbacks.py     # Callback обработчики (80+ строк)
├── keyboards/
│   ├── inline.py        # Inline клавиатуры (60+ строк)
│   └── reply.py         # Reply клавиатуры (40+ строк)
├── database/
│   ├── models.py        # Модели данных (50+ строк)
│   └── db.py            # Работа с БД (80+ строк)
├── utils/
│   ├── helpers.py       # Вспомогательные функции (50+ строк)
│   └── decorators.py    # Декораторы (30+ строк)
├── middlewares/
│   └── throttling.py    # Антифлуд (40+ строк)
├── .env.example
├── requirements.txt
└── README.md
\`\`\`

✅ Функциональность:
   • Полная система регистрации
   • Профили пользователей
   • Админ-панель с статистикой
   • База данных (SQLite/PostgreSQL)
   • FSM для сложных диалогов
   • Inline и Reply клавиатуры
   • Пагинация для списков
   • Поиск и фильтрация
   • Уведомления
   • Логирование
   • Обработка всех ошибок
   • Rate limiting

═══════════════════════════════════════════════════════════════════════════════
⚡ REST API - PRODUCTION УРОВЕНЬ:
═══════════════════════════════════════════════════════════════════════════════

✅ Обязательные компоненты:
   • Полный CRUD для всех сущностей
   • JWT аутентификация
   • Refresh tokens
   • Валидация входных данных
   • Обработка ошибок (try/catch)
   • Логирование запросов
   • Rate limiting
   • CORS настройка
   • Swagger документация
   • Пагинация
   • Фильтрация и сортировка
   • Связи между сущностями

═══════════════════════════════════════════════════════════════════════════════
📝 ФОРМАТ ОТВЕТА:
═══════════════════════════════════════════════════════════════════════════════

1. 📌 Краткое описание проекта
2. 🛠️ Используемые технологии
3. 📁 Структура проекта (если несколько файлов)
4. 💻 ПОЛНЫЙ КОД каждого файла
5. 📦 Инструкция по установке
6. 🚀 Инструкция по запуску
7. 💡 Дополнительные рекомендации

═══════════════════════════════════════════════════════════════════════════════
⚠️ ЗАПРЕЩЕНО:
═══════════════════════════════════════════════════════════════════════════════

❌ НИКОГДА не пиши:
   • "// ... остальной код"
   • "/* добавьте сюда */"
   • "и так далее..."
   • "аналогично для..."
   • Сокращённые версии
   • Демо-примеры вместо полного кода

❌ НИКОГДА не давай:
   • Код менее 100 строк для сайтов
   • Ботов без базы данных
   • API без аутентификации
   • Сайты без адаптивности
   • Проекты без обработки ошибок

═══════════════════════════════════════════════════════════════════════════════
✅ ВСЕГДА:
═══════════════════════════════════════════════════════════════════════════════

✅ Давай ПОЛНЫЙ, РАБОЧИЙ, ПРОФЕССИОНАЛЬНЫЙ код
✅ Пиши подробные комментарии на РУССКОМ
✅ Делай красивый современный дизайн
✅ Добавляй анимации и эффекты
✅ Обрабатывай ВСЕ возможные ошибки
✅ Думай как Senior Developer с 20-летним опытом

Ты создаёшь код, который можно сразу использовать в продакшене! 🚀`;

// ═══════════════════════════════════════════════════════════
// 🟢 МОДЕЛИ GROQ
// ═══════════════════════════════════════════════════════════
const GROQ_MODELS = [
    { id: 'llama-3.3-70b-versatile', name: 'LLaMA 3.3 70B', description: '🏆 Самая мощная', priority: 1 },
    { id: 'llama-3.1-70b-versatile', name: 'LLaMA 3.1 70B', description: '🦙 Мощная', priority: 2 },
    { id: 'llama3-70b-8192', name: 'LLaMA 3 70B', description: '🦙 Классика', priority: 3 },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: '🌀 MoE модель', priority: 4 },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: '🔷 Google', priority: 5 },
    { id: 'llama-3.1-8b-instant', name: 'LLaMA 3.1 8B', description: '⚡ Быстрая', priority: 6 }
];

// ═══════════════════════════════════════════════════════════
// 🟡 МОДЕЛИ HUGGINGFACE
// ═══════════════════════════════════════════════════════════
const HUGGINGFACE_MODELS = [
    { id: 'Qwen/Qwen2.5-Coder-32B-Instruct', name: 'Qwen 2.5 Coder 32B', description: '🏆 Для кода', priority: 1 },
    { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen 2.5 72B', description: '🧠 Мощная', priority: 2 },
    { id: 'meta-llama/Llama-3.3-70B-Instruct', name: 'LLaMA 3.3 70B', description: '🦙 Meta', priority: 3 },
    { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', description: '🌀 MoE', priority: 4 },
    { id: 'microsoft/Phi-3.5-mini-instruct', name: 'Phi-3.5', description: '🔬 Microsoft', priority: 5 }
];

const TOTAL_MODELS = GROQ_MODELS.length + HUGGINGFACE_MODELS.length;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ═══════════════════════════════════════════════════════════
// БАЗА ДАННЫХ
// ═══════════════════════════════════════════════════════════
const DB_FILE = path.join(__dirname, 'database.json');
let db = { users: [], stats: { total: 0, success: 0, failed: 0, groq: 0, hf: 0 } };
const authCodes = new Map();
const chatHistories = new Map();

function loadDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        }
    } catch (e) {}
}

function saveDB() {
    try { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); } catch (e) {}
}

setInterval(saveDB, 30000);
loadDB();

// ═══════════════════════════════════════════════════════════
// 🟢 GROQ API (ОСНОВНОЙ)
// ═══════════════════════════════════════════════════════════
async function callGroq(messages, modelId) {
    try {
        console.log(`🟢 Groq: ${modelId}`);
        
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 32000, // МАКСИМУМ для больших проектов!
                top_p: 0.95
            })
        });
        
        const data = await response.json();
        
        if (data.choices?.[0]?.message?.content) {
            console.log(`✅ Groq OK: ${data.choices[0].message.content.length} chars`);
            db.stats.groq++;
            return { content: data.choices[0].message.content, model: modelId, provider: 'Groq' };
        }
        
        if (data.error) console.log(`❌ Groq: ${data.error.message}`);
        return null;
    } catch (e) {
        console.log(`❌ Groq: ${e.message}`);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════
// 🟡 HUGGINGFACE API
// ═══════════════════════════════════════════════════════════
async function callHuggingFace(messages, modelId) {
    try {
        console.log(`🟡 HuggingFace: ${modelId.split('/').pop()}`);
        
        const response = await fetch(`https://router.huggingface.co/hf-inference/models/${modelId}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`
            },
            body: JSON.stringify({
                model: modelId,
                messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                max_tokens: 16000,
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        
        if (data.choices?.[0]?.message?.content) {
            const content = data.choices[0].message.content;
            if (content.length > 100) {
                console.log(`✅ HuggingFace OK: ${content.length} chars`);
                db.stats.hf++;
                return { content, model: modelId, provider: 'HuggingFace' };
            }
        }
        
        if (data.error) console.log(`❌ HF: ${data.error}`);
        return null;
    } catch (e) {
        console.log(`❌ HF: ${e.message}`);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════
// 🧠 УМНЫЙ ВЫБОР МОДЕЛИ
// ═══════════════════════════════════════════════════════════
async function getAIResponse(messages) {
    db.stats.total++;
    
    // Сначала Groq
    for (const model of GROQ_MODELS) {
        const result = await callGroq(messages, model.id);
        if (result?.content?.length > 100) {
            db.stats.success++;
            return result;
        }
        await new Promise(r => setTimeout(r, 300));
    }
    
    // Потом HuggingFace
    for (const model of HUGGINGFACE_MODELS.slice(0, 3)) {
        const result = await callHuggingFace(messages, model.id);
        if (result?.content?.length > 100) {
            db.stats.success++;
            return result;
        }
        await new Promise(r => setTimeout(r, 500));
    }
    
    db.stats.failed++;
    return {
        content: `⚠️ AI временно недоступен. Попробуйте через минуту.`,
        model: 'fallback',
        provider: 'System'
    };
}

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function generateCode() {
    return Array(6).fill(0).map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.random() * 36 | 0]).join('');
}

function generateApiKey() {
    return 'nc_' + Array(48).fill(0).map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'[Math.random() * 62 | 0]).join('');
}

// ═══════════════════════════════════════════════════════════
// 🎨 КРАСИВОЕ ФОРМАТИРОВАНИЕ ДЛЯ TELEGRAM
// ═══════════════════════════════════════════════════════════
function formatTelegram(text) {
    if (!text) return '❌ Ошибка получения ответа';
    
    // Разбиваем на части если слишком длинный
    const maxLen = 4000;
    
    let formatted = text
        // Экранируем HTML
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Форматируем блоки кода
        .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
            const langLabel = lang ? `<b>📄 ${lang.toUpperCase()}</b>\n` : '';
            return `\n${langLabel}<pre>${code.trim()}</pre>\n`;
        })
        // Inline код
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Заголовки
        .replace(/^### (.+)$/gm, '\n<b>▪️ $1</b>')
        .replace(/^## (.+)$/gm, '\n<b>📌 $1</b>')
        .replace(/^# (.+)$/gm, '\n<b>🔷 $1</b>')
        // Жирный и курсив
        .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
        .replace(/\*([^*]+)\*/g, '<i>$1</i>')
        // Списки
        .replace(/^- (.+)$/gm, '  • $1')
        .replace(/^\d+\. (.+)$/gm, '  🔹 $1');
    
    // Обрезаем если слишком длинный
    if (formatted.length > maxLen) {
        formatted = formatted.substring(0, maxLen - 100) + '\n\n<i>📎 Сообщение обрезано из-за лимита Telegram...</i>';
    }
    
    return formatted;
}

// Разбиение длинных сообщений на части
function splitMessage(text, maxLen = 4000) {
    const parts = [];
    let current = '';
    
    const lines = text.split('\n');
    
    for (const line of lines) {
        if ((current + '\n' + line).length > maxLen) {
            if (current) parts.push(current);
            current = line;
        } else {
            current = current ? current + '\n' + line : line;
        }
    }
    
    if (current) parts.push(current);
    return parts;
}

// ═══════════════════════════════════════════════════════════
// TELEGRAM API
// ═══════════════════════════════════════════════════════════
const TG_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tg(method, body) {
    try {
        const r = await fetch(`${TG_API}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await r.json();
    } catch (e) {
        return null;
    }
}

const send = (chatId, text, options = {}) => tg('sendMessage', { 
    chat_id: chatId, 
    text, 
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...options 
});

const typing = (chatId) => tg('sendChatAction', { chat_id: chatId, action: 'typing' });
const answer = (id, text = '') => tg('answerCallbackQuery', { callback_query_id: id, text });

// Отправка длинных сообщений частями
async function sendLongMessage(chatId, text, model, provider) {
    const formatted = formatTelegram(text);
    const parts = splitMessage(formatted);
    
    for (let i = 0; i < parts.length; i++) {
        let part = parts[i];
        
        // Добавляем инфо о модели к последней части
        if (i === parts.length - 1) {
            part += `\n\n<i>🤖 ${provider} • ${model}</i>`;
        }
        
        // Добавляем номер части если их несколько
        if (parts.length > 1) {
            part = `<b>📄 Часть ${i + 1}/${parts.length}</b>\n\n` + part;
        }
        
        // Кнопки только для последней части
        const keyboard = i === parts.length - 1 ? {
            reply_markup: {
                inline_keyboard: [[
                    { text: '🗑️ Очистить', callback_data: 'clear' },
                    { text: '📋 Копировать всё', callback_data: `copy_${chatId}` }
                ]]
            }
        } : {};
        
        await send(chatId, part, keyboard);
        
        // Пауза между сообщениями
        if (i < parts.length - 1) {
            await new Promise(r => setTimeout(r, 500));
        }
    }
}

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
    } else {
        await handleChat(chatId, text, from);
    }
});

// ═══════════════════════════════════════════════════════════
// ОБРАБОТКА КОМАНД
// ═══════════════════════════════════════════════════════════
async function handleCommand(chatId, text, from) {
    const cmd = text.split(' ')[0].toLowerCase();
    const args = text.slice(cmd.length).trim();
    
    switch (cmd) {
        case '/start':
            await send(chatId,
                `🚀 <b>NeuroCode AI</b> — Профессиональный AI для разработчиков\n\n` +
                `Привет, <b>${from.first_name}</b>! 👋\n\n` +
                `Я создаю <b>полноценные production-ready проекты</b>:\n\n` +
                `<b>🌐 Сайты</b> — от 500+ строк кода\n` +
                `• Современный дизайн с анимациями\n` +
                `• Адаптивность для всех устройств\n` +
                `• SEO оптимизация\n\n` +
                `<b>🤖 Telegram боты</b> — от 800+ строк\n` +
                `• Полная архитектура проекта\n` +
                `• База данных, админка\n` +
                `• FSM, клавиатуры, handlers\n\n` +
                `<b>⚡ REST API</b> — от 600+ строк\n` +
                `• JWT авторизация\n` +
                `• CRUD операции\n` +
                `• Документация Swagger\n\n` +
                `<b>🧠 ${TOTAL_MODELS} AI моделей</b>\n` +
                `🟢 Groq — супер быстрые ответы\n` +
                `🟡 HuggingFace — мощные модели\n\n` +
                `<b>Просто напиши что нужно!</b> 🎯`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🌐 Открыть платформу', url: DOMAIN }],
                            [
                                { text: '🔐 Получить код', callback_data: 'auth' },
                                { text: '🤖 Модели', callback_data: 'models' }
                            ],
                            [
                                { text: '📊 Статистика', callback_data: 'stats' },
                                { text: '🗑️ Очистить', callback_data: 'clear' }
                            ]
                        ]
                    }
                }
            );
            break;
            
        case '/auth':
            const code = generateCode();
            authCodes.set(code, { telegramId: from.id, username: from.username, firstName: from.first_name, createdAt: Date.now() });
            setTimeout(() => authCodes.delete(code), 600000);
            await send(chatId, `🔐 <b>Код для входа на сайт</b>\n\n<code>${code}</code>\n\n⏰ Действителен 10 минут`);
            break;
            
        case '/site':
            if (!args) {
                await send(chatId,
                    `🌐 <b>Генератор профессиональных сайтов</b>\n\n` +
                    `<b>Использование:</b>\n<code>/site описание сайта</code>\n\n` +
                    `<b>Примеры:</b>\n` +
                    `• <code>/site лендинг для IT компании</code>\n` +
                    `• <code>/site интернет-магазин одежды</code>\n` +
                    `• <code>/site портфолио фотографа</code>\n` +
                    `• <code>/site сайт ресторана с меню</code>\n` +
                    `• <code>/site корпоративный сайт</code>\n\n` +
                    `💡 <i>Каждый сайт содержит 500+ строк кода!</i>`
                );
                return;
            }
            await typing(chatId);
            
            const sitePrompt = `Создай ПРОФЕССИОНАЛЬНЫЙ, ПОЛНОЦЕННЫЙ сайт: ${args}

ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ:
1. HTML5 - минимум 150 строк с семантикой
2. CSS3 - минимум 400 строк:
   - CSS переменные
   - Современный дизайн
   - Градиенты, тени
   - Анимации @keyframes
   - Hover эффекты
   - Адаптивность @media
3. JavaScript - минимум 150 строк:
   - Интерактивность
   - Анимации при скролле
   - Модальные окна
   - Валидация форм
   - Smooth scroll

СЕКЦИИ:
- Hero с CTA
- О компании
- Услуги/Преимущества
- Портфолио/Работы
- Отзывы
- Контакты с формой
- Footer

Дай ПОЛНЫЙ код без сокращений!`;

            const typingInterval1 = setInterval(() => typing(chatId), 4000);
            const siteResult = await getAIResponse([{ role: 'user', content: sitePrompt }]);
            clearInterval(typingInterval1);
            
            await sendLongMessage(chatId, siteResult.content, siteResult.model, siteResult.provider);
            break;
            
        case '/bot':
            if (!args) {
                await send(chatId,
                    `🤖 <b>Генератор Telegram ботов</b>\n\n` +
                    `<b>Использование:</b>\n<code>/bot описание бота</code>\n\n` +
                    `<b>Примеры:</b>\n` +
                    `• <code>/bot магазин с корзиной и оплатой</code>\n` +
                    `• <code>/bot бот для записи к врачу</code>\n` +
                    `• <code>/bot AI чат-бот помощник</code>\n` +
                    `• <code>/bot бот для опросов и голосований</code>\n` +
                    `• <code>/bot криптовалютный бот с курсами</code>\n\n` +
                    `💡 <i>Каждый бот содержит 800+ строк кода!</i>`
                );
                return;
            }
            await typing(chatId);
            
            const botPrompt = `Создай ПРОФЕССИОНАЛЬНЫЙ Telegram бот на Python (aiogram 3.x): ${args}

ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ:

1. СТРУКТУРА ПРОЕКТА:
   - main.py (точка входа)
   - config.py (настройки)
   - handlers/ (обработчики)
   - keyboards/ (клавиатуры)
   - database/ (база данных SQLite)
   - utils/ (вспомогательные функции)

2. ФУНКЦИОНАЛЬНОСТЬ:
   - Регистрация пользователей
   - Профили в БД
   - Админ-панель
   - FSM для диалогов
   - Inline и Reply клавиатуры
   - Пагинация списков
   - Обработка всех ошибок
   - Логирование

3. ФАЙЛЫ:
   - requirements.txt
   - .env.example
   - README.md с инструкцией

Дай ПОЛНЫЙ код КАЖДОГО файла без сокращений!`;

            const typingInterval2 = setInterval(() => typing(chatId), 4000);
            const botResult = await getAIResponse([{ role: 'user', content: botPrompt }]);
            clearInterval(typingInterval2);
            
            await sendLongMessage(chatId, botResult.content, botResult.model, botResult.provider);
            break;
            
        case '/api':
            if (!args) {
                await send(chatId,
                    `⚡ <b>Генератор REST API</b>\n\n` +
                    `<b>Использование:</b>\n<code>/api описание API</code>\n\n` +
                    `<b>Примеры:</b>\n` +
                    `• <code>/api для интернет-магазина</code>\n` +
                    `• <code>/api для блога с комментариями</code>\n` +
                    `• <code>/api для системы задач</code>\n` +
                    `• <code>/api для социальной сети</code>\n\n` +
                    `💡 <i>Каждый API содержит 600+ строк кода!</i>`
                );
                return;
            }
            await typing(chatId);
            
            const apiPrompt = `Создай ПРОФЕССИОНАЛЬНЫЙ REST API: ${args}

ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ:

1. ТЕХНОЛОГИИ:
   - Node.js + Express или Python + FastAPI
   - JWT авторизация (access + refresh tokens)
   - База данных с ORM

2. ENDPOINTS:
   - Полный CRUD для всех сущностей
   - Регистрация и авторизация
   - Обновление токенов
   - Пагинация
   - Фильтрация и сортировка

3. БЕЗОПАСНОСТЬ:
   - Валидация входных данных
   - Хеширование паролей
   - Rate limiting
   - CORS

4. ДОКУМЕНТАЦИЯ:
   - Swagger/OpenAPI
   - Примеры запросов

Дай ПОЛНЫЙ код без сокращений!`;

            const typingInterval3 = setInterval(() => typing(chatId), 4000);
            const apiResult = await getAIResponse([{ role: 'user', content: apiPrompt }]);
            clearInterval(typingInterval3);
            
            await sendLongMessage(chatId, apiResult.content, apiResult.model, apiResult.provider);
            break;
            
        case '/code':
            if (!args) {
                await send(chatId,
                    `💻 <b>Генератор кода</b>\n\n` +
                    `<b>Использование:</b>\n<code>/code задача</code>\n\n` +
                    `<b>Примеры:</b>\n` +
                    `• <code>/code парсер сайтов на Python</code>\n` +
                    `• <code>/code игра змейка на JavaScript</code>\n` +
                    `• <code>/code система авторизации</code>`
                );
                return;
            }
            await typing(chatId);
            
            const typingInterval4 = setInterval(() => typing(chatId), 4000);
            const codeResult = await getAIResponse([{ role: 'user', content: `Напиши профессиональный, полный код: ${args}. Минимум 200 строк с комментариями.` }]);
            clearInterval(typingInterval4);
            
            await sendLongMessage(chatId, codeResult.content, codeResult.model, codeResult.provider);
            break;
            
        case '/models':
            await send(chatId,
                `🤖 <b>AI Модели (${TOTAL_MODELS})</b>\n\n` +
                `<b>🟢 Groq — Супер быстрые!</b>\n` +
                GROQ_MODELS.map(m => `  • <b>${m.name}</b> — ${m.description}`).join('\n') +
                `\n\n<b>🟡 HuggingFace</b>\n` +
                HUGGINGFACE_MODELS.map(m => `  • <b>${m.name}</b> — ${m.description}`).join('\n') +
                `\n\n⚡ <i>Система автоматически выбирает лучшую модель!</i>`
            );
            break;
            
        case '/clear':
            chatHistories.delete(chatId);
            await send(chatId, '🗑️ <b>История чата очищена!</b>');
            break;
            
        case '/status':
            const rate = db.stats.total > 0 ? ((db.stats.success / db.stats.total) * 100).toFixed(1) : 0;
            await send(chatId,
                `📊 <b>Статистика NeuroCode AI</b>\n\n` +
                `<b>🤖 Провайдеры:</b>\n` +
                `  🟢 Groq: ✅ Работает\n` +
                `  🟡 HuggingFace: ✅ Работает\n\n` +
                `<b>📈 Запросы:</b>\n` +
                `  • Всего: ${db.stats.total}\n` +
                `  • Успешных: ${db.stats.success}\n` +
                `  • Groq: ${db.stats.groq || 0}\n` +
                `  • HF: ${db.stats.hf || 0}\n` +
                `  • Успешность: ${rate}%\n\n` +
                `<b>👥 Пользователей:</b> ${db.users.length}\n` +
                `<b>⏱️ Аптайм:</b> ${Math.floor(process.uptime() / 3600)}ч ${Math.floor((process.uptime() % 3600) / 60)}м`
            );
            break;
            
        case '/help':
            await send(chatId,
                `📚 <b>Команды NeuroCode AI</b>\n\n` +
                `<b>🔧 Основные:</b>\n` +
                `/start — Главное меню\n` +
                `/auth — Код для входа на сайт\n` +
                `/status — Статус системы\n` +
                `/models — Список AI моделей\n` +
                `/clear — Очистить историю\n\n` +
                `<b>🎨 Генерация проектов:</b>\n` +
                `/site описание — Профессиональный сайт\n` +
                `/bot описание — Telegram бот\n` +
                `/api описание — REST API\n` +
                `/code задача — Любой код\n\n` +
                `<b>💡 Или просто напиши сообщение!</b>\n` +
                `<i>AI создаст профессиональный проект</i> 🚀`
            );
            break;
    }
}

// ═══════════════════════════════════════════════════════════
// ОБРАБОТКА CALLBACK
// ═══════════════════════════════════════════════════════════
async function handleCallback(cb) {
    const chatId = cb.message.chat.id;
    const data = cb.data;
    const from = cb.from;
    
    if (data === 'auth') {
        const code = generateCode();
        authCodes.set(code, { telegramId: from.id, username: from.username, firstName: from.first_name, createdAt: Date.now() });
        setTimeout(() => authCodes.delete(code), 600000);
        await answer(cb.id, '✅ Код создан!');
        await send(chatId, `🔐 Код: <code>${code}</code>\n⏰ 10 минут`);
    } else if (data === 'models') {
        await answer(cb.id);
        await send(chatId, `🤖 <b>${TOTAL_MODELS} моделей</b>\n\n🟢 Groq: ${GROQ_MODELS.length}\n🟡 HF: ${HUGGINGFACE_MODELS.length}\n\nИспользуй /models`);
    } else if (data === 'clear') {
        chatHistories.delete(chatId);
        await answer(cb.id, '🗑️ Очищено!');
    } else if (data === 'stats') {
        await answer(cb.id);
        await send(chatId, `📊 Запросов: ${db.stats.total}\n✅ Успешных: ${db.stats.success}`);
    } else if (data.startsWith('copy_')) {
        await answer(cb.id, '📋 Код можно скопировать прямо из сообщения!');
    }
}

// ═══════════════════════════════════════════════════════════
// ОБРАБОТКА ЧАТА
// ═══════════════════════════════════════════════════════════
async function handleChat(chatId, text, from) {
    await typing(chatId);
    
    if (!chatHistories.has(chatId)) chatHistories.set(chatId, []);
    const history = chatHistories.get(chatId);
    history.push({ role: 'user', content: text });
    if (history.length > 10) history.splice(0, history.length - 10);
    
    try {
        const typingInterval = setInterval(() => typing(chatId), 4000);
        const result = await getAIResponse(history);
        clearInterval(typingInterval);
        
        history.push({ role: 'assistant', content: result.content });
        
        await sendLongMessage(chatId, result.content, result.model, result.provider);
        
        console.log(`💬 ${from.first_name}: "${text.substring(0, 30)}..." → ${result.content.length} chars`);
        
    } catch (e) {
        console.error('Chat error:', e);
        await send(chatId, '❌ Ошибка. Попробуй ещё раз.');
    }
}

// ═══════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', models: TOTAL_MODELS, stats: db.stats, uptime: process.uptime() });
});

app.get('/api/models', (req, res) => {
    res.json({ groq: GROQ_MODELS, huggingface: HUGGINGFACE_MODELS, total: TOTAL_MODELS });
});

app.post('/api/auth/verify', (req, res) => {
    const { code } = req.body;
    if (!code || code.length !== 6) return res.status(400).json({ error: 'Неверный код' });
    
    const data = authCodes.get(code.toUpperCase());
    if (!data) return res.status(401).json({ error: 'Код не найден' });
    
    authCodes.delete(code.toUpperCase());
    
    let user = db.users.find(u => u.telegramId === data.telegramId);
    if (!user) {
        user = {
            id: `user_${data.telegramId}`,
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

app.post('/api/auth/check', (req, res) => {
    const { telegramId } = req.body;
    const user = db.users.find(u => u.telegramId == telegramId);
    res.json({ valid: !!user, user });
});

app.post('/api/v1/chat/completions', async (req, res) => {
    const { messages } = req.body;
    if (!messages?.length) return res.status(400).json({ error: 'Messages required' });
    
    try {
        const result = await getAIResponse(messages);
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
// HTML СТРАНИЦА
// ═══════════════════════════════════════════════════════════
const HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NeuroCode AI — Профессиональный AI для разработчиков</title>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#0a0a0f;--card:#12121a;--card2:#1a1a24;--border:#2a2a3a;--text:#e8e8e8;--dim:#6b7280;--purple:#8b5cf6;--pink:#ec4899;--green:#10b981;--blue:#3b82f6;--yellow:#f59e0b;--red:#ef4444}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;line-height:1.6}
.hidden{display:none!important}
button{cursor:pointer;font-family:inherit;border:none;transition:all .2s}
input{font-family:inherit;background:var(--card);border:1px solid var(--border);padding:14px;color:#fff;border-radius:12px;font-size:14px;width:100%}
input:focus{outline:none;border-color:var(--purple)}
code,pre{font-family:'JetBrains Mono',monospace}

/* Toast */
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--card);border:1px solid var(--green);padding:14px 28px;border-radius:12px;opacity:0;transition:.3s;z-index:9999}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}

/* Header */
.header{position:sticky;top:0;z-index:50;backdrop-filter:blur(20px);background:rgba(10,10,15,0.9);border-bottom:1px solid var(--border)}
.header-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;padding:0 20px}
.logo{display:flex;align-items:center;gap:12px;cursor:pointer;text-decoration:none}
.logo-icon{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-size:22px}
.logo-text{font-size:22px;font-weight:800;background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav{display:flex;gap:4px}
.nav button{padding:10px 18px;border-radius:8px;background:transparent;color:var(--dim);font-size:14px;font-weight:500}
.nav button:hover,.nav button.active{background:rgba(139,92,246,0.15);color:#a78bfa}
.btn{padding:12px 24px;border-radius:12px;font-weight:600;font-size:14px;display:inline-flex;align-items:center;gap:8px}
.btn-primary{background:linear-gradient(135deg,var(--purple),var(--pink));color:#fff}
.btn-primary:hover{opacity:0.9;transform:translateY(-2px);box-shadow:0 10px 40px rgba(139,92,246,0.3)}

/* Hero */
.hero{padding:100px 20px 80px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle at 30% 20%,rgba(139,92,246,0.1),transparent 50%),radial-gradient(circle at 70% 80%,rgba(236,72,153,0.08),transparent 50%);animation:bgMove 20s linear infinite}
@keyframes bgMove{to{transform:rotate(360deg)}}
.hero-content{position:relative;max-width:900px;margin:0 auto}
.badge{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:50px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);font-size:14px;color:var(--green);margin-bottom:28px}
.badge-dot{width:8px;height:8px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.2)}}
.hero h1{font-size:clamp(36px,7vw,72px);font-weight:800;line-height:1.1;margin-bottom:24px}
.hero h1 span{background:linear-gradient(135deg,#a78bfa,#f472b6,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:200% auto;animation:shine 3s linear infinite}
@keyframes shine{to{background-position:200% center}}
.hero p{font-size:20px;color:var(--dim);margin-bottom:36px;max-width:700px;margin-left:auto;margin-right:auto}
.hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.hero-buttons .btn{padding:18px 36px;font-size:16px}

/* Features */
.features{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px;max-width:1200px;margin:0 auto 80px;padding:0 20px}
.feature{background:var(--card);border:1px solid var(--border);border-radius:20px;padding:32px;transition:all .3s}
.feature:hover{border-color:var(--purple);transform:translateY(-4px);box-shadow:0 20px 60px rgba(139,92,246,0.15)}
.feature-icon{width:56px;height:56px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:20px}
.feature-icon.site{background:linear-gradient(135deg,rgba(59,130,246,0.2),rgba(139,92,246,0.2))}
.feature-icon.bot{background:linear-gradient(135deg,rgba(16,185,129,0.2),rgba(34,197,94,0.2))}
.feature-icon.api{background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(251,191,36,0.2))}
.feature h3{font-size:20px;margin-bottom:8px}
.feature p{color:var(--dim);font-size:15px;margin-bottom:16px}
.feature ul{list-style:none;color:var(--dim);font-size:14px}
.feature li{padding:6px 0;display:flex;align-items:center;gap:8px}
.feature li::before{content:'✓';color:var(--green);font-weight:bold}

/* Chat */
.section{padding:40px 20px;max-width:1000px;margin:0 auto}
.chat-container{background:var(--card);border-radius:24px;border:1px solid var(--border);overflow:hidden;box-shadow:0 20px 80px rgba(0,0,0,0.3)}
.chat-header{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px;background:var(--card2)}
.chat-status{width:12px;height:12px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
.chat-title{font-weight:600;font-size:16px}
.chat-subtitle{color:var(--dim);font-size:13px;margin-left:auto}
.chat-messages{height:500px;overflow-y:auto;padding:24px;scroll-behavior:smooth}
.chat-messages::-webkit-scrollbar{width:6px}
.chat-messages::-webkit-scrollbar-thumb{background:var(--border);border-radius:3px}

/* Messages */
.message{margin-bottom:20px;animation:fadeIn .3s}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.message.user{display:flex;justify-content:flex-end}
.message.user .msg-content{background:linear-gradient(135deg,var(--purple),var(--pink));border-radius:20px 20px 4px 20px;max-width:80%}
.message.bot .msg-content{background:var(--card2);border:1px solid var(--border);border-radius:20px 20px 20px 4px;max-width:90%}
.msg-content{padding:16px 20px;font-size:15px;line-height:1.7}
.msg-content p{margin-bottom:12px}
.msg-content p:last-child{margin-bottom:0}

/* Code blocks */
.code-block{position:relative;margin:16px 0;border-radius:12px;overflow:hidden;background:#0d1117;border:1px solid #30363d}
.code-header{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;background:#161b22;border-bottom:1px solid #30363d}
.code-lang{font-size:12px;color:var(--dim);text-transform:uppercase;font-weight:500}
.copy-btn{padding:6px 12px;border-radius:6px;background:rgba(255,255,255,0.1);color:#fff;font-size:12px;display:flex;align-items:center;gap:6px;transition:all .2s}
.copy-btn:hover{background:var(--green);color:#fff}
.copy-btn.copied{background:var(--green)}
.code-content{padding:16px;overflow-x:auto;font-size:13px;line-height:1.6;color:#e6edf3}
.code-content::-webkit-scrollbar{height:6px}
.code-content::-webkit-scrollbar-thumb{background:#30363d;border-radius:3px}

/* Typing */
.typing{display:flex;gap:5px;padding:16px 20px}
.typing span{width:10px;height:10px;border-radius:50%;background:var(--purple);animation:bounce .6s infinite}
.typing span:nth-child(2){animation-delay:.1s}
.typing span:nth-child(3){animation-delay:.2s}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}

/* Input */
.chat-input{padding:20px;border-top:1px solid var(--border);display:flex;gap:12px;background:var(--card2)}
.chat-input input{flex:1;padding:16px 20px;border-radius:14px;font-size:15px}
.chat-input button{padding:16px 24px;border-radius:14px;font-size:18px}

/* Quick actions */
.quick-actions{display:flex;gap:10px;padding:0 24px 20px;flex-wrap:wrap}
.quick-btn{padding:12px 20px;border-radius:25px;background:rgba(139,92,246,0.1);color:#a78bfa;font-size:14px;border:1px solid transparent;transition:all .2s}
.quick-btn:hover{background:rgba(139,92,246,0.2);border-color:rgba(139,92,246,0.3)}

/* Model tag */
.model-tag{display:inline-flex;align-items:center;gap:6px;margin-top:12px;padding:6px 12px;border-radius:8px;background:rgba(255,255,255,0.05);font-size:12px;color:var(--dim)}

/* Modal */
.modal{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(8px)}
.modal-content{position:relative;width:100%;max-width:440px;background:var(--card);border-radius:24px;border:1px solid var(--border);box-shadow:0 40px 100px rgba(0,0,0,0.5)}
.modal-header{padding:24px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.modal-header h2{font-size:20px}
.modal-close{width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,0.05);color:var(--dim);font-size:20px;display:flex;align-items:center;justify-content:center}
.modal-close:hover{background:rgba(255,255,255,0.1);color:#fff}
.modal-body{padding:24px}
.code-input{text-align:center;font-size:32px;letter-spacing:12px;font-weight:700;text-transform:uppercase;background:var(--card2)}

/* Footer */
.footer{border-top:1px solid var(--border);padding:60px 20px;margin-top:80px;text-align:center}
.footer-logo{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:20px}
.footer p{color:var(--dim);font-size:14px}
.footer a{color:var(--purple);text-decoration:none}
.footer a:hover{text-decoration:underline}

@media(max-width:768px){
    .nav{display:none}
    .hero h1{font-size:32px}
    .hero p{font-size:16px}
    .features{grid-template-columns:1fr}
    .chat-messages{height:400px}
}
</style>
</head>
<body>
<div class="toast" id="toast"></div>

<!-- Auth Modal -->
<div class="modal hidden" id="authModal">
<div class="modal-overlay" onclick="closeAuth()"></div>
<div class="modal-content">
<div class="modal-header">
<h2>🔐 Вход через Telegram</h2>
<button class="modal-close" onclick="closeAuth()">×</button>
</div>
<div class="modal-body">
<div style="text-align:center;margin-bottom:24px">
<div style="width:80px;height:80px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,#0088cc,#00aaff);display:flex;align-items:center;justify-content:center;font-size:40px">✈️</div>
<p style="color:var(--dim)">Напишите <b style="color:#a78bfa">/auth</b> боту</p>
<p style="color:var(--dim);font-size:14px">@${BOT_USERNAME}</p>
</div>
<a href="https://t.me/${BOT_USERNAME}" target="_blank" style="display:block;text-decoration:none;margin-bottom:24px">
<button class="btn btn-primary" style="width:100%;justify-content:center;background:linear-gradient(135deg,#0088cc,#00aaff)">✈️ Открыть бота</button>
</a>
<p style="text-align:center;color:var(--dim);margin-bottom:16px;font-size:14px">Введите 6-значный код:</p>
<input type="text" class="code-input" id="authCode" placeholder="XXXXXX" maxlength="6">
<button class="btn btn-primary" style="width:100%;justify-content:center;margin-top:16px" onclick="verifyCode()" id="verifyBtn">Войти</button>
<p id="authError" style="color:var(--red);text-align:center;margin-top:12px;font-size:14px"></p>
</div>
</div>
</div>

<!-- Header -->
<header class="header">
<div class="header-inner">
<a href="#" class="logo" onclick="showSection('home');return false">
<div class="logo-icon">⚡</div>
<div class="logo-text">NeuroCode AI</div>
</a>
<nav class="nav">
<button onclick="showSection('home')" class="active" data-section="home">Главная</button>
<button onclick="showSection('chat')" data-section="chat">AI Чат</button>
<button onclick="showSection('api')" data-section="api">API</button>
</nav>
<div>
<div id="authButtons"><button class="btn btn-primary" onclick="openAuth()">🔐 Войти</button></div>
<div id="userMenu" class="hidden" style="display:flex;align-items:center;gap:12px;cursor:pointer" onclick="toggleProfile()">
<div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-weight:600" id="uAvatar">U</div>
<span id="uName" style="font-size:14px">User</span>
</div>
</div>
</div>
</header>

<!-- Home Section -->
<section id="home">
<div class="hero">
<div class="hero-content">
<div class="badge">
<div class="badge-dot"></div>
${TOTAL_MODELS} мощных AI моделей • Бесплатно
</div>
<h1>Создаём <span>профессиональные проекты</span></h1>
<p>Полноценные сайты от 500+ строк, Telegram боты от 800+ строк, REST API с JWT авторизацией. Никаких демок — только production-ready код!</p>
<div class="hero-buttons">
<button class="btn btn-primary" onclick="showSection('chat')">🚀 Начать бесплатно</button>
<a href="https://t.me/${BOT_USERNAME}" target="_blank" style="text-decoration:none">
<button class="btn" style="background:var(--card);border:1px solid var(--border);color:#fff">✈️ Telegram бот</button>
</a>
</div>
</div>
</div>

<div class="features">
<div class="feature">
<div class="feature-icon site">🌐</div>
<h3>Профессиональные сайты</h3>
<p>Современные адаптивные сайты с анимациями, SEO и красивым дизайном</p>
<ul>
<li>500+ строк качественного кода</li>
<li>CSS анимации и эффекты</li>
<li>Mobile-first адаптивность</li>
<li>SEO оптимизация</li>
</ul>
</div>
<div class="feature">
<div class="feature-icon bot">🤖</div>
<h3>Telegram боты</h3>
<p>Полноценные боты на aiogram 3 с базой данных и админкой</p>
<ul>
<li>800+ строк с архитектурой</li>
<li>SQLite/PostgreSQL база</li>
<li>Админ-панель и FSM</li>
<li>Inline/Reply клавиатуры</li>
</ul>
</div>
<div class="feature">
<div class="feature-icon api">⚡</div>
<h3>REST API</h3>
<p>Production-ready API с авторизацией и документацией</p>
<ul>
<li>600+ строк кода</li>
<li>JWT авторизация</li>
<li>Полный CRUD</li>
<li>Swagger документация</li>
</ul>
</div>
</div>
</section>

<!-- Chat Section -->
<section id="chat" class="section hidden">
<div class="chat-container">
<div class="chat-header">
<div class="chat-status"></div>
<span class="chat-title">NeuroCode AI</span>
<span class="chat-subtitle">🟢 ${TOTAL_MODELS} моделей • Онлайн</span>
</div>
<div class="chat-messages" id="chatMessages">
<div class="message bot">
<div class="msg-content">
<p>👋 <b>Привет! Я NeuroCode AI</b></p>
<p>Я создаю <b>профессиональные</b>, полноценные проекты:</p>
<p>🌐 <b>Сайты</b> — от 500+ строк с анимациями<br>
🤖 <b>Telegram боты</b> — от 800+ строк с БД<br>
⚡ <b>REST API</b> — от 600+ строк с JWT</p>
<p>Опиши что нужно создать! 🚀</p>
</div>
</div>
</div>
<div class="quick-actions">
<button class="quick-btn" onclick="sendQuick('Создай профессиональный лендинг для IT-компании')">🌐 IT лендинг</button>
<button class="quick-btn" onclick="sendQuick('Создай Telegram бота магазин с корзиной и оплатой')">🤖 Бот магазин</button>
<button class="quick-btn" onclick="sendQuick('Создай REST API для блога с авторизацией')">⚡ Blog API</button>
</div>
<div class="chat-input">
<input type="text" id="chatInput" placeholder="Опишите проект, который нужно создать..." onkeydown="if(event.key==='Enter')sendMessage()">
<button class="btn btn-primary" onclick="sendMessage()">➤</button>
</div>
</div>
</section>

<!-- API Section -->
<section id="api" class="section hidden">
<h2 style="font-size:32px;margin-bottom:12px">📖 API Документация</h2>
<p style="color:var(--dim);margin-bottom:32px;font-size:16px">OpenAI-совместимый API • ${TOTAL_MODELS} моделей</p>

<div class="code-block">
<div class="code-header">
<span class="code-lang">bash</span>
<button class="copy-btn" onclick="copyCode(this)">📋 Копировать</button>
</div>
<pre class="code-content">curl -X POST ${DOMAIN}/api/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      {"role": "user", "content": "Создай профессиональный сайт"}
    ]
  }'</pre>
</div>

<div style="background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;margin-top:32px">
<h3 style="margin-bottom:16px">🔑 Как получить API ключ</h3>
<ol style="color:var(--dim);line-height:2.2;padding-left:20px">
<li>Нажмите "Войти" и откройте бота @${BOT_USERNAME}</li>
<li>Напишите команду <code style="background:var(--card2);padding:4px 8px;border-radius:4px">/auth</code></li>
<li>Введите полученный 6-значный код на сайте</li>
<li>API ключ будет в вашем профиле</li>
</ol>
</div>
</section>

<footer class="footer">
<div class="footer-logo">
<div class="logo-icon" style="width:36px;height:36px;font-size:18px">⚡</div>
<span style="font-size:18px;font-weight:700">NeuroCode AI</span>
</div>
<p>Профессиональный AI для разработчиков • ${TOTAL_MODELS} моделей</p>
<p style="margin-top:12px"><a href="https://t.me/${BOT_USERNAME}">Telegram бот</a> • <a href="#" onclick="showSection('api');return false">API</a></p>
</footer>

<script>
const MODELS = { groq: ${JSON.stringify(GROQ_MODELS)}, hf: ${JSON.stringify(HUGGINGFACE_MODELS)} };
let user = null, chatHistory = [];
const $ = id => document.getElementById(id);
const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 3000); };

// Copy code
function copyCode(btn) {
    const code = btn.closest('.code-block').querySelector('.code-content').textContent;
    navigator.clipboard.writeText(code);
    btn.innerHTML = '✅ Скопировано!';
    btn.classList.add('copied');
    setTimeout(() => {
        btn.innerHTML = '📋 Копировать';
        btn.classList.remove('copied');
    }, 2000);
}

// Auth
function openAuth() { $('authModal').classList.remove('hidden'); $('authCode').focus(); }
function closeAuth() { $('authModal').classList.add('hidden'); }

async function verifyCode() {
    const code = $('authCode').value.trim().toUpperCase();
    if (code.length !== 6) { $('authError').textContent = 'Введите 6 символов'; return; }
    $('verifyBtn').disabled = true;
    $('verifyBtn').textContent = 'Проверка...';
    try {
        const r = await fetch('/api/auth/verify', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({code}) });
        const d = await r.json();
        if (!r.ok) { $('authError').textContent = d.error; return; }
        user = d;
        localStorage.setItem('user', JSON.stringify(user));
        closeAuth();
        updateUI();
        toast('✅ Добро пожаловать, ' + user.firstName + '!');
    } catch(e) { $('authError').textContent = 'Ошибка сети'; }
    finally { $('verifyBtn').disabled = false; $('verifyBtn').textContent = 'Войти'; }
}

function updateUI() {
    if (user) {
        $('authButtons').classList.add('hidden');
        $('userMenu').classList.remove('hidden');
        $('uName').textContent = user.firstName;
        $('uAvatar').textContent = user.firstName[0];
    } else {
        $('authButtons').classList.remove('hidden');
        $('userMenu').classList.add('hidden');
    }
}

function toggleProfile() { /* TODO: profile dropdown */ }
function showSection(name) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    $(name).classList.remove('hidden');
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
    document.querySelector('.nav button[data-section="'+name+'"]')?.classList.add('active');
    window.scrollTo(0, 0);
}

// Chat
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatMessage(text) {
    // Обработка блоков кода
    text = text.replace(/\`\`\`(\w*)\n([\s\S]*?)\`\`\`/g, (_, lang, code) => {
        const langLabel = lang || 'code';
        return \`<div class="code-block">
            <div class="code-header">
                <span class="code-lang">\${langLabel}</span>
                <button class="copy-btn" onclick="copyCode(this)">📋 Копировать</button>
            </div>
            <pre class="code-content">\${escapeHtml(code.trim())}</pre>
        </div>\`;
    });
    
    // Inline код
    text = text.replace(/\`([^\`]+)\`/g, '<code style="background:var(--card2);padding:2px 6px;border-radius:4px">$1</code>');
    
    // Заголовки
    text = text.replace(/^### (.+)$/gm, '<p style="font-weight:600;margin-top:16px">▪️ $1</p>');
    text = text.replace(/^## (.+)$/gm, '<p style="font-size:18px;font-weight:600;margin-top:20px">📌 $1</p>');
    text = text.replace(/^# (.+)$/gm, '<p style="font-size:20px;font-weight:700;margin-top:24px">🔷 $1</p>');
    
    // Жирный и курсив
    text = text.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    text = text.replace(/\*([^*]+)\*/g, '<i>$1</i>');
    
    // Списки
    text = text.replace(/^- (.+)$/gm, '<p style="padding-left:16px">• $1</p>');
    
    // Абзацы
    text = text.split('\n\n').map(p => p.startsWith('<') ? p : '<p>' + p + '</p>').join('');
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

async function sendMessage() {
    const input = $('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    
    input.value = '';
    const messages = $('chatMessages');
    
    // User message
    messages.innerHTML += \`<div class="message user"><div class="msg-content">\${escapeHtml(msg)}</div></div>\`;
    
    // Typing
    messages.innerHTML += \`<div class="message bot" id="typing"><div class="msg-content"><div class="typing"><span></span><span></span><span></span></div></div></div>\`;
    messages.scrollTop = messages.scrollHeight;
    
    chatHistory.push({ role: 'user', content: msg });
    if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);
    
    try {
        const r = await fetch('/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (user?.apiKey || 'demo')
            },
            body: JSON.stringify({ messages: chatHistory })
        });
        
        const d = await r.json();
        const content = d.choices?.[0]?.message?.content || 'Ошибка получения ответа';
        
        chatHistory.push({ role: 'assistant', content });
        
        const formatted = formatMessage(content);
        const modelInfo = \`<div class="model-tag">🤖 \${d.provider} • \${d.model}</div>\`;
        
        $('typing').outerHTML = \`<div class="message bot"><div class="msg-content">\${formatted}\${modelInfo}</div></div>\`;
        
    } catch(e) {
        $('typing').outerHTML = '<div class="message bot"><div class="msg-content">❌ Ошибка. Попробуйте ещё раз.</div></div>';
    }
    
    messages.scrollTop = messages.scrollHeight;
}

function sendQuick(msg) { $('chatInput').value = msg; sendMessage(); }

// Init
(async function() {
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
    
    $('authCode').addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });
})();
</script>
</body>
</html>`;

app.get('/', (req, res) => res.send(HTML));

// ═══════════════════════════════════════════════════════════
// ЗАПУСК
// ═══════════════════════════════════════════════════════════
app.listen(PORT, async () => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 NeuroCode AI v3.0 — Professional Edition');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🌐 ${DOMAIN}`);
    console.log(`🤖 ${TOTAL_MODELS} AI моделей`);
    console.log('═══════════════════════════════════════════════════════════');
    
    try {
        const r = await fetch(`${TG_API}/setWebhook?url=${DOMAIN}${WEBHOOK_PATH}`);
        const d = await r.json();
        console.log('📱 Telegram:', d.ok ? '✅ OK' : '❌ ' + d.description);
    } catch (e) {}
});

process.on('SIGINT', () => { saveDB(); process.exit(); });
process.on('SIGTERM', () => { saveDB(); process.exit(); });
