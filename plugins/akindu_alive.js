const config = require('../config');
const { cmd, commands } = require('../command');
const moment = require('moment-timezone');

// Sri Lankan time and date formatting
function getSriLankanTime() {
    return moment().tz('Asia/Colombo').format('h:mm:ss A');
}

function getSriLankanDate() {
    return moment().tz('Asia/Colombo').format('dddd, MMMM D, YYYY');
}

// System status information
function getSystemStatus() {
    return {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        nodeVersion: process.version
    };
}

// Plugin command
cmd({
    pattern: "alive",
    react: "⚡",
    desc: "Check bot status with Sri Lankan time",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Get system information
        const status = getSystemStatus();
        const uptime = formatUptime(status.uptime);
        const memoryUsage = (status.memory.rss / 1024 / 1024).toFixed(2);
        
        // Sri Lankan time and date
        const slTime = getSriLankanTime();
        const slDate = getSriLankanDate();
        
        // Create alive message
        let aliveMsg = `╭──「 *AKINDU MD STATUS* 」
│
│ *🕒 Sri Lankan Time:* ${slTime}
│ *📅 Date:* ${slDate}
│
│ *🤖 Bot Status:* ONLINE
│ *⚡ Uptime:* ${uptime}
│ *💾 Memory Usage:* ${memoryUsage} MB
│ *🛠️ Platform:* ${status.platform}
│ *📦 Node.js:* ${status.nodeVersion}
│
│ *👋 Hello ${pushname}!*
│ *How can I help you today?*
│
│ *Type* \`.menu\` *for command list*
╰───────────────────
*Powered by Akindu MD*`;

        // Send message with image
        await conn.sendMessage(from, { 
            image: { url: config.ALIVE_IMG || 'https://i.imgur.com/example.jpg' },
            caption: aliveMsg 
        }, { quoted: mek });

    } catch (e) {
        console.error('Alive plugin error:', e);
        reply('⚠️ An error occurred while checking bot status');
    }
});

// Helper function to format uptime
function formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

// Add to command list
commands.alive = {
    desc: "Check if bot is alive with system status",
    usage: ".alive",
    category: "main"
};
