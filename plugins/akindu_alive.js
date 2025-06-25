const config = require('../config');
const { cmd, commands } = require('../command');
const moment = require('moment-timezone');

// Constants
const MENU_TIMEOUT = 300000; // 5 minutes

// Menu state storage
const activeMenus = new Map();

class AlivePlugin {
    constructor() {
        this.defaultImage = config.ALIVE_IMG || 'https://i.imgur.com/J9LF7Yv.jpeg';
    }

    static async handle(conn, mek, m, { from, pushname, reply }) {
        try {
            const plugin = new AlivePlugin();
            const menuId = `${from}-${Date.now()}`;
            
            // Store menu state
            activeMenus.set(menuId, {
                timestamp: Date.now(),
                userId: pushname
            });

            // Send menu
            await plugin.sendMenu(conn, from, mek, pushname);
            
            // Set timeout to clear menu
            setTimeout(() => {
                if (activeMenus.has(menuId)) {
                    activeMenus.delete(menuId);
                    conn.sendMessage(from, { 
                        text: `🕒 Menu session expired for ${pushname}` 
                    });
                }
            }, MENU_TIMEOUT);

        } catch (e) {
            console.error('[MENU ERROR]', e);
            reply("⚠️ Failed to generate menu. Please try again.");
        }
    }

    async sendMenu(conn, to, quoted, username) {
        const time = moment().tz('Asia/Colombo').format('h:mm:ss A');
        const date = moment().tz('Asia/Colombo').format('dddd, MMMM D, YYYY');
        const uptime = this.formatUptime(process.uptime());

        const menuMessage = {
            text: `╭──「  AKINDU MD - NUMERIC MENU  」\n` +
                  `│\n` +
                  `│ ⏰ Time: ${time} (LK)\n` +
                  `│ 📅 Date: ${date}\n` +
                  `│ ⚡ Uptime: ${uptime}\n` +
                  `│ 👤 User: ${username}\n` +
                  `│\n` +
                  `│ 1️⃣ Bot Speed Test\n` +
                  `│ 2️⃣ System Information\n` +
                  `│ 3️⃣ Command List\n` +
                  `│ 4️⃣ Server Status\n` +
                  `│ 5️⃣ About Akindu MD\n` +
                  `│\n` +
                  `╰──「 Reply with NUMBER 1-5 」\n` +
                  `💡 Example: Reply "1" for speed test`,
            footer: "⚡ Instant response system | ⌛ 5min timeout"
        };

        try {
            await conn.sendMessage(to, { 
                image: { url: this.defaultImage },
                caption: menuMessage.text
            }, { quoted });
        } catch (e) {
            await conn.sendMessage(to, { 
                text: menuMessage.text + (menuMessage.footer ? `\n\n${menuMessage.footer}` : '') 
            }, { quoted });
        }
    }

    formatUptime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    }
}

// Main command handler
cmd({
    pattern: "alive",
    alias: ["menu", "status"],
    react: "⚡",
    desc: "Numeric menu system for Akindu MD",
    category: "core",
    filename: __filename
}, AlivePlugin.handle);

// Menu option handler
cmd({
    on: "text",
    fromMe: false,
    dontAddCommandList: true
}, async (conn, mek, m, { from, body, pushname }) => {
    // Check if this is a numeric reply to an active menu
    if (/^[1-5]$/.test(body.trim())) {
        const option = parseInt(body.trim());
        
        switch(option) {
            case 1: // Speed Test
                const start = Date.now();
                await conn.sendMessage(from, { text: "⏳ Testing response speed..." });
                const latency = Date.now() - start;
                await conn.sendMessage(from, { 
                    text: `📊 *Speed Test Results*\n` +
                          `Response Time: ${latency}ms\n` +
                          `Connection: ${latency < 500 ? "🚀 Excellent" : latency < 1000 ? "🏃 Good" : "🐢 Slow"}`
                });
                break;
                
            case 2: // System Info
                const mem = process.memoryUsage();
                await conn.sendMessage(from, { 
                    text: `💻 *System Information*\n` +
                          `Platform: ${process.platform}\n` +
                          `Node.js: ${process.version}\n` +
                          `Memory: ${(mem.heapUsed/1024/1024).toFixed(2)}MB/${(mem.rss/1024/1024).toFixed(2)}MB`
                });
                break;
                
            case 3: // Command List
                // Simplified command list - expand as needed
                await conn.sendMessage(from, {
                    text: `📜 *Available Commands*\n` +
                          `.menu - Show this menu\n` +
                          `.ping - Test response time\n` +
                          `.help - Get help\n` +
                          `\nMore commands coming soon!`
                });
                break;
                
            case 4: // Server Status
                await conn.sendMessage(from, {
                    text: `🛠️ *Server Status*\n` +
                          `Uptime: ${new AlivePlugin().formatUptime(process.uptime())}\n` +
                          `CPU: ${process.cpuUsage().user/1000}ms\n` +
                          `Active Users: ${activeMenus.size}`
                });
                break;
                
            case 5: // About
                await conn.sendMessage(from, {
                    text: `⚡ *About Akindu MD*\n` +
                          `Version: ${config.version || '5.0'}\n` +
                          `Developer: Akindu\n` +
                          `Platform: WhatsApp Bot\n` +
                          `\n` +
                          `Advanced features with Sri Lankan optimized performance`
                });
                break;
        }
    }
});

// Auto-cleanup expired menus
setInterval(() => {
    const now = Date.now();
    for (const [id, menu] of activeMenus) {
        if (now - menu.timestamp > MENU_TIMEOUT) {
            activeMenus.delete(id);
        }
    }
}, 60000); // Check every minute

// Command metadata
commands.alive = {
    name: 'Numeric Menu',
    desc: "Interactive number-based menu system",
    usage: ".alive (then reply with number 1-5)",
    category: "core",
    alias: ["menu"]
};
