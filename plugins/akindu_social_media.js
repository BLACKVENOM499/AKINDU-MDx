const { cmd } = require('../command');
const axios = require('axios');

// Common download handler with quality selection
const handleDownload = async (conn, m, from, q, reply, requestedQuality) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return reply("*Please provide a valid Facebook URL!*\nExample: fb hd https://fb.com/video");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const apiUrl = `https://lance-frank-asta.onrender.com/api/downloader?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.content?.status || !data?.content?.data?.result?.length) {
      throw new Error("No downloadable video found");
    }

    // Try requested quality first, then fallback
    let videoData = data.content.data.result.find(v => v.quality === requestedQuality);
    if (!videoData && requestedQuality === 'HD') {
      videoData = data.content.data.result.find(v => v.quality === 'SD');
    }
    if (!videoData) videoData = data.content.data.result[0];

    const qualityNumber = videoData.quality === 'HD' ? '1080' : '720';
    
    await conn.sendMessage(from, {
      video: { url: videoData.url },
      caption: `✅ Downloaded with ${qualityNumber}p Quality\n📊 Size: ${(videoData.size/1024/1024).toFixed(2)}MB\n🚀 Powered by AKindU MD`
    }, { quoted: m });

    // Delete processing reaction
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

  } catch (error) {
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
    reply(`Failed to download: ${error.message}`);
  }
};

// HD Quality Command
cmd({
  pattern: "fbhd",
  alias: ["fbd-hd"],
  desc: "Download HD Facebook videos (1080p)",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  await handleDownload(conn, m, from, q, reply, 'HD');
});

// SD Quality Command
cmd({
  pattern: "fbsd",
  alias: ["fbd-sd"],
  desc: "Download SD Facebook videos (720p)",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  await handleDownload(conn, m, from, q, reply, 'SD');
});

// Number-based quality selection
cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos with quality number\nExample: fb 1080 <url> for HD",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  const parts = q.split(' ');
  let quality = 'auto';
  let url = q;

  // Check for number quality specification
  if (parts.length > 1 && !isNaN(parts[0])) {
    const qualityNum = parseInt(parts[0]);
    quality = qualityNum >= 1080 ? 'HD' : 'SD';
    url = parts.slice(1).join(' ');
  }

  await handleDownload(conn, m, from, url, reply, quality);
});

// Helper command to show available qualities
cmd({
  pattern: "fbhelp",
  desc: "Show Facebook download quality options",
  category: "download",
  filename: __filename
}, (conn, m, store, { reply }) => {
  reply(`📱 *Facebook Download Quality Options*:
  
🔹 *fb 1080 <url>* - Best quality (HD)
🔹 *fb 720 <url>* - Standard quality (SD)
🔹 *fbhd <url>* - Force HD download
🔹 *fbsd <url>* - Force SD download

💡 Example: *fb 1080 https://fb.com/video*`);
});
