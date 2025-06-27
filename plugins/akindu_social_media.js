const { cmd } = require('../command');
const axios = require('axios');

const handleDownload = async (conn, m, from, q, reply, requestedType) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return reply("*`Need a valid Facebook URL!`*");
    }

    await conn.sendMessage(from, { react: { text: '📥', key: m.key } });
    
    const apiUrl = `https://lance-frank-asta.onrender.com/api/downloader?url=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data?.content?.status || !data?.content?.data?.result?.length) {
      throw new Error("Invalid API response or no video found.");
    }

    let videoData;
    if (requestedType === 'SD_VIDEO') {
      videoData = data.content.data.result.find(v => v.quality === 'SD' && v.type === 'video');
    } else if (requestedType === 'SD_DOCUMENT') {
      videoData = data.content.data.result.find(v => v.quality === 'SD' && v.type === 'document');
    } else if (requestedType === 'HD_VIDEO') {
      videoData = data.content.data.result.find(v => v.quality === 'HD' && v.type === 'video');
    } else if (requestedType === 'HD_DOCUMENT') {
      videoData = data.content.data.result.find(v => v.quality === 'HD' && v.type === 'document');
    } else if (requestedType === 'AUDIO') {
      videoData = data.content.data.result.find(v => v.type === 'audio');
    }

    if (!videoData) {
      throw new Error("No valid video URL found.");
    }

    const qualityLabel = videoData.quality || 'Standard';
    await conn.sendMessage(from, {
      video: { url: videoData.url },
      caption: `📥 *𝐒𝐔𝐋𝐀-𝐌𝐃 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐃*\n> *𝚅𝙸𝙳𝙴𝙾 𝚄𝚁𝙻:* ${videoData.url}\n> *Quality:* ${qualityLabel}`
    }, { quoted: m });

  } catch (error) {
    console.error("Facebook Download Error:", error);
    const ownerNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    await conn.sendMessage(ownerNumber, {
      text: `⚠️ *Facebook Downloader Error!*\n\n📍 *Group/User:* ${from}\n💬 *Query:* ${q}\n❌ *Error:* ${error.message || error}`
    });
    reply(`❌ *Error:* Unable to process the request. Please try again later.`);
  }
};

// Command to initiate the download process
cmd({
  pattern: "fb",
  alias: ["facebook", "fbdl"],
  desc: "Download Facebook videos with quality and type selection",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  // Ask the user for the quality and type selection
  await conn.sendMessage(from, {
    text: `📥 *𝐒𝐔𝐋𝐀-𝐌𝐃 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐕𝐈𝐃𝐄𝐎 𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃𝐄𝐑* 📥\n\n➤ *𝚅𝙸𝙳𝙴𝙾 𝚄𝚁𝙻 :* ${q}\n\n*🔢 Reply Below Number*\n\n𝐒𝙳 𝐓𝚈𝙿𝙴 🪫\n    1.1 │  🪫 \`SD\` 𝐐𝚄𝙰𝙻𝙸𝚃𝚈 𝐕𝙸𝙳𝙴𝙾\n    1.2 │  📂 \`SD\` 𝐐𝚄𝙰𝙻𝙸𝚃𝚈 𝐃𝙾𝙲𝚄𝙼𝙴𝙽𝚃\n\n𝐇𝙳 𝐓𝚈𝙿𝙴 🔋\n    2.1 │  🔋 \`HD\` 𝐐𝚄𝙰𝙻𝙸𝚃𝚈 𝐕𝙸𝙳𝙴𝙾\n    2.2 │  📂 \`HD\` 𝐐𝚄𝙰𝙻𝙸𝚃𝚈 𝐃𝙾𝙲𝚄𝙼𝙴𝙽𝚃\n\n𝐕𝙾𝙸𝙲𝙴 𝐓𝚈𝙿𝙴 🎶\n    3.1 │  🎶 \`AUDIO\` 𝐅𝙄𝙇𝙀\n    3.2 │  📂 \`DOCUMENT\` 𝐅𝙄𝙇𝙀\n\n> 𝐏𝙊𝚆𝙀𝚁𝙀𝙳 𝐁𝚈 𝐒𝚄𝙇𝙰 𝐌𝙳`
  }, { quoted: m });

  // Store the URL for later use
  store[from] = { url: q };
});

// Command to handle the user's quality and type selection
cmd({
  pattern: "reply",
  desc: "Handle quality and type selection for Facebook video download",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, reply }) => {
  const userSelection = m.text.trim();

  // Check if the user has previously sent a URL
  if (!store[from] || !store[from].url) {
    return reply("*`Please provide a valid Facebook URL first!`*");
  }

  const url = store[from].url;

  // Determine the requested type based on user input
  if (userSelection === '1.1') {
    await handleDownload(conn, m, from, url, reply, 'SD_VIDEO');
  } else if (userSelection === '1.2') {
    await handleDownload(conn, m, from, url, reply, 'SD_DOCUMENT');
  } else if (userSelection === '2.1') {
    await handleDownload(conn, m, from, url, reply, 'HD_VIDEO');
  } else if (userSelection === '2.2') {
    await handleDownload(conn, m, from, url, reply, 'HD_DOCUMENT');
  } else if (userSelection === '3.1') {
    await handleDownload(conn, m, from, url, reply, 'AUDIO');
  } else if (userSelection === '3.2') {
    await handleDownload(conn, m, from, url, reply, 'DOCUMENT');
  } else {
    reply("*`Invalid selection! Please reply with the correct number for your choice.`*");
  }

  // Clear the stored URL after processing
  delete store[from];
});
