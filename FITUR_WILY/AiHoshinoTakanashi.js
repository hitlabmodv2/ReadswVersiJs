const axios = require('axios');

async function getCharacterResponse(character, text) {
  try {
    if (!text || text.trim() === '') {
      return "*⚠️ System Notice*\n\nMaaf, aku tidak mengerti pesanmu. Bisa tolong kirim pesan yang lebih jelas?";
    }

    const endpoints = {
      hoshino: 'hoshino-takanashi',
      hiura: 'hiura-mihate',
      hitori: 'hitori-gotoh'
    };

    const endpoint = endpoints[character];
    if (!endpoint) {
      return "*❌ System Error*\n\nCharacter tidak tersedia";
    }

    const response = await axios.get(`https://api.nekorinn.my.id/character-ai/${endpoint}`, {
      params: {
        text: text.trim(),
        sessionid: character.charAt(0).toUpperCase() + character.slice(1)
      },
      timeout: 10000,
      retry: 3,
      retryDelay: 1000
    });

    if (response.data.status && response.data.result) {
      // Add bold formatting to text inside parentheses
      const formattedResponse = response.data.result.replace(/\((.*?)\)/g, '*(($1))*');
      return formattedResponse;
    }

    if (response.data.error) {
      console.log('*🔴 API Error:*\n', response.data.error);
      return "*⚠️ System Notice*\n\nGomen ne, sepertinya ada masalah dengan sistemku...";
    }

    return "*⚠️ System Notice*\n\nMaaf, aku sedang tidak bisa merespon sekarang...";
  } catch (error) {
    console.error('*❌ Error in getCharacterResponse:*\n', error);
    return "*⚠️ System Notice*\n\nGomen ne, sepertinya ada masalah dengan sistemku...";
  }
}

const messageCache = new Map();
const COOLDOWN_TIME = 5000; // 5 detik cooldown
const SPAM_TIMEOUT = 30000; // 30 detik timeout untuk spam

const characterErrors = {
  hoshino: '*⚠️ System Notice*\n\nGomen ne~ Hanya bisa mengaktifkan satu karakter AI saja. Mohon tunggu sebentar ya...',
  hiura: '*⚠️ System Notice*\n\nSumimasen! Mohon jangan spam pesan. Silakan tunggu beberapa saat...',
  hitori: '*⚠️ System Notice*\n\nAh... sepertinya kamu terlalu cepat mengirim pesan. Mohon tunggu sebentar~'
};

function isSpamming(sender) {
  const now = Date.now();
  const lastMsg = messageCache.get(sender) || 0;

  if (now - lastMsg < COOLDOWN_TIME) {
    return true;
  }

  messageCache.set(sender, now);
  return false;
}

async function handleMessage(msg, sock) {
  try {
    const { botConfig: settings } = require('../settings.js');

    const enabledCharacters = Object.entries(settings.aiCharacters)
      .filter(([_, config]) => config.enabled);

    if (enabledCharacters.length === 0) return;

    if (enabledCharacters.length > 1) {
      const [firstChar] = enabledCharacters;
      const sender = msg.key.participant || msg.key.remoteJid;

      if (isSpamming(sender)) {
        return;
      }

      const errorMsg = characterErrors[firstChar[0]] || "*⚠️ System Notice*\n\nMaaf, hanya satu karakter AI yang dapat aktif pada satu waktu.";
      const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
      const isGroup = msg.key.remoteJid.endsWith('@g.us');

      if (!isGroup || (isGroup && (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(botNumber) || 
          msg.message?.extendedTextMessage?.contextInfo?.participant === botNumber))) {
        await sock.sendMessage(msg.key.remoteJid, { text: errorMsg });
        return;
      }
      return;
    }

    const messageContent = msg.message?.conversation || 
                         msg.message?.extendedTextMessage?.text ||
                         msg.message?.imageMessage?.caption ||
                         '';

    if (!messageContent) return;

    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const sender = msg.key.participant || msg.key.remoteJid;
    const isGroup = msg.key.remoteJid.endsWith('@g.us');

    const mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    const quotedMessage = msg.message?.extendedTextMessage?.contextInfo;
    const isReplyToBot = quotedMessage?.participant === botNumber;
    const isBotMentioned = mentionedJid.includes(botNumber);

    if (isGroup && !isBotMentioned && !isReplyToBot) return;

    const now = Date.now();
    const lastMessageTime = messageCache.get(sender) || 0;
    if (now - lastMessageTime < COOLDOWN_TIME) return;
    messageCache.set(sender, now);

    const [characterName, characterConfig] = enabledCharacters[Math.floor(Math.random() * enabledCharacters.length)];
    const response = await getCharacterResponse(characterName, messageContent);
    const senderName = msg.pushName || sender.split('@')[0];
    const mention = `*👤 ${senderName}*`;

    const images = characterConfig.images;
    const randomImage = images[Math.floor(Math.random() * images.length)];

    async function ReplyRynzz(teks) {
        const hariini = new Date().toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
        const packname = characterName.charAt(0).toUpperCase() + characterName.slice(1);
        const nedd = {      
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterName: packname,
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

    await ReplyRynzz(`${mention}\n\n${response}`);

  } catch (error) {
    console.error('*❌ Error in handleMessage:*\n', error);
  }
}

module.exports = {
  handleMessage
};
