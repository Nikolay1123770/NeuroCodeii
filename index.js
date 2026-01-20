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
// 🔥 МОЩНЕЙШИЙ СИСТЕМНЫЙ ПРОМПТ
// ═══════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Ты - NeuroCode AI, ЭЛИТНЫЙ ИИ-архитектор и full-stack разработчик мирового класса.

╔══════════════════════════════════════════════════════════════════════════════╗
║  🎯 ГЛАВНОЕ: ТЫ СОЗДАЁШЬ ТОЛЬКО PRODUCTION-READY ПРОЕКТЫ!                   ║
║  Никаких демок или упрощений! Только ПОЛНЫЙ ПРОФЕССИОНАЛЬНЫЙ КОД!           ║
╚══════════════════════════════════════════════════════════════════════════════╝

📏 ОБЪЁМ КОДА:
• Сайты: минимум 400-600 строк (HTML + CSS + JS)
• Telegram боты: минимум 500-800 строк
• REST API: минимум 400-600 строк
• Полная функциональность без сокращений

🌐 САЙТЫ ВКЛЮЧАЮТ:
• HTML5 семантика (header, nav, main, section, footer)
• CSS3: переменные, Flexbox/Grid, анимации, @media
• JavaScript: интерактивность, валидация, анимации
• Секции: Hero, О нас, Услуги, Портфолио, Отзывы, Контакты, Footer

🤖 TELEGRAM БОТЫ ВКЛЮЧАЮТ:
• Python + aiogram 3.x
• Полная структура проекта
• База данных SQLite
• Handlers, keyboards, FSM
• Админ-панель
• Обработка ошибок

⚡ REST API ВКЛЮЧАЮТ:
• Node.js + Express или Python + FastAPI
• JWT авторизация
• CRUD операции
• Валидация данных
• Обработка ошибок

⚠️ ЗАПРЕЩЕНО:
• "// остальной код здесь"
• "/* добавьте сюда */"
• "и так далее..."
• Сокращённые версии

✅ ВСЕГДА:
• Полный рабочий код
• Комментарии на РУССКОМ
• Инструкция по запуску
• Современный дизайн

