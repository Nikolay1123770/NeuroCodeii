const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════
// КОНФИГУРАЦИЯ
// ═══════════════════════════════════════════════════════════
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const PORT = process.env.PORT || 3000;
const DOMAIN = 'https://neurocodeai.bothost.ru';
const WEBHOOK_PATH = `/webhook/${BOT_TOKEN}`;
const BOT_USERNAME = 'NeuroCodeAI_bot';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ═══════════════════════════════════════════════════════════
// БАЗА ДАННЫХ
// ═══════════════════════════════════════════════════════════
const DB_FILE = path.join(__dirname, 'database.json');

let db = {
    users: []
};

// Хранение кодов авторизации в памяти
const authCodes = new Map();

function loadDB() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            db = JSON.parse(data);
            console.log(`📂 Database loaded: ${db.users.length} users`);
        }
    } catch (e) {
        console.log('⚠️ Could not load database:', e.message);
    }
}

function saveDB() {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    } catch (e) {
        console.log('⚠️ Could not save database:', e.message);
    }
}

// Автосохранение
setInterval(saveDB, 30000);
loadDB();

// ═══════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════
function generateAuthCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'nc_';
    for (let i = 0; i < 48; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

// ═══════════════════════════════════════════════════════════
// TELEGRAM API
// ═══════════════════════════════════════════════════════════
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function sendMessage(chatId, text, options = {}) {
    try {
        await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text,
                parse_mode: 'HTML',
                ...options
            })
        });
    } catch (e) {
        console.error('TG error:', e.message);
    }
}

async function answerCallback(callbackId, text = '') {
    try {
        await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                callback_query_id: callbackId,
                text
            })
        });
    } catch (e) {}
}

