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
        if (!q) return reply("Please provide a TikTok video link and quality number (1 for SD, 2 for HD).\n\nExample:\n.tiktok <link> 1");
        
        // Split input to get link and quality number
        // args example: ['https://tiktok...', '1']
        let inputArgs = q.trim().split(' ');
        let link = inputArgs[0];
        let qualityNum = inputArgs[1] || '1'; // default to SD (1)

        if (!link.includes("tiktok.com")) return reply("Invalid TikTok link.");
        if (!['1', '2'].includes(qualityNum)) return reply("Quality number must be 1 (SD) or 2 (HD).");

        reply("Downloading video, please wait...");

        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(link)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) return reply("Failed to fetch TikTok video.");

        const { title, like, comment, share, author, meta } = data.data;
        if (!meta || !meta.media || !Array.isArray(meta.media)) 
            return reply("Video metadata not found.");

        // Find SD and HD video URLs
        // Based on assumption: type = "video" with 'quality' or 'resolution' property
        // If no explicit quality, fallback based on index

        // Find all videos
        const videos = meta.media.filter(v => v.type === 'video');

        if (videos.length === 0) return reply("No video found in metadata.");

        // Try to find SD (lower quality) and HD (higher quality)
        // If meta.media items have 'quality' or 'resolution', use them.
        // Otherwise, assume videos[0] = SD, videos[1] = HD (if exists)

        let sdVideo = videos[0];
        let hdVideo = videos[1] || videos[0]; // fallback to first if no HD

        // Select video based on qualityNum
        const selectedVideo = qualityNum === '1' ? sdVideo : hdVideo;
        if (!selectedVideo.org) return reply("Video URL not found.");

        const videoUrl = selectedVideo.org;

        const caption = `🎵 *TikTok Video* 🎵\n\n` +
                        `👤 *User:* ${author.nickname} (@${author.username})\n` +
                        `📖 *Title:* ${title}\n` +
                        `👍 *Likes:* ${like}\n💬 *Comments:* ${comment}\n🔁 *Shares:* ${share}\n\n` +
                        `📺 *Quality:* ${qualityNum === '1' ? 'SD' : 'HD'}`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
