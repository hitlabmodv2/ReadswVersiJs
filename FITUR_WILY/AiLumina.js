
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

    // Check if message is from group and validate tag/reply
    const isGroup = msg.key.remoteJid.endsWith('@g.us');
    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const quotedMessage = msg.message?.extendedTextMessage?.contextInfo;
    const isReplyToBot = quotedMessage?.participant === botNumber;
    const isBotMentioned = mentionedJid.includes(botNumber);

    // Return if group message without bot mention/reply
    if (isGroup && !isBotMentioned && !isReplyToBot) {
      return;
    }

    const response = await axios.get(`${settings.luminaAi.apiUrl}`, {
      params: {
        content: text.trim()
      },
      timeout: 30000,
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
      retry: 2,
      retryDelay: 1000
    }).catch(error => {
      console.error('Error accessing Lumina API:', error.message);
      if (error.code === 'ECONNABORTED') {
        return { data: { data: "Maaf, server sedang sibuk. Mohon coba lagi sebentar." } };
      }
      return { data: { data: "Maaf, terjadi kesalahan saat menghubungi server. Silakan coba lagi nanti." } };
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
