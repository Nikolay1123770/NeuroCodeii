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
// OPENROUTER API KEY
// ═══════════════════════════════════════════════════════════
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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';

// Бесплатные модели OpenRouter (отсортированы по качеству для кода)
const FREE_MODELS = [
    {
        id: 'qwen/qwen-2.5-coder-32b-instruct:free',
        name: 'Qwen 2.5 Coder 32B',
        description: '🏆 Лучшая для кода',
        forCode: true
    },
    {
        id: 'deepseek/deepseek-r1-distill-qwen-32b:free',
        name: 'DeepSeek R1 32B',
        description: '🧠 Мощный reasoning',
        forCode: true
    },
    {
        id: 'meta-llama/llama-3.3-70b-instruct:free',
        name: 'LLaMA 3.3 70B',
        description: '🦙 Самая умная LLaMA',
        forCode: true
    },
    {
        id: 'google/gemini-2.0-flash-exp:free',
        name: 'Gemini 2.0 Flash',
        description: '✨ Google Gemini 2.0',
        forCode: true
    },
    {
        id: 'meta-llama/llama-3.1-8b-instruct:free',
        name: 'LLaMA 3.1 8B',
        description: '⚡ Быстрая и умная',
        forCode: true
    },
    {
        id: 'google/gemma-2-9b-it:free',
        name: 'Gemma 2 9B',
        description: '🔷 Google Gemma',
        forCode: true
    },
    {
        id: 'qwen/qwen-2-7b-instruct:free',
        name: 'Qwen 2 7B',
        description: '🇨🇳 Alibaba Qwen',
        forCode: true
    },
    {
        id: 'mistralai/mistral-7b-instruct:free',
        name: 'Mistral 7B',
        description: '🌀 Mistral AI',
        forCode: true
    },
    {
        id: 'microsoft/phi-3-mini-128k-instruct:free',
        name: 'Phi-3 Mini',
        description: '🔬 Microsoft Phi',
        forCode: false
    },
    {
        id: 'openchat/openchat-7b:free',
        name: 'OpenChat 7B',
        description: '💬 Чат модель',
        forCode: false
    },
    {
        id: 'huggingfaceh4/zephyr-7b-beta:free',
        name: 'Zephyr 7B',
        description: '🌬️ HuggingFace',
        forCode: false
    }
];

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ═══════════════════════════════════════════════════════════
// БАЗА ДАННЫХ
// ═══════════════════════════════════════════════════════════
const DB_FILE = path.join(__dirname, 'database.json');
let db = { users: [], stats: { totalRequests: 0, successfulRequests: 0 } };
const authCodes = new Map();
const chatHistories = new Map();

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
// AI СИСТЕМА С МНОЖЕСТВОМ МОДЕЛЕЙ
// ═══════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `Ты - NeuroCode AI, эксперт-программист мирового уровня.

ТВОИ ЗАДАЧИ:
1. Писать чистый, рабочий код с комментариями
2. Создавать Telegram ботов (Python/Node.js)
3. Разрабатывать веб-сайты (HTML/CSS/JS/React)
4. Создавать REST API и бэкенды
5. Помогать с любыми задачами программирования

ПРАВИЛА:
- Всегда отвечай на русском языке
- Код оборачивай в \`\`\`язык ... \`\`\`
- Давай готовый к использованию код
- Объясняй что делает код
- Если нужны библиотеки - указывай как установить
- Будь дружелюбным и полезным

ТВОИ МОДЕЛИ: Qwen Coder, DeepSeek, LLaMA 3.3, Gemini 2.0 и другие.`;

// Основная функция вызова OpenRouter
async function callOpenRouter(messages, modelId = null) {
    const model = modelId || FREE_MODELS[0].id;
    
    try {
        console.log(`🤖 Calling ${model}...`);
        
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'HTTP-Referer': DOMAIN,
                'X-Title': 'NeuroCode AI'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    ...messages
                ],
                temperature: 0.7,
                max_tokens: 4096,
                top_p: 0.9
            })
        });
        
        const data = await response.json();
        
        if (data.choices?.[0]?.message?.content) {
            console.log(`✅ ${model} - OK`);
            db.stats.successfulRequests++;
            return {
                content: data.choices[0].message.content,
                model: model,
                provider: 'OpenRouter'
            };
        }
        
        if (data.error) {
            console.log(`❌ ${model} error:`, data.error.message || data.error);
        }
        
        return null;
        
    } catch (e) {
        console.log(`❌ ${model} error:`, e.message);
        return null;
    }
}

