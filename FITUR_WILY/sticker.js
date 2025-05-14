
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { WebP } = require('node-webpmux');

async function stickerHandler(m, client) {
  try {
    // Get command from caption or message
    const cmd = m.message?.imageMessage?.caption?.toLowerCase() || 
                m.message?.conversation?.toLowerCase() || 
                m.message?.extendedTextMessage?.text?.toLowerCase() || '';

    if (!cmd.startsWith('.s') && !cmd.startsWith('.sticker')) return;

    // Only show instructions if there's no image
    if ((cmd === '.s' || cmd === '.sticker') && 
        !m.message?.imageMessage && 
        !m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
      await client.sendMessage(m.key.remoteJid, { 
        text: `╭━━━『 *STICKER CREATOR* 』━━━❀
┃ ⌬ Cara membuat sticker:
┃ 🖼️ Kirim gambar dengan caption .s
┃ 💬 Atau reply gambar dengan .s
╰━━━━━━━━━━━━━━━❀
_Bot akan mengubah gambar menjadi sticker!_` 
      });
      return;
    }

    let imageMessage;
    let buffer;

    // Handle direct image with caption
    if (m.message?.imageMessage) {
      imageMessage = m.message.imageMessage;
      buffer = await downloadMediaMessage(m, 'buffer', {}, {});
    } 
    // Handle replied image
    else if (m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
      imageMessage = m.message.extendedTextMessage.contextInfo.quotedMessage.imageMessage;
      buffer = await downloadMediaMessage(
        { key: m.key, message: { imageMessage } },
        'buffer',
        {},
        {}
      );
    }

    if (!buffer) {
      await client.sendMessage(m.key.remoteJid, { 
        text: '❌ Kirim gambar dengan caption .s atau reply gambar dengan .s!' 
      });
      return;
    }

    // Convert to WebP sticker
    const sticker = await sharp(buffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp()
      .toBuffer();

    // Send sticker with quoted reply and processing message
    await client.sendMessage(m.key.remoteJid, { 
      text: "⏳ Sedang membuat sticker...",
      quoted: m
    });

    // Send the sticker
    await client.sendMessage(m.key.remoteJid, { 
      sticker: sticker,
      quoted: m,
      mimetype: 'image/webp'
    });

  } catch (error) {
    console.error('Error in sticker handler:', error);
    await client.sendMessage(m.key.remoteJid, { 
      text: '❌ Gagal membuat sticker. Silakan coba lagi!' 
    });
  }
}

module.exports = { stickerHandler };
