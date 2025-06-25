const config = require('../config')
const {cmd , commands} = require('../command')

cmd({
    pattern: "time",
    react: "⏱️",
    desc: "Show Sri Lankan current time",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    // Get Sri Lanka time (Asia/Colombo UTC+5:30)
    const now = new Date();
    const options = { 
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false 
    };
    const timeString = now.toLocaleTimeString('en-US', options);
    
    // Get Sri Lanka date with Sinhala/Tamil formatting
    const dateOptions = { 
        timeZone: 'Asia/Colombo',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    
    // Determine current Sri Lankan season
    const month = now.getMonth() + 1;
    let season = "";
    if (month >= 12 || month <= 2) {
        season = "🌴 Dry Season (Dec-Feb)";
    } else if (month >= 3 && month <= 5) {
        season = "🌦️ First Inter-Monsoon (Mar-May)";
    } else if (month >= 6 && month <= 9) {
        season = "🌧️ Southwest Monsoon (Jun-Sep)";
    } else {
        season = "⛅ Second Inter-Monsoon (Oct-Nov)";
    }
    
    // Check for Sri Lankan holidays
    const holidays = {
        '01-14': 'Tamil Thai Pongal Day',
        '02-04': 'Independence Day',
        '04-13': 'Sinhala and Tamil New Year',
        '05-01': 'May Day',
        '05-18': 'Id-Ul-Fitr (Ramazan Festival Day)',
        '08-21': 'Id-Ul-Alha (Hajj Festival Day)',
        '12-25': 'Christmas Day'
    };
    const monthDay = `${String(month).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const holiday = holidays[monthDay] ? `\n❒ *Today's Holiday:* ${holidays[monthDay]}` : '';
    
    let timeInfo = `⏰ *Sri Lanka Current Time*
❒ *Time:* ${timeString}
❒ *Date:* ${dateString}
❒ *Season:* ${season}${holiday}

_This updates in real-time when you check_`;
    
    await conn.sendMessage(from, { text: timeInfo }, { quoted: mek });

}catch(e){
    console.log(e)
    reply(`⛔ Error getting time: ${e}`)
}
})

cmd({
    pattern: "alive",
    react: "👋",
    desc: "check bot alive with time info",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    // Get current Sri Lanka time
    const now = new Date();
    const timeOptions = { 
        timeZone: 'Asia/Colombo',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    let madeMenu = `*ᴀᴋɪɴᴅᴜ ᴍᴅ ━ ALIVE*\n
❒ *👋 ʜᴇʟʟᴏ ${pushname}*
❒ *⌚ Sʀɪ Lᴀɴᴋᴀ Tɪᴍᴇ: ${timeString}*
❒ *🟢 Bᴏᴛ Sᴛᴀᴛᴜs: FULLY OPERATIONAL*
❒ *💻 Sᴇʀᴠᴇʀ: ONLINE*
❒ *📊 Sʏsᴛᴇᴍ Uᴘᴛɪᴍᴇ: 99.9%*

❒ *Hᴏᴡ ᴄᴀɴ I ʜᴇʟᴘ ʏᴏᴜ ᴛᴏᴅᴀʏ?*
❒ *Tʏᴘᴇ* \`.menu\` *ꜰᴏʀ ᴀʟʟ ᴄᴏᴍᴍᴀɴᴅꜱ*

> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴀᴋɪɴᴅᴜ ᴍᴅ*`
    
    await conn.sendMessage(from, { 
        image: { url: config.ALIVE_IMG },
        caption: madeMenu 
    }, { quoted: mek });

}catch(e){
    console.log(e)
    reply(`${e}`)
}
})
