const config = require('../config');
const { cmd, commands } = require('../command');
const moment = require('moment-timezone');

// Default configurations
const DEFAULTS = {
  ALIVE_IMG: 'https://i.imgur.com/J9LF7Yv.jpeg',
  REPLY_STYLE: 'numbered'
};

// System Monitor Class
class SystemMonitor {
  static getStatus() {
    const mem = process.memoryUsage();
    return {
      uptime: process.uptime(),
      memory: {
        total: (mem.rss / 1024 / 1024).toFixed(2),
        used: (mem.heapUsed / 1024 / 1024).toFixed(2)
      },
      platform: `${process.platform}/${process.arch}`,
      versions: {
        node: process.version,
        bot: config.version || '5.0.0'
      }
    };
  }

  static formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  }
}

// Main Alive Command
cmd({
  pattern: "alive",
  alias: ["status", "ping", "online"],
  react: "⚡",
  desc: "Check bot status with interactive options",
  category: "core",
  filename: __filename
}, async (conn, mek, m, { from, pushname, isGroup, groupName, reply }) => {
  try {
    const status = SystemMonitor.getStatus();
    const time = moment().tz('Asia/Colombo').format('h:mm:ss A');
    const date = moment().tz('Asia/Colombo').format('dddd, MMMM D, YYYY');
    
    const response = generateResponse({
      style: config.REPLY_STYLE || DEFAULTS.REPLY_STYLE,
      pushname,
      status,
      time,
      date,
      isGroup,
      groupName
    });

    await sendAliveResponse(conn, from, mek, response);

  } catch (e) {
    console.error('[ALIVE ERROR]', e);
    reply("❌ Error checking status. Please try again.");
  }
});

// Number-based Reply Handler
cmd({
  on: "text",
  fromMe: false,
  dontAddCommandList: true
}, async (conn, mek, m) => {
  const { body, from, sender } = mek;
  
  // Check if message is a number reply to alive message
  if (/^[0-3]$/.test(body.trim())) {
    const number = parseInt(body.trim());
    
    switch(number) {
      case 1:
        await handleSpeedTest(conn, from, mek);
        break;
      case 2:
        await conn.sendMessage(from, { text: "📜 Loading command menu..." }, { quoted: mek });
        // Add your menu command logic here
        break;
      case 3:
        await conn.sendMessage(from, { text: "⚙️ System diagnostics running..." }, { quoted: mek });
        // Add your diagnostics logic here
        break;
      default:
        await conn.sendMessage(from, { text: "ℹ️ Please select a valid option (1-3)" }, { quoted: mek });
    }
  }
});

// Speed Test Handler
async function handleSpeedTest(conn, to, quoted) {
  const start = Date.now();
  await conn.sendMessage(to, { text: "⏳ Calculating response speed..." }, { quoted });
  const latency = Date.now() - start;
  
  let speedRating = "🚀 Excellent";
  if (latency > 500) speedRating = "🐢 Slow";
  else if (latency > 200) speedRating = "🏃 Good";
  
  await conn.sendMessage(to, { 
    text: `📊 *Speed Test Results:*\n` +
          `- Response Time: ${latency}ms\n` +
          `- Connection: ${speedRating}\n\n` +
          `🔧 Server: ${process.platform} | Node ${process.version}`
  }, { quoted });
}

// Response Generator
function generateResponse(params) {
  const { style, pushname, status, time, date } = params;
  const uptime = SystemMonitor.formatUptime(status.uptime);
  
  if (style === 'numbered') {
    return {
      text: `🔋 *Akindu MD System Status*\n\n` +
            `🕒 *Sri Lankan Time:* ${time}\n` +
            `📅 *Date:* ${date}\n\n` +
            `⚙️ *System Information:*\n` +
            `1. Uptime: ${uptime}\n` +
            `2. Memory: ${status.memory.used}MB / ${status.memory.total}MB\n` +
            `3. Platform: ${status.platform}\n\n` +
            `🔢 *Quick Actions:*\n` +
            `1. Speed Test\n` +
            `2. Command Menu\n` +
            `3. System Diagnostics\n\n` +
            `👋 *User:* ${pushname}`,
      footer: "💡 Reply with number (1-3) for quick actions"
    };
  } else {
    return {
      text: `┌──「 *AKINDU MD ONLINE* 」\n` +
            `│\n` +
            `│ 🕒 ${time} | ${date}\n` +
            `│\n` +
            `│ ⏳ Uptime: ${uptime}\n` +
            `│ 💾 Memory: ${status.memory.used}MB/${status.memory.total}MB\n` +
            `│ 🖥️ Platform: ${status.platform}\n` +
            `│ 📦 Node.js: ${status.versions.node}\n` +
            `│ 🚀 Version: ${status.versions.bot}\n` +
            `└───────────────────\n` +
            `✨ Reply "1" for speed test`
    };
  }
}

// Response Sender
async function sendAliveResponse(conn, to, quoted, response) {
  const options = { quoted };
  const imageUrl = config.ALIVE_IMG || DEFAULTS.ALIVE_IMG;
  
  if (response.footer) {
    response.text += `\n\n${response.footer}`;
  }
  
  try {
    if (imageUrl) {
      await conn.sendMessage(to, {
        image: { url: imageUrl },
        caption: response.text
      }, options);
    } else {
      await conn.sendMessage(to, { text: response.text }, options);
    }
  } catch (e) {
    console.error('[SEND ERROR]', e);
    await conn.sendMessage(to, { text: response.text }, options);
  }
}

// Command Metadata
commands.alive = {
  name: 'Alive Check',
  desc: "Interactive system status with numbered replies",
  usage: ".alive\n.alive classic\n.alive numbered",
  category: "core",
  alias: ["status"]
};