// Умный выбор модели с fallback
async function getAIResponse(messages, preferCodeModel = true) {
    db.stats.totalRequests++;
    
    // Определяем порядок моделей
    let modelsToTry = [...FREE_MODELS];
    
    // Если нужен код - сначала пробуем кодовые модели
    if (preferCodeModel) {
        modelsToTry.sort((a, b) => (b.forCode ? 1 : 0) - (a.forCode ? 1 : 0));
    }
    
    // Пробуем модели по очереди
    for (const model of modelsToTry) {
        const result = await callOpenRouter(messages, model.id);
        if (result) {
            return result;
        }
        
        // Небольшая пауза между попытками
        await new Promise(r => setTimeout(r, 500));
    }
    
    // Fallback ответ
    return {
        content: `К сожалению, все AI модели сейчас перегружены. 

Попробуйте через минуту или используйте другую формулировку запроса.

**Доступные модели:**
${FREE_MODELS.slice(0, 5).map(m => `• ${m.name}`).join('\n')}`,
        model: 'fallback',
        provider: 'System'
    };
}

// Быстрый запрос к конкретной модели
async function askModel(modelId, question) {
    return await callOpenRouter([{ role: 'user', content: question }], modelId);
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
    
    // Ограничение длины
    if (text.length > 4000) {
        text = text.substring(0, 3900) + '\n\n... (сообщение обрезано)';
    }
    
    // Форматирование
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
    res.sendStatus(200); // Быстрый ответ Telegram
    
    const { message, callback_query } = req.body;
    
    if (callback_query) {
        await handleCallback(callback_query);
        return;
    }
    
    if (!message?.text) return;
    
    const chatId = message.chat.id;
    const text = message.text;
    const from = message.from;
    
    // Команды
    if (text.startsWith('/')) {
        await handleCommand(chatId, text, from);
        return;
    }
    
    // AI чат
    await handleAIChat(chatId, text, from);
});