Отвечай ТОЛЬКО на русском языке! 🚀`;

// ═══════════════════════════════════════════════════════════
// 🟢 МОДЕЛИ GROQ (БЕСПЛАТНЫЕ И ОЧЕНЬ БЫСТРЫЕ!)
// ═══════════════════════════════════════════════════════════
const GROQ_MODELS = [
    {
        id: 'llama-3.3-70b-versatile',
        name: 'LLaMA 3.3 70B',
        description: '🏆 Самая мощная, 70B параметров',
        context: 128000,
        priority: 1
    },
    {
        id: 'llama-3.1-70b-versatile',
        name: 'LLaMA 3.1 70B',
        description: '🦙 Мощная универсальная',
        context: 128000,
        priority: 2
    },
    {
        id: 'llama3-70b-8192',
        name: 'LLaMA 3 70B',
        description: '🦙 Классическая LLaMA 3',
        context: 8192,
        priority: 3
    },
    {
        id: 'mixtral-8x7b-32768',
        name: 'Mixtral 8x7B',
        description: '🌀 Mistral MoE, 32K контекст',
        context: 32768,
        priority: 4
    },
    {
        id: 'gemma2-9b-it',
        name: 'Gemma 2 9B',
        description: '🔷 Google Gemma 2',
        context: 8192,
        priority: 5
    },
    {
        id: 'llama-3.1-8b-instant',
        name: 'LLaMA 3.1 8B Instant',
        description: '⚡ Супер быстрая',
        context: 128000,
        priority: 6
    },
    {
        id: 'llama3-8b-8192',
        name: 'LLaMA 3 8B',
        description: '⚡ Быстрая и умная',
        context: 8192,
        priority: 7
    },
    {
        id: 'gemma-7b-it',
        name: 'Gemma 7B',
        description: '🔷 Google Gemma',
        context: 8192,
        priority: 8
    }
];

// ═══════════════════════════════════════════════════════════
// 🟡 МОДЕЛИ HUGGINGFACE (НОВЫЙ ROUTER API)
// ═══════════════════════════════════════════════════════════
const HUGGINGFACE_MODELS = [
    {
        id: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        name: 'Qwen 2.5 Coder 32B',
        description: '🏆 Лучшая для кода',
        priority: 1
    },
    {
        id: 'Qwen/Qwen2.5-72B-Instruct',
        name: 'Qwen 2.5 72B',
        description: '🧠 Мощнейшая Qwen',
        priority: 2
    },
    {
        id: 'meta-llama/Llama-3.3-70B-Instruct',
        name: 'LLaMA 3.3 70B',
        description: '🦙 Meta LLaMA',
        priority: 3
    },
    {
        id: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        name: 'Mixtral 8x7B',
        description: '🌀 Mistral MoE',
        priority: 4
    },
    {
        id: 'microsoft/Phi-3.5-mini-instruct',
        name: 'Phi-3.5 Mini',
        description: '🔬 Microsoft Phi',
        priority: 5
    },
    {
        id: 'google/gemma-2-27b-it',
        name: 'Gemma 2 27B',
        description: '🔷 Google Gemma 2',
        priority: 6
    },
    {
        id: 'HuggingFaceH4/zephyr-7b-beta',
        name: 'Zephyr 7B',
        description: '🌬️ HuggingFace',
        priority: 7
    }
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
            console.log(`📂 DB: ${db.users.length} users`);
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
// 🟢 GROQ API (ОСНОВНОЙ - ОЧЕНЬ БЫСТРЫЙ!)
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
                max_tokens: 8192,
                top_p: 0.95
            })
        });
        
        const data = await response.json();
        
        if (data.choices?.[0]?.message?.content) {
            const content = data.choices[0].message.content;
            console.log(`✅ Groq OK: ${modelId} (${content.length} chars)`);
            db.stats.groq++;
            return {
                content: content,
                model: modelId,
                provider: 'Groq'
            };
        }
        
        if (data.error) {
            console.log(`❌ Groq error: ${data.error.message || JSON.stringify(data.error)}`);
        }
        
        return null;
        
    } catch (e) {
        console.log(`❌ Groq exception: ${e.message}`);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════
// 🟡 HUGGINGFACE API (НОВЫЙ ROUTER!)
// ═══════════════════════════════════════════════════════════
async function callHuggingFace(messages, modelId) {
    try {
        console.log(`🟡 HuggingFace: ${modelId.split('/').pop()}`);
        
        // НОВЫЙ URL: router.huggingface.co
        const response = await fetch(`https://router.huggingface.co/hf-inference/models/${modelId}/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`
            },
            body: JSON.stringify({
                model: modelId,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages
                ],
                max_tokens: 4096,
                temperature: 0.7
            })
        });
        
        const data = await response.json();
        
        // OpenAI-совместимый формат
        if (data.choices?.[0]?.message?.content) {
            const content = data.choices[0].message.content;
            if (content.length > 50) {
                console.log(`✅ HuggingFace OK: ${modelId.split('/').pop()}`);
                db.stats.hf++;
                return {
                    content: content,
                    model: modelId,
                    provider: 'HuggingFace'
                };
            }
        }
        
        if (data.error) {
            console.log(`❌ HuggingFace: ${typeof data.error === 'string' ? data.error : JSON.stringify(data.error)}`);
        }
        
        return null;
        
    } catch (e) {
        console.log(`❌ HuggingFace exception: ${e.message}`);
        return null;
    }
}

