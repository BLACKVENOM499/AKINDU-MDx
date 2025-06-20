const config = require('../config');
const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
  pattern: "menu",
  alias: ["list"],
  desc: "Show bot menu with buttons",
  react: "📜",
  category: "main"
},
async (conn, mek, m, { from, pushname, reply }) => {
  try {
    const menuText = `👋 Hello *${pushname || 'User'}*, welcome to 👑🥷 *𝐇𝐀𝐒𝐈𝐍𝐃𝐔-𝐌𝐃*\n
⏱️ *Runtime:* ${runtime(process.uptime())}
🔧 *Mode:* ${config.MODE}
📎 *Prefix:* ${config.PREFIX}
📊 *RAM Usage:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB
🛠️ *Version:* 1.0.0

🔘 Select a menu from the options below:`;

    const buttons = [
      { buttonId: 'owner_menu', buttonText: { displayText: '👑 Owner Menu' }, type: 1 },
      { buttonId: 'ai_menu', buttonText: { displayText: '🤖 AI Menu' }, type: 1 },
      { buttonId: 'group_menu', buttonText: { displayText: '👥 Group Menu' }, type: 1 },
      { buttonId: 'convert_menu', buttonText: { displayText: '🔄 Convert Menu' }, type: 1 },
      { buttonId: 'search_menu', buttonText: { displayText: '🔍 Search Menu' }, type: 1 },
      { buttonId: 'download_menu', buttonText: { displayText: '📥 Download Menu' }, type: 1 },
      { buttonId: 'main_menu', buttonText: { displayText: '📜 Main Menu' }, type: 1 },
      { buttonId: 'other_menu', buttonText: { displayText: '🧚‍♂️ Other Menu' }, type: 1 }
    ];

    await conn.sendMessage(from, {
      image: { url: config.ALIVE_IMG },
      caption: menuText,
      footer: '👑 Powered by Hasindu-MD',
      buttons: buttons,
      headerType: 4
    }, { quoted: mek });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
    reply('An error occurred while displaying the menu.');
  }
});
