const config = require('../config');
const { cmd, commands } = require('../command');
const os = require('os');

// Enhanced typing simulation with randomized duration
async function simulateTyping(conn, chatId, min = 800, max = 2500) {
    const duration = Math.floor(Math.random() * (max - min + 1)) + min;
    await conn.sendPresenceUpdate('composing', chatId);
    await new Promise(resolve => setTimeout(resolve, duration));
    await conn.sendPresenceUpdate('paused', chatId);
}

// Sri Lanka time with emoji variations
function getSriLankaTime() {
    const now = new Date();
    const options = {
        timeZone: 'Asia/Colombo',
        hour12: true,
        weekday: 'long',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    
    const timeString = now.toLocaleString('en-US', options);
    const hours = now.getHours();
    let timeEmoji = '🕛';
    
    if (hours >= 5 && hours < 12) timeEmoji = '🌅';
    else if (hours >= 12 && hours < 17) timeEmoji = '☀️';
    else if (hours >= 17 && hours < 20) timeEmoji = '🌇';
    else timeEmoji = '🌙';
    
    return `${timeEmoji} ${timeString.replace(',', '')}`;
}

// Simulated battery status with random charging state
function getBatteryStatus() {
    const randomCharge = Math.floor(Math.random() * 100);
    const isCharging = Math.random() > 0.6;
    
    let battEmoji = '🔋';
    if (isCharging) battEmoji = '⚡';
    if (randomCharge <= 20) battEmoji = '🪫';
    
    return `${battEmoji} ${randomCharge}%${isCharging ? ' (Charging)' : ''}`;
}

// CPU and memory info
function getSystemInfo() {
    return {
        cpu: `${os.cpus()[0].model.split('@')[0].trim()}`,
        memory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(1)}GB/${(os.totalmem() / 1024 / 1024 / 1024).toFixed(1)}GB`,
        platform: `${os.platform()} ${os.arch()}`
    };
}

cmd({
    pattern: "alive",
    react: ["👋", "🤖", "🏃‍♂️"],
    desc: "Check bot status with detailed information",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, pushname, sender, isOwner }) => {
    try {
        // Simulate more realistic typing
        await simulateTyping(conn, from);
        
        const slTime = getSriLankaTime();
        const battery = getBatteryStatus();
        const uptime = process.uptime();
        const sysInfo = getSystemInfo();
        
        // Dynamic greeting based on time
        const currentHour = new Date().getHours();
        let greeting = 'Hello';
        if (currentHour < 12) greeting = 'Good morning';
        else if (currentHour < 17) greeting = 'Good afternoon';
        else greeting = 'Good evening';

        // Random alive quotes
        const quotes = [
            "Up and running like a Colombo express!",
            "Serving you from the heart of Sri Lanka!",
            "ජීවමානයි සහ ක්‍රියාකාරීයි!",
            "Ready to assist you 24/7!"
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        const response = `*⌜ 𝗔𝗸𝗶𝗻𝗱𝘂 𝗠𝗗 𝗦𝘁𝗮𝘁𝘂𝘀 𝗕𝗼𝗮𝗿𝗱 ⌟*\n
💬 ${greeting} ${pushname.split(' ')[0]}! ${randomQuote}

🕒 *Local Time*: ${slTime}
⏳ *Uptime*: ${formatUptime(uptime)}
${battery.includes('⚡') ? battery : '🔋 ' + battery}

📊 *System Status*:
⎔ RAM: ${sysInfo.memory}
⚙️ CPU: ${sysInfo.cpu}
💻 OS: ${sysInfo.platform}

${isOwner ? `📡 *Developer Mode*: Active\n` : ''}
💡 *Need help?* Type .menu for commands
🚀 *Version*: ${config.version || '2.0.0'}

_🏷️ Powered by Akindu MD_`;
        
        // Randomly choose between sending as image or text (80% image)
        if (Math.random() > 0.2 && config.ALIVE_IMG) {
            await conn.sendMessage(from, { 
                image: { url: config.ALIVE_IMG }, 
                caption: response 
            }, { quoted: m });
        } else {
            await conn.sendMessage(from, { 
                text: response 
            }, { quoted: m });
        }

    } catch (e) {
        console.error('Alive command error:', e);
        await conn.sendMessage(from, { 
            text: `⚠️ Oops! Something went wrong:\n${e.message}` 
        }, { quoted: m });
    }
});

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days ? `${days}d ` : ''}${hours}h ${minutes}m ${secs}s`;
}
