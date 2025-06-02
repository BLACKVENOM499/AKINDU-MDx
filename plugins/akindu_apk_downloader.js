const { fetchJson } = require("../lib/functions");
const cheerio = require("cheerio");
const axios = require("axios");
const { cmd, commands } = require('../command');

cmd({
  pattern: "apk",
  desc: "Download APK from Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide an app name to search.");
    }

    await conn.sendMessage(from, { react: { text: "📥", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("⚠️ No results found for the given app name.");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `*ᴀᴋɪɴᴅᴜ ᴍᴅ ᴀᴘᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ* \n
❒ *ᴀᴘᴋ ɴᴀᴍᴇ* ${app.name}

❒ *ᴀᴘᴋ ꜱɪᴢᴇ* ${appSize} ᴍʙ

❒  *ᴀᴘᴋ ᴘᴀᴄᴋᴇɢᴇ* ${app.package}

❒  *ᴜᴘᴅᴀᴛᴇᴅ ᴅᴀᴛᴇ* ${app.updated}

❒  *ᴅᴇᴠᴇʟᴏᴘᴇʀ* ${app.developer.name}

> *ᴀᴋɪɴᴅᴜ ᴍᴅ*`;
    await conn.sendMessage(from, { react: { text: "📥", key: m.key } });

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the APK. Please try again.");
  }
});
              