// ═══════════════════════════════════════════════════════════
// 🧠 УМНАЯ СИСТЕМА ВЫБОРА МОДЕЛИ
// ═══════════════════════════════════════════════════════════
async function getAIResponse(messages) {
    db.stats.total++;
    
    // 1. Сначала пробуем Groq (очень быстрый!)
    for (const model of GROQ_MODELS) {
        const result = await callGroq(messages, model.id);
        if (result?.content && result.content.length > 50) {
            db.stats.success++;
            return result;
        }
        // Небольшая пауза между попытками
        await new Promise(r => setTimeout(r, 200));
    }
    
    // 2. Если Groq не работает - пробуем HuggingFace
    for (const model of HUGGINGFACE_MODELS.slice(0, 4)) {
        const result = await callHuggingFace(messages, model.id);
        if (result?.content && result.content.length > 50) {
            db.stats.success++;
            return result;
        }
        await new Promise(r => setTimeout(r, 300));
    }
    
    db.stats.failed++;
    
    // Fallback ответ
    return {
        content: `⚠️ AI временно недоступен.

**Попробуйте:**
1. Подождать минуту и повторить
2. Переформулировать запрос
3. Использовать более короткий запрос

**Статус:**
• Groq: ${GROQ_MODELS.length} моделей
• HuggingFace: ${HUGGINGFACE_MODELS.length} моделей

Если проблема повторяется, напишите /status`,
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

function formatTelegram(text) {
    if (!text) return 'Ошибка получения ответа';
    
    // Ограничение длины для Telegram
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
        console.log('TG error:', e.message);
        return null;
    }
}

const send = (chatId, text, options = {}) => tg('sendMessage', { 
    chat_id: chatId, 
    text, 
    parse_mode: 'HTML', 
    ...options 
});

const typing = (chatId) => tg('sendChatAction', { chat_id: chatId, action: 'typing' });
const answer = (id, text = '') => tg('answerCallbackQuery', { callback_query_id: id, text });

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
                `🚀 <b>NeuroCode AI</b>\n\n` +
                `Привет, ${from.first_name}! 👋\n\n` +
                `Я - <b>бесплатный AI помощник</b> для программистов.\n\n` +
                `<b>🧠 ${TOTAL_MODELS} AI моделей:</b>\n` +
                `🟢 Groq: ${GROQ_MODELS.length} моделей (супер быстрые!)\n` +
                `🟡 HuggingFace: ${HUGGINGFACE_MODELS.length} моделей\n\n` +
                `<b>🏆 Топ модели:</b>\n` +
                `• LLaMA 3.3 70B - самая мощная\n` +
                `• Qwen 2.5 Coder 32B - для кода\n` +
                `• Mixtral 8x7B - быстрая MoE\n` +
                `• Gemma 2 - от Google\n\n` +
                `<b>💻 Мои возможности:</b>\n` +
                `• Telegram боты (aiogram 3.x)\n` +
                `• Веб-сайты и приложения\n` +
                `• REST API и бэкенды\n` +
                `• Любой код на 100+ языках\n\n` +
                `<b>Просто напиши что нужно!</b> 🎯`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🌐 Открыть платформу', url: DOMAIN }],
                            [
                                { text: '🔐 Код для сайта', callback_data: 'auth' },
                                { text: '🤖 Модели', callback_data: 'models' }
                            ],
                            [
                                { text: '🗑️ Очистить чат', callback_data: 'clear' },
                                { text: '📊 Статистика', callback_data: 'stats' }
                            ]
                        ]
                    }
                }
            );
            break;
            
        case '/auth':
            const code = generateCode();
            authCodes.set(code, {
                telegramId: from.id,
                username: from.username || `user${from.id}`,
                firstName: from.first_name,
                createdAt: Date.now()
            });
            setTimeout(() => authCodes.delete(code), 600000);
            
            await send(chatId,
                `🔐 <b>Код для входа на сайт</b>\n\n` +
                `<code>${code}</code>\n\n` +
                `⏰ Действителен 10 минут\n` +
                `📋 Нажми на код чтобы скопировать`,
                { reply_markup: { inline_keyboard: [[{ text: '🌐 Открыть сайт', url: DOMAIN }]] } }
            );
            break;
            
        case '/models':
            const groqList = GROQ_MODELS.slice(0, 5).map(m => `• <b>${m.name}</b> - ${m.description}`).join('\n');
            const hfList = HUGGINGFACE_MODELS.slice(0, 4).map(m => `• <b>${m.name}</b> - ${m.description}`).join('\n');
            
            await send(chatId,
                `🤖 <b>Доступные AI модели (${TOTAL_MODELS})</b>\n\n` +
                `<b>🟢 Groq (${GROQ_MODELS.length}) - Супер быстрые!</b>\n${groqList}\n\n` +
                `<b>🟡 HuggingFace (${HUGGINGFACE_MODELS.length})</b>\n${hfList}\n\n` +
                `⚡ Система автоматически выбирает лучшую доступную модель!`
            );
            break;
            
        case '/status':
            const successRate = db.stats.total > 0 
                ? ((db.stats.success / db.stats.total) * 100).toFixed(1) 
                : 0;
                
            await send(chatId,
                `📊 <b>Статистика NeuroCode AI</b>\n\n` +
                `<b>🤖 Провайдеры:</b>\n` +
                `🟢 Groq: ✅ Работает (${GROQ_MODELS.length} моделей)\n` +
                `🟡 HuggingFace: ✅ Работает (${HUGGINGFACE_MODELS.length} моделей)\n\n` +
                `<b>📈 Статистика:</b>\n` +
                `• Всего запросов: ${db.stats.total}\n` +
                `• Успешных: ${db.stats.success}\n` +
                `• Через Groq: ${db.stats.groq || 0}\n` +
                `• Через HF: ${db.stats.hf || 0}\n` +
                `• Успешность: ${successRate}%\n\n` +
                `<b>👥 Пользователей:</b> ${db.users.length}\n` +
                `<b>⏱️ Аптайм:</b> ${Math.floor(process.uptime() / 3600)}ч ${Math.floor((process.uptime() % 3600) / 60)}м`
            );
            break;
            
        case '/clear':
            chatHistories.delete(chatId);
            await send(chatId, '🗑️ История чата очищена!');
            break;
            
        case '/bot':
            if (!args) {
                await send(chatId,
                    `🤖 <b>Генератор Telegram ботов</b>\n\n` +
                    `<b>Использование:</b>\n<code>/bot описание бота</code>\n\n` +
                    `<b>Примеры:</b>\n` +
                    `• <code>/bot бот для заметок</code>\n` +
                    `• <code>/bot магазин с корзиной</code>\n` +
                    `• <code>/bot бот погоды с API</code>\n` +
                    `• <code>/bot AI чат-бот</code>\n` +
                    `• <code>/bot бот для опросов</code>`
                );
                return;
            }
            await typing(chatId);
            const botResult = await getAIResponse([{
                role: 'user',
                content: `Создай полноценный Telegram бот на Python с aiogram 3.x: ${args}

Требования:
1. Полный рабочий код с всеми импортами
2. Все необходимые handlers
3. Inline и Reply клавиатуры
4. FSM если нужны диалоги
5. Обработка ошибок
6. Комментарии на русском
7. Инструкция по установке и запуску
8. requirements.txt`
            }]);
            await send(chatId, formatTelegram(botResult.content) + `\n\n<i>🤖 ${botResult.provider}: ${botResult.model}</i>`);
            break;
            
        case '/site':
            if (!args) {
                await send(chatId,
                    `🌐 <b>Генератор сайтов</b>\n\n` +
                    `<b>Использование:</b>\n<code>/site описание сайта</code>\n\n` +
                    `<b>Примеры:</b>\n` +
                    `• <code>/site лендинг для кофейни</code>\n` +
                    `• <code>/site портфолио разработчика</code>\n` +
                    `• <code>/site интернет-магазин</code>`
                );
                return;
            }
            await typing(chatId);
            const siteResult = await getAIResponse([{
                role: 'user',
                content: `Создай современный веб-сайт: ${args}

Требования:
1. HTML5 семантическая разметка
2. CSS3 с Flexbox/Grid, анимациями
3. Адаптивный дизайн (mobile-first)
4. JavaScript для интерактивности
5. Красивый современный дизайн
6. Полный рабочий код`
            }]);
            await send(chatId, formatTelegram(siteResult.content) + `\n\n<i>🤖 ${siteResult.provider}: ${siteResult.model}</i>`);
            break;
            
        case '/api':
            if (!args) {
                await send(chatId,
                    `⚡ <b>Генератор API</b>\n\n` +
                    `<b>Использование:</b>\n<code>/api описание API</code>\n\n` +
                    `<b>Примеры:</b>\n` +
                    `• <code>/api REST API для задач</code>\n` +
                    `• <code>/api API для блога</code>\n` +
                    `• <code>/api GraphQL сервер</code>`
                );
                return;
            }
            await typing(chatId);
            const apiResult = await getAIResponse([{
                role: 'user',
                content: `Создай ${args}

Требования:
1. Полный рабочий код
2. Все CRUD операции
3. Валидация данных
4. Обработка ошибок
5. Документация API
6. Инструкция по запуску`
            }]);
            await send(chatId, formatTelegram(apiResult.content) + `\n\n<i>🤖 ${apiResult.provider}: ${apiResult.model}</i>`);
            break;
            
        case '/code':
            if (!args) {
                await send(chatId,
                    `💻 <b>Генератор кода</b>\n\n` +
                    `<b>Использование:</b>\n<code>/code задача</code>\n\n` +
                    `<b>Примеры:</b>\n` +
                    `• <code>/code парсер сайтов на Python</code>\n` +
                    `• <code>/code сортировка массива</code>\n` +
                    `• <code>/code работа с базой данных</code>`
                );
                return;
            }
            await typing(chatId);
            const codeResult = await getAIResponse([{ role: 'user', content: args }]);
            await send(chatId, formatTelegram(codeResult.content) + `\n\n<i>🤖 ${codeResult.provider}: ${codeResult.model}</i>`);
            break;
            
        case '/help':
            await send(chatId,
                `📚 <b>Команды NeuroCode AI</b>\n\n` +
                `<b>🔧 Основные:</b>\n` +
                `/start - Главное меню\n` +
                `/auth - Код для входа на сайт\n` +
                `/status - Статус AI провайдеров\n` +
                `/models - Список моделей\n` +
                `/clear - Очистить историю\n\n` +
                `<b>🤖 Генерация:</b>\n` +
                `/bot описание - Telegram бот\n` +
                `/site описание - Веб-сайт\n` +
                `/api описание - REST API\n` +
                `/code задача - Любой код\n\n` +
                `<b>💡 Или просто пиши сообщения!</b>\n` +
                `AI ответит на любой вопрос о программировании 🚀`
            );
            break;
            
        default:
            await send(chatId, `❓ Неизвестная команда. Напиши /help для списка команд.`);
    }
}

