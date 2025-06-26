const fetch = require('node-fetch');
const config = require('../config');    
const { cmd } = require('../command');

const _0x3bda96 = {
  pattern: "toqr",
  react: '🔊',
  desc: descg,
  category: "convert",
  use: ".toqr <Reply a text or a url>",
  filename: __filename
};
cmd(_0x3bda96, async (_0x85429b, _0x21ccac, _0x1c5d7e, {
  from: _0x4f4bb4,
  l: _0x4d23de,
  quoted: _0x44aab,
  body: _0x2208ba,
  prefix: _0x406b7c,
  isCmd: _0x4d22d8,
  command: _0x34a90a,
  args: _0x36ebd4,
  q: _0x54bb15,
  isGroup: _0x4420bc,
  sender: _0x2bf389,
  senderNumber: _0x256262,
  botNumber2: _0x42cdcc,
  botNumber: _0xe816e1,
  pushname: _0x465614,
  isMe: _0x1c19d6,
  isOwner: _0x206259,
  groupMetadata: _0x4d38e0,
  groupName: _0x5cf49d,
  participants: _0x97412b,
  groupAdmins: _0x2e5f81,
  isBotAdmins: _0x31e244,
  isAdmins: _0x5af3ea,
  reply: _0x8146da
}) => {
  try {
    if (!_0x54bb15) {
      return _0x8146da(" Please include link or text!");
    }
    const _0x563d08 = require("qrcode");
    const _0x3930fb = {
      scale: 0x23
    };
    let _0x3bb0c5 = await _0x563d08.toDataURL(_0x54bb15, _0x3930fb);
    let _0x26346f = new Buffer.from(_0x3bb0c5.replace("data:image/png;base64,", ''), "base64");
    let _0x412f0a = getRandom(".jpg");
    await fs.writeFileSync('./' + _0x412f0a, _0x26346f);
    let _0x1cfb98 = fs.readFileSync('./' + _0x412f0a);
    const _0x36a8c6 = {
      image: _0x1cfb98,
      caption: "Here you go!"
    };
    const _0x28ff40 = {
      quoted: _0x1c5d7e
    };
    await _0x85429b.sendMessage(_0x4f4bb4, _0x36a8c6, _0x28ff40);
    setTimeout(() => {
      fs.unlinkSync(_0x412f0a);
    }, 10000);
    const _0x37a42 = {
      text: '🎼',
      key: _0x21ccac.key
    };
    const _0x366415 = {
      react: _0x37a42
    };
    await _0x85429b.sendMessage(_0x4f4bb4, _0x366415);
  } catch (_0x1b4973) {
    _0x8146da("*Error !!*");
    _0x4d23de(_0x1b4973);
  }
});
