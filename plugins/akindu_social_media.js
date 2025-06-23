const { cmd } = require('../command');
const axios = require('axios');

// MAIN FACEBOOK DOWNLOAD COMMAND
cmd({
  pattern: "fb",
  alias: ["facebook", "fb3", "fbdl"],
  desc: "Download Facebook videos (SD, HD, Audio)",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return reply("*🔗 Please provide a valid Facebook video URL.*");
    }

    await conn.sendMessage(from, { react: { text: '📥', key: m.key } });

    const apiUrl = `https://lance-frank-asta.onrender.com/api/downloader?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.content?.status || !data?.content?.data?.result?.length) {
      throw new Error("API failed or no video found.");
    }

    const results = data.content.data.result;
    const audioUrl = data.content.data.audio?.url;

    const formats = [];

    const sd = results.find(v => v.quality === "SD");
    const hd = results.find(v => v.quality === "HD");

    if (sd) formats.push({ type: "video", quality: "SD", url: sd.url, size: sd.size || "Unknown" });
    if (hd) formats.push({ type: "video", quality: "HD", url: hd.url, size: hd.size || "Unknown" });
    if (audioUrl) formats.push({ type: "audio", quality: "Audio", url: audioUrl, size: "MP3 Audio" });

    if (formats.length === 0) {
      return reply("❌ No downloadable formats found (SD/HD/Audio).");
    }

    // Build selection list
    let caption = "🎬 *Select a format to download:*\n\n";
    formats.forEach((v, i) => {
      caption += `*${i + 1}.* ${v.quality} - ${v.size}\n`;
    });
    caption += `\n📩 _Reply with the number (1-${formats.length}) to download._`;

    // Store selection temporarily
    global.fbDownloads = global.fbDownloads || {};
    global.fbDownloads[m.key.id] = formats;

    await conn.sendMessage(from, {
      text: caption,
      quoted: m
    });

  } catch (error) {
    console.error("FB Download Error:", error);

    const ownerNumber = conn.user?.id?.split(":")[0] + "@s.whatsapp.net";
    await conn.sendMessage(ownerNumber, {
      text: `⚠️ *FB Downloader Error!*\n\n📍 *Group/User:* ${from}\n💬 *Query:* ${q}\n❌ *Error:* ${error.message || error}`
    });

    reply("❌ An error occurred. Please try again later.");
  }
});

// HANDLER FOR USER'S REPLY
cmd({
  on: "text"
}, async (conn, m, store, { from, reply }) => {
  if (!global.fbDownloads || !global.fbDownloads[m.quoted?.key?.id]) return;

  const selection = parseInt(m.text.trim());
  const formats = global.fbDownloads[m.quoted.key.id];

  if (isNaN(selection) || selection < 1 || selection > formats.length) {
    return reply("❌ Invalid number. Please reply with a valid option.");
  }

  const chosen = formats[selection - 1];
  delete global.fbDownloads[m.quoted.key.id]; // Clean up

  if (chosen.type === "audio") {
    await conn.sendMessage(from, {
      document: { url: chosen.url },
      mimetype: 'audio/mpeg',
      fileName: 'facebook-audio.mp3',
      caption: `🎵 *Downloaded Audio (MP3)*\n> *ᴀᴋɪɴᴅᴜ ᴍᴅ*`
    }, { quoted: m });
  } else {
    await conn.sendMessage(from, {
      video: { url: chosen.url },
      caption: `📽️ *Downloaded Video (${chosen.quality})*\n> *ᴀᴋɪɴᴅᴜ ᴍᴅ*`
    }, { quoted: m });
  }
});
