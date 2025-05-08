const {
  default: WAConnect,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  Browsers,
  fetchLatestWaWebVersion,
  downloadMediaMessage,
  jidNormalizedUser
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const readline = require('readline');
const { Boom } = require("@hapi/boom");
const fs = require('fs');
const path = require('path');

// Anti-tag handler functions
function loadWarningData() {
  const warningFile = path.join(__dirname, 'DATA', 'tag_warnings.json');
  try {
    if (fs.existsSync(warningFile)) {
      return JSON.parse(fs.readFileSync(warningFile, 'utf8'));
    }
  } catch (error) {
    console.error('Error loading warning data:', error);
  }
  return {};
}

function saveWarningData(data) {
  const warningFile = path.join(__dirname, 'DATA', 'tag_warnings.json');
  try {
    fs.writeFileSync(warningFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving warning data:', error);
  }
}

async function handleAntiTagSW(sock, msg) {
  if (!config.antitagswv2) return;

  if (msg.message?.groupStatusMentionMessage) {
    const groupId = msg.key.remoteJid;
    const participant = msg.key.participant;

    // Load warning data
    const warningData = loadWarningData();
    if (!warningData[groupId]) warningData[groupId] = {};
    if (!warningData[groupId][participant]) warningData[groupId][participant] = 0;
    warningData[groupId][participant]++;

    // Reply to the message
    await sock.sendMessage(participant, {
      text: "⚠️ *PERINGATAN*\n\nMaaf, anda telah melakukan tag grup di status. Mohon untuk tidak mengulanginya lagi.\n\nJika anda mengulanginya, akan diberikan sanksi sesuai ketentuan grup."
    });

    try {
      const groupMetadata = await sock.groupMetadata(groupId);
      const groupName = groupMetadata.subject;
      const warnings = warningData[groupId][participant];

      // Delete message
      if (config.deleteMessages) {
        await sock.sendMessage(groupId, { delete: msg.key });
      }

      // Send warning
      if (warnings <= config.maxWarnings) {
        // Get user profile picture
        let ppuser;
        try {
          ppuser = await sock.profilePictureUrl(participant, 'image');
        } catch {
          ppuser = 'https://i.ibb.co/T8JgL6m/avatar-contact.png'; // Default avatar if no profile picture
        }

        await sock.sendMessage(groupId, {
          image: { url: ppuser },
          caption: `⚠️ *Anti-Tag Warning ${warnings}/${config.maxWarnings}*\n\n@${participant.split('@')[0]} dilarang tag grup di status!\n\nGroup: ${groupName}`,
          mentions: [participant]
        }, {
          quoted: msg
        });
      }

      // Kick if max warnings reached
      if (warnings >= config.maxWarnings && config.kickEnabled) {
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isAdmin = groupMetadata.participants.some(p => p.id === botNumber && p.admin);

        if (isAdmin) {
          await sock.groupParticipantsUpdate(groupId, [participant], 'remove');
          delete warningData[groupId][participant];
        }
      }

      saveWarningData(warningData);
    } catch (error) {
      console.error('Error handling anti-tag:', error);
    }
  }
}

// Load config from JSON file
let config;
try {
  config = require('./config.json');
} catch (error) {
  console.error('Error loading config:', error);
  process.exit(1);
}

let totalViewed = 0;

const saveCounter = (count, number) => {
  const dataDir = path.join(__dirname, 'DATA');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const counterFile = path.join(dataDir, 'counter.json');
  let data = { total: count, numbers: {} };

  try {
    if (fs.existsSync(counterFile)) {
      data = JSON.parse(fs.readFileSync(counterFile));
    }
  } catch (err) {
    console.log("Error reading existing counter data");
  }

  if (number) {
    data.numbers[number] = (data.numbers[number] || 0) + 1;
  }
  data.total = count;

  fs.writeFileSync(counterFile, JSON.stringify(data, null, 2));
};

const loadCounter = (number) => {
  const counterFile = path.join(__dirname, 'DATA', 'counter.json');
  try {
    if (!fs.existsSync(counterFile)) {
      return 0;
    }
    const data = JSON.parse(fs.readFileSync(counterFile));
    return number ? (data.numbers[number] || 0) : data.total;
  } catch {
    return 0;
  }
};

async function isSocketReady(sock) {
  return sock && sock.user && sock.user.id;
}

const { textColors, bgColors, reset } = require('./WARNA_CODE/CodeWarna.js');

async function handleStatusUpdate(sock, msg, logCuy) {
  try {
    if (!await isSocketReady(sock)) {
      console.log("Menunggu koneksi WhatsApp siap...");
      return;
    }

    if (msg.key.remoteJid === "status@broadcast" && msg.key.participant) {
      if (!config.autoReadStatus) return;

      let senderNumber = msg.key.participant.split("@")[0];
      let displaySendernumber = config.sensorNomor ? 
        senderNumber.slice(0, 3) + "****" + senderNumber.slice(-2) : 
        senderNumber;
      const senderName = msg.pushName || "Tidak diketahui";

      if (msg.message?.protocolMessage || msg.message?.reactionMessage) return;

      if (config.blackList.includes(senderNumber)) {
        console.log(`${senderName} (${displaySendernumber}) dalam blacklist, diabaikan`);
        return;
      }

      if (config.whiteList.length > 0 && !config.whiteList.includes(senderNumber)) {
        console.log(`${senderName} (${displaySendernumber}) tidak dalam whitelist, diabaikan`);
        return;
      }

      const emojis = require(`./KUMPULAN_EMOJI/${config.emojiFile}.js`);
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
      const myself = jidNormalizedUser(sock.user.id);

      await new Promise(resolve => setTimeout(resolve, config.SpeedReadStory));
      await sock.readMessages([msg.key]);

      if (config.autoLikeStatus) {
        try {
          await sock.sendMessage(
            msg.key.remoteJid,
            { react: { key: msg.key, text: randomEmoji } },
            { statusJidList: [msg.key.participant, myself] }
          );
        } catch (error) {
          console.log(`Gagal memberikan reaksi: ${error.message}`);
        }
      }

      totalViewed++;
      saveCounter(totalViewed, senderNumber);
      const contactViews = loadCounter(senderNumber);

      const statusType = msg.message.imageMessage ? "Gambar" : 
                        msg.message.videoMessage ? "Video" : 
                        msg.message.audioMessage ? "Audio" :
                        msg.message.extendedTextMessage ? "Teks" : "Tidak diketahui";


      const date = new Date();
      const formattedDate = date.toLocaleDateString('id-ID', { 
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        month: 'long',
        year: 'numeric',
        day: 'numeric'
      });

      const formattedTime = date.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Jakarta',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      const getTimeSession = () => {
        const hour = new Date().toLocaleString('en-US', { 
          timeZone: 'Asia/Jakarta',
          hour: 'numeric',
          hour12: false
        });
        const hourNum = parseInt(hour);
        if (hourNum >= 0 && hourNum < 4) return "🌙 Tengah Malam";
        if (hourNum >= 4 && hourNum < 10) return "🌅 Pagi";
        if (hourNum >= 10 && hourNum < 15) return "☀️ Siang";
        if (hourNum >= 15 && hourNum < 18) return "🌤️ Sore";
        return "🌜 Malam";
      };

      console.log(textColors.cyan + "\n├─────────────────");
      console.log(textColors.cyan + "│" + textColors.yellow + "🤖 BOT AUTO LIHAT STATUS WHATSAPP");
      console.log(textColors.cyan + "├─────────────────");
      console.log(textColors.cyan + "│" + textColors.magenta + "📊 Info System");
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " Status Bot      : " + textColors.green + "Aktif ✓");
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " ⏰ Sesi         : " + textColors.yellow + getTimeSession());
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " 📅 Tanggal      : " + textColors.blue + formattedDate);
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " 🕐 Waktu        : " + textColors.blue + formattedTime);
      console.log(textColors.cyan + "├─────────────────");
      console.log(textColors.cyan + "│" + textColors.magenta + "📱 Info Status");
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " Kecepatan Lihat : " + textColors.yellow + config.SpeedReadStory/1000 + " Detik");
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " Total Dilihat   : " + textColors.green + totalViewed);
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " Dilihat Kontak  : " + textColors.green + contactViews);
      console.log(textColors.cyan + "├─────────────────");
      console.log(textColors.cyan + "│" + textColors.magenta + "👤 Info Kontak");
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " Nama            : " + textColors.yellow + senderName);
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " Nomor           : " + textColors.yellow + displaySendernumber);
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " Tipe Status     : " + textColors.blue + statusType);
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " Reaksi          : " + randomEmoji);
      console.log(textColors.cyan + "│ ⟫" + textColors.white + " Status          : " + textColors.green + (config.autoLikeStatus ? "Dilihat & Disukai" : "Dilihat"));
      console.log(textColors.cyan + "└─────────────────" + reset);

      if (config.downloadMediaStatus && (msg.message?.imageMessage || msg.message?.videoMessage || msg.message?.audioMessage)) {
        try {
          const buffer = await downloadMediaMessage(msg, "buffer", {}, { logger: pino({ level: "silent" }) });
          const mediaType = msg.message.imageMessage ? "image" : 
                          msg.message.videoMessage ? "video" : "audio";

          await sock.sendMessage(`${sock.user.id.split(':')[0]}@s.whatsapp.net`, {
            [mediaType]: buffer,
            caption: `Status dari ${senderName} (${displaySendernumber})\nTipe: ${statusType}`
          });
        } catch (error) {
          console.log(`Error downloading media: ${error.message}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error in handleStatusUpdate: ${error.message}`);
  }
}