async function handleCommand(chatId, text, from) {
    const cmd = text.split(' ')[0].toLowerCase();
    const args = text.slice(cmd.length).trim();
    
    switch (cmd) {
        case '/start':
            const user = db.users.find(u => u.telegramId === from.id);
            await sendMessage(chatId,
                `🚀 <b>NeuroCode AI</b>\n\n` +
                `Привет, ${from.first_name}! 👋\n\n` +
                `Я - <b>бесплатный AI помощник</b> для программистов.\n\n` +
                `<b>🤖 Мои возможности:</b>\n` +
                `• Пишу код на 50+ языках\n` +
                `• Создаю Telegram ботов\n` +
                `• Разрабатываю веб-сайты\n` +
                `• Делаю REST API\n` +
                `• Нахожу и исправляю баги\n\n` +
                `<b>🧠 AI модели:</b>\n` +
                `• Qwen 2.5 Coder 32B 🏆\n` +
                `• DeepSeek R1 32B\n` +
                `• LLaMA 3.3 70B\n` +
                `• Gemini 2.0 Flash\n` +
                `• И 7 других...\n\n` +
                `<b>Просто напиши что нужно!</b>\n\n` +
                `Примеры:\n` +
                `• "Напиши Telegram бота для погоды"\n` +
                `• "Создай REST API на Express"\n` +
                `• "Сделай лендинг для кофейни"` +
                (user ? `\n\n✅ Авторизован | ${user.requestsToday}/${user.requestsLimit} запросов` : ''),
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🌐 Открыть платформу', url: DOMAIN }],
                            [
                                { text: '🔐 Код для сайта', callback_data: 'get_code' },
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
                `🔐 <b>Код для входа на сайт</b>\n\n` +
                `<code>${code}</code>\n\n` +
                `⏰ Действителен 10 минут\n` +
                `📋 Нажми на код чтобы скопировать`,
                { reply_markup: { inline_keyboard: [[{ text: '🌐 Открыть сайт', url: DOMAIN }]] } }
            );
            break;
            
        case '/models':
            const modelsList = FREE_MODELS.map((m, i) => 
                `${i + 1}. <b>${m.name}</b>\n   ${m.description}`
            ).join('\n\n');
            
            await sendMessage(chatId,
                `🤖 <b>Доступные AI модели</b>\n\n${modelsList}\n\n` +
                `Все модели бесплатные и работают 24/7!\n` +
                `Система автоматически выбирает лучшую.`
            );
            break;
            
        case '/clear':
            chatHistories.delete(chatId);
            await sendMessage(chatId, '🗑️ История чата очищена!');
            break;
            
        case '/stats':
            await sendMessage(chatId,
                `📊 <b>Статистика NeuroCode AI</b>\n\n` +
                `👥 Пользователей: ${db.users.length}\n` +
                `🔢 Всего запросов: ${db.stats.totalRequests}\n` +
                `✅ Успешных: ${db.stats.successfulRequests}\n` +
                `🤖 Моделей: ${FREE_MODELS.length}\n` +
                `⏱️ Аптайм: ${Math.floor(process.uptime() / 3600)}ч`
            );
            break;
            
        case '/profile':
            const u = db.users.find(u => u.telegramId === from.id);
            if (!u) {
                await sendMessage(chatId, '❌ Сначала авторизуйся: /auth');
                return;
            }
            await sendMessage(chatId,
                `👤 <b>Твой профиль</b>\n\n` +
                `📛 ${u.firstName}\n` +
                `🎫 @${u.username}\n` +
                `💎 ${u.plan.toUpperCase()}\n` +
                `📊 ${u.requestsToday}/${u.requestsLimit} запросов\n\n` +
                `🔑 <b>API Key:</b>\n<code>${u.apiKey}</code>`,
                { reply_markup: { inline_keyboard: [[{ text: '🔄 Новый ключ', callback_data: 'refresh_key' }]] } }
            );
            break;
            
        case '/code':
            if (!args) {
                await sendMessage(chatId, '❓ Использование: /code <описание>\n\nПример: /code telegram бот для заметок');
                return;
            }
            await sendTyping(chatId);
            const codeResult = await askModel(FREE_MODELS[0].id, 
                `Напиши полный рабочий код: ${args}. Добавь комментарии и инструкцию по запуску.`);
            await sendMessage(chatId, formatForTelegram(codeResult?.content));
            break;
            
        case '/help':
            await sendMessage(chatId,
                `📚 <b>Команды NeuroCode AI</b>\n\n` +
                `<b>Основные:</b>\n` +
                `/start - Главное меню\n` +
                `/auth - Код для сайта\n` +
                `/profile - Профиль и API\n\n` +
                `<b>AI:</b>\n` +
                `/code <задача> - Быстрая генерация\n` +
                `/models - Список AI моделей\n` +
                `/clear - Очистить историю\n` +
                `/stats - Статистика\n\n` +
                `<b>Или просто пиши сообщения!</b>\n` +
                `AI ответит на любой вопрос о коде 🤖`
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
                lastName: from.last_name,
                createdAt: Date.now()
            });
            setTimeout(() => authCodes.delete(code), 600000);
            
            await answerCallback(callback.id, '✅ Код создан!');
            await sendMessage(chatId,
                `🔐 <code>${code}</code>\n⏰ 10 минут`,
                { reply_markup: { inline_keyboard: [[{ text: '🌐 Сайт', url: DOMAIN }]] } }
            );
            break;
            
        case 'clear':
            chatHistories.delete(chatId);
            await answerCallback(callback.id, '🗑️ Очищено!');
            break;
            
        case 'models':
            await answerCallback(callback.id);
            await sendMessage(chatId,
                `🤖 <b>AI Модели</b>\n\n` +
                FREE_MODELS.slice(0, 6).map(m => `• <b>${m.name}</b> - ${m.description}`).join('\n')
            );
            break;
            
        case 'stats':
            await answerCallback(callback.id);
            await sendMessage(chatId,
                `📊 Запросов: ${db.stats.totalRequests}\n✅ Успешных: ${db.stats.successfulRequests}`
            );
            break;
            
        case 'refresh_key':
            const user = db.users.find(u => u.telegramId === from.id);
            if (user) {
                user.apiKey = generateApiKey();
                saveDB();
                await answerCallback(callback.id, '✅ Ключ обновлен!');
                await sendMessage(chatId, `🔑 Новый API ключ:\n<code>${user.apiKey}</code>`);
            }
            break;
    }
}

async function handleAIChat(chatId, text, from) {
    await sendTyping(chatId);
    
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
    
    // Определяем нужен ли код
    const needsCode = /код|напиши|создай|сделай|бот|сайт|api|функци|скрипт|программ/i.test(text);
    
    try {
        // Отправляем typing каждые 4 секунды
        const typingInterval = setInterval(() => sendTyping(chatId), 4000);
        
        const { content, model, provider } = await getAIResponse(history, needsCode);
        
        clearInterval(typingInterval);
        
        // Добавляем в историю
        history.push({ role: 'assistant', content });
        
        // Форматируем и отправляем
        const formatted = formatForTelegram(content);
        const modelName = FREE_MODELS.find(m => m.id === model)?.name || model;
        
        await sendMessage(chatId, 
            formatted + `\n\n<i>🤖 ${modelName}</i>`,
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
        
        console.log(`💬 ${from.first_name}: "${text.substring(0, 40)}..." → ${modelName}`);
        
    } catch (e) {
        console.error('AI Chat error:', e);
        await sendMessage(chatId, '❌ Произошла ошибка. Попробуй ещё раз.');
    }
}

// ═══════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'NeuroCode AI',
        users: db.users.length,
        models: FREE_MODELS.length,
        stats: db.stats,
        uptime: process.uptime()
    });
});

