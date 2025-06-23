const config = require('../config')
const { cmd } = require('../command')
const os = require("os");
const { runtime } = require('../lib/functions');

// Store active reply sessions
const aliveSessions = {};

cmd({
  pattern: "alive",
  react: "👋",
  desc: "check bot alive",
  category: "main",
  filename: __filename
}, async (conn, mek, m, {
  from, pushname, reply
}) => {
  try {
    const madeMenu = `*ᴀᴋɪɴᴅᴜ ᴍᴅ ᴀʟɪᴠᴇ*

❒ 👋 ʜᴇʟʟᴏ *${pushname}*
❒ ʙᴏᴛ ɪꜱ ᴀᴄᴛɪᴠᴇ ✅
❒ ʜᴏᴡ ᴄᴀɴ ɪ ʜᴇʟᴘ ʏᴏᴜ ᴛᴏᴅᴀʏ?

💬 *Reply with a number:*
1️⃣ - Show Bot Speed  
2️⃣ - Show Owner Info  
3️⃣ - Exit

> *ᴀᴋɪɴᴅᴜ ᴍᴅ*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: config.ALIVE_IMG },
      caption: madeMenu
    }, { quoted: mek });

    // Save reply session
    aliveSessions[sentMsg.key.id] = {
      from,
      user: m.sender
    }

  } catch (e) {
    console.log(e)
    reply(`${e}`)
  }
});

// Listen for number reply
cmd({
  on: "text"
}, async (conn, m) => {
  const quoted = m.quoted;
  const quotedId = quoted?.key?.id;
  if (!quotedId || !aliveSessions[quotedId]) return;

  const session = aliveSessions[quotedId];
  if (m.sender !== session.user) return;

  const input = m.text.trim();

  switch (input) {
    case '1': {
      const latency = Date.now() - (m.messageTimestamp * 1000);
      await conn.sendMessage(session.from, {
        text: `⚡ Bot Speed: *${latency} ms*\n\n*AKINDU MD*`,
        quoted: m
      });
      break;
    }

    case '2':
      await conn.sendMessage(session.from, {
        text: `👑 *Owner*: MR LAKSIDU\n📞 wa.me/94712345678\n\n*AKINDU MD*`,
        quoted: m
      });
      break;

    case '3':
      await conn.sendMessage(session.from, {
        text: `✅ Exited. Thank you!\n\n*AKINDU MD*`,
        quoted: m
      });
      break;

    default:
      await conn.sendMessage(session.from, {
        text: `❌ Invalid number. Please reply with 1, 2, or 3.`,
        quoted: m
      });
      return;
  }

  // Clear session
  delete aliveSessions[quotedId];
});