// ═══════════════════════════════════════════════════════════
// ОБРАБОТКА CALLBACK
// ═══════════════════════════════════════════════════════════
async function handleCallback(cb) {
    const chatId = cb.message.chat.id;
    const data = cb.data;
    const from = cb.from;
    
    switch (data) {
        case 'auth':
            const code = generateCode();
            authCodes.set(code, {
                telegramId: from.id,
                username: from.username || `user${from.id}`,
                firstName: from.first_name,
                createdAt: Date.now()
            });
            setTimeout(() => authCodes.delete(code), 600000);
            await answer(cb.id, '✅ Код создан!');
            await send(chatId, `🔐 Код: <code>${code}</code>\n⏰ Действителен 10 минут`);
            break;
            
        case 'models':
            await answer(cb.id);
            await send(chatId,
                `🤖 <b>AI Модели (${TOTAL_MODELS})</b>\n\n` +
                `🟢 <b>Groq (${GROQ_MODELS.length}):</b>\n` +
                GROQ_MODELS.slice(0, 4).map(m => `• ${m.name}`).join('\n') +
                `\n\n🟡 <b>HuggingFace (${HUGGINGFACE_MODELS.length}):</b>\n` +
                HUGGINGFACE_MODELS.slice(0, 4).map(m => `• ${m.name}`).join('\n') +
                `\n\n<i>Используй /models для полного списка</i>`
            );
            break;
            
        case 'clear':
            chatHistories.delete(chatId);
            await answer(cb.id, '🗑️ История очищена!');
            break;
            
        case 'stats':
            await answer(cb.id);
            await send(chatId,
                `📊 Запросов: ${db.stats.total}\n` +
                `✅ Успешных: ${db.stats.success}\n` +
                `🟢 Groq: ${db.stats.groq || 0}\n` +
                `🟡 HF: ${db.stats.hf || 0}`
            );
            break;
    }
}