const pairingCode = process.argv.includes("--pairing-code");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function WAStart() {
  const { state, saveCreds } = await useMultiFileAuthState("./session");
  const { version, isLatest } = await fetchLatestWaWebVersion().catch(() => fetchLatestBaileysVersion());

  // Ensure DATA directory exists
  const dataDir = './DATA';
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  // Load or initialize counter data
  let savedData = { total: 0, numbers: {} };
  const counterFile = './DATA/counter.json';
  if (fs.existsSync(counterFile)) {
    try {
      savedData = JSON.parse(fs.readFileSync(counterFile));
      totalViewed = savedData.total; // Sync with global counter
    } catch (error) {
      console.error('Error reading counter data:', error);
    }
  } else {
    fs.writeFileSync(counterFile, JSON.stringify(savedData, null, 2));
  }
  const getTimeSession = () => {
    const hour = new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Jakarta', hour: 'numeric', hour12: false });
    if (hour >= 0 && hour < 5) return "🌙 Tengah Malam";
    if (hour >= 5 && hour < 11) return "🌅 Pagi";
    if (hour >= 11 && hour < 15) return "☀️ Siang";
    if (hour >= 15 && hour < 18) return "🌤️ Sore";
    return "🌜 Malam";
  };

  const date = new Date();
  const formattedDate = date.toLocaleDateString('id-ID', { 
    timeZone: 'Asia/Jakarta',
    weekday: 'long',
    month: 'short',
    year: 'numeric',
    day: 'numeric'
  });

  const formattedTime = date.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Jakarta',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  const client = WAConnect({
    logger: pino({ level: "silent" }),
    browser: Browsers.ubuntu("Chrome"),
    auth: state,
    version: version,
    markOnlineOnConnect: config.autoOnline,
    readReceipts: config.readReceipts,
    browserDescription: ["BOT", "Chrome", "3.0"],
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 10000,
    defaultQueryTimeoutMs: 60000,
    emitOwnEvents: true,
    syncFullHistory: false,
    qrTimeout: 40000,
    retryRequestDelayMs: 250,
    maxRetries: 5,
    mobile: false
  });

  if (!client.authState.creds.registered && !fs.existsSync('./sesi/creds.json')) {
    const { textColors, bgColors, reset, getRandomColor } = require('./WARNA_CODE/CodeWarna.js');
    console.clear();
    console.log(textColors.cyan + "─".repeat(50));
    console.log(textColors.green + "           📱 WHATSAPP LOGIN SYSTEM");
    console.log(textColors.cyan + "─".repeat(50));
    console.log(textColors.yellow + "📲 Login dengan Kode Pairing");
    console.log(textColors.white + "Silahkan ikuti langkah berikut dengan teliti:");
    console.log();
    console.log(textColors.cyan + "1️⃣ Persiapan");
    console.log(textColors.white + "• Buka aplikasi WhatsApp di HP anda");
    console.log(textColors.white + "• Masuk ke Pengaturan/Settings");
    console.log(textColors.white + "• Pilih menu Perangkat Tertaut");
    console.log();
    console.log(textColors.cyan + "2️⃣ Format Nomor WhatsApp");
    console.log(textColors.white + "• Contoh: 628123xxxxxx");
    console.log(textColors.white + "• Gunakan kode negara 62 (Indonesia)");
    console.log(textColors.white + "• Tanpa tanda + atau -");
    console.log(textColors.white + "• Pastikan format benar untuk menghindari error");
    console.log();
    console.log(textColors.cyan + "3️⃣ Catatan Penting");
    console.log(textColors.white + "• Pastikan nomor sudah terdaftar di WhatsApp");
    console.log(textColors.white + "• Jangan tutup console saat proses login");
    console.log(textColors.white + "• Siapkan HP untuk scan kode yang akan muncul");
    console.log();
    console.log(textColors.yellow + "💡 Ketik nomor WhatsApp Anda di bawah ini");
    console.log(textColors.white + "   Format: 628123xxxxxx");
    console.log(textColors.cyan + "─".repeat(50) + reset);

    const phoneNumber = await question("\n📱 Masukkan nomor WhatsApp Anda: ");
    try {
      let code = await client.requestPairingCode(phoneNumber);
      code = code?.match(/.{1,4}/g)?.join("-") || code;
      console.log("\n┌─────────────────────┐");
      console.log(`│🔑 Kode: ${code}   │`);
      console.log("└─────────────────────┘");
      console.log("\n📱 Cara Memasukan Kode:");
      console.log("1. Buka WhatsApp di HP");
      console.log("2. Ketuk Menu Titik Tiga (⋮)");
      console.log("3. Pilih 'Perangkat Tertaut'");
      console.log("4. Ketuk 'Tambahkan Perangkat'");
      console.log("5. Masukkan kode diatas\n");
    } catch (error) {
      console.log("\n❌ Gagal mendapatkan kode. Pastikan nomor benar.");
      process.exit(1);
    }
  }

  client.ev.on("messages.upsert", async (chatUpdate) => {
    try {
      const m = chatUpdate.messages[0];
      if (!m.message) return;

      const chat = m.key.remoteJid;

      // Auto typing dan recording
      if (chat) {
        if (config.autoTyping) {
          await client.presenceSubscribe(chat);
          await client.sendPresenceUpdate('composing', chat);
          setTimeout(async () => {
            await client.sendPresenceUpdate('paused', chat);
          }, 10000);
        }

        if (config.autoRecording) {
          await client.presenceSubscribe(chat);
          await client.sendPresenceUpdate('recording', chat);
          setTimeout(async () => {
            await client.sendPresenceUpdate('paused', chat);
          }, 10000);
        }
      }

      await handleStatusUpdate(client, m, console.log);
      await handleAntiTagSW(client, m);
      
      // Handle Hoshino AI responses
      const { handleMessage } = require('./FITUR_WILY/AiHoshinoTakanashi.js');
      await handleMessage(m, client);

      // Handle sticker creation
      const { stickerHandler } = require('./FITUR_WILY/sticker.js');
      await stickerHandler(m, client);
    } catch (err) {
      console.log(err);
    }
  });

  // Handle incoming calls
  client.ev.on("call", async (node) => {
    const calls = Array.isArray(node) ? node : [node];
    for (const call of calls) {
      if (call.status === "offer" && config.autoRejectCall) {
        try {
          await client.rejectCall(call.id, call.from);
          const caller = call.from.split('@')[0];
          console.log("\n┌────────────────────────────┐");
          console.log("│   📞 Panggilan Masuk        │");
          console.log("│   ❌ Auto Reject Aktif      │");
          console.log(`│   👤 Dari: ${caller}        │`);
          console.log("└────────────────────────────┘\n");

          // Kirim pesan ke penelepon
          await client.sendMessage(call.from, {
            text: '❌ Maaf, panggilan otomatis ditolak oleh bot.'
          });
        } catch (error) {
          console.error('Gagal menolak panggilan:', error);
        }
      }
    }
  });

  client.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if(qr) {
      // QR code disabled, using pairing code only
      return;
    }
    if (connection === "close") {
      let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(`Bad Session File, Please Delete Session and Scan Again`);
        process.exit();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        WAStart();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        WAStart();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log("Connection Replaced, Another New Session Opened, Please Restart Bot");
        process.exit();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log("\n┌────────────────────────────┐");
        console.log("│   ⚠️ Device Logged Out      │");
        console.log("│   🗑️ Menghapus sesi...      │");
        console.log("└────────────────────────────┘");
        setTimeout(() => {
          try {
            fs.rmSync('./sesi', { recursive: true, force: true });
            console.log("\n┌────────────────────────────┐");
            console.log("│   ✅ Sesi berhasil dihapus  │");
            console.log("│   🔄 Silahkan restart bot   │");
            console.log("└────────────────────────────┘\n");
            process.exit();
          } catch (error) {
            console.error('\n❌ Gagal menghapus folder sesi:', error);
            process.exit(1);
          }
        }, 5000);
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        WAStart();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        WAStart();
      } else {
        console.log(`Unknown DisconnectReason: ${reason}|${connection}`);
        WAStart();
      }
    } else if (connection === "open") {
      console.log("➜ WhatsApp Status Bot ⚡");
      console.log("━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`📱 Bot Version   : v${version.join(".")}`);
      console.log(`✨ Latest        : ${isLatest}`);
      console.log(`👁️  Read Story    : ${savedData.total}`);
      console.log(`⏰ Sesi          : ${getTimeSession()}`);
      console.log(`🟢 Status        : Connected`);
      console.log(`📅 Tanggal       : ${formattedDate}`);
      console.log(`🕐 Waktu         : ${formattedTime}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━\n");
    }
  });

  client.ev.on("creds.update", saveCreds);

  // Register the message handler
  client.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    await messageHandler(msg, client);
  });

  return client;
}

WAStart();

// Message handler
// Initialize messageTimers map for cooldown
const messageTimers = new Map();

async function messageHandler(msg, sock) {
  // Empty message handler since we removed all commands
  return;
}
