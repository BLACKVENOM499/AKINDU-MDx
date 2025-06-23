const { cmd } = require('../command');
const os = require('os');
const { runtime } = require('../lib/functions');

// Temporary store for alive command sessions keyed by message ID
const aliveSessions = {};

cmd({
  pattern: "alive",
  alias: ["status", "runtime", "uptime"],
  desc: "Show alive info and wait for number reply",
  category: "main",
  react: "📟",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const usedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);

    // Prepare numbered options text
    const menuText = `┏━❮ 🩵 *𝐋𝐀𝐊𝐈𝐘𝐀 𝐀𝐋𝐈𝐕𝐄* 🩵 ❯━
┃◈ 🤖 Bot Name : 𝐋𝐀𝐊𝐈𝐘𝐀
┃◈ 🔖 Version  : 2.0
┃◈ 📟 Platform : ${os.platform()}
┃◈ 👨‍💻 Owner   : 𝐌𝐑 𝐋𝐀𝐊𝐒𝐈𝐃𝐔
┃◈ 📆 Runtime : ${runtime(process.uptime())}
┃◈ 📈 RAM Usage: ${usedMem}MB / ${totalMem}MB
┗━━━━━━━━━━━━━━━𖣔𖣔
╰──────────────┈⊷

Choose an option by typing the number:
1. Show Bot Speed (Latency)
2. Show Owner Info
3. Exit`;

    // Save session with message ID to track reply
    aliveSessions[m.key.id] = { from };

    await conn.sendMessage(from, {
      image: { url: 'https://example.com/your-image.jpg' }, // Replace with your image URL
      caption: menuText,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: mek });

  } catch (e) {
    console.error("Error in alive command:", e);
    reply(`❌ An error occurred: ${e.message}`);
  }
});

cmd({
  on: "text"
}, async (conn, m, store, { from, reply }) => {
  // Check if this message is a reply to our alive menu message
  const quotedId = m.quoted?.key?.id;
  if (!quotedId || !aliveSessions[quotedId]) return; // Not related

  // Only accept from the same user who started session
  if (from !== aliveSessions[quotedId].from) return;

  const choice = m.text.trim();

  switch (choice) {
    case '1': {
      // Calculate latency using message timestamp and current time
      const latency = Date.now() - (m.messageTimestamp * 1000);

      await conn.sendMessage(from, {
        text: `⚡ Bot Speed (Latency): *${latency} ms*\n\n*AKINDU MD*`
      }, { quoted: m });

      break;
    }
    case '2':
      await conn.sendMessage(from, {
        text: `👨‍💻 Owner: *MR LAKSIDU*\nContact: +1234567890\n\n*AKINDU MD*`
      }, { quoted: m });
      break;

    case '3':
      await conn.sendMessage(from, {
        text: "Exiting alive menu. Thank you!\n\n*AKINDU MD*"
      }, { quoted: m });
      break;

    default:
      await reply("❌ Invalid option. Please type 1, 2, or 3.");
      return; // Don't clear session on invalid input
  }

  // Clear session after valid selection
  delete aliveSessions[quotedId];
});
