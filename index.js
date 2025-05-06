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

// Config and counters
let config = {
  autoReadStatus: true,
  autoLikeStatus: true,
  downloadMediaStatus: true,
  sensorNomor: true,
  SpeedReadStory: 2000,
  autoRejectCall: true, // Pengaturan untuk menolak panggilan otomatis
  autoOnline: true, // Selalu online
  readReceipts: false, // Matikan read receipts (centang biru)
  autoTyping: false,
  autoRecording: true,
  emojiFile: 'Lengkap_Emojis', // Pilih 'Lengkap_Emojis' atau 'Costum_Emojis'
  blackList: [],
  whiteList: []
};

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

      console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("  🤖 BOT AUTO LIHAT STATUS WHATSAPP");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`  ⟫ Status Bot        : Aktif ✓`);
      console.log(`  ⟫ ⏰ Sesi           : ${getTimeSession()}`);
      console.log(`  ⟫ 📅 Tanggal        : ${formattedDate}`);
      console.log(`  ⟫ 🕐 Waktu          : ${formattedTime}`);
      console.log(`  ⟫ Kecepatan Lihat   : ${config.SpeedReadStory/1000} Detik`);
      console.log(`  ⟫ Total Dilihat     : ${totalViewed}`);
      console.log(`  ⟫ Dilihat Kontak    : ${contactViews}`);
      console.log(`  ⟫ Nama Kontak       : ${senderName}`);
      console.log(`  ⟫ Nomor Kontak      : ${displaySendernumber}`);
      console.log(`  ⟫ Tipe Status       : ${statusType}`);
      console.log(`  ⟫ Reaksi Diberikan  : ${randomEmoji}`);
      console.log(`  ⟫ Status            : ${config.autoLikeStatus ? "Dilihat & Disukai" : "Dilihat"}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

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
  const { state, saveCreds } = await useMultiFileAuthState("./sesi");
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

  return client;
}

WAStart();
