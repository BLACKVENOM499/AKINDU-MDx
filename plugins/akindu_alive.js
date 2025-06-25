const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const config = require('../../config');

// Store sessions with expiration
const sessions = new Map();
const SESSION_TIMEOUT = 2 * 60 * 1000; // 2 minutes

cmd({
    pattern: "alive",
    alias: ["menu"],
    desc: "Interactive menu with number replies",
    category: "core",
    filename: __filename
}, async (m, sock) => {
    try {
        const sessionId = m.from;
        const menuMessage = await m.reply(generateMenuText(m));

        // Store session
        sessions.set(sessionId, {
            timestamp: Date.now(),
            menuMessageId: menuMessage.key.id
        });

        // Auto-clean session
        setTimeout(() => sessions.delete(sessionId), SESSION_TIMEOUT);

    } catch (error) {
        console.error('[ALIVE ERROR]', error);
        await m.reply('❌ Menu failed to load');
    }
});

// Handle number responses
cmd({
    on: "text",
    fromMe: false,
    dontAddCommandList: true
}, async (m, sock) => {
    // Validate number reply
    if (!/^[1-4]$/.test(m.body)) return;
    
    const session = sessions.get(m.from);
    if (!session) return;

    // React to show processing
    await sock.sendMessage(m.from, { 
        react: { text: '⏳', key: m.key } 
    });

    try {
        switch (m.body.trim()) {
            case '1':
                await handleSpeedTest(m, sock);
                break;
            case '2':
                await handleSystemInfo(m, sock);
                break;
            case '3':
                await handleCommandList(m, sock);
                break;
            case '4':
                await handleServerStatus(m, sock);
                break;
        }
        
        // Confirm completion
        await sock.sendMessage(m.from, { 
            react: { text: '✅', key: m.key } 
        });

    } catch (error) {
        await sock.sendMessage(m.from, { 
            react: { text: '❌', key: m.key } 
        });
    } finally {
        sessions.delete(m.from); // Clear after handling
    }
});

// Menu Content Generator
function generateMenuText(m) {
    const time = moment().tz(config.TIMEZONE).format('h:mm A');
    const date = moment().tz(config.TIMEZONE).format('D MMM YYYY');
    const uptime = formatUptime(process.uptime());

    return `╭──「 ${config.BOT_NAME} Menu 」─⊷
│
│ 🕒 ${time} | 📅 ${date} (LK)
│ ⚡ Uptime: ${uptime}
│
│ 1. Speed Test 🚀
│ 2. System Info 💻  
│ 3. Command List 📜
│ 4. Server Status 🛠
│
╰──「 Reply with NUMBER 1-4 」⊷`;
}

// Command Handlers
async function handleSpeedTest(m, sock) {
    const start = Date.now();
    const pingMsg = await m.reply('🏓 Pinging...');
    const latency = Date.now() - start;
    
    await pingMsg.edit(`📊 *Speed Test Results*\n`
        + `Response: ${latency}ms\n`
        + `${latency < 500 ? "🚀 Excellent" : "🐢 Needs improvement"}`);
}

async function handleSystemInfo(m, sock) {
    const mem = process.memoryUsage();
    await m.reply(`💻 *System Information*\n`
        + `Platform: ${process.platform}\n`
        + `Memory: ${(mem.heapUsed/1024/1024).toFixed(2)}MB used\n`
        + `Node.js: ${process.version}`);
}

async function handleCommandList(m, sock) {
    await m.reply(`📜 *Core Commands*\n\n`
        + `.alive - This menu\n.ping - Test latency\n`
        + `.help - Show full help\n.song - Download music`);
}

async function handleServerStatus(m, sock) {
    await m.reply(`🛠️ *Server Status*\n`
        + `Uptime: ${formatUptime(process.uptime())}\n`
        + `Active Sessions: ${sessions.size}`);
}

// Helper
function formatUptime(seconds) {
    // ... (same uptime formatter as before)
}