// ═══════════════════════════════════════════════════════════
// TELEGRAM WEBHOOK
// ═══════════════════════════════════════════════════════════
app.post(WEBHOOK_PATH, async (req, res) => {
    const { message, callback_query } = req.body;
    
    if (callback_query) {
        const chatId = callback_query.message.chat.id;
        const data = callback_query.data;
        const from = callback_query.from;
        
        if (data === 'auth' || data === 'get_code') {
            const code = generateAuthCode();
            
            authCodes.set(code, {
                telegramId: from.id,
                username: from.username || `user${from.id}`,
                firstName: from.first_name,
                lastName: from.last_name,
                createdAt: Date.now()
            });
            
            setTimeout(() => authCodes.delete(code), 10 * 60 * 1000);
            
            await answerCallback(callback_query.id, '✅ Код создан!');
            await sendMessage(chatId,
                `🔐 <b>Код для входа</b>\n\n` +
                `<pre>${code}</pre>\n\n` +
                `⏰ Действителен 10 минут\n\n` +
                `Введи этот код на сайте для авторизации`,
                {
                    reply_markup: {
                        inline_keyboard: [[{ text: '🌐 Открыть сайт', url: DOMAIN }]]
                    }
                }
            );
        }
        
        if (data === 'refresh_key') {
            const user = db.users.find(u => u.telegramId === from.id);
            if (user) {
                user.apiKey = generateApiKey();
                saveDB();
                await answerCallback(callback_query.id, '✅ Ключ обновлен!');
                await sendMessage(chatId,
                    `✅ <b>API ключ обновлен!</b>\n\n` +
                    `<code>${user.apiKey.slice(0, 10)}...${user.apiKey.slice(-6)}</code>`
                );
            }
        }
        
        if (data === 'my_profile') {
            const user = db.users.find(u => u.telegramId === from.id);
            if (user) {
                await answerCallback(callback_query.id);
                await sendMessage(chatId,
                    `👤 <b>Твой профиль</b>\n\n` +
                    `<b>Имя:</b> ${user.firstName}\n` +
                    `<b>Username:</b> @${user.username}\n` +
                    `<b>Тариф:</b> ${user.plan.toUpperCase()}\n\n` +
                    `📊 <b>Статистика:</b>\n` +
                    `• Запросов сегодня: ${user.requestsToday}/${user.requestsLimit}\n` +
                    `• Всего запросов: ${user.totalRequests || 0}\n\n` +
                    `🔑 <b>API Key:</b>\n` +
                    `<code>${user.apiKey.slice(0, 10)}...${user.apiKey.slice(-6)}</code>`,
                    {
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: '🌐 На сайт', url: DOMAIN }],
                                [{ text: '🔄 Обновить ключ', callback_data: 'refresh_key' }]
                            ]
                        }
                    }
                );
            } else {
                await answerCallback(callback_query.id, '❌ Сначала авторизуйся', true);
            }
        }
        
        return res.sendStatus(200);
    }
    
    if (!message || !message.text) return res.sendStatus(200);
    
    const chatId = message.chat.id;
    const text = message.text;
    const from = message.from;
    
    if (text === '/start') {
        const user = db.users.find(u => u.telegramId === from.id);
        
        await sendMessage(chatId,
            `🚀 <b>NeuroCode AI</b>\n\n` +
            `Привет, ${from.first_name}! 👋\n\n` +
            `Бесплатный AI API для разработчиков:\n\n` +
            `✨ Генерация кода на любом языке\n` +
            `🤖 Создание Telegram ботов\n` +
            `🌐 Веб-разработка с AI\n` +
            `📚 Готовые примеры и документация\n\n` +
            `<b>💎 Бесплатный тариф:</b>\n` +
            `• 1000 запросов в день\n` +
            `• Все AI модели\n` +
            `• До 4000 токенов\n\n` +
            (user ? `✅ Ты авторизован! Баланс: ${user.requestsToday}/${user.requestsLimit}\n\n` : '') +
            `Выбери действие 👇`,
            {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: '🌐 Открыть платформу', url: DOMAIN }],
                        [
                            { text: '🔐 Получить код', callback_data: 'get_code' },
                            { text: '👤 Мой профиль', callback_data: 'my_profile' }
                        ],
                        [
                            { text: '📖 Документация', url: `${DOMAIN}` },
                            { text: '💻 Примеры', url: `${DOMAIN}` }
                        ]
                    ]
                }
            }
        );
    }
    
    if (text === '/auth') {
        const code = generateAuthCode();
        
        authCodes.set(code, {
            telegramId: from.id,
            username: from.username || `user${from.id}`,
            firstName: from.first_name,
            lastName: from.last_name,
            createdAt: Date.now()
        });
        
        setTimeout(() => authCodes.delete(code), 10 * 60 * 1000);
        
        console.log(`🔐 Auth code: ${code} for @${from.username}`);
        
        await sendMessage(chatId,
            `🔐 <b>Код для входа на сайт</b>\n\n` +
            `<pre>${code}</pre>\n\n` +
            `⏰ Действителен <b>10 минут</b>\n\n` +
            `<b>Как использовать:</b>\n` +
            `1. Открой сайт NeuroCode AI\n` +
            `2. Нажми "Войти через Telegram"\n` +
            `3. Введи этот код\n\n` +
            `<i>Нажми на код чтобы скопировать</i>`,
            {
                reply_markup: {
                    inline_keyboard: [[{ text: '🌐 Открыть сайт', url: DOMAIN }]]
                }
            }
        );
    }
    
    if (text === '/profile') {
        const user = db.users.find(u => u.telegramId === from.id);
        
        if (!user) {
            await sendMessage(chatId,
                `❌ <b>Ты еще не авторизован</b>\n\n` +
                `Используй /auth чтобы получить код для входа на сайт`,
                {
                    reply_markup: {
                        inline_keyboard: [[{ text: '🔐 Получить код', callback_data: 'get_code' }]]
                    }
                }
            );
        } else {
            await sendMessage(chatId,
                `👤 <b>Твой профиль NeuroCode AI</b>\n\n` +
                `<b>📋 Информация:</b>\n` +
                `• Имя: ${user.firstName}\n` +
                `• Username: @${user.username}\n` +
                `• ID: <code>${user.telegramId}</code>\n\n` +
                `<b>💎 Тариф: ${user.plan.toUpperCase()}</b>\n` +
                `• Запросов сегодня: ${user.requestsToday}/${user.requestsLimit}\n` +
                `• Всего запросов: ${user.totalRequests || 0}\n\n` +
                `<b>🔑 API Key:</b>\n` +
                `<code>${user.apiKey}</code>\n\n` +
                `<i>Нажми на ключ чтобы скопировать</i>`,
                {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🌐 Открыть сайт', url: DOMAIN }],
                            [{ text: '🔄 Обновить ключ', callback_data: 'refresh_key' }]
                        ]
                    }
                }
            );
        }
    }
    
    if (text === '/help') {
        await sendMessage(chatId,
            `📚 <b>Помощь NeuroCode AI</b>\n\n` +
            `<b>Команды бота:</b>\n` +
            `/start - Главное меню\n` +
            `/auth - Получить код для входа\n` +
            `/profile - Мой профиль и API ключ\n` +
            `/help - Это сообщение\n\n` +
            `<b>Как начать:</b>\n` +
            `1️⃣ Напиши /auth\n` +
            `2️⃣ Открой сайт\n` +
            `3️⃣ Введи код\n` +
            `4️⃣ Получи API ключ!\n\n` +
            `<b>Поддержка:</b>\n` +
            `@NeuroCodeSupport`
        );
    }
    
    res.sendStatus(200);
});

// ═══════════════════════════════════════════════════════════
// API ENDPOINTS
// ═══════════════════════════════════════════════════════════

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'NeuroCode AI',
        users: db.users.length,
        uptime: process.uptime()
    });
});

