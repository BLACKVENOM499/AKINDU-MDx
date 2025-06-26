const config = require('../config');
const { cmd, commands } = require('../command');
const moment = require('moment-timezone');

// Time-based greeting messages
const timeGreetings = {
    morning: [
        "☀️ Good morning {name}! A fresh new day begins!",
        "🌄 Rise and shine {name}! How can I help you today?",
        "🦉 Early bird {name}! What's our first task today?"
    ],
    afternoon: [
        "🌞 Good afternoon {name}! How's your day going?",
        "👋 Hello {name}! Need some afternoon assistance?",
        "💻 Afternoon boost {name}! What shall we accomplish?"
    ],
    evening: [
        "🌇 Good evening {name}! How was your day?",
        "🌙 Evening {name}! Time for some relaxation?",
        "🍵 Tea time {name}! How can I assist this evening?"
    ],
    night: [
        "🌜 Good night {name}! Rest well!",
        "🌚 Late night owl {name}! Still working?",
        "✨ Nighty night {name}! Last tasks before bed?"
    ]
};

cmd({
    pattern: "alive",
    alias: ["status", "ping", "hi", "hello"],
    react: "✨",
    desc: "Check bot status with time-based greeting",
    category: "core",
    filename: __filename
},
async(conn, mek, m, {from, pushname, reply}) => {
    try {
        // Get current time in Sri Lanka
        const now = moment().tz('Asia/Colombo');
        const currentHour = now.hour();
        const currentTime = now.format('hh:mm:ss A');
        const currentDate = now.format('dddd, MMMM D, YYYY');
        
        // Determine time of day
        let timeOfDay;
        let greetingPool;
        
        if (currentHour < 12) {
            timeOfDay = "morning";
            greetingPool = timeGreetings.morning;
        } else if (currentHour < 17) { // 12pm-5pm
            timeOfDay = "afternoon";
            greetingPool = timeGreetings.afternoon;
        } else if (currentHour < 21) { // 5pm-9pm
            timeOfDay = "evening";
            greetingPool = timeGreetings.evening;
        } else { // 9pm-12am
            timeOfDay = "night";
            greetingPool = timeGreetings.night;
        }
        
        // Select random greeting for the time period
        const randomGreeting = greetingPool[Math.floor(Math.random() * greetingPool.length)]
            .replace('{name}', pushname.split(' ')[0]);
        
        // System information
        const uptime = process.uptime();
        const memUsage = process.memoryUsage();
        const formattedUptime = formatTime(uptime);
        const usedMemory = Math.round(memUsage.rss / 1024 / 1024 * 100) / 100;
        
        // Enhanced status message with time-based greeting
        const statusMessage = `
╭──「 *ᴀᴋɪɴᴅᴜ ᴍᴅ ᴀʟɪᴠᴇ* 」───
│
│ ${randomGreeting}
│
│ 🕓 *Current Time in Sri Lanka:* ${currentTime}


│ 📅 *Date:* ${currentDate}
│ 
│ 🤖 *Status:* ONLINE
│
│ Type `.menu` for command list
╰───────────────────────
*ᴀᴋɪɴᴅʏ ᴍᴅ*
        `.trim();

        // Send message with image or fallback to text
        const opts = {
            quoted: mek
        };

        if (config.ALIVE_IMG) {
            opts.image = { url: config.ALIVE_IMG };
            opts.caption = statusMessage;
        } else {
            opts.text = statusMessage;
        }

        await conn.sendMessage(from, opts);

    } catch (error) {
        console.error('[ALIVE ERROR]', error);
        try {
            await reply('⚠️ Oops! Something went wrong. Please try again.');
        } catch (fallbackError) {
            console.error('[FALLBACK ERROR]', fallbackError);
        }
    }
});

// Helper function to format uptime
function formatTime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= 3600 * 24;
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    
    return `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${minutes}m ${seconds}s`;
}

// Command metadata
commands.alive = {
    name: "Alive Status",
    desc: "Shows bot status with time-based greetings",
    usage: `.alive - Status with time-appropriate greeting
.status/.ping/.hi/.hello - Same as alive`,
    category: "core"
};
