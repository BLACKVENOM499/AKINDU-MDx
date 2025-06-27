const { cmd } = require('../command');
const axios = require('axios');

// Database for storing temporary user selections
const qualitySelectionDB = {};

const handleDownload = async (conn, m, from, q, reply, requestedQuality) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return reply("*⚠️ Please provide a valid Facebook URL!*");
    }

    await conn.sendMessage(from, { react: { text: '📥', key: m.key } });

    const apiUrl = `https://lance-frank-asta.onrender.com/api/downloader?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.content?.status || !data?.content?.data?.result?.length) {
      throw new Error("Invalid API response or no video found");
    }

    // Quality selection logic
    let videoData = data.content.data.result.find(v => v.quality === requestedQuality) || 
                   data.content.data.result[0]; // Fallback to first available

    if (!videoData) {
      throw new Error("No downloadable video found");
    }

    const qualityLabel = `Quality: ${videoData.quality || 'Standard'}`;
    await conn.sendMessage(from, {
      video: { url: videoData.url },
      caption: `👇 *VIDEO DOWNLOADED* 👇\n${qualityLabel}\n🚀 Powered by AkinDu-MD`
    }, { quoted: m });

  } catch (error) {
    console.error("DOWNLOAD ERROR:", error);
    await reply(`❌ Download failed: ${error.message}\nPlease try again.`);
  }
};

// Main command to start download process
cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos with quality selection",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  if (!q) return reply("*Please include a Facebook video URL*");
  
  // Store URL with timestamp
  qualitySelectionDB[from] = {
    url: q,
    timestamp: Date.now()
  };

  // Send quality options
  await conn.sendMessage(from, {
    text: `📺 *SELECT VIDEO QUALITY:*\n\n1. HD (Recommended)\n2. SD\n3. Auto (System Default)\n\nReply with the number (1-3)`,
    footer: "Selection expires in 2 minutes",
    templateButtons: [
      { quickReplyButton: { displayText: "1. HD" }},
      { quickReplyButton: { displayText: "2. SD" }},
      { quickReplyButton: { displayText: "3. Auto" }}
    ]
  }, { quoted: m });
});

// Number reply handler
cmd({
  pattern: "reply",
  desc: "Handles number selection for quality",
  category: "system",
  filename: __filename
}, async (conn, m, store, { from, reply }) => {
  const selection = parseInt(m.text.trim());
  const savedData = qualitySelectionDB[from];

  // Validate data exists and is recent (<2 mins old)
  if (!savedData || (Date.now() - savedData.timestamp) > 120000) {
    delete qualitySelectionDB[from];
    return reply("*❌ Selection expired. Please start over.*");
  }

  // Process selection
  let quality;
  switch(selection) {
    case 1: quality = 'HD'; break;
    case 2: quality = 'SD'; break;
    case 3: quality = 'auto'; break;
    default: 
      return reply("*⚠️ Invalid choice! Reply with 1, 2 or 3*");
  }

  // Clean up stored data
  delete qualitySelectionDB[from];

  // Start download
  await handleDownload(conn, m, from, savedData.url, reply, quality);
});

// Clean expired selections periodically
setInterval(() => {
  const now = Date.now();
  for (const user in qualitySelectionDB) {
    if (now - qualitySelectionDB[user].timestamp > 120000) {
      delete qualitySelectionDB[user];
    }
  }
}, 60000); // Runs every minute