app.get('/api/models', (req, res) => {
    res.json(FREE_MODELS.map(m => ({
        id: m.id,
        name: m.name,
        description: m.description,
        forCode: m.forCode
    })));
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
        console.log(`✅ New user: ${user.username}`);
    }
    
    res.json(user);
});

app.post('/api/auth/check', (req, res) => {
    const { telegramId } = req.body;
    const user = db.users.find(u => u.telegramId == telegramId);
    res.json({ valid: !!user, user });
});

// Основной Chat API
app.post('/api/v1/chat/completions', async (req, res) => {
    const auth = req.headers.authorization?.replace('Bearer ', '');
    const user = db.users.find(u => u.apiKey === auth);
    
    if (!user && auth !== 'demo') {
        return res.status(401).json({ error: 'Invalid API key' });
    }
    
    const { messages, model } = req.body;
    if (!messages?.length) {
        return res.status(400).json({ error: 'Messages required' });
    }
    
    try {
        const preferredModel = model && FREE_MODELS.find(m => m.id.includes(model));
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
<title>NeuroCode AI - Бесплатный AI для разработчиков</title>
<meta name="description" content="Бесплатный AI для создания ботов, сайтов и приложений. 11 моделей: Qwen Coder, DeepSeek, LLaMA 3.3, Gemini 2.0">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#0a0a0f;--card:#12121a;--border:#1e1e2e;--text:#e8e8e8;--dim:#6b7280;--purple:#8b5cf6;--pink:#ec4899;--green:#10b981;--blue:#3b82f6}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh}
.hidden{display:none!important}
button{cursor:pointer;font-family:inherit;border:none;transition:all .2s}
input,textarea{font-family:inherit;background:rgba(255,255,255,0.05);border:1px solid var(--border);padding:14px 16px;color:#fff;border-radius:12px;font-size:14px;width:100%}
input:focus,textarea:focus{outline:none;border-color:var(--purple)}
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
.user-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px}

.hero{padding:80px 20px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-300px;right:-300px;width:600px;height:600px;background:radial-gradient(circle,rgba(139,92,246,0.15),transparent 70%);pointer-events:none}
.hero::after{content:'';position:absolute;bottom:-300px;left:-300px;width:600px;height:600px;background:radial-gradient(circle,rgba(236,72,153,0.1),transparent 70%);pointer-events:none}
.hero-content{position:relative;max-width:900px;margin:0 auto}
.badge{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:50px;background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2);font-size:14px;color:var(--green);margin-bottom:24px}
.badge-dot{width:8px;height:8px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
.hero h1{font-size:clamp(36px,7vw,72px);font-weight:800;line-height:1.1;margin-bottom:24px}
.hero h1 span{background:linear-gradient(135deg,#a78bfa,#f472b6,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:200% auto;animation:shine 3s linear infinite}
@keyframes shine{to{background-position:200% center}}
.hero p{font-size:18px;color:var(--dim);margin-bottom:32px;line-height:1.7}
.hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.hero-buttons .btn{padding:16px 32px;font-size:16px}

.models-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;max-width:1200px;margin:60px auto 0;padding:0 20px}
.model-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;transition:all .3s}
.model-card:hover{border-color:var(--purple);transform:translateY(-4px)}
.model-card h3{font-size:16px;margin-bottom:4px;display:flex;align-items:center;gap:8px}
.model-card p{font-size:13px;color:var(--dim)}
.model-badge{font-size:11px;padding:4px 8px;border-radius:6px;background:rgba(139,92,246,0.2);color:#a78bfa}
.model-badge.code{background:rgba(16,185,129,0.2);color:var(--green)}

.section{padding:40px 20px;max-width:1000px;margin:0 auto}
.chat-container{background:var(--card);border-radius:20px;border:1px solid var(--border);overflow:hidden}
.chat-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
.chat-status{width:10px;height:10px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
.chat-messages{height:450px;overflow-y:auto;padding:20px;scroll-behavior:smooth}
.message{max-width:85%;margin-bottom:16px;padding:14px 18px;border-radius:18px;font-size:14px;line-height:1.7}
.message.user{background:linear-gradient(135deg,var(--purple),var(--pink));margin-left:auto;border-bottom-right-radius:4px}
.message.bot{background:rgba(255,255,255,0.05);border-bottom-left-radius:4px}
.message pre{background:rgba(0,0,0,0.4);padding:14px;border-radius:10px;margin:12px 0;overflow-x:auto;font-size:13px;line-height:1.5}
.message code{font-family:'Fira Code',monospace}
.message .model-tag{font-size:11px;color:var(--dim);margin-top:8px}
.typing{display:flex;gap:4px;padding:16px}
.typing span{width:8px;height:8px;border-radius:50%;background:var(--purple);animation:bounce .6s infinite}
.typing span:nth-child(2){animation-delay:.1s}
.typing span:nth-child(3){animation-delay:.2s}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
.chat-input{padding:16px;border-top:1px solid var(--border);display:flex;gap:12px}
.quick-actions{display:flex;gap:8px;padding:0 20px 16px;flex-wrap:wrap}
.quick-btn{padding:10px 16px;border-radius:20px;background:rgba(139,92,246,0.1);color:#a78bfa;font-size:13px;border:none;white-space:nowrap}
.quick-btn:hover{background:rgba(139,92,246,0.2)}

.api-card{background:var(--card);border-radius:16px;border:1px solid var(--border);margin-bottom:20px;overflow:hidden}
.api-header{padding:14px 20px;background:rgba(255,255,255,0.02);display:flex;align-items:center;gap:12px;font-family:monospace}
.method{padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600}
.method.post{background:rgba(16,185,129,0.2);color:var(--green)}
.method.get{background:rgba(59,130,246,0.2);color:var(--blue)}
.api-body{padding:20px}
.api-body pre{background:rgba(0,0,0,0.3);padding:16px;border-radius:10px;overflow-x:auto;font-size:13px}
.api-body code{color:var(--green)}

.modal{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px)}
.modal-content{position:relative;width:100%;max-width:420px;background:var(--card);border-radius:20px;border:1px solid var(--border)}
.modal-header{padding:20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.modal-body{padding:24px}
.code-input{text-align:center;font-size:28px;letter-spacing:10px;font-weight:700;text-transform:uppercase}

.profile-dropdown{position:absolute;top:70px;right:20px;width:340px;background:var(--card);border-radius:16px;border:1px solid var(--border);z-index:100;box-shadow:0 20px 40px rgba(0,0,0,0.3)}
.profile-header{padding:20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px}
.profile-avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600}
.profile-stats{padding:16px 20px;border-bottom:1px solid var(--border)}
.progress-bar{height:6px;background:rgba(255,255,255,0.1);border-radius:3px;margin-top:10px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--purple),var(--pink));border-radius:3px;transition:width .3s}

.footer{border-top:1px solid var(--border);padding:40px 20px;margin-top:60px;text-align:center;color:var(--dim)}
.footer a{color:var(--purple);text-decoration:none}

@media(max-width:768px){
    .nav{display:none}
    .hero h1{font-size:32px}
    .hero-buttons{flex-direction:column;align-items:center}
    .hero-buttons .btn{width:100%;max-width:300px}
    .models-grid{grid-template-columns:1fr}
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
<h2>Вход через Telegram</h2>
<button onclick="closeAuth()" style="background:none;color:var(--dim);font-size:24px">×</button>
</div>
<div class="modal-body">
<div style="text-align:center;margin-bottom:24px">
<div style="width:80px;height:80px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,#0088cc,#00aaff);display:flex;align-items:center;justify-content:center;font-size:40px">✈️</div>
<p style="color:var(--dim)">Напишите <b style="color:#a78bfa">/auth</b> боту</p>
<p style="color:var(--dim);font-size:14px;margin-top:4px">@${BOT_USERNAME}</p>
</div>
<a href="https://t.me/${BOT_USERNAME}" target="_blank" style="display:block;margin-bottom:20px;text-decoration:none">
<button class="btn btn-primary" style="width:100%;background:linear-gradient(135deg,#0088cc,#00aaff)">✈️ Открыть бота</button>
</a>
<div style="text-align:center;color:var(--dim);margin:20px 0;font-size:14px">Введите 6-значный код</div>
<input type="text" class="code-input" id="authCode" placeholder="XXXXXX" maxlength="6" autocomplete="off">
<button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="verifyCode()" id="verifyBtn">Войти</button>
<p id="authError" style="color:#ef4444;text-align:center;margin-top:12px;font-size:14px"></p>
</div>
</div>
</div>

<!-- Profile Dropdown -->
<div class="profile-dropdown hidden" id="profileDropdown">
<div class="profile-header">
<div class="profile-avatar" id="pAvatar">U</div>
<div>
<h4 id="pName">User</h4>
<p style="font-size:13px;color:var(--dim)" id="pUsername">@user</p>
</div>
</div>
<div class="profile-stats">
<div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:4px">
<span style="color:var(--dim)">Тариф</span>
<span id="pPlan" style="color:var(--green)">FREE</span>
</div>
<div style="display:flex;justify-content:space-between;font-size:14px">
<span style="color:var(--dim)">Запросов сегодня</span>
<span id="pReq">0/1000</span>
</div>
<div class="progress-bar"><div class="progress-fill" id="pProgress" style="width:0%"></div></div>
</div>
<div style="padding:16px 20px;border-bottom:1px solid var(--border)">
<label style="font-size:13px;color:var(--dim);display:block;margin-bottom:8px">🔑 API Key</label>
<div style="display:flex;gap:8px">
<code id="pKey" style="flex:1;padding:12px;background:rgba(255,255,255,0.05);border-radius:8px;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">nc_xxx...xxx</code>
<button onclick="copyKey()" style="padding:12px;border-radius:8px;background:rgba(255,255,255,0.05);color:#fff;font-size:16px">📋</button>
</div>
<button class="btn btn-secondary" style="width:100%;margin-top:12px" onclick="refreshKey()">🔄 Обновить ключ</button>
</div>
<div style="padding:12px">
<button onclick="logout()" style="width:100%;padding:12px;border-radius:10px;background:rgba(239,68,68,0.1);color:#ef4444;font-size:14px">🚪 Выйти</button>
</div>
</div>

<!-- Header -->
<header class="header">
<div class="header-inner">
<div class="logo" onclick="showSection('home')">
<div class="logo-icon">⚡</div>
<div class="logo-text">NeuroCode AI</div>
</div>
<nav class="nav">
<button onclick="showSection('home')" class="active" data-section="home">Главная</button>
<button onclick="showSection('chat')" data-section="chat">AI Чат</button>
<button onclick="showSection('api')" data-section="api">API</button>
</nav>
<div style="display:flex;align-items:center;gap:12px">
<div id="authButtons">
<button class="btn btn-primary" onclick="openAuth()">Войти</button>
</div>
<div id="userMenu" class="user-menu hidden" onclick="toggleProfile()">
<div class="user-avatar" id="uAvatar">U</div>
<span id="uName" style="font-size:14px">User</span>
</div>
</div>
</div>
</header>

<!-- Home -->
<section id="home">
<div class="hero">
<div class="hero-content">
<div class="badge">
<div class="badge-dot"></div>
11 бесплатных AI моделей
</div>
<h1>Создавайте с <span>ИИ нового поколения</span></h1>
<p>Бесплатный доступ к лучшим AI моделям: Qwen Coder 32B, DeepSeek R1, LLaMA 3.3 70B, Gemini 2.0 Flash. Генерация кода, боты, сайты — всё бесплатно!</p>
<div class="hero-buttons">
<button class="btn btn-primary" onclick="showSection('chat')">🚀 Начать бесплатно</button>
<button class="btn btn-secondary" onclick="showSection('api')">📖 API документация</button>
</div>
</div>
</div>

<div class="models-grid" id="modelsGrid"></div>
</section>

<!-- Chat -->
<section id="chat" class="section hidden">
<div class="chat-container">
<div class="chat-header">
<div class="chat-status"></div>
<span style="font-weight:600">NeuroCode AI</span>
<span style="color:var(--dim);margin-left:8px;font-size:13px">• 11 моделей • Онлайн</span>
</div>
<div class="chat-messages" id="chatMessages">
<div class="message bot">
👋 Привет! Я <b>NeuroCode AI</b> — бесплатный AI для программистов.
<br><br>
<b>Что я умею:</b><br>
• 💻 Писать код на любом языке<br>
• 🤖 Создавать Telegram ботов<br>
• 🌐 Разрабатывать сайты и API<br>
• 🐛 Находить и исправлять баги
<br><br>
<b>Примеры запросов:</b><br>
• "Напиши Telegram бота для погоды"<br>
• "Создай REST API на Express"<br>
• "Сделай калькулятор на Python"
<br><br>
Просто напиши, что нужно! 🚀
</div>
</div>
<div class="quick-actions">
<button class="quick-btn" onclick="sendQuick('Напиши Telegram бота на Python')">🤖 Telegram бот</button>
<button class="quick-btn" onclick="sendQuick('Создай REST API на Node.js')">🌐 REST API</button>
<button class="quick-btn" onclick="sendQuick('Сделай лендинг на HTML/CSS')">📄 Лендинг</button>
<button class="quick-btn" onclick="sendQuick('Напиши парсер сайта на Python')">🕷️ Парсер</button>
</div>
<div class="chat-input">
<input type="text" id="chatInput" placeholder="Опишите что нужно создать..." onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sendMessage()}">
<button class="btn btn-primary" onclick="sendMessage()" style="padding:12px 20px">➤</button>
</div>
</div>
</section>

<!-- API -->
<section id="api" class="section hidden">
<h2 style="margin-bottom:8px">📖 API Документация</h2>
<p style="color:var(--dim);margin-bottom:24px">Совместимо с OpenAI API формат</p>

<div class="api-card">
<div class="api-header">
<span class="method post">POST</span>
<code>/api/v1/chat/completions</code>
</div>
<div class="api-body">
<p style="color:var(--dim);margin-bottom:16px">Генерация ответа с помощью AI. Автоматически выбирает лучшую модель.</p>
<pre><code>curl -X POST ${DOMAIN}/api/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "neurocode-1",
    "messages": [
      {"role": "user", "content": "Напиши Telegram бота"}
    ]
  }'</code></pre>
</div>
</div>

<div class="api-card">
<div class="api-header">
<span class="method get">GET</span>
<code>/api/models</code>
</div>
<div class="api-body">
<p style="color:var(--dim)">Список всех доступных AI моделей</p>
</div>
</div>

<div class="api-card">
<div class="api-header">
<span class="method get">GET</span>
<code>/api/health</code>
</div>
<div class="api-body">
<p style="color:var(--dim)">Статус сервиса и статистика</p>
</div>
</div>

<h3 style="margin:32px 0 16px">🔑 Как получить API ключ</h3>
<ol style="color:var(--dim);line-height:2.2">
<li>Нажмите "Войти" в шапке сайта</li>
<li>Откройте бота @${BOT_USERNAME} в Telegram</li>
<li>Напишите команду <code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px">/auth</code></li>
<li>Введите полученный код на сайте</li>
<li>API ключ будет в вашем профиле</li>
</ol>
</section>

<footer class="footer">
<p>© 2024 NeuroCode AI — Бесплатный AI для разработчиков</p>
<p style="margin-top:8px">
<a href="https://t.me/${BOT_USERNAME}">Telegram бот</a> • 
<a href="#" onclick="showSection('api');return false">API</a> • 
11 бесплатных моделей
</p>
</footer>

<script>
const MODELS = ${JSON.stringify(FREE_MODELS)};
let user = null, chatHistory = [];
const $ = id => document.getElementById(id);
const toast = m => { const t = $('toast'); t.textContent = m; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500); };

// Render models
function renderModels() {
    $('modelsGrid').innerHTML = MODELS.map(m => \`
        <div class="model-card">
            <h3>\${m.name} <span class="model-badge \${m.forCode ? 'code' : ''}">\${m.forCode ? '💻 Код' : '💬 Чат'}</span></h3>
            <p>\${m.description}</p>
        </div>
    \`).join('');
}

// Auth
function openAuth() { $('authModal').classList.remove('hidden'); $('authCode').value = ''; $('authError').textContent = ''; $('authCode').focus(); }
function closeAuth() { $('authModal').classList.add('hidden'); }

async function verifyCode() {
    const code = $('authCode').value.trim().toUpperCase();
    if (code.length !== 6) { $('authError').textContent = 'Введите 6 символов'; return; }
    
    $('verifyBtn').disabled = true;
    $('verifyBtn').textContent = 'Проверка...';
    
    try {
        const r = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        const d = await r.json();
        
        if (!r.ok) { $('authError').textContent = d.error; return; }
        
        user = d;
        localStorage.setItem('user', JSON.stringify(user));
        closeAuth();
        updateUI();
        toast('🎉 Добро пожаловать, ' + user.firstName + '!');
    } catch (e) {
        $('authError').textContent = 'Ошибка сети';
    } finally {
        $('verifyBtn').disabled = false;
        $('verifyBtn').textContent = 'Войти';
    }
}

function updateUI() {
    if (user) {
        $('authButtons').classList.add('hidden');
        $('userMenu').classList.remove('hidden');
        $('uName').textContent = user.firstName;
        $('uAvatar').textContent = user.firstName[0];
        $('pName').textContent = user.firstName;
        $('pUsername').textContent = '@' + user.username;
        $('pAvatar').textContent = user.firstName[0];
        $('pPlan').textContent = user.plan.toUpperCase();
        $('pReq').textContent = user.requestsToday + '/' + user.requestsLimit;
        $('pProgress').style.width = (user.requestsToday / user.requestsLimit * 100) + '%';
        $('pKey').textContent = user.apiKey.slice(0, 12) + '...' + user.apiKey.slice(-6);
    } else {
        $('authButtons').classList.remove('hidden');
        $('userMenu').classList.add('hidden');
    }
}

function toggleProfile() { $('profileDropdown').classList.toggle('hidden'); }
function copyKey() { if (user) { navigator.clipboard.writeText(user.apiKey); toast('✅ API ключ скопирован!'); } }

async function refreshKey() {
    if (!user) return;
    try {
        const r = await fetch('/api/user/' + user.telegramId + '/refresh-key', { method: 'POST' });
        const d = await r.json();
        user.apiKey = d.apiKey;
        localStorage.setItem('user', JSON.stringify(user));
        updateUI();
        toast('✅ Ключ обновлен!');
    } catch (e) { toast('❌ Ошибка'); }
}

function logout() {
    user = null;
    localStorage.removeItem('user');
    updateUI();
    $('profileDropdown').classList.add('hidden');
    toast('👋 До встречи!');
}

// Navigation
function showSection(name) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    $(name).classList.remove('hidden');
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
    document.querySelector('.nav button[data-section="' + name + '"]')?.classList.add('active');
    $('profileDropdown').classList.add('hidden');
}

// Chat
function escapeHtml(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

async function sendMessage() {
    const input = $('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    
    input.value = '';
    const messages = $('chatMessages');
    
    // User message
    messages.innerHTML += '<div class="message user">' + escapeHtml(msg) + '</div>';
    messages.innerHTML += '<div class="message bot" id="typing"><div class="typing"><span></span><span></span><span></span></div></div>';
    messages.scrollTop = messages.scrollHeight;
    
    chatHistory.push({ role: 'user', content: msg });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
    
    try {
        const r = await fetch('/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + (user?.apiKey || 'demo')
            },
            body: JSON.stringify({ model: 'neurocode-1', messages: chatHistory })
        });
        
        const d = await r.json();
        const content = d.choices?.[0]?.message?.content || 'Ошибка получения ответа';
        const modelName = MODELS.find(m => m.id === d.model)?.name || d.model || 'AI';
        
        chatHistory.push({ role: 'assistant', content });
        
        let html = escapeHtml(content)
            .replace(/\`\`\`(\\w*)\\n([\\s\\S]*?)\`\`\`/g, '<pre><code>$2</code></pre>')
            .replace(/\`([^\`]+)\`/g, '<code>$1</code>')
            .replace(/\\n/g, '<br>');
        
        const typing = $('typing');
        if (typing) {
            typing.outerHTML = '<div class="message bot">' + html + '<div class="model-tag">🤖 ' + modelName + '</div></div>';
        }
        messages.scrollTop = messages.scrollHeight;
        
        if (user) { user.requestsToday++; updateUI(); }
        
    } catch (e) {
        const typing = $('typing');
        if (typing) typing.outerHTML = '<div class="message bot">❌ Ошибка. Попробуйте ещё раз.</div>';
    }
}

function sendQuick(msg) { $('chatInput').value = msg; sendMessage(); }

// Init
(async function() {
    renderModels();
    
    const saved = localStorage.getItem('user');
    if (saved) {
        try {
            const u = JSON.parse(saved);
            const r = await fetch('/api/auth/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegramId: u.telegramId })
            });
            const d = await r.json();
            if (d.valid) {
                user = d.user;
                localStorage.setItem('user', JSON.stringify(user));
                updateUI();
            } else {
                localStorage.removeItem('user');
            }
        } catch (e) { localStorage.removeItem('user'); }
    }
    
    // Close dropdowns on outside click
    document.addEventListener('click', e => {
        if (!e.target.closest('#userMenu') && !e.target.closest('#profileDropdown')) {
            $('profileDropdown').classList.add('hidden');
        }
    });
    
    // Auth code input
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
const server = app.listen(PORT, async () => {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🚀 NeuroCode AI запущен!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🌐 Домен:', DOMAIN);
    console.log('📡 Порт:', PORT);
    console.log('👥 Пользователей:', db.users.length);
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🤖 Доступные AI модели:');
    FREE_MODELS.forEach((m, i) => console.log(`   ${i + 1}. ${m.name} ${m.forCode ? '💻' : '💬'}`));
    console.log('═══════════════════════════════════════════════════════════');
    
    // Webhook
    try {
        const r = await fetch(`${TELEGRAM_API}/setWebhook?url=${DOMAIN}${WEBHOOK_PATH}`);
        const d = await r.json();
        console.log('📱 Telegram:', d.ok ? '✅ Webhook OK' : '❌ ' + d.description);
    } catch (e) {
        console.log('❌ Webhook error:', e.message);
    }
    console.log('═══════════════════════════════════════════════════════════');
});

server.on('error', err => {
    if (err.code === 'EADDRINUSE') server.listen(0);
});

process.on('SIGINT', () => { saveDB(); process.exit(); });
process.on('SIGTERM', () => { saveDB(); process.exit(); });
