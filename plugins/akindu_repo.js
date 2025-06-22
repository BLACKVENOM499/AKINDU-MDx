const fetch = require('node-fetch');
const config = require('../config');    
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch information about a GitHub repository.",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/AKINDU-MD-2025/AKINDU-MD/';

    try {
        // Extract username and repo name from the URL
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

        // Fetch repository details using GitHub API
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status}`);
        }

        const repoData = await response.json();

        // Format the repository information
        const formattedInfo = `*ᴀᴋɪɴᴅᴜ ᴍᴅ ʀᴇᴘᴏꜱɪᴛᴏʀʏ*
❒ *ʙᴏᴛ ɴᴀᴍᴇ* : ${repoData.name}

❒ *ᴏᴡɴᴇʀ ɴᴀᴍᴇ* : ${repoData.owner.login}

❒ *ꜱᴛᴀʀꜱ* : ${repoData.stargazers_count}

❒ *ꜰᴏʀᴋꜱ* : ${repoData.forks_count}

❒ *ɢɪᴛ ʜᴜʙ ʟɪɴᴋ* : ${repoData.html_url}

❒ *ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ* : ${repoData.description || 'No description'}

❒ *ꜰᴏʀᴋ ᴀɴᴅ ɢɪᴠᴇ ᴀ ꜱᴛᴀʀ ᴍʏ ᴡʜᴀᴛꜱ ᴀᴘᴘ ʙᴏᴛ*

> *ᴀᴋɪɴᴅᴜ ᴍᴅ*`;

    } catch (error) {
        console.error("Error in repo command:", error);
        reply("Sorry, something went wrong while fetching the repository information. Please try again later.");
    }
});