// Проверка кода и авторизация
app.post('/api/auth/verify', (req, res) => {
    const { code } = req.body;
    
    if (!code || code.length !== 6) {
        return res.status(400).json({ error: 'Неверный формат кода' });
    }
    
    const authData = authCodes.get(code.toUpperCase());
    
    if (!authData) {
        return res.status(401).json({ error: 'Неверный или истекший код' });
    }
    
    // Удаляем использованный код
    authCodes.delete(code.toUpperCase());
    
    // Ищем или создаем пользователя
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
        
        console.log(`✅ New user: ${user.username} (${user.telegramId})`);
        
        // Уведомляем в Telegram
        sendMessage(authData.telegramId,
            `🎉 <b>Добро пожаловать в NeuroCode AI!</b>\n\n` +
            `Твой аккаунт создан успешно.\n\n` +
            `🔑 API Key: <code>${user.apiKey.slice(0, 15)}...</code>\n\n` +
            `Полный ключ в профиле на сайте!`,
            {
                reply_markup: {
                    inline_keyboard: [[{ text: '🌐 Открыть сайт', url: DOMAIN }]]
                }
            }
        );
    } else {
        console.log(`✅ User login: ${user.username}`);
    }
    
    res.json(user);
});

// Проверка сессии
app.post('/api/auth/check', (req, res) => {
    const { telegramId } = req.body;
    
    if (!telegramId) {
        return res.json({ valid: false });
    }
    
    const user = db.users.find(u => u.telegramId == telegramId);
    
    if (!user) {
        return res.json({ valid: false });
    }
    
    res.json({ valid: true, user });
});

