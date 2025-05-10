const axios = require('axios');
const settings = require('../ai_settings.js');

const characterName = "Lumina";
const images = [
  "https://files.catbox.moe/9cq0yk.jpg"
];

async function getLuminaResponse(text, msg, sock) {
  try {
    if (!settings.luminaAi.enabled) {
      return;
    }

    if (!text || text.trim() === '') {
      return "*⚠️ System Notice*\n\nMaaf, aku tidak mengerti pesanmu. Bisa tolong kirim pesan yang lebih jelas?";
    }

    const response = await axios.get(`${settings.luminaAi.apiUrl}`, {
      params: {
        content: text.trim()
      },
      timeout: 10000
    });

    if (response.data && response.data.data) {
      const sender = msg.key.participant || msg.key.remoteJid;
      const senderName = msg.pushName || sender.split('@')[0];
      const mention = `👋 *${senderName}*`;
      const randomImage = images[Math.floor(Math.random() * images.length)];

      async function ReplyRynzz(teks) {
        const hariini = new Date().toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
        const packname = "Lumina Ai";
        const nedd = {      
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterName: "Lumina Ai",
              newsletterJid: "120363312297133690@newsletter",
            },
            externalAdReply: {  
              showAdAttribution: true,
              title: `${hariini}`,
              body: `${packname}`,
              previewType: "IMAGE",
              thumbnailUrl: "https://files.catbox.moe/9cq0yk.jpg",
              sourceUrl: "https://wa.me/6289688206739",
            },
          },
          text: teks,
        };
        return sock.sendMessage(msg.key.remoteJid, nedd, {
          quoted: msg,
        });
      }

      await ReplyRynzz(`${mention}\n\n${response.data.data}`);
      return null;
    }

    return "*⚠️ System Notice*\n\nMaaf, aku sedang tidak bisa merespon sekarang...";
  } catch (error) {
    console.error('*❌ Error in getLuminaResponse:*\n', error);
    return "*⚠️ System Notice*\n\nGomen ne, sepertinya ada masalah dengan sistemku...";
  }
}

module.exports = { getLuminaResponse };
