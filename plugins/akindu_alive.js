const { cmd, commands } = require('../command');
const moment = require('moment-timezone');
const axios = require('axios');

cmd({
    pattern: "alive",
    react: "👋",
    desc: "Check if the bot is alive",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        // Get Sri Lanka time
        const now = moment().tz("Asia/Colombo");
        const hour = now.hour();

        // Greeting based on time
        let greet = "🌃 Good Night";
        if (hour >= 5 && hour < 12) greet = "🌅 Good Morning";
        else if (hour >= 12 && hour < 17) greet = "🌇 Good Afternoon";
        else if (hour >= 17 && hour < 20) greet = "🌆 Good Evening";

        // Get Sri Lanka weather from wttr.in (Colombo)
        let weather = "Unknown";
        try {
            const res = await axios.get("https://wttr.in/Matara?format=%C+%t");
            weather = res.data;
        } catch {
            weather = "Unavailable";
        }

        let madeMenu = `ᴀᴋɪɴᴅᴜ ᴍᴅ ᴀʟɪᴠᴇ ɴᴏᴡ

👋 Hello ${pushname}

${greet} ☀️

🕰️ Current Time: ${now.format('HH:mm:ss')} (Sri Lanka Time)
🌦️ Weather in ᴍᴀᴛᴀʀᴀ: ${weather}

BOT STATUS: ✅ ONLINE & READY

Need help?
Type: .menu to view all commands ⚙️

༒꧁ Powered by 🥷⚡ \`ᴀᴋɪɴᴅᴜ-ᴍᴅ\` ꧂༒`;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/4l9cjf.jpg' },
            caption: madeMenu
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