// Получить пользователя
app.get('/api/user/:telegramId', (req, res) => {
    const user = db.users.find(u => u.telegramId == req.params.telegramId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

// Обновить API ключ
app.post('/api/user/:telegramId/refresh-key', (req, res) => {
    const user = db.users.find(u => u.telegramId == req.params.telegramId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.apiKey = generateApiKey();
    saveDB();
    
    res.json({ apiKey: user.apiKey });
});

// Mock Chat API
app.post('/api/v1/chat/completions', (req, res) => {
    const { messages, model } = req.body;
    const lastMessage = messages?.[messages.length - 1]?.content || 'Hello';
    
    const responses = [
        `Вот пример кода:\n\n\`\`\`python\nprint("Hello, World!")\n\`\`\``,
        `Отличный вопрос! Вот решение:\n\n\`\`\`javascript\nconsole.log("Hello!");\n\`\`\``,
        `Я помогу вам с этим. Попробуйте такой подход:\n\n1. Создайте функцию\n2. Добавьте логику\n3. Протестируйте`,
    ];
    
    res.json({
        id: 'chatcmpl-' + Date.now(),
        object: 'chat.completion',
        created: Math.floor(Date.now() / 1000),
        model: model || 'neurocode-1',
        choices: [{
            index: 0,
            message: {
                role: 'assistant',
                content: responses[Math.floor(Math.random() * responses.length)]
            },
            finish_reason: 'stop'
        }],
        usage: { prompt_tokens: 10, completion_tokens: 50, total_tokens: 60 }
    });
});

// ═══════════════════════════════════════════════════════════
// ГЛАВНАЯ СТРАНИЦА (HTML)
// ═══════════════════════════════════════════════════════════
const HTML = `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NeuroCode AI - AI платформа для разработчиков</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root{--bg:#0a0a0f;--card:#12121a;--border:#252535;--text:#e8e8e8;--dim:#707080;--purple:#8b5cf6;--pink:#ec4899;--green:#22c55e}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
.hidden{display:none!important}
button{cursor:pointer;font-family:inherit;border:none;transition:all .2s}
input{font-family:inherit;background:rgba(255,255,255,0.05);border:1px solid var(--border);padding:14px 16px;color:#fff;border-radius:10px;font-size:14px;width:100%}
input:focus{outline:none;border-color:var(--purple)}

/* Toast */
.toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--card);border:1px solid var(--purple);padding:14px 28px;border-radius:12px;opacity:0;transition:.3s;z-index:9999}
.toast.show{transform:translateX(-50%) translateY(0);opacity:1}

/* Header */
.header{position:sticky;top:0;z-index:50;backdrop-filter:blur(20px);background:rgba(10,10,15,0.7);border-bottom:1px solid rgba(139,92,246,0.2);padding:0 20px}
.header-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:64px}
.logo{display:flex;align-items:center;gap:12px;cursor:pointer}
.logo-icon{width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,var(--purple),var(--pink));display:flex;align-items:center;justify-content:center}
.logo-text{font-size:20px;font-weight:800;background:linear-gradient(135deg,#a78bfa,#f472b6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav{display:flex;gap:8px}
.nav button{padding:10px 16px;border-radius:8px;background:transparent;color:var(--dim);font-size:14px;font-weight:500}
.nav button:hover,.nav button.active{background:rgba(139,92,246,0.2);color:#a78bfa}
.header-right{display:flex;align-items:center;gap:12px}
.btn{padding:10px 20px;border-radius:10px;font-weight:600;font-size:14px}
.btn-primary{background:linear-gradient(135deg,var(--purple),var(--pink));color:#fff}
.btn-secondary{background:rgba(255,255,255,0.05);color:#fff;border:1px solid var(--border)}
.user-menu{display:flex;align-items:center;gap:10px;padding:6px 12px;border-radius:10px;background:rgba(255,255,255,0.05);cursor:pointer}
.user-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink))}
.user-name{font-size:14px;font-weight:500}

/* Hero */
.hero{padding:80px 20px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;top:-200px;right:-200px;width:500px;height:500px;background:rgba(139,92,246,0.15);border-radius:50%;filter:blur(100px)}
.hero::after{content:'';position:absolute;bottom:-200px;left:-200px;width:500px;height:500px;background:rgba(236,72,153,0.15);border-radius:50%;filter:blur(100px)}
.hero-content{position:relative;z-index:1;max-width:900px;margin:0 auto}
.badge{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:50px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.2);font-size:14px;color:#a78bfa;margin-bottom:24px}
.badge-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}
.hero h1{font-size:clamp(36px,8vw,72px);font-weight:800;line-height:1.1;margin-bottom:24px}
.hero h1 span{background:linear-gradient(135deg,#a78bfa,#f472b6,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:18px;color:var(--dim);max-width:600px;margin:0 auto 40px}
.hero-buttons{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.hero-buttons .btn{padding:16px 32px;font-size:16px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;max-width:800px;margin:60px auto 0}
.stat{text-align:center}
.stat-value{font-size:28px;font-weight:800;color:#fff}
.stat-label{font-size:13px;color:var(--dim);margin-top:4px}

/* Features */
.features{padding:80px 20px;max-width:1200px;margin:0 auto}
.section-title{text-align:center;margin-bottom:48px}
.section-title h2{font-size:36px;font-weight:800;margin-bottom:12px}
.section-title p{color:var(--dim);font-size:16px}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
.feature-card{padding:24px;border-radius:16px;background:rgba(255,255,255,0.03);border:1px solid var(--border);transition:all .3s}
.feature-card:hover{border-color:rgba(139,92,246,0.3);transform:translateY(-4px)}
.feature-icon{width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,rgba(139,92,246,0.2),rgba(236,72,153,0.2));display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:16px}
.feature-card h3{font-size:18px;font-weight:600;margin-bottom:8px}
.feature-card p{color:var(--dim);font-size:14px;line-height:1.6}

/* Sections */
.section{padding:40px 20px;max-width:1000px;margin:0 auto}
.section.hidden{display:none}

/* Chat */
.chat-container{background:var(--card);border-radius:20px;border:1px solid rgba(139,92,246,0.2);overflow:hidden}
.chat-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
.chat-status{width:10px;height:10px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
.chat-messages{height:400px;overflow-y:auto;padding:20px}
.message{max-width:80%;margin-bottom:16px;padding:12px 16px;border-radius:16px;font-size:14px;line-height:1.6}
.message.user{background:linear-gradient(135deg,var(--purple),var(--pink));margin-left:auto;border-bottom-right-radius:4px}
.message.bot{background:rgba(255,255,255,0.05);border-bottom-left-radius:4px}
.message pre{background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;margin:8px 0;overflow-x:auto}
.message code{font-family:monospace;font-size:13px}
.chat-input{padding:16px;border-top:1px solid var(--border);display:flex;gap:12px}
.chat-input input{flex:1}
.chat-input button{padding:12px 24px}
.quick-actions{display:flex;gap:8px;padding:0 20px 16px;flex-wrap:wrap}
.quick-btn{padding:8px 16px;border-radius:20px;background:rgba(139,92,246,0.1);color:#a78bfa;font-size:13px;border:none}

/* API Docs */
.api-card{background:var(--card);border-radius:16px;border:1px solid var(--border);margin-bottom:20px;overflow:hidden}
.api-card-header{padding:16px 20px;background:rgba(255,255,255,0.02);display:flex;align-items:center;gap:12px}
.method{padding:4px 10px;border-radius:6px;font-size:12px;font-weight:600;font-family:monospace}
.method.get{background:rgba(59,130,246,0.2);color:#60a5fa}
.method.post{background:rgba(34,197,94,0.2);color:#4ade80}
.api-card-body{padding:20px}
.api-card-body pre{background:rgba(0,0,0,0.3);padding:16px;border-radius:10px;overflow-x:auto;font-size:13px}
.api-card-body code{color:#4ade80}

/* Examples */
.example-tabs{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}
.example-tab{padding:10px 20px;border-radius:10px;background:rgba(255,255,255,0.05);color:var(--dim);font-size:14px;border:none}
.example-tab.active{background:rgba(139,92,246,0.2);color:#a78bfa}
.example-code{background:var(--card);border-radius:16px;border:1px solid var(--border);overflow:hidden}
.example-code-header{padding:12px 20px;background:rgba(255,255,255,0.02);display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--dim)}
.example-code pre{padding:20px;overflow-x:auto;font-size:13px;line-height:1.6}
.example-code code{color:#4ade80}

/* Auth Modal */
.modal{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.modal-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px)}
.modal-content{position:relative;width:100%;max-width:420px;background:var(--card);border-radius:20px;border:1px solid rgba(139,92,246,0.2);overflow:hidden}
.modal-header{padding:20px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center}
.modal-header h2{font-size:20px;font-weight:600}
.modal-close{width:32px;height:32px;border-radius:8px;background:transparent;color:var(--dim);display:flex;align-items:center;justify-content:center;font-size:20px}
.modal-body{padding:24px}
.auth-icon{width:80px;height:80px;margin:0 auto 20px;border-radius:50%;background:linear-gradient(135deg,#0088cc,#00aaff);display:flex;align-items:center;justify-content:center;font-size:40px}
.auth-steps{background:rgba(255,255,255,0.03);border-radius:12px;padding:16px;margin:20px 0}
.auth-step{display:flex;align-items:center;gap:12px;padding:8px 0;font-size:14px;color:var(--dim)}
.auth-step span:first-child{font-size:18px}
.code-input{text-align:center;font-size:28px;letter-spacing:12px;font-weight:700;text-transform:uppercase}

/* Profile Dropdown */
.profile-dropdown{position:absolute;top:70px;right:20px;width:320px;background:var(--card);border-radius:16px;border:1px solid var(--border);overflow:hidden;z-index:100}
.profile-header{padding:20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:12px}
.profile-avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--pink))}
.profile-info h4{font-size:16px;margin-bottom:2px}
.profile-info p{font-size:13px;color:var(--dim)}
.profile-stats{padding:16px 20px;border-bottom:1px solid var(--border)}
.profile-stat{display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px}
.profile-stat span:first-child{color:var(--dim)}
.progress-bar{height:6px;background:rgba(255,255,255,0.1);border-radius:3px;overflow:hidden;margin-top:12px}
.progress-fill{height:100%;background:linear-gradient(90deg,var(--purple),var(--pink));border-radius:3px}
.profile-key{padding:16px 20px;border-bottom:1px solid var(--border)}
.profile-key label{font-size:13px;color:var(--dim);display:block;margin-bottom:8px}
.key-box{display:flex;gap:8px}
.key-box code{flex:1;padding:10px;background:rgba(255,255,255,0.05);border-radius:8px;font-size:12px;overflow:hidden;text-overflow:ellipsis}
.key-box button{padding:10px;border-radius:8px;background:rgba(255,255,255,0.05);color:#fff;font-size:14px}
.profile-actions{padding:12px}
.profile-actions button{width:100%;padding:12px;border-radius:10px;background:transparent;color:#ef4444;font-size:14px;display:flex;align-items:center;justify-content:center;gap:8px}

/* Footer */
.footer{border-top:1px solid var(--border);padding:40px 20px;margin-top:80px}
.footer-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:20px}
.footer-text{color:var(--dim);font-size:14px}
.footer-links{display:flex;gap:24px}
.footer-links a{color:var(--dim);font-size:14px;text-decoration:none}
.footer-links a:hover{color:#fff}

/* Responsive */
@media(max-width:768px){
    .nav{display:none}
    .stats{grid-template-columns:repeat(2,1fr)}
    .hero-buttons{flex-direction:column;align-items:center}
    .hero-buttons .btn{width:100%;max-width:300px}
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
<button class="modal-close" onclick="closeAuth()">×</button>
</div>
<div class="modal-body">
<div class="auth-icon">✈️</div>
<p style="text-align:center;color:var(--dim);margin-bottom:20px">
Напишите <b style="color:#a78bfa">/auth</b> боту и введите полученный код
</p>
<div class="auth-steps">
<div class="auth-step"><span>1️⃣</span> Откройте бота в Telegram</div>
<div class="auth-step"><span>2️⃣</span> Напишите команду /auth</div>
<div class="auth-step"><span>3️⃣</span> Скопируйте код и введите ниже</div>
</div>
<a href="https://t.me/${BOT_USERNAME}" target="_blank" style="display:block;text-decoration:none;margin-bottom:20px">
<button class="btn btn-primary" style="width:100%;background:linear-gradient(135deg,#0088cc,#00aaff)">
✈️ Открыть бота
</button>
</a>
<div style="text-align:center;color:var(--dim);margin:16px 0;font-size:14px">Введите код</div>
<input type="text" class="code-input" id="authCode" placeholder="XXXXXX" maxlength="6">
<button class="btn btn-primary" style="width:100%;margin-top:16px" onclick="verifyCode()" id="verifyBtn">
Войти
</button>
<p id="authError" style="color:#ef4444;text-align:center;margin-top:12px;font-size:14px"></p>
</div>
</div>
</div>

<!-- Profile Dropdown -->
<div class="profile-dropdown hidden" id="profileDropdown">
<div class="profile-header">
<div class="profile-avatar"></div>
<div class="profile-info">
<h4 id="profileName">Username</h4>
<p id="profileUsername">@username</p>
</div>
</div>
<div class="profile-stats">
<div class="profile-stat"><span>Тариф</span><span id="profilePlan">FREE</span></div>
<div class="profile-stat"><span>Запросов сегодня</span><span id="profileRequests">0 / 1000</span></div>
<div class="progress-bar"><div class="progress-fill" id="profileProgress" style="width:0%"></div></div>
</div>
<div class="profile-key">
<label>API Key</label>
<div class="key-box">
<code id="profileKey">nc_xxxxx...xxxxx</code>
<button onclick="copyKey()" title="Копировать">📋</button>
</div>
<button class="btn btn-secondary" style="width:100%;margin-top:10px" onclick="refreshKey()">🔄 Обновить ключ</button>
</div>
<div class="profile-actions">
<button onclick="logout()">🚪 Выйти</button>
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
<button onclick="showSection('examples')" data-section="examples">Примеры</button>
</nav>
<div class="header-right">
<div id="authButtons">
<button class="btn btn-primary" onclick="openAuth()">Войти</button>
</div>
<div id="userMenu" class="user-menu hidden" onclick="toggleProfile()">
<div class="user-avatar"></div>
<span class="user-name" id="userName">User</span>
</div>
</div>
</div>
</header>

<!-- Home Section -->
<section id="home" class="section-full">
<div class="hero">
<div class="hero-content">
<div class="badge"><div class="badge-dot"></div> Бесплатный API для разработчиков</div>
<h1>Создавайте с помощью <span>ИИ нового поколения</span></h1>
<p>Бесплатный API для создания Telegram ботов, веб-сайтов и приложений. Интегрируйте мощь нейросетей за минуты.</p>
<div class="hero-buttons">
<button class="btn btn-primary" onclick="showSection('chat')">🚀 Попробовать бесплатно</button>
<button class="btn btn-secondary" onclick="showSection('api')">📖 Документация</button>
</div>
<div class="stats">
<div class="stat"><div class="stat-value">100K+</div><div class="stat-label">API запросов/день</div></div>
<div class="stat"><div class="stat-value">50+</div><div class="stat-label">Языков программирования</div></div>
<div class="stat"><div class="stat-value">99.9%</div><div class="stat-label">Uptime</div></div>
<div class="stat"><div class="stat-value">&lt;500ms</div><div class="stat-label">Время ответа</div></div>
</div>
</div>
</div>

<div class="features">
<div class="section-title">
<h2>Всё что нужно для разработки</h2>
<p>Мощный API с простой интеграцией</p>
</div>
<div class="features-grid">
<div class="feature-card">
<div class="feature-icon">💻</div>
<h3>Генерация кода</h3>
<p>Создавайте код на любом языке. Python, JavaScript, Go, Rust и многие другие.</p>
</div>
<div class="feature-card">
<div class="feature-icon">🤖</div>
<h3>Telegram боты</h3>
<p>Готовые шаблоны для создания Telegram ботов с AI функциональностью.</p>
</div>
<div class="feature-card">
<div class="feature-icon">🌐</div>
<h3>Веб-разработка</h3>
<p>Генерируйте HTML, CSS, React, Vue компоненты и веб-приложения.</p>
</div>
<div class="feature-card">
<div class="feature-icon">🔒</div>
<h3>Безопасность</h3>
<p>Все запросы шифруются. Ваши данные остаются конфиденциальными.</p>
</div>
<div class="feature-card">
<div class="feature-icon">⚡</div>
<h3>Высокая скорость</h3>
<p>Оптимизированная инфраструктура с минимальными задержками.</p>
</div>
<div class="feature-card">
<div class="feature-icon">🎁</div>
<h3>Бесплатно</h3>
<p>Начните использовать API бесплатно с щедрыми лимитами.</p>
</div>
</div>
</div>
</section>

<!-- Chat Section -->
<section id="chat" class="section hidden">
<h2 style="margin-bottom:20px">💬 AI Чат</h2>
<div class="chat-container">
<div class="chat-header">
<div class="chat-status"></div>
<span>NeuroCode AI</span>
<span style="color:var(--dim);margin-left:8px">• Онлайн</span>
</div>
<div class="chat-messages" id="chatMessages">
<div class="message bot">
Привет! Я NeuroCode AI 👋<br><br>
Я могу помочь вам:<br>
• Генерировать код<br>
• Создавать Telegram ботов<br>
• Разрабатывать веб-приложения<br><br>
Что бы вы хотели создать?
</div>
</div>
<div class="quick-actions" id="quickActions">
<button class="quick-btn" onclick="sendQuick('Создай Telegram бота')">🤖 Telegram бот</button>
<button class="quick-btn" onclick="sendQuick('Покажи пример React')">⚛️ React</button>
<button class="quick-btn" onclick="sendQuick('Напиши на Python')">🐍 Python</button>
</div>
<div class="chat-input">
<input type="text" id="chatInput" placeholder="Напишите сообщение..." onkeypress="if(event.key==='Enter')sendMessage()">
<button class="btn btn-primary" onclick="sendMessage()">→</button>
</div>
</div>
</section>

<!-- API Section -->
<section id="api" class="section hidden">
<h2 style="margin-bottom:20px">📖 API Документация</h2>

<div class="api-card">
<div class="api-card-header">
<span class="method post">POST</span>
<code>/api/v1/chat/completions</code>
</div>
<div class="api-card-body">
<p style="color:var(--dim);margin-bottom:16px">Создаёт ответ на основе диалога</p>
<pre><code>curl -X POST ${DOMAIN}/api/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "model": "neurocode-1",
    "messages": [
      {"role": "user", "content": "Привет!"}
    ]
  }'</code></pre>
</div>
</div>

<div class="api-card">
<div class="api-card-header">
<span class="method get">GET</span>
<code>/api/health</code>
</div>
<div class="api-card-body">
<p style="color:var(--dim)">Проверка статуса API</p>
</div>
</div>

<h3 style="margin:32px 0 16px">Доступные модели</h3>
<div style="display:grid;gap:12px">
<div class="api-card" style="margin:0">
<div class="api-card-body">
<h4 style="margin-bottom:8px">neurocode-1</h4>
<p style="color:var(--dim);font-size:14px">Основная модель. Лучший баланс качества и скорости.</p>
</div>
</div>
<div class="api-card" style="margin:0">
<div class="api-card-body">
<h4 style="margin-bottom:8px">neurocode-code</h4>
<p style="color:var(--dim);font-size:14px">Оптимизирована для генерации кода. 50+ языков.</p>
</div>
</div>
<div class="api-card" style="margin:0">
<div class="api-card-body">
<h4 style="margin-bottom:8px">neurocode-fast</h4>
<p style="color:var(--dim);font-size:14px">Быстрая модель для простых задач.</p>
</div>
</div>
</div>
</section>

<!-- Examples Section -->
<section id="examples" class="section hidden">
<h2 style="margin-bottom:20px">💻 Примеры кода</h2>

<div class="example-tabs">
<button class="example-tab active" onclick="showExample('python',this)">Python</button>
<button class="example-tab" onclick="showExample('javascript',this)">JavaScript</button>
<button class="example-tab" onclick="showExample('telegram',this)">Telegram Bot</button>
</div>

<div class="example-code">
<div class="example-code-header">
<span id="exampleLang">Python</span>
<button onclick="copyExample()" style="background:transparent;color:var(--purple);border:none">📋 Копировать</button>
</div>
<pre><code id="exampleCode">import requests

API_KEY = "YOUR_API_KEY"
API_URL = "${DOMAIN}/api/v1/chat/completions"

def chat(message):
    response = requests.post(
        API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        },
        json={
            "model": "neurocode-1",
            "messages": [
                {"role": "user", "content": message}
            ]
        }
    )
    return response.json()["choices"][0]["message"]["content"]

# Использование
result = chat("Напиши Hello World на Python")
print(result)</code></pre>
</div>
</section>

<!-- Footer -->
<footer class="footer">
<div class="footer-inner">
<div class="footer-text">© 2024 NeuroCode AI. Все права защищены.</div>
<div class="footer-links">
<a href="#">Документация</a>
<a href="#">GitHub</a>
<a href="https://t.me/${BOT_USERNAME}">Telegram</a>
</div>
</div>
</footer>

<script>
let user = null;
const $ = id => document.getElementById(id);

const toast = msg => {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2500);
};

// Auth
function openAuth() {
    $('authModal').classList.remove('hidden');
    $('authCode').value = '';
    $('authError').textContent = '';
}

function closeAuth() {
    $('authModal').classList.add('hidden');
}

async function verifyCode() {
    const code = $('authCode').value.trim().toUpperCase();
    if (code.length !== 6) {
        $('authError').textContent = 'Код должен содержать 6 символов';
        return;
    }
    
    $('verifyBtn').disabled = true;
    $('verifyBtn').textContent = 'Проверка...';
    
    try {
        const res = await fetch('/api/auth/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            $('authError').textContent = data.error || 'Ошибка';
            return;
        }
        
        user = data;
        localStorage.setItem('user', JSON.stringify(user));
        closeAuth();
        updateUI();
        toast('🎉 Добро пожаловать!');
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
        $('userName').textContent = user.firstName;
        $('profileName').textContent = user.firstName;
        $('profileUsername').textContent = '@' + user.username;
        $('profilePlan').textContent = user.plan.toUpperCase();
        $('profileRequests').textContent = user.requestsToday + ' / ' + user.requestsLimit;
        $('profileProgress').style.width = (user.requestsToday / user.requestsLimit * 100) + '%';
        $('profileKey').textContent = user.apiKey.slice(0, 10) + '...' + user.apiKey.slice(-6);
    } else {
        $('authButtons').classList.remove('hidden');
        $('userMenu').classList.add('hidden');
    }
}

function toggleProfile() {
    $('profileDropdown').classList.toggle('hidden');
}

function copyKey() {
    if (user) {
        navigator.clipboard.writeText(user.apiKey);
        toast('✅ API ключ скопирован!');
    }
}

async function refreshKey() {
    if (!user) return;
    
    try {
        const res = await fetch('/api/user/' + user.telegramId + '/refresh-key', { method: 'POST' });
        const data = await res.json();
        user.apiKey = data.apiKey;
        localStorage.setItem('user', JSON.stringify(user));
        updateUI();
        toast('✅ Ключ обновлен!');
    } catch (e) {
        toast('❌ Ошибка');
    }
}

function logout() {
    user = null;
    localStorage.removeItem('user');
    updateUI();
    $('profileDropdown').classList.add('hidden');
    toast('👋 До встречи!');
}

// Sections
function showSection(name) {
    document.querySelectorAll('.section, .section-full').forEach(s => s.classList.add('hidden'));
    $(name).classList.remove('hidden');
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
    document.querySelector('.nav button[data-section="' + name + '"]')?.classList.add('active');
}

// Chat
function sendMessage() {
    const input = $('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    
    input.value = '';
    $('quickActions').classList.add('hidden');
    
    const messages = $('chatMessages');
    messages.innerHTML += '<div class="message user">' + escapeHtml(msg) + '</div>';
    messages.innerHTML += '<div class="message bot" id="typing">⏳ Печатает...</div>';
    messages.scrollTop = messages.scrollHeight;
    
    setTimeout(() => {
        const typing = $('typing');
        if (typing) {
            const responses = [
                'Вот пример кода:\\n\\n<pre><code>console.log("Hello!");</code></pre>',
                'Отличный вопрос! Попробуйте такой подход:\\n\\n1. Создайте функцию\\n2. Добавьте логику\\n3. Протестируйте',
                'Вот что я могу предложить:\\n\\n<pre><code>def hello():\\n    print("Hello!")</code></pre>'
            ];
            typing.id = '';
            typing.innerHTML = responses[Math.floor(Math.random() * responses.length)].replace(/\\\\n/g, '<br>');
            messages.scrollTop = messages.scrollHeight;
        }
    }, 1000 + Math.random() * 1000);
}

function sendQuick(msg) {
    $('chatInput').value = msg;
    sendMessage();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Examples
const examples = {
    python: {
        lang: 'Python',
        code: \`import requests

API_KEY = "YOUR_API_KEY"
API_URL = "${DOMAIN}/api/v1/chat/completions"

def chat(message):
    response = requests.post(
        API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        },
        json={
            "model": "neurocode-1",
            "messages": [
                {"role": "user", "content": message}
            ]
        }
    )
    return response.json()["choices"][0]["message"]["content"]

result = chat("Напиши Hello World")
print(result)\`
    },
    javascript: {
        lang: 'JavaScript',
        code: \`const API_KEY = "YOUR_API_KEY";
const API_URL = "${DOMAIN}/api/v1/chat/completions";

async function chat(message) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": \\\`Bearer \\\${API_KEY}\\\`
        },
        body: JSON.stringify({
            model: "neurocode-1",
            messages: [
                { role: "user", content: message }
            ]
        })
    });

    const data = await response.json();
    return data.choices[0].message.content;
}

chat("Напиши Hello World")
    .then(result => console.log(result));\`
    },
    telegram: {
        lang: 'Telegram Bot (Python)',
        code: \`import telebot
import requests

BOT_TOKEN = "YOUR_BOT_TOKEN"
API_KEY = "YOUR_API_KEY"
API_URL = "${DOMAIN}/api/v1/chat/completions"

bot = telebot.TeleBot(BOT_TOKEN)

@bot.message_handler(func=lambda m: True)
def handle(message):
    response = requests.post(
        API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        },
        json={
            "model": "neurocode-1",
            "messages": [
                {"role": "user", "content": message.text}
            ]
        }
    )
    
    ai_response = response.json()["choices"][0]["message"]["content"]
    bot.reply_to(message, ai_response)

bot.polling()\`
    }
};

function showExample(name, btn) {
    $('exampleLang').textContent = examples[name].lang;
    $('exampleCode').textContent = examples[name].code;
    document.querySelectorAll('.example-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
}

function copyExample() {
    const code = $('exampleCode').textContent;
    navigator.clipboard.writeText(code);
    toast('✅ Код скопирован!');
}

// Init
(async function init() {
    const saved = localStorage.getItem('user');
    if (saved) {
        try {
            const u = JSON.parse(saved);
            const res = await fetch('/api/auth/check', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ telegramId: u.telegramId })
            });
            const data = await res.json();
            if (data.valid) {
                user = data.user;
                localStorage.setItem('user', JSON.stringify(user));
                updateUI();
            } else {
                localStorage.removeItem('user');
            }
        } catch (e) {
            localStorage.removeItem('user');
        }
    }
    
    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#userMenu') && !e.target.closest('#profileDropdown')) {
            $('profileDropdown').classList.add('hidden');
        }
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
    console.log('═══════════════════════════════════════');
    console.log('🚀 NeuroCode AI started');
    console.log('🌐 Domain:', DOMAIN);
    console.log('📡 Port:', PORT);
    console.log('👥 Users:', db.users.length);
    console.log('═══════════════════════════════════════');
    
    // Установка webhook
    try {
        const r = await fetch(`${TELEGRAM_API}/setWebhook?url=${DOMAIN}${WEBHOOK_PATH}`);
        const d = await r.json();
        console.log('📱 Telegram webhook:', d.ok ? '✅ OK' : '❌ Error');
        if (!d.ok) console.log('   ', d.description);
    } catch (e) {
        console.log('❌ Webhook error:', e.message);
    }
});

process.on('SIGINT', () => { saveDB(); process.exit(); });
process.on('SIGTERM', () => { saveDB(); process.exit(); });
