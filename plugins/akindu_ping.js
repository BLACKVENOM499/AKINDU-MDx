const config = require('../config')
let fs = require('fs')
const os = require("os")
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
cmd({
    pattern: "ping",
    react: "⚡",
    alias: ["speed"],
    desc: "Check bot\'s ping",
    category: "main",
    use: '.ping',
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
const startTime = Date.now()
        const message = await conn.sendMessage(from, { text: '*ᴘɪɴɢɪɴɢ*' })
        const endTime = Date.now()
        const ping = endTime - startTime
        await conn.sendMessage(from, { text: `*ᴀᴋɪɴᴅᴜ ᴍᴅ ꜱᴘᴇᴇᴅ : ${ping}ᴍꜱ*`}, { quoted: message })
    } catch (e) {
        console.log(e)
        reply(`${e}`)
    }
})
