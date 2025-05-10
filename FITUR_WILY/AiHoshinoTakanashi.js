const axios = require('axios');

async function getHoshinoResponse(text) {
  try {
    if (!text || text.trim() === '') {
      return "Maaf, aku tidak mengerti pesanmu. Bisa tolong kirim pesan yang lebih jelas?";
    }

    const response = await axios.get(`https://api.nekorinn.my.id/character-ai/hoshino-takanashi`, {
      params: {
        text: text.trim(),
        sessionid: 'HoshinoTakanashi'
      },
      timeout: 10000,
      retry: 3,
      retryDelay: 1000
    });

    if (response.data.status && response.data.result) {
      return response.data.result;
    }

    if (response.data.error) {
      console.log('API Error:', response.data.error);
      return "Gomen ne, sepertinya ada masalah dengan sistemku...";
    }

    return "Maaf, aku sedang tidak bisa merespon sekarang...";
  } catch (error) {
    console.error('Error in getHoshinoResponse:', error);
    return "Gomen ne, sepertinya ada masalah dengan sistemku...";
  }
}

const messageTimers = new Map();
const COOLDOWN_TIME = 5000; // 5 detik cooldown

async function handleMessage(msg, sock) {
  try {
    // Check if AI feature is enabled in settings
    const { botConfig: settings } = require('../settings.js');
    if (!settings.aiHoshino?.enabled) return;
    // Get message content from various types
    const messageContent = msg.message?.conversation || 
                         msg.message?.extendedTextMessage?.text ||
                         msg.message?.imageMessage?.caption ||
                         '';

    if (!messageContent) return;

    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const sender = msg.key.participant || msg.key.remoteJid;
    const isGroup = msg.key.remoteJid.endsWith('@g.us');

    // Check if message mentions bot or is reply to bot
    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const quotedMessage = msg.message?.extendedTextMessage?.contextInfo;
    const isReplyToBot = quotedMessage?.participant === botNumber;
    const isBotMentioned = mentionedJid.includes(botNumber);

    // Handle group messages
    if (isGroup) {
      // Only respond if bot is mentioned or message is reply to bot
      if (!isBotMentioned && !isReplyToBot) return;
    }

    // Check cooldown
    const now = Date.now();
    const lastMessageTime = messageTimers.get(sender) || 0;
    if (now - lastMessageTime < COOLDOWN_TIME) return;
    messageTimers.set(sender, now);

    // Get response and send message
    const response = await getHoshinoResponse(messageContent);
    const senderName = msg.pushName || sender.split('@')[0];
    const mention = senderName;

    // Array of image URLs
    const images = [
      'https://files.catbox.moe/lza1uc.jpg',
      'https://files.catbox.moe/dz3l1w.jpg',
      'https://files.catbox.moe/0g66xr.jpg',
      'https://files.catbox.moe/8i4bin.jpg',
      'https://files.catbox.moe/2a8jkm.jpg',
      'https://files.catbox.moe/owmntz.jpg',
      'https://files.catbox.moe/hq3irj.jpg'
    ];

    const randomImage = images[Math.floor(Math.random() * images.length)];

    // Custom reply function
    async function ReplyRynzz(teks) {
      const nedd = {      
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterName: "Hoshino Bot",
            newsletterJid: sender,
          },
          externalAdReply: {  
            showAdAttribution: true,
            title: new Date().toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'}),
            body: "Hoshino Takanashi",
            previewType: "IMAGE",
            thumbnailUrl: randomImage,
            sourceUrl: `https://wa.me/${sender.split('@')[0]}`,
          },
        },
        text: teks,
      };
      return sock.sendMessage(msg.key.remoteJid, nedd, {
        quoted: msg,
      });
    }

    // Send response using custom reply
    await ReplyRynzz(`${mention} ${response}`);

  } catch (error) {
    console.error('Error in handleMessage:', error);
  }
}

module.exports = {
  handleMessage
};
