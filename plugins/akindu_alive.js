const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

const sessions = {}; // Store menu sessions

cmd({
  pattern: "alive",
  alias: ["status", "runtime", "uptime"],
  desc: "Show bot status and wait for a number",
  category: "main",
  react: "📟",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const usedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);

    const menuText = `┏━❮ 🩵 *𝐋𝐀𝐊𝐈𝐘𝐀 𝐀𝐋𝐈𝐕𝐄* 🩵 ❯━
┃◈ 🤖 Bot Name : 𝐋𝐀𝐊𝐈𝐘𝐀
┃◈ 🔖 Version  : 2.0
┃◈ 📟 Platform : ${os.platform()}
┃◈ 👨‍💻 Owner   : 𝐌𝐑 𝐋𝐀𝐊𝐒𝐈𝐃𝐔
┃◈ 📆 Runtime : ${runtime(process.uptime())}
┃◈ 📈 RAM Usage: ${usedMem}MB / ${totalMem}MB
┗━━━━━━━━━━━━━━━𖣔𖣔

Choose an option:
1. Show Bot Speed
2. Show Owner Info
3. Exit`;

    const sent = await conn.sendMessage(from, {
      text: menuText,
      quoted: mek
    });

    // Store session to track user reply
    sessions[sent.key.id] = {
      from,
      user: m.sender
    };

  } catch (e) {
    console.error("Alive Error:", e);
    reply(`❌ Error: ${e.message}`);
  }
});

// Handle number reply
cmd({
  on: "text"
}, async (conn, m, store, { from }) => {
  const quotedId = m.quoted?.key?.id;
  if (!quotedId || !sessions[quotedId]) return;

  const session = sessions[quotedId];

  // Check if it's from the same user who triggered it
  if (m.sender !== session.user) return;

  const number = m.text.trim();

  switch (number) {
    case "1": {
      const latency = Date.now() - (m.messageTimestamp * 1000);
      await conn.sendMessage(from, {
        text: `⚡ Bot Speed: *${latency} ms*\n\n*AKINDU MD*`,
        quoted: m
      });
      break;
    }

    case "2":
      await conn.sendMessage(from, {
        text: `👑 Owner: *MR AKINDU*\n🔗 WhatsApp: wa.me/94764703165\n\n*AKINDU MD*`,
        quoted: m
      });
      break;

    case "3":
      await conn.sendMessage(from, {
        text: `✅ Exited the menu. Thank you!\n\n*AKINDU MD*`,
        quoted: m
      });
      break;

    default:
      await conn.sendMessage(from, {
        text: `❌ Invalid number. Please type 1, 2 or 3.`,
        quoted: m
      });
      return;
  }

  // Clean up session after reply
  delete sessions[quotedId];
});