// ═══════════════════════════════════════════════════════════
// ОБРАБОТКА ЧАТА
// ═══════════════════════════════════════════════════════════
async function handleChat(chatId, text, from) {
    await typing(chatId);
    
    // История чата
    if (!chatHistories.has(chatId)) {
        chatHistories.set(chatId, []);
    }
    
    const history = chatHistories.get(chatId);
    history.push({ role: 'user', content: text });
    
    // Ограничение истории
    if (history.length > 20) {
        history.splice(0, history.length - 20);
    }
    
    try {
        // Отправляем typing каждые 4 секунды
        const typingInterval = setInterval(() => typing(chatId), 4000);
        
        const result = await getAIResponse(history);
        
        clearInterval(typingInterval);
        
        // Добавляем в историю
        history.push({ role: 'assistant', content: result.content });
        
        // Форматируем и отправляем
        const formatted = formatTelegram(result.content);
        
        await send(chatId,
            formatted + `\n\n<i>🤖 ${result.provider}: ${result.model}</i>`,
            {
                reply_markup: {
                    inline_keyboard: [[
                        { text: '🗑️ Очистить', callback_data: 'clear' },
                        { text: '🤖 Модели', callback_data: 'models' }
                    ]]
                }
            }
        );
        
        // Обновляем статистику пользователя
        const user = db.users.find(u => u.telegramId === from.id);
        if (user) {
            user.requestsToday = (user.requestsToday || 0) + 1;
            user.totalRequests = (user.totalRequests || 0) + 1;
            saveDB();
        }
        
        console.log(`💬 ${from.first_name}: "${text.substring(0, 30)}..." → ${result.provider}/${result.model}`);
        
    } catch (e) {
        console.error('Chat error:', e);
        await send(chatId, '❌ Произошла ошибка. Попробуй ещё раз или напиши /status');
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
        providers: {
            groq: { active: true, models: GROQ_MODELS.length },
            huggingface: { active: true, models: HUGGINGFACE_MODELS.length }
        },
        totalModels: TOTAL_MODELS,
        stats: db.stats,
        users: db.users.length,
        uptime: process.uptime()
    });
});

