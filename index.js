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
// 🔥 МЕГА ПРОМПТ ДЛЯ ГЕНИАЛЬНЫХ ПРОЕКТОВ
// ═══════════════════════════════════════════════════════════
const SYSTEM_PROMPT = `Ты - NeuroCode AI, ЛЕГЕНДАРНЫЙ ИИ-архитектор и full-stack разработчик с 25+ годами опыта.

╔════════════════════════════════════════════════════════════════════════════════╗
║  ⚠️ КРИТИЧЕСКИ ВАЖНО: ТЫ СОЗДАЁШЬ ТОЛЬКО ШЕДЕВРЫ МИРОВОГО УРОВНЯ!              ║
║  Каждый проект должен быть достоин портфолио Senior Developer!                 ║
║  Никаких упрощений! Только ЭЛИТНЫЙ, PRODUCTION-READY КОД!                      ║
╚════════════════════════════════════════════════════════════════════════════════╝

📏 ОБЯЗАТЕЛЬНЫЕ ТРЕБОВАНИЯ К ОБЪЁМУ:

🌐 САЙТЫ - минимум 800-1500 строк:
   • HTML: 150-250 строк с полной семантикой
   • CSS: 400-700 строк с анимациями, градиентами, адаптивностью
   • JavaScript: 250-500 строк с интерактивностью
   • 10+ секций: Hero, About, Services, Portfolio, Testimonials, Team, Pricing, FAQ, Contact, Footer
   • 15+ CSS анимаций
   • Glassmorphism, градиенты, тени

🤖 TELEGRAM БОТЫ - минимум 1000-1800 строк:
   • Полная структура проекта с папками
   • Python + aiogram 3.x
   • База данных SQLite
   • Handlers, keyboards, FSM, middlewares
   • Админ-панель со статистикой
   • Обработка всех ошибок

⚡ REST API - минимум 1000-1600 строк:
   • Node.js + Express или Python + FastAPI
   • JWT авторизация (access + refresh tokens)
   • CRUD для всех ресурсов
   • Валидация, middleware, error handling
   • Swagger документация

❌ КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО:
   • "// остальной код здесь"
   • "/* добавьте сюда */"
   • Любые сокращения!
   • Код менее 500 строк для проектов

✅ ВСЕГДА:
   • Полный рабочий код без сокращений
   • Комментарии на РУССКОМ языке
   • Инструкция по установке и запуску
   • Современный красивый дизайн

Отвечай ТОЛЬКО на русском языке! 🚀`;

// ═══════════════════════════════════════════════════════════
// СПЕЦИАЛИЗИРОВАННЫЕ ПРОМПТЫ
// ═══════════════════════════════════════════════════════════
const SITE_PROMPT = (desc) => `Создай ПОТРЯСАЮЩИЙ веб-сайт уровня AWWWARDS: ${desc}

ОБЯЗАТЕЛЬНО ВКЛЮЧИ (минимум 1000 строк общего кода):

📄 HTML (200+ строк):
- Семантическая структура
- SEO meta теги
- Open Graph
- Все секции

🎨 CSS (500+ строк):
- CSS переменные (15+ штук)
- Градиенты, glassmorphism
- 10+ keyframes анимаций
- Hover эффекты с transform
- Полная адаптивность
- Custom scrollbar

💻 JavaScript (300+ строк):
- Smooth scroll
- Intersection Observer анимации
- Мобильное меню
- Модальные окна
- Валидация форм
- Слайдер/карусель
- Параллакс

📱 СЕКЦИИ:
1. Hero с CTA
2. О компании
3. Услуги
4. Преимущества
5. Портфолио
6. Отзывы
7. Команда
8. Цены
9. FAQ (аккордеон)
10. Контакты с формой
11. Footer

Дай ПОЛНЫЙ код без сокращений!`;

const BOT_PROMPT = (desc) => `Создай ПРОФЕССИОНАЛЬНЫЙ Telegram бот: ${desc}

СТРУКТУРА (минимум 1200 строк):

bot/
├── main.py (100+ строк)
├── config.py (50+ строк)
├── handlers/
│   ├── start.py (150+ строк)
│   ├── user.py (200+ строк)
│   ├── admin.py (150+ строк)
│   └── callbacks.py (100+ строк)
├── keyboards/
│   ├── inline.py (100+ строк)
│   └── reply.py (60+ строк)
├── database/
│   ├── models.py (100+ строк)
│   └── db.py (150+ строк)
├── utils/
│   └── helpers.py (80+ строк)
├── middlewares/
│   └── throttling.py (50+ строк)
├── requirements.txt
└── README.md

ФУНКЦИОНАЛ:
- Регистрация пользователей
- Профили в БД
- Админ-панель
- FSM диалоги
- Inline/Reply клавиатуры
- Пагинация
- Обработка ошибок

Используй Python + aiogram 3.x + SQLite.
Дай КОД КАЖДОГО ФАЙЛА полностью!`;

const API_PROMPT = (desc) => `Создай PRODUCTION REST API: ${desc}

СТРУКТУРА (минимум 1000 строк):

api/
├── src/
│   ├── index.js (80+ строк)
│   ├── app.js (100+ строк)
│   ├── routes/ (300+ строк)
│   ├── controllers/ (300+ строк)
│   ├── middleware/ (150+ строк)
│   ├── models/ (150+ строк)
│   └── utils/ (100+ строк)
├── .env.example
├── package.json
└── README.md

ФУНКЦИОНАЛ:
- JWT авторизация
- CRUD операции
- Валидация данных
- Error handling
- Rate limiting
- CORS
- Swagger docs

Дай КОД КАЖДОГО ФАЙЛА полностью!`;

