const { cmd } = require('../command');
const axios = require('axios');

// Temporary store for selections
const fbTempStore = {};

// 📥 Facebook Video Downloader Command
cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook video in HD, SD, or audio",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.includes("facebook.com")) {
      return reply("❌ *Please send a valid Facebook video URL.*");
    }

    // React to show it's processing
    await conn.sendMessage(from, { react: { text: '📥', key: m.key } });

    // Fetch download data from API
    const api = `https://lance-frank-asta.onrender.com/api/downloader?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(api);

    const videoList = data?.content?.data?.result || [];
    const audioUrl = data?.content?.data?.audio?.url;

    const formats = [];

    const sd = videoList.find(v => v.quality === "SD");
    const hd = videoList.find(v => v.quality === "HD");

    if (sd) formats.push({ type: "video", label: "SD", url: sd.url });
    if (hd) formats.push({ type: "video", label: "HD", url: hd.url });
    if (audioUrl) formats.push({ type: "audio", label: "Audio (MP3)", url: audioUrl });

    if (formats.length === 0) return reply("❌ No downloadable formats found.");

    // Prepare selection menu
    let text = "🎬 *Select a format to download:*\n\n";
    formats.forEach((f, i) => {
      text += `*${i + 1}.* ${f.label}\n`;
    });
    text += `\n📩 _Reply with a number (1-${formats.length})_`;

    // Save selection to temporary memory using message ID
    fbTempStore[m.key.id] = formats;

    // Send format list to user
    await conn.sendMessage(from, { text, quoted: m });

  } catch (err) {
    console.error("FB Download Error:", err.message);
    reply("❌ Something went wrong while processing the link.");
  }
});

// 🎯 Handle Number Reply from User
cmd({
  on: "text"
}, async (conn, m, store, { from, reply }) => {
  try {
    const quotedId = m.quoted?.key?.id;
    if (!quotedId || !fbTempStore[quotedId]) return;

    const formats = fbTempStore[quotedId];
    const num = parseInt(m.text.trim());

    if (isNaN(num) || num < 1 || num > formats.length) {
      return reply(`❌ Invalid selection. Type a number between 1 and ${formats.length}`);
    }

    const chosen = formats[num - 1];
    delete fbTempStore[quotedId]; // Clean up

    if (chosen.type === "audio") {
      await conn.sendMessage(from, {
        document: { url: chosen.url },
        mimetype: 'audio/mpeg',
        fileName: 'facebook-audio.mp3',
        caption: `🎵 *Downloaded Audio (MP3)*`
      }, { quoted: m });
    } else {
      await conn.sendMessage(from, {
        video: { url: chosen.url },
        caption: `📥 *Downloaded Video (${chosen.label})*`
      }, { quoted: m });
    }

  } catch (e) {
    console.error("Reply handler error:", e.message);
    reply("❌ Failed to process your selection.");
  }
});
