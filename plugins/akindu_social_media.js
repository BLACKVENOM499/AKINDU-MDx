const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark in SD or HD quality",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply(
            `❗️ *Usage:* .tiktok <TikTok link> <quality number>\n` +
            `🔢 *Quality Options:*\n` +
            `1️⃣ SD (Standard Definition)\n` +
            `2️⃣ HD (High Definition)\n\n` +
            `Example:\n.tiktok https://www.tiktok.com/@user/video/1234567890 2`
        );

        let inputArgs = q.trim().split(/\s+/);
        let link = inputArgs[0];
        let qualityNum = inputArgs[1] || '1'; // default SD

        if (!link.includes("tiktok.com")) 
            return reply("❌ Invalid TikTok link. Please provide a correct URL.");

        if (!['1', '2'].includes(qualityNum)) 
            return reply("❌ Quality number must be 1 (SD) or 2 (HD).");

        await reply("⏳ Downloading your TikTok video, please wait...");

        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(link)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) 
            return reply("⚠️ Failed to fetch TikTok video data.");

        const { title, like, comment, share, author, meta } = data.data;

        if (!meta || !meta.media || !Array.isArray(meta.media)) 
            return reply("⚠️ Video metadata not found in API response.");

        const videos = meta.media.filter(v => v.type === 'video');

        if (videos.length === 0) 
            return reply("⚠️ No video found in metadata.");

        const sdVideo = videos[0];
        const hdVideo = videos[1] || videos[0];

        const selectedVideo = qualityNum === '1' ? sdVideo : hdVideo;

        if (!selectedVideo.org) 
            return reply("⚠️ Video URL not found.");

        const videoUrl = selectedVideo.org;

        const caption =
`🎵 *TikTok Video Download* 🎵

👤 *User:* ${author.nickname} (@${author.username})
📖 *Title:* ${title}

👍 *Likes:* ${like}   💬 *Comments:* ${comment}   🔁 *Shares:* ${share}

📺 *Quality Selected:* ${qualityNum === '1' ? 'Standard Definition (SD) 1️⃣' : 'High Definition (HD) 2️⃣'}

_Enjoy your video!_ 🎉`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});
