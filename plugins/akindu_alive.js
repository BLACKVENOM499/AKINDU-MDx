const { cmd } = require('../command');
const os = require('os');
const { runtime } = require('../lib/functions');

// Session to track user interactions
let aliveSessions = {};

cmd({
  pattern: "alive",
  alias: ["status", "runtime", "uptime", "speed", "ping"],
  desc: "Show bot status and wait for number typing",
  category: "main",
  react: "📟",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const usedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);

    const text = `┏━❮ 🩵 *AKINDU MD ALIVE* 🩵 ❯━
┃◈ 🤖 *Bot Name* : AKINDU MD
┃◈ 🔖 *Version*  : 2.0
┃◈ 📟 *Platform* : ${os.platform()}
┃◈ 👨‍💻 *Owner*   : MR LAKSIDU
┃◈ 📆 *Runtime*  : ${runtime(process.uptime())}
┃◈ 📈 *RAM*      : ${usedMem}MB / ${totalMem}MB
┗━━━━━━━━━━━━━━━𖣔𖣔

*Reply with a number to select:*
1️⃣ - Show Bot Speed  
2️⃣ - Show Owner Info  
3️⃣ - Exit`;

    const sent = await conn.sendMessage(from, { text }, { quoted: mek });

    // Save session
    aliveSessions[sent.key.id] = {
      from,
      user: m.sender
    };

  } catch (e) {
    console.error("Alive command error:", e);
    reply("❌ Error: " + e.message);
  }
});

// Listen for replies
cmd({
  on: "text"
}, async (conn, m, store, { from }) => {
  const quotedMsg = m.quoted;
  const quotedId = quotedMsg?.key?.id;

  if (!quotedId || !aliveSessions[quotedId]) return;

  const session = aliveSessions[quotedId];

  // Only allow the original user to reply
  if (m.sender !== session.user) return;

  const choice = m.text.trim();

  switch (choice) {
    case '1': {
      const latency = Date.now() - (m.messageTimestamp * 1000);
      await conn.sendMessage(from, {
        text: `⚡ *Bot Speed*: ${latency} ms\n\n*AKINDU MD*`,
        quoted: m
      });
      break;
    }
    case '2':
      await conn.sendMessage(from, {
        text: `👑 *Owner*: MR LAKSIDU\n📞 wa.me/94712345678\n\n*AKINDU MD*`,
        quoted: m
      });
      break;
    case '3':
      await conn.sendMessage(from, {
        text: `✅ *Exited the menu.*\n\nThank you — *AKINDU MD*`,
        quoted: m
      });
      break;
    default:
      await conn.sendMessage(from, {
        text: `❌ Invalid option. Please reply with 1, 2 or 3.`,
        quoted: m
      });
      return;
  }

  // Remove session after one valid interaction
  delete aliveSessions[quotedId];
});
