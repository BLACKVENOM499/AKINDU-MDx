const config = require('../config');
const { cmd, commands } = require('../command');
const moment = require('moment-timezone');

// Time-based greeting messages
const timeGreetings = {
    morning: [
        "*☀️ Good morning ! A fresh new day begins!*",
        "*🌄 Rise and shine ! How can I help you today?*",
        "*🦉 Early bird What's our first task today?*"
    ],
    afternoon: [
        "*🌞 Good afternoon ! How's your day going?*",
        "*👋 Hello ! Need some afternoon assistance?*",
        "*💻 Afternoon boost ! What shall we accomplish?*"
    ],
    evening: [
        "*🌇 Good evening ! How was your day?*",
        "*🌙 Evening ! Time for some relaxation?*",
        "*🍵 Tea time ! How can I assist this evening?*"
    ],
    night: [
        "-🌜 Good night ! Rest well!*",
        "*🌚 Late night owl Still working?*",
        "*✨ Nighty night ! Last tasks before bed?*"
    ]
};

cmd({
    pattern: "alive",
    alias: ["status", "hi", "hello"],
    react: "🤖",
    desc: "Get time-based greeting with Sri Lanka time",
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
        
        // Simplified status message
        const statusMessage = `
*ᴀᴋɪɴᴅᴜ ᴍᴅ ᴀʟɪᴠᴇ*

❒ *ʜᴇʟʟᴏ* *${pushname}* *${randomGreeting}*

❒ *ᴛɪᴍᴇ* *${currentTime}*

❒ *ᴅᴀᴛᴇ* *${currentDate}*

 
ᴛʏᴘᴇ `.ᴍᴇɴᴜ` ᴛᴏ ɢᴇᴛ ʙᴏᴛ ᴍᴇɴᴜ

*ᴀᴋɪɴᴅᴜ ᴍᴅ*`.trim();

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

// Command metadata
commands.alive = {
    name: "Greeting",
    desc: "Shows time-based greeting with Sri Lanka time",
    usage: `.alive - Time-based greeting
.status/.ping/.hi/.hello - Same as alive`,
    category: "core"
};
