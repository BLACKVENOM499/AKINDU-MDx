const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

function isEnabled(value) {
    // Function to check if a value represents a "true" boolean state
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["setting", "allvar"],
    desc: "Settings of bot",
    category: "menu",
    react: "⚙",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply }) => {
    try {
        // Define the settings message with the correct boolean checks
        let envSettings = `*ᴀᴋɪɴᴅᴜ ᴍᴅ ꜱᴇᴛᴛɪɴɢꜱ*
        
❒ *Auto Read Status:* ${isEnabled(config.AUTO_READ_STATUS) ? "Enabled ✅" : "Disabled ❌"}

❒ *Auto Status Reply:* ${isEnabled(config.AUTO_STATUS_REPLY) ? "Enabled ✅" : "Disabled ❌"}

❒ *Auto Reply:* ${isEnabled(config.AUTO_REPLY) ? "Enabled ✅" : "Disabled ❌"}

❒ *Auto Sticker:* ${isEnabled(config.AUTO_STICKER) ? "Enabled ✅" : "Disabled ❌"}

❒ *Auto Voice:* ${isEnabled(config.AUTO_VOICE) ? "Enabled ✅" : "Disabled ❌"}

❒ *Owner React:* ${isEnabled(config.OWNER_REACT) ? "Enabled ✅" : "Disabled ❌"}

❒ *Heart React:* ${isEnabled(config.HEART_REACT) ? "Enabled ✅" : "Disabled ❌"}

❒ *Auto React:* ${isEnabled(config.AUTO_REACT) ? "Enabled ✅" : "Disabled ❌"}

❒ *Anti-Link:* ${isEnabled(config.ANTI_LINK) ? "Enabled ✅" : "Disabled ❌"}

❒ *Anti-Bad Words:* ${isEnabled(config.ANTI_BAD) ? "Enabled ✅" : "Disabled ❌"}

❒ *Auto Typing:* ${isEnabled(config.AUTO_TYPING) ? "Enabled ✅" : "Disabled ❌"}

❒ *Auto Recording:* ${isEnabled(config.FAKE_RECORDING) ? "Enabled ✅" : "Disabled ❌"}

❒ *Always Online:* ${isEnabled(config.ALWAYS_ONLINE) ? "Enabled ✅" : "Disabled ❌"}

❒ *Currently Status:* ${isEnabled(config.CURRENT_STATUS) ? "Enabled ✅" : "Disabled ❌"}

❒ *Read Message:* ${isEnabled(config.READ_MESSAGE) ? "Enabled ✅" : "Disabled ❌"}

> *ᴀᴋɪɴᴅᴜ ᴍᴅ*`;
     } catch (error) {
        console.log(error);
        reply(`Error: ${error.message}`);
    }
});
