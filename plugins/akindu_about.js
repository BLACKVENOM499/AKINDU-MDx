const config = require('../config')
const {cmd , commands} = require('../command')
cmd({
    pattern: "about",
    react: "👑",
    desc: "get owner dec",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
let madeMenu = `*ᴀᴋɪɴᴅᴜ ᴍᴅ ᴀʙᴏᴜᴛ*

❒  *👋 ʜᴇʟʟᴏ ${pushname}*

❒ *ɪ'ᴍ ᴀᴋɪɴᴅᴜ ᴅɪᴍᴀɴꜱʜᴀ.*

❒ *ᴏᴡɴᴇʀ ᴏꜰ ᴀᴋɪɴᴅᴜ ᴍᴅ ᴡʜᴀᴛꜱᴀᴘᴘ ʙᴏᴛ.*

❒ *ɪ'ᴍ ꜰʀᴏᴍ ꜱʀɪ ʟᴀɴᴋᴀ.*

❒ *16 ʏᴇᴀʀꜱ ᴏʟᴅ.*

> *ᴀᴋɪɴᴅᴜ ᴍᴅ*`
await conn.sendMessage(from,{image:{url:config.ALIVE_IMG},caption:madeMenu},{quoted:mek})

}catch(e){
console.log(e)
reply(`${e}`)
}
})
