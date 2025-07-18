const { cmd } = require('../command');
const axios = require('axios');

// MediaFire-dl

cmd({
  pattern: "mediafire",
  alias: ["mfire", "mf"],
  desc: "To download MediaFire files.",
  react: "📂",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q || !q.includes("mediafire.com")) {
      return reply("❌ Please provide a valid MediaFire link.");
    }

    await conn.sendMessage(from, {
      react: { text: "📥", key: m.key }
    });

    const response = await axios.get(`https://supun-md-api-xmjh.vercel.app/api/mediafire-dl?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.url) {
      return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.");
    }

    const { url: dl_link, name: fileName, mimetype: fileType } = data.result;
    const file_name = fileName || "mediafire_download";
    const mime_type = fileType || "application/octet-stream";

    await conn.sendMessage(from, {
      react: { text: "⬆️", key: m.key }
    });

    const caption = `*ᴀᴋɪɴᴅᴜ ᴍᴅ ᴍᴇᴅɪᴀꜰɪʀᴇ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ*

❒ *ꜰɪʟᴇ ɴᴀᴍᴇ* : ${file_name}

❒ *ꜰɪʟᴇ ᴛʏᴘᴇ* : ${mime_type}

> *ᴀᴋɪɴᴅᴜ ᴍᴅ*`;

    await conn.sendMessage(from, {
      document: { url: dl_link },
      mimetype: mime_type,
      fileName: file_name,
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});