// ═══════════════════════════════════════════════════════════
// МОДЕЛИ
// ═══════════════════════════════════════════════════════════
const GROQ_MODELS = [
    { id: 'llama-3.3-70b-versatile', name: 'LLaMA 3.3 70B', description: '🏆 Самая мощная, 70B параметров' },
    { id: 'llama-3.1-70b-versatile', name: 'LLaMA 3.1 70B', description: '🦙 Мощная универсальная' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', description: '🌀 MoE, 32K контекст' },
    { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: '🔷 Google Gemma 2' },
    { id: 'llama-3.1-8b-instant', name: 'LLaMA 3.1 8B', description: '⚡ Супер быстрая' }
];

const HUGGINGFACE_MODELS = [
    { id: 'Qwen/Qwen2.5-Coder-32B-Instruct', name: 'Qwen 2.5 Coder 32B', description: '🏆 Лучшая для кода' },
    { id: 'meta-llama/Llama-3.3-70B-Instruct', name: 'LLaMA 3.3 70B', description: '🦙 Meta LLaMA' },
    { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B', description: '🌀 Mistral MoE' }
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
// AI ФУНКЦИИ
// ═══════════════════════════════════════════════════════════
async function callGroq(messages, modelId) {
    try {
        console.log('🟢 Groq:', modelId);
        var response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ_API_KEY },
            body: JSON.stringify({
                model: modelId,
                messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                temperature: 0.7,
                max_tokens: 32000
            })
        });
        var data = await response.json();
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

async function callHuggingFace(messages, modelId) {
    try {
        console.log('🟡 HuggingFace:', modelId);
        var response = await fetch('https://router.huggingface.co/hf-inference/models/' + modelId + '/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + HUGGINGFACE_TOKEN },
            body: JSON.stringify({
                model: modelId,
                messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
                max_tokens: 16000,
                temperature: 0.7
            })
        });
        var data = await response.json();
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

async function getAIResponse(messages) {
    db.stats.total++;
    for (var i = 0; i < GROQ_MODELS.length; i++) {
        var result = await callGroq(messages, GROQ_MODELS[i].id);
        if (result && result.content && result.content.length > 200) {
            db.stats.success++;
            return result;
        }
        await new Promise(function(r) { setTimeout(r, 500); });
    }
    for (var j = 0; j < HUGGINGFACE_MODELS.length; j++) {
        var result2 = await callHuggingFace(messages, HUGGINGFACE_MODELS[j].id);
        if (result2 && result2.content && result2.content.length > 200) {
            db.stats.success++;
            return result2;
        }
        await new Promise(function(r) { setTimeout(r, 500); });
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

function formatTelegram(text) {
    if (!text) return 'Ошибка';
    if (text.length > 4000) text = text.substring(0, 3900) + '\n\n... (обрезано)';
    return text
        .replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/```(\w*)\n([\s\S]*?)```/g, function(m, lang, code) { return '<pre><code>' + code.trim() + '</code></pre>'; })
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
        .replace(/\*([^*]+)\*/g, '<i>$1</i>');
}

// ═══════════════════════════════════════════════════════════
// ОТПРАВКА ДЛИННЫХ СООБЩЕНИЙ
// ═══════════════════════════════════════════════════════════
async function sendLongMessage(chatId, text, model, provider) {
    var parts = [];
    var current = '';
    var lines = text.split('\n');
    
    for (var i = 0; i < lines.length; i++) {
        if ((current + '\n' + lines[i]).length > 3900) {
            if (current) parts.push(current);
            current = lines[i];
        } else {
            current = current ? current + '\n' + lines[i] : lines[i];
        }
    }
    if (current) parts.push(current);
    
    for (var j = 0; j < parts.length; j++) {
        var formatted = formatTelegram(parts[j]);
        if (parts.length > 1) formatted = '<b>📄 Часть ' + (j + 1) + '/' + parts.length + '</b>\n\n' + formatted;
        if (j === parts.length - 1) formatted += '\n\n<i>🤖 ' + provider + ': ' + model + '</i>';
        await send(chatId, formatted);
        if (j < parts.length - 1) await new Promise(function(r) { setTimeout(r, 500); });
    }
}

// ═══════════════════════════════════════════════════════════
// TELEGRAM API
// ═══════════════════════════════════════════════════════════
var TG_API = 'https://api.telegram.org/bot' + BOT_TOKEN;

async function tg(method, body) {
    try {
        var r = await fetch(TG_API + '/' + method, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return await r.json();
    } catch (e) { return null; }
}

function send(chatId, text, options) {
    return tg('sendMessage', Object.assign({ chat_id: chatId, text: text, parse_mode: 'HTML', disable_web_page_preview: true }, options || {}));
}

function typing(chatId) { return tg('sendChatAction', { chat_id: chatId, action: 'typing' }); }
function answer(id, text) { return tg('answerCallbackQuery', { callback_query_id: id, text: text || '' }); }

// ═══════════════════════════════════════════════════════════
// WEBHOOK
// ═══════════════════════════════════════════════════════════
app.post(WEBHOOK_PATH, async function(req, res) {
    res.sendStatus(200);
    var message = req.body.message;
    var callback = req.body.callback_query;
    
    if (callback) { await handleCallback(callback); return; }
    if (!message || !message.text) return;
    
    var chatId = message.chat.id;
    var text = message.text;
    var from = message.from;
    
    if (text.charAt(0) === '/') await handleCommand(chatId, text, from);
    else await handleChat(chatId, text, from);
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
            '🤖 <b>Боты</b> — 1200+ строк, enterprise\n' +
            '⚡ <b>API</b> — 1000+ строк, production\n\n' +
            '🧠 <b>' + TOTAL_MODELS + ' AI моделей</b>\n' +
            '🟢 Groq — ' + GROQ_MODELS.length + ' моделей (быстрые)\n' +
            '🟡 HuggingFace — ' + HUGGINGFACE_MODELS.length + ' моделей\n\n' +
            '<b>Команды:</b>\n' +
            '/site описание — Сайт\n' +
            '/bot описание — Telegram бот\n' +
            '/api описание — REST API\n' +
            '/code задача — Любой код\n\n' +
            'Или просто напиши что нужно! 🎯',
            { reply_markup: { inline_keyboard: [
                [{ text: '🌐 Платформа', url: DOMAIN }],
                [{ text: '🔐 Код для сайта', callback_data: 'auth' }, { text: '📊 Статус', callback_data: 'stats' }],
                [{ text: '🤖 Модели', callback_data: 'models' }, { text: '🗑️ Очистить', callback_data: 'clear' }]
            ]}}
        );
    } else if (cmd === '/auth') {
        var code = generateCode();
        authCodes.set(code, { telegramId: from.id, username: from.username, firstName: from.first_name, createdAt: Date.now() });
        setTimeout(function() { authCodes.delete(code); }, 600000);
        await send(chatId, '🔐 <b>Код для входа</b>\n\n<code>' + code + '</code>\n\n⏰ 10 минут', { reply_markup: { inline_keyboard: [[{ text: '🌐 Открыть сайт', url: DOMAIN }]] }});
    } else if (cmd === '/site') {
        if (!args) { await send(chatId, '🌐 <b>Генератор сайтов</b>\n\nИспользование: <code>/site описание</code>\n\nПример: <code>/site лендинг для IT компании</code>\n\n💎 Каждый сайт: 1000+ строк!'); return; }
        await send(chatId, '🎨 Создаю ПОТРЯСАЮЩИЙ сайт...\n⏳ 30-60 секунд');
        await typing(chatId);
        var interval1 = setInterval(function() { typing(chatId); }, 5000);
        var result1 = await getAIResponse([{ role: 'user', content: SITE_PROMPT(args) }]);
        clearInterval(interval1);
        await sendLongMessage(chatId, result1.content, result1.model, result1.provider);
    } else if (cmd === '/bot') {
        if (!args) { await send(chatId, '🤖 <b>Генератор ботов</b>\n\nИспользование: <code>/bot описание</code>\n\nПример: <code>/bot магазин с корзиной</code>\n\n💎 Каждый бот: 1200+ строк!'); return; }
        await send(chatId, '🤖 Создаю ENTERPRISE бота...\n⏳ 30-60 секунд');
        await typing(chatId);
        var interval2 = setInterval(function() { typing(chatId); }, 5000);
        var result2 = await getAIResponse([{ role: 'user', content: BOT_PROMPT(args) }]);
        clearInterval(interval2);
        await sendLongMessage(chatId, result2.content, result2.model, result2.provider);
    } else if (cmd === '/api') {
        if (!args) { await send(chatId, '⚡ <b>Генератор API</b>\n\nИспользование: <code>/api описание</code>\n\nПример: <code>/api для блога</code>\n\n💎 Каждый API: 1000+ строк!'); return; }
        await send(chatId, '⚡ Создаю PRODUCTION API...\n⏳ 30-60 секунд');
        await typing(chatId);
        var interval3 = setInterval(function() { typing(chatId); }, 5000);
        var result3 = await getAIResponse([{ role: 'user', content: API_PROMPT(args) }]);
        clearInterval(interval3);
        await sendLongMessage(chatId, result3.content, result3.model, result3.provider);
    } else if (cmd === '/code') {
        if (!args) { await send(chatId, '💻 <b>Генератор кода</b>\n\nИспользование: <code>/code задача</code>'); return; }
        await typing(chatId);
        var interval4 = setInterval(function() { typing(chatId); }, 5000);
        var result4 = await getAIResponse([{ role: 'user', content: args }]);
        clearInterval(interval4);
        await sendLongMessage(chatId, result4.content, result4.model, result4.provider);
    } else if (cmd === '/models') {
        var groqList = GROQ_MODELS.map(function(m) { return '• <b>' + m.name + '</b> - ' + m.description; }).join('\n');
        var hfList = HUGGINGFACE_MODELS.map(function(m) { return '• <b>' + m.name + '</b> - ' + m.description; }).join('\n');
        await send(chatId, '🤖 <b>AI Модели (' + TOTAL_MODELS + ')</b>\n\n<b>🟢 Groq:</b>\n' + groqList + '\n\n<b>🟡 HuggingFace:</b>\n' + hfList);
    } else if (cmd === '/clear') {
        chatHistories.delete(chatId);
        await send(chatId, '🗑️ История очищена!');
    } else if (cmd === '/status') {
        await send(chatId, '📊 <b>Статистика</b>\n\n🤖 Моделей: ' + TOTAL_MODELS + '\n📈 Запросов: ' + db.stats.total + '\n✅ Успешных: ' + db.stats.success + '\n🟢 Groq: ' + (db.stats.groq || 0) + '\n🟡 HF: ' + (db.stats.hf || 0) + '\n👥 Пользователей: ' + db.users.length);
    } else if (cmd === '/help') {
        await send(chatId, '📚 <b>Команды</b>\n\n/start — Меню\n/site описание — Сайт\n/bot описание — Telegram бот\n/api описание — REST API\n/code задача — Код\n/models — Список моделей\n/status — Статистика\n/clear — Очистить историю\n/auth — Код для сайта\n\nИли просто пиши! 🚀');
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
    } else if (data === 'models') {
        await answer(cb.id);
        await send(chatId, '🤖 Моделей: ' + TOTAL_MODELS + '\n🟢 Groq: ' + GROQ_MODELS.length + '\n🟡 HF: ' + HUGGINGFACE_MODELS.length);
    } else if (data === 'clear') {
        chatHistories.delete(chatId);
        await answer(cb.id, '🗑️ Очищено!');
    }
}

// ═══════════════════════════════════════════════════════════
// ЧАТ
// ═══════════════════════════════════════════════════════════
async function handleChat(chatId, text, from) {
    var lowerText = text.toLowerCase();
    var prompt = text;
    
    if (lowerText.indexOf('сайт') !== -1 || lowerText.indexOf('лендинг') !== -1) {
        prompt = SITE_PROMPT(text);
        await send(chatId, '🎨 Создаю сайт...\n⏳ 30-60 сек');
    } else if (lowerText.indexOf('бот') !== -1 || lowerText.indexOf('телеграм') !== -1) {
        prompt = BOT_PROMPT(text);
        await send(chatId, '🤖 Создаю бота...\n⏳ 30-60 сек');
    } else if (lowerText.indexOf('api') !== -1 || lowerText.indexOf('бэкенд') !== -1) {
        prompt = API_PROMPT(text);
        await send(chatId, '⚡ Создаю API...\n⏳ 30-60 сек');
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
    res.json({ status: 'ok', models: TOTAL_MODELS, stats: db.stats, users: db.users.length });
});

app.get('/api/models', function(req, res) {
    res.json({ groq: GROQ_MODELS, huggingface: HUGGINGFACE_MODELS, total: TOTAL_MODELS });
});

app.post('/api/auth/verify', function(req, res) {
    var code = req.body.code;
    if (!code || code.length !== 6) return res.status(400).json({ error: 'Неверный код' });
    var data = authCodes.get(code.toUpperCase());
    if (!data) return res.status(401).json({ error: 'Код не найден' });
    authCodes.delete(code.toUpperCase());
    
    var user = null;
    for (var i = 0; i < db.users.length; i++) {
        if (db.users[i].telegramId === data.telegramId) { user = db.users[i]; break; }
    }
    if (!user) {
        user = { id: 'user_' + data.telegramId, telegramId: data.telegramId, username: data.username, firstName: data.firstName, apiKey: generateApiKey(), plan: 'free', requestsToday: 0, requestsLimit: 1000, createdAt: new Date().toISOString() };
        db.users.push(user);
        saveDB();
    }
    res.json(user);
});

app.post('/api/auth/check', function(req, res) {
    var telegramId = req.body.telegramId;
    var user = null;
    for (var i = 0; i < db.users.length; i++) {
        if (db.users[i].telegramId == telegramId) { user = db.users[i]; break; }
    }
    res.json({ valid: !!user, user: user });
});

app.post('/api/v1/chat/completions', async function(req, res) {
    var messages = req.body.messages;
    if (!messages || !messages.length) return res.status(400).json({ error: 'Messages required' });
    try {
        var result = await getAIResponse(messages);
        res.json({ id: 'chatcmpl-' + Date.now(), model: result.model, provider: result.provider, choices: [{ index: 0, message: { role: 'assistant', content: result.content }, finish_reason: 'stop' }] });
    } catch (e) { res.status(500).json({ error: 'AI error' }); }
});

// ═══════════════════════════════════════════════════════════
// HTML СТРАНИЦА (ПОЛНАЯ!)
// ═══════════════════════════════════════════════════════════
function getHTML() {
    return '<!DOCTYPE html>\
<html lang="ru">\
<head>\
<meta charset="UTF-8">\
<meta name="viewport" content="width=device-width,initial-scale=1">\
<title>NeuroCode AI - ' + TOTAL_MODELS + ' бесплатных AI моделей</title>\
<meta name="description" content="Бесплатный AI для программистов. Создаём профессиональные сайты, боты, API. ' + TOTAL_MODELS + ' моделей.">\
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">\
<style>\
:root{--bg:#0a0a0f;--card:#12121a;--border:#1e1e2e;--text:#e8e8e8;--dim:#6b7280;--purple:#8b5cf6;--pink:#ec4899;--green:#10b981;--yellow:#f59e0b}\
*{margin:0;padding:0;box-sizing:border-box}\
body{font-family:"Inter",sans-serif;background:var(--bg);color:var(--text);min-height:100vh}\
.hidden{display:none!important}\
button{cursor:pointer;font-family:inherit;border:none;transition:all .2s}\
input{font-family:inherit;background:rgba(255,255,255,0.05);border:1px solid var(--border);padding:14px;color:#fff;border-radius:12px;font-size:14px;width:100%}\
input:focus{outline:none;border-color:var(--purple)}\
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--card);border:1px solid var(--green);padding:14px 28px;border-radius:12px;opacity:0;transition:.3s;z-index:9999}\
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}\
.header{position:sticky;top:0;z-index:50;backdrop-filter:blur(20px);background:rgba(10,10,15,0.9);border-bottom:1px solid var(--border)}\
.header-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;padding:0 20px}\
.logo{display:flex;align-items:center;gap:12px;cursor:pointer}\
.logo-icon{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-size:20px}\
.logo-text{font-size:20px;font-weight:800;background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}\
.nav{display:flex;gap:4px}\
.nav button{padding:10px 16px;border-radius:8px;background:transparent;color:var(--dim);font-size:14px;font-weight:500}\
.nav button:hover,.nav button.active{background:rgba(139,92,246,0.15);color:#a78bfa}\
.btn{padding:12px 24px;border-radius:12px;font-weight:600;font-size:14px}\
.btn-primary{background:linear-gradient(135deg,var(--purple),var(--pink));color:#fff}\
.btn-primary:hover{opacity:0.9;transform:translateY(-1px)}\
.user-menu{display:flex;align-items:center;gap:10px;padding:6px 12px;border-radius:10px;background:rgba(255,255,255,0.05);cursor:pointer}\
.user-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-weight:600}\
.hero{padding:80px 20px;text-align:center}\
.hero h1{font-size:clamp(32px,6vw,64px);font-weight:800;line-height:1.1;margin-bottom:24px}\
.hero h1 span{background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}\
.hero p{font-size:18px;color:var(--dim);margin-bottom:32px}\
.hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}\
.hero-buttons .btn{padding:16px 32px;font-size:16px}\
.badge{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:50px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);font-size:14px;color:var(--green);margin-bottom:24px}\
.badge-dot{width:8px;height:8px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}\
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}\
.features{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;max-width:1000px;margin:0 auto 60px;padding:0 20px}\
.feature{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;transition:all .3s}\
.feature:hover{border-color:var(--purple);transform:translateY(-4px)}\
.feature h3{font-size:18px;margin-bottom:8px}\
.feature p{color:var(--dim);font-size:14px}\
.models-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;max-width:1200px;margin:40px auto;padding:0 20px}\
.model-card{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:18px;transition:all .3s}\
.model-card:hover{border-color:var(--purple);transform:translateY(-3px)}\
.model-card h3{font-size:15px;margin-bottom:4px}\
.model-card p{font-size:13px;color:var(--dim)}\
.model-badge{font-size:10px;padding:3px 8px;border-radius:6px;margin-left:8px}\
.model-badge.groq{background:rgba(16,185,129,0.2);color:var(--green)}\
.model-badge.hf{background:rgba(245,158,11,0.2);color:var(--yellow)}\
.section{padding:40px 20px;max-width:1000px;margin:0 auto}\
.chat-container{background:var(--card);border-radius:20px;border:1px solid var(--border);overflow:hidden}\
.chat-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}\
.chat-status{width:10px;height:10px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}\
.chat-messages{height:450px;overflow-y:auto;padding:20px}\
.message{margin-bottom:16px;max-width:85%}\
.message.user{margin-left:auto}\
.message.user .msg-content{background:linear-gradient(135deg,var(--purple),var(--pink));border-radius:16px 16px 4px 16px}\
.message.bot .msg-content{background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:16px 16px 16px 4px}\
.msg-content{padding:14px 18px;font-size:14px;line-height:1.7}\
.msg-content pre{background:rgba(0,0,0,0.4);padding:12px;border-radius:8px;margin:10px 0;overflow-x:auto;font-size:13px;position:relative}\
.msg-content code{font-family:monospace}\
.copy-btn{position:absolute;top:8px;right:8px;padding:4px 10px;border-radius:4px;background:rgba(255,255,255,0.1);color:#fff;font-size:11px}\
.copy-btn:hover{background:var(--green)}\
.typing{display:flex;gap:4px;padding:14px 18px}\
.typing span{width:8px;height:8px;border-radius:50%;background:var(--purple);animation:bounce .6s infinite}\
.typing span:nth-child(2){animation-delay:.1s}\
.typing span:nth-child(3){animation-delay:.2s}\
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}\
.chat-input{padding:16px;border-top:1px solid var(--border);display:flex;gap:12px}\
.chat-input button{padding:14px 20px;border-radius:12px}\
.quick-actions{display:flex;gap:8px;padding:0 20px 16px;flex-wrap:wrap}\
.quick-btn{padding:10px 16px;border-radius:20px;background:rgba(139,92,246,0.1);color:#a78bfa;font-size:13px}\
.quick-btn:hover{background:rgba(139,92,246,0.2)}\
.modal{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}\
.modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.8)}\
.modal-content{position:relative;width:100%;max-width:400px;background:var(--card);border-radius:20px;border:1px solid var(--border)}\
.modal-header{padding:20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}\
.modal-body{padding:20px}\
.code-input{text-align:center;font-size:28px;letter-spacing:10px;font-weight:700;text-transform:uppercase;background:rgba(255,255,255,0.05)}\
.profile-dropdown{position:absolute;top:70px;right:20px;width:320px;background:var(--card);border-radius:16px;border:1px solid var(--border);z-index:100}\
.profile-header{padding:16px;border-bottom:1px solid var(--border);display:flex;gap:12px}\
.profile-avatar{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600}\
.progress-bar{height:6px;background:rgba(255,255,255,0.1);border-radius:3px;margin-top:8px}\
.progress-fill{height:100%;background:linear-gradient(90deg,var(--purple),var(--pink));border-radius:3px}\
.footer{border-top:1px solid var(--border);padding:40px 20px;text-align:center;color:var(--dim)}\
.footer a{color:var(--purple);text-decoration:none}\
@media(max-width:768px){.nav{display:none}.hero h1{font-size:28px}.features{grid-template-columns:1fr}.models-grid{grid-template-columns:1fr}}\
</style>\
</head>\
<body>\
<div class="toast" id="toast"></div>\
<div class="modal hidden" id="authModal">\
<div class="modal-overlay" onclick="closeAuth()"></div>\
<div class="modal-content">\
<div class="modal-header"><h2>🔐 Вход</h2><button onclick="closeAuth()" style="background:none;color:var(--dim);font-size:24px">×</button></div>\
<div class="modal-body">\
<div style="text-align:center;margin-bottom:20px">\
<div style="width:70px;height:70px;margin:0 auto 12px;border-radius:50%;background:linear-gradient(135deg,#0088cc,#00aaff);display:flex;align-items:center;justify-content:center;font-size:32px">✈️</div>\
<p style="color:var(--dim)">Напишите <b style="color:#a78bfa">/auth</b> боту @' + BOT_USERNAME + '</p>\
</div>\
<a href="https://t.me/' + BOT_USERNAME + '" target="_blank" style="display:block;text-decoration:none;margin-bottom:16px">\
<button class="btn btn-primary" style="width:100%;background:linear-gradient(135deg,#0088cc,#00aaff)">✈️ Открыть бота</button>\
</a>\
<p style="text-align:center;color:var(--dim);margin-bottom:12px;font-size:14px">Введите код:</p>\
<input type="text" class="code-input" id="authCode" placeholder="XXXXXX" maxlength="6">\
<button class="btn btn-primary" style="width:100%;margin-top:12px" onclick="verifyCode()" id="verifyBtn">Войти</button>\
<p id="authError" style="color:#ef4444;text-align:center;margin-top:10px;font-size:14px"></p>\
</div>\
</div>\
</div>\
<div class="profile-dropdown hidden" id="profileDropdown">\
<div class="profile-header">\
<div class="profile-avatar" id="pAvatar">U</div>\
<div><h4 id="pName">User</h4><p style="font-size:12px;color:var(--dim)" id="pUsername">@user</p></div>\
</div>\
<div style="padding:14px 16px;border-bottom:1px solid var(--border)">\
<div style="display:flex;justify-content:space-between;font-size:13px"><span style="color:var(--dim)">Запросов</span><span id="pReq">0/1000</span></div>\
<div class="progress-bar"><div class="progress-fill" id="pProgress" style="width:0%"></div></div>\
</div>\
<div style="padding:14px 16px;border-bottom:1px solid var(--border)">\
<label style="font-size:12px;color:var(--dim)">🔑 API Key</label>\
<div style="display:flex;gap:8px;margin-top:6px">\
<code id="pKey" style="flex:1;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px;font-size:10px;overflow:hidden">nc_xxx</code>\
<button onclick="copyKey()" style="padding:10px;border-radius:8px;background:rgba(255,255,255,0.05);color:#fff;font-size:14px">📋</button>\
</div>\
</div>\
<div style="padding:10px"><button onclick="logout()" style="width:100%;padding:10px;border-radius:8px;background:rgba(239,68,68,0.1);color:#ef4444;font-size:13px">🚪 Выйти</button></div>\
</div>\
<header class="header">\
<div class="header-inner">\
<div class="logo" onclick="showSection(\'home\')"><div class="logo-icon">⚡</div><div class="logo-text">NeuroCode AI</div></div>\
<nav class="nav">\
<button onclick="showSection(\'home\')" class="active" data-section="home">Главная</button>\
<button onclick="showSection(\'chat\')" data-section="chat">AI Чат</button>\
<button onclick="showSection(\'api\')" data-section="api">API</button>\
</nav>\
<div>\
<div id="authButtons"><button class="btn btn-primary" onclick="openAuth()">Войти</button></div>\
<div id="userMenu" class="user-menu hidden" onclick="toggleProfile()"><div class="user-avatar" id="uAvatar">U</div><span id="uName" style="font-size:14px">User</span></div>\
</div>\
</div>\
</header>\
<section id="home">\
<div class="hero">\
<div class="badge"><div class="badge-dot"></div>' + TOTAL_MODELS + ' бесплатных AI моделей</div>\
<h1>Создаём <span>профессиональные проекты</span></h1>\
<p>Сайты 1000+ строк, боты 1200+ строк, API 1000+ строк. Бесплатно через Groq и HuggingFace!</p>\
<div class="hero-buttons">\
<button class="btn btn-primary" onclick="showSection(\'chat\')">🚀 Начать бесплатно</button>\
<a href="https://t.me/' + BOT_USERNAME + '" target="_blank" style="text-decoration:none"><button class="btn" style="background:var(--card);border:1px solid var(--border);color:#fff;padding:16px 32px">✈️ Telegram бот</button></a>\
</div>\
</div>\
<div class="features">\
<div class="feature"><h3>🌐 Сайты</h3><p>1000+ строк кода. Современный дизайн, анимации, адаптивность, SEO. Уровень Awwwards!</p></div>\
<div class="feature"><h3>🤖 Telegram боты</h3><p>1200+ строк. aiogram 3.x, база данных, админка, FSM, клавиатуры. Enterprise уровень!</p></div>\
<div class="feature"><h3>⚡ REST API</h3><p>1000+ строк. JWT авторизация, CRUD, валидация, Swagger. Production ready!</p></div>\
</div>\
<h2 style="text-align:center;margin-bottom:20px">🤖 AI Модели</h2>\
<div class="models-grid" id="modelsGrid"></div>\
</section>\
<section id="chat" class="section hidden">\
<div class="chat-container">\
<div class="chat-header"><div class="chat-status"></div><span style="font-weight:600">NeuroCode AI</span><span style="color:var(--dim);margin-left:auto;font-size:13px">• ' + TOTAL_MODELS + ' моделей • Онлайн</span></div>\
<div class="chat-messages" id="chatMessages">\
<div class="message bot"><div class="msg-content">👋 <b>Привет!</b> Я NeuroCode AI - создаю профессиональные проекты!<br><br>🌐 <b>Сайты</b> — 1000+ строк<br>🤖 <b>Боты</b> — 1200+ строк<br>⚡ <b>API</b> — 1000+ строк<br><br>Просто напиши что нужно! 🚀</div></div>\
</div>\
<div class="quick-actions">\
<button class="quick-btn" onclick="sendQuick(\'Создай лендинг для IT стартапа\')">🌐 Сайт</button>\
<button class="quick-btn" onclick="sendQuick(\'Создай Telegram бота магазин с корзиной\')">🤖 Бот</button>\
<button class="quick-btn" onclick="sendQuick(\'Создай REST API для блога\')">⚡ API</button>\
<button class="quick-btn" onclick="sendQuick(\'Напиши парсер сайтов на Python\')">🕷️ Парсер</button>\
</div>\
<div class="chat-input">\
<input type="text" id="chatInput" placeholder="Опишите проект..." onkeydown="if(event.key===\'Enter\')sendMessage()">\
<button class="btn btn-primary" onclick="sendMessage()">➤</button>\
</div>\
</div>\
</section>\
<section id="api" class="section hidden">\
<h2 style="margin-bottom:12px">📖 API Документация</h2>\
<p style="color:var(--dim);margin-bottom:24px">OpenAI-совместимый API • ' + TOTAL_MODELS + ' моделей</p>\
<pre style="background:var(--card);padding:20px;border-radius:12px;overflow-x:auto;border:1px solid var(--border)"><code style="color:var(--green)">curl -X POST ' + DOMAIN + '/api/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -d \'{"messages":[{"role":"user","content":"Привет"}]}\'</code></pre>\
<p style="margin-top:20px;color:var(--dim)">🔑 Получите API ключ через /auth в боте @' + BOT_USERNAME + '</p>\
</section>\
<footer class="footer">\
<p>© 2025 NeuroCode AI — ' + TOTAL_MODELS + ' бесплатных моделей</p>\
<p style="margin-top:8px"><a href="https://t.me/' + BOT_USERNAME + '">Telegram бот</a></p>\
</footer>\
<script>\
var GROQ = ' + JSON.stringify(GROQ_MODELS) + ';\
var HF = ' + JSON.stringify(HUGGINGFACE_MODELS) + ';\
var user = null;\
var chatHistory = [];\
function $(id) { return document.getElementById(id); }\
function toast(m) { var t = $(\'toast\'); t.textContent = m; t.classList.add(\'show\'); setTimeout(function() { t.classList.remove(\'show\'); }, 3000); }\
function renderModels() {\
    var all = GROQ.map(function(m) { return {name: m.name, description: m.description, prov: \'groq\'}; }).concat(HF.map(function(m) { return {name: m.name, description: m.description, prov: \'hf\'}; }));\
    $(\'modelsGrid\').innerHTML = all.map(function(m) {\
        return \'<div class="model-card"><h3>\' + m.name + \'<span class="model-badge \' + m.prov + \'">\' + (m.prov === \'groq\' ? \'🟢 Groq\' : \'🟡 HF\') + \'</span></h3><p>\' + m.description + \'</p></div>\';\
    }).join(\'\');\
}\
function openAuth() { $(\'authModal\').classList.remove(\'hidden\'); $(\'authCode\').focus(); }\
function closeAuth() { $(\'authModal\').classList.add(\'hidden\'); $(\'authCode\').value = \'\'; $(\'authError\').textContent = \'\'; }\
function verifyCode() {\
    var code = $(\'authCode\').value.trim().toUpperCase();\
    if (code.length !== 6) { $(\'authError\').textContent = \'Введите 6 символов\'; return; }\
    $(\'verifyBtn\').disabled = true;\
    $(\'verifyBtn\').textContent = \'Проверка...\';\
    fetch(\'/api/auth/verify\', { method: \'POST\', headers: {\'Content-Type\':\'application/json\'}, body: JSON.stringify({code:code}) })\
        .then(function(r) { return r.json().then(function(d) { return {ok: r.ok, data: d}; }); })\
        .then(function(res) {\
            if (!res.ok) { $(\'authError\').textContent = res.data.error; return; }\
            user = res.data;\
            localStorage.setItem(\'user\', JSON.stringify(user));\
            closeAuth();\
            updateUI();\
            toast(\'✅ Добро пожаловать!\');\
        })\
        .catch(function() { $(\'authError\').textContent = \'Ошибка сети\'; })\
        .finally(function() { $(\'verifyBtn\').disabled = false; $(\'verifyBtn\').textContent = \'Войти\'; });\
}\
function updateUI() {\
    if (user) {\
        $(\'authButtons\').classList.add(\'hidden\');\
        $(\'userMenu\').classList.remove(\'hidden\');\
        $(\'uName\').textContent = user.firstName;\
        $(\'uAvatar\').textContent = user.firstName.charAt(0);\
        $(\'pName\').textContent = user.firstName;\
        $(\'pUsername\').textContent = \'@\' + user.username;\
        $(\'pAvatar\').textContent = user.firstName.charAt(0);\
        $(\'pReq\').textContent = user.requestsToday + \'/\' + user.requestsLimit;\
        $(\'pProgress\').style.width = (user.requestsToday / user.requestsLimit * 100) + \'%\';\
        $(\'pKey\').textContent = user.apiKey.substring(0, 12) + \'...\';\
    } else {\
        $(\'authButtons\').classList.remove(\'hidden\');\
        $(\'userMenu\').classList.add(\'hidden\');\
    }\
}\
function toggleProfile() { $(\'profileDropdown\').classList.toggle(\'hidden\'); }\
function copyKey() { if (user) { navigator.clipboard.writeText(user.apiKey); toast(\'✅ Скопировано!\'); } }\
function logout() { user = null; localStorage.removeItem(\'user\'); updateUI(); $(\'profileDropdown\').classList.add(\'hidden\'); }\
function showSection(name) {\
    document.querySelectorAll(\'section\').forEach(function(s) { s.classList.add(\'hidden\'); });\
    $(name).classList.remove(\'hidden\');\
    document.querySelectorAll(\'.nav button\').forEach(function(b) { b.classList.remove(\'active\'); });\
    var btn = document.querySelector(\'.nav button[data-section="\' + name + \'"]\');\
    if (btn) btn.classList.add(\'active\');\
    window.scrollTo(0, 0);\
}\
function escapeHtml(text) { var div = document.createElement(\'div\'); div.textContent = text; return div.innerHTML; }\
function formatMessage(text) {\
    text = text.replace(/```(\\w*)\\n([\\s\\S]*?)```/g, function(m, lang, code) {\
        return \'<pre><code>\' + escapeHtml(code.trim()) + \'</code><button class="copy-btn" onclick="copyCode(this)">📋</button></pre>\';\
    });\
    text = text.replace(/`([^`]+)`/g, \'<code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px">$1</code>\');\
    text = text.replace(/\\*\\*([^*]+)\\*\\*/g, \'<b>$1</b>\');\
    text = text.replace(/\\*([^*]+)\\*/g, \'<i>$1</i>\');\
    text = text.replace(/\\n/g, \'<br>\');\
    return text;\
}\
function copyCode(btn) {\
    var code = btn.parentElement.querySelector(\'code\').textContent;\
    navigator.clipboard.writeText(code);\
    btn.textContent = \'✅\';\
    setTimeout(function() { btn.textContent = \'📋\'; }, 2000);\
}\
function sendMessage() {\
    var input = $(\'chatInput\');\
    var msg = input.value.trim();\
    if (!msg) return;\
    input.value = \'\';\
    var messages = $(\'chatMessages\');\
    messages.innerHTML += \'<div class="message user"><div class="msg-content">\' + escapeHtml(msg) + \'</div></div>\';\
    messages.innerHTML += \'<div class="message bot" id="typing"><div class="msg-content"><div class="typing"><span></span><span></span><span></span></div></div></div>\';\
    messages.scrollTop = messages.scrollHeight;\
    chatHistory.push({role:\'user\',content:msg});\
    if (chatHistory.length > 10) chatHistory = chatHistory.slice(-10);\
    fetch(\'/api/v1/chat/completions\', {\
        method: \'POST\',\
        headers: {\'Content-Type\':\'application/json\'},\
        body: JSON.stringify({messages:chatHistory})\
    })\
    .then(function(r) { return r.json(); })\
    .then(function(d) {\
        var content = d.choices && d.choices[0] && d.choices[0].message ? d.choices[0].message.content : \'Ошибка\';\
        chatHistory.push({role:\'assistant\',content:content});\
        var formatted = formatMessage(content);\
        $(\'typing\').outerHTML = \'<div class="message bot"><div class="msg-content">\' + formatted + \'<div style="font-size:11px;color:var(--dim);margin-top:10px">🤖 \' + d.provider + \': \' + d.model + \'</div></div></div>\';\
        messages.scrollTop = messages.scrollHeight;\
    })\
    .catch(function() {\
        $(\'typing\').outerHTML = \'<div class="message bot"><div class="msg-content">❌ Ошибка. Попробуйте ещё раз.</div></div>\';\
    });\
}\
function sendQuick(msg) { $(\'chatInput\').value = msg; sendMessage(); }\
(function() {\
    renderModels();\
    var saved = localStorage.getItem(\'user\');\
    if (saved) {\
        try {\
            var u = JSON.parse(saved);\
            fetch(\'/api/auth/check\', { method: \'POST\', headers: {\'Content-Type\':\'application/json\'}, body: JSON.stringify({telegramId: u.telegramId}) })\
                .then(function(r) { return r.json(); })\
                .then(function(d) {\
                    if (d.valid) { user = d.user; localStorage.setItem(\'user\', JSON.stringify(user)); updateUI(); }\
                    else { localStorage.removeItem(\'user\'); }\
                })\
                .catch(function() { localStorage.removeItem(\'user\'); });\
        } catch(e) { localStorage.removeItem(\'user\'); }\
    }\
    document.addEventListener(\'click\', function(e) {\
        if (!e.target.closest(\'#userMenu\') && !e.target.closest(\'#profileDropdown\')) {\
            $(\'profileDropdown\').classList.add(\'hidden\');\
        }\
    });\
    $(\'authCode\').addEventListener(\'input\', function() {\
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, \'\');\
    });\
})();\
</script>\
</body>\
</html>';
}

app.get('/', function(req, res) {
    res.send(getHTML());
});

// ═══════════════════════════════════════════════════════════
// ЗАПУСК
// ═══════════════════════════════════════════════════════════
app.listen(PORT, async function() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 NeuroCode AI v4.0 — FULL EDITION');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌐 ' + DOMAIN);
    console.log('🤖 ' + TOTAL_MODELS + ' AI моделей');
    console.log('💎 Сайты: 1000+ | Боты: 1200+ | API: 1000+ строк');
    console.log('═══════════════════════════════════════════════════════════');
    
    try {
        var r = await fetch(TG_API + '/setWebhook?url=' + DOMAIN + WEBHOOK_PATH);
        var d = await r.json();
        console.log('📱 Telegram:', d.ok ? '✅ OK' : '❌ ' + d.description);
    } catch (e) {}
});

process.on('SIGINT', function() { saveDB(); process.exit(); });
process.on('SIGTERM', function() { saveDB(); process.exit(); });