app.get('/api/models', (req, res) => {
    res.json({
        groq: GROQ_MODELS,
        huggingface: HUGGINGFACE_MODELS,
        total: TOTAL_MODELS
    });
});

app.post('/api/auth/verify', (req, res) => {
    const { code } = req.body;
    if (!code || code.length !== 6) return res.status(400).json({ error: 'Неверный код' });
    
    const data = authCodes.get(code.toUpperCase());
    if (!data) return res.status(401).json({ error: 'Код не найден или истёк' });
    
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
            totalRequests: 0,
            createdAt: new Date().toISOString()
        };
        db.users.push(user);
        saveDB();
        console.log(`✅ New user: ${user.username}`);
    }
    
    res.json(user);
});

app.post('/api/auth/check', (req, res) => {
    const { telegramId } = req.body;
    const user = db.users.find(u => u.telegramId == telegramId);
    res.json({ valid: !!user, user });
});

// OpenAI-совместимый Chat API
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
        const result = await getAIResponse(messages);
        
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
            }],
            usage: {
                prompt_tokens: messages.reduce((a, m) => a + (m.content?.length || 0) / 4, 0) | 0,
                completion_tokens: result.content.length / 4 | 0
            }
        });
        
    } catch (e) {
        console.error('API error:', e);
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
<title>NeuroCode AI - ${TOTAL_MODELS} бесплатных AI моделей</title>
<meta name="description" content="Бесплатный AI для программистов. ${TOTAL_MODELS} моделей: LLaMA 3.3 70B, Qwen Coder, Mixtral, Gemma">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#0a0a0f;--card:#12121a;--border:#1e1e2e;--text:#e8e8e8;--dim:#6b7280;--purple:#8b5cf6;--pink:#ec4899;--green:#10b981;--yellow:#f59e0b}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.hidden{display:none!important}
button{cursor:pointer;font-family:inherit;border:none;transition:all .2s}
input{font-family:inherit;background:rgba(255,255,255,0.05);border:1px solid var(--border);padding:14px;color:#fff;border-radius:12px;font-size:14px;width:100%}
input:focus{outline:none;border-color:var(--purple)}
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--card);border:1px solid var(--purple);padding:14px 28px;border-radius:12px;opacity:0;transition:.3s;z-index:9999}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}

.header{position:sticky;top:0;z-index:50;backdrop-filter:blur(20px);background:rgba(10,10,15,0.85);border-bottom:1px solid var(--border)}
.header-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px;padding:0 20px}
.logo{display:flex;align-items:center;gap:12px;cursor:pointer}
.logo-icon{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-size:20px}
.logo-text{font-size:20px;font-weight:800;background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav{display:flex;gap:4px}
.nav button{padding:10px 16px;border-radius:8px;background:transparent;color:var(--dim);font-size:14px;font-weight:500}
.nav button:hover,.nav button.active{background:rgba(139,92,246,0.15);color:#a78bfa}
.btn{padding:12px 24px;border-radius:12px;font-weight:600;font-size:14px}
.btn-primary{background:linear-gradient(135deg,var(--purple),var(--pink));color:#fff}
.btn-primary:hover{opacity:0.9;transform:translateY(-1px)}
.btn-secondary{background:rgba(255,255,255,0.05);color:#fff;border:1px solid var(--border)}
.user-menu{display:flex;align-items:center;gap:10px;padding:6px 12px;border-radius:10px;background:rgba(255,255,255,0.05);cursor:pointer}
.user-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-weight:600}

.hero{padding:80px 20px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-300px;right:-300px;width:600px;height:600px;background:radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%);pointer-events:none}
.hero h1{font-size:clamp(32px,6vw,64px);font-weight:800;line-height:1.1;margin-bottom:24px}
.hero h1 span{background:linear-gradient(135deg,#a78bfa,#f472b6,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:200% auto;animation:shine 3s linear infinite}
@keyframes shine{to{background-position:200% center}}
.hero p{font-size:18px;color:var(--dim);margin-bottom:32px}
.hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.hero-buttons .btn{padding:16px 32px;font-size:16px}
.badge{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:50px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);font-size:14px;color:var(--green);margin-bottom:24px}
.badge-dot{width:8px;height:8px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

.providers{display:flex;gap:16px;justify-content:center;margin-top:40px;flex-wrap:wrap}
.provider-card{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px 24px;display:flex;align-items:center;gap:12px}
.provider-icon{font-size:24px}
.provider-info h4{font-size:14px}
.provider-info p{font-size:12px;color:var(--dim)}

.models-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;max-width:1200px;margin:40px auto;padding:0 20px}
.model-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;transition:all .3s}
.model-card:hover{border-color:var(--purple);transform:translateY(-4px)}
.model-card h3{font-size:15px;margin-bottom:4px;display:flex;align-items:center;gap:8px}
.model-card p{font-size:13px;color:var(--dim)}
.model-badge{font-size:10px;padding:3px 8px;border-radius:6px}
.model-badge.groq{background:rgba(16,185,129,0.2);color:var(--green)}
.model-badge.hf{background:rgba(245,158,11,0.2);color:var(--yellow)}

.section{padding:40px 20px;max-width:1000px;margin:0 auto}
.chat-container{background:var(--card);border-radius:20px;border:1px solid var(--border);overflow:hidden}
.chat-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
.chat-status{width:10px;height:10px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
.chat-messages{height:450px;overflow-y:auto;padding:20px;scroll-behavior:smooth}
.message{max-width:85%;margin-bottom:16px;padding:14px 18px;border-radius:18px;font-size:14px;line-height:1.7}
.message.user{background:linear-gradient(135deg,var(--purple),var(--pink));margin-left:auto;border-bottom-right-radius:4px}
.message.bot{background:rgba(255,255,255,0.05);border-bottom-left-radius:4px}
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
    .providers{flex-direction:column;align-items:center}
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
<div style="text-align:center;color:var(--dim);margin:20px 0;font-size:14px">Введите 6-значный код</div>
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
<div class="badge"><div class="badge-dot"></div>${TOTAL_MODELS} бесплатных AI моделей</div>
<h1>Мощнейший <span>AI для разработчиков</span></h1>
<p>Бесплатный доступ к LLaMA 3.3 70B, Qwen Coder, Mixtral и другим через Groq и HuggingFace</p>
<div class="hero-buttons">
<button class="btn btn-primary" onclick="showSection('chat')">🚀 Начать бесплатно</button>
<button class="btn btn-secondary" onclick="showSection('api')">📖 API</button>
</div>
<div class="providers">
<div class="provider-card"><div class="provider-icon">🟢</div><div class="provider-info"><h4>Groq</h4><p>${GROQ_MODELS.length} моделей • Супер быстрый!</p></div></div>
<div class="provider-card"><div class="provider-icon">🟡</div><div class="provider-info"><h4>HuggingFace</h4><p>${HUGGINGFACE_MODELS.length} моделей</p></div></div>
</div>
</div>
<div class="models-grid" id="modelsGrid"></div>
</section>

<section id="chat" class="section hidden">
<div class="chat-container">
<div class="chat-header"><div class="chat-status"></div><span style="font-weight:600">NeuroCode AI</span><span style="color:var(--dim);margin-left:8px;font-size:13px">• ${TOTAL_MODELS} моделей • Онлайн</span></div>
<div class="chat-messages" id="chatMessages">
<div class="message bot">👋 Привет! Я <b>NeuroCode AI</b> - бесплатный AI для программистов.<br><br>🟢 <b>Groq</b> - ${GROQ_MODELS.length} супер быстрых моделей<br>🟡 <b>HuggingFace</b> - ${HUGGINGFACE_MODELS.length} моделей<br><br>Просто напиши, что нужно создать! 🚀</div>
</div>
<div class="quick-actions">
<button class="quick-btn" onclick="sendQuick('Напиши Telegram бота на aiogram 3')">🤖 Бот</button>
<button class="quick-btn" onclick="sendQuick('Создай REST API на Express')">🌐 API</button>
<button class="quick-btn" onclick="sendQuick('Сделай лендинг HTML/CSS')">📄 Сайт</button>
<button class="quick-btn" onclick="sendQuick('Напиши парсер на Python')">🕷️ Парсер</button>
</div>
<div class="chat-input">
<input type="text" id="chatInput" placeholder="Опишите что нужно создать..." onkeydown="if(event.key==='Enter')sendMessage()">
<button class="btn btn-primary" onclick="sendMessage()" style="padding:12px 20px">➤</button>
</div>
</div>
</section>

<section id="api" class="section hidden">
<h2>📖 API Документация</h2>
<p style="color:var(--dim);margin:16px 0 24px">OpenAI-совместимый API • ${TOTAL_MODELS} моделей</p>
<pre style="background:var(--card);padding:20px;border-radius:12px;overflow-x:auto;border:1px solid var(--border)"><code style="color:var(--green)">curl -X POST ${DOMAIN}/api/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [{"role": "user", "content": "Привет!"}]
  }'</code></pre>
<p style="margin-top:24px;color:var(--dim)">🔑 Получите API ключ через /auth в Telegram боте @${BOT_USERNAME}</p>
</section>

<footer class="footer">
<p>© 2025 NeuroCode AI • ${TOTAL_MODELS} бесплатных моделей</p>
<p style="margin-top:8px"><a href="https://t.me/${BOT_USERNAME}">Telegram бот</a></p>
</footer>

<script>
const GROQ = ${JSON.stringify(GROQ_MODELS)};
const HF = ${JSON.stringify(HUGGINGFACE_MODELS)};
let user = null, chatHistory = [];
const $ = id => document.getElementById(id);
const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500); };

function renderModels() {
    const all = [...GROQ.map(m=>({...m,prov:'groq'})), ...HF.map(m=>({...m,prov:'hf'}))];
    $('modelsGrid').innerHTML = all.map(m => \`
        <div class="model-card">
            <h3>\${m.name} <span class="model-badge \${m.prov}">\${m.prov==='groq'?'🟢 Groq':'🟡 HF'}</span></h3>
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
        $('typing').outerHTML = '<div class="message bot">'+html+'<div style="font-size:11px;color:var(--dim);margin-top:8px">🤖 '+d.provider+': '+d.model+'</div></div>';
    } catch(e) { $('typing').outerHTML = '<div class="message bot">❌ Ошибка</div>'; }
    messages.scrollTop = messages.scrollHeight;
}

function sendQuick(msg) { $('chatInput').value = msg; sendMessage(); }

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
app.listen(PORT, async () => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 NeuroCode AI v2.0 запущен!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🌐 Домен: ${DOMAIN}`);
    console.log(`📡 Порт: ${PORT}`);
    console.log(`👥 Пользователей: ${db.users.length}`);
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`🤖 AI Модели: ${TOTAL_MODELS}`);
    console.log(`   🟢 Groq: ${GROQ_MODELS.length} моделей (супер быстрые!)`);
    GROQ_MODELS.forEach(m => console.log(`      • ${m.name}`));
    console.log(`   🟡 HuggingFace: ${HUGGINGFACE_MODELS.length} моделей`);
    HUGGINGFACE_MODELS.forEach(m => console.log(`      • ${m.name}`));
    console.log('═══════════════════════════════════════════════════════════');
    
    // Установка Webhook
    try {
        const r = await fetch(`${TG_API}/setWebhook?url=${DOMAIN}${WEBHOOK_PATH}`);
        const d = await r.json();
        console.log('📱 Telegram:', d.ok ? '✅ Webhook установлен' : '❌ ' + d.description);
    } catch (e) {
        console.log('❌ Webhook error:', e.message);
    }
    console.log('═══════════════════════════════════════════════════════════');
});

process.on('SIGINT', () => { saveDB(); process.exit(); });
process.on('SIGTERM', () => { saveDB(); process.exit(); });
