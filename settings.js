
// WhatsApp Bot Configuration
exports.botConfig = {
  //════════════[ STATUS & STORY ]════════════//
  status: {
    autoReadStatus: true,      // Auto read WhatsApp status
    autoLikeStatus: true,      // Auto react to status with emoji
    downloadMediaStatus: false, // Save status media to device
    SpeedReadStory: 3000,      // Delay between reading status (ms)
  },

  //════════════[ EMOJI SYSTEM ]════════════//
  emoji: {
    emojiFile: "Lengkap_Emojis"  // Lengkap_Emojis or Costum_Emojis
  },

  //════════════[ DISPLAY & INTERFACE ]════════════//
  display: {
    autoOnline: true,     // Always show online status
    readReceipts: true,   // Show read receipts
    autoTyping: false,    // Show typing indicator
    autoRecording: true,  // Show recording indicator
    sensorNomor: true,    // Hide phone numbers in logs
  },

  //════════════[ SECURITY & PRIVACY ]════════════//
  accessControl: {
    blackList: [], // Blocked numbers
    whiteList: []  // Allowed numbers
  },

  //════════════[ ANTI-TAG PROTECTION ]════════════//
  antiTag: {
    antitagswv2: true,     // Enable anti-tag protection
    maxWarnings: 5,        // Maximum warnings before action
    deleteMessages: true,  // Delete violating messages
    kickEnabled: true,     // Enable kicking violators
    warningTimeout: 24     // Warning timeout in hours
  },

  //════════════[ BACKUP SYSTEM ]════════════//
  autoBackup: {
    enabled: true,                    // Enable/disable auto backup
    targetNumber: '6289688206739@s.whatsapp.net', // Backup destination number
    interval: 24,                      // Backup interval value
    intervalType: 'hours',          // Interval type: 'seconds', 'minutes', 'hours'
    sendBackup: true,                 // Send backup to target number
    deleteBackupAfterSend: true       // Delete backup file after sending
  },

  //════════════[ CALL HANDLING ]════════════//
  call: {
    autoRejectCall: false // Auto reject incoming calls
  },

  //════════════[ AI CHARACTERS ]════════════//
  aiCharacters: {
    hoshino: {
      enabled: false,
      cooldownTime: 1000,
      sessionId: 'HoshinoTakanashi',
      characterName: 'Hoshino Takanashi',
      images: [
        'https://files.catbox.moe/lza1uc.jpg',
        'https://files.catbox.moe/dz3l1w.jpg',
        'https://files.catbox.moe/0g66xr.jpg',
        'https://files.catbox.moe/8i4bin.jpg',
        'https://files.catbox.moe/2a8jkm.jpg',
        'https://files.catbox.moe/owmntz.jpg',
        'https://files.catbox.moe/hq3irj.jpg'
      ]
    },
    hiura: {
      enabled: false,
      cooldownTime: 1000,
      sessionId: 'HiuraMihate',
      characterName: 'Hiura Mihate',
      images: [
        'https://files.catbox.moe/5ndm3o.jpg'
      ]
    },
    hitori: {
      enabled: false,
      cooldownTime: 1000,
      sessionId: 'HitoriGotoh',
      characterName: 'Hitori Gotoh',
      images: [
        'https://files.catbox.moe/yioehs.jpg',
        'https://files.catbox.moe/52qp2p.jpg',
        'https://files.catbox.moe/6q8zwy.jpg'
      ]
    }
  }
};

//════════════[ FEATURE DESCRIPTIONS ]════════════//
exports.featureDescriptions = {
  status: {
    autoReadStatus: "Otomatis membaca status/story WhatsApp",
    autoLikeStatus: "Otomatis memberikan reaksi emoji pada status yang dilihat",
    downloadMediaStatus: "Menyimpan media dari status ke penyimpanan",
    SpeedReadStory: "Mengatur jeda waktu antara membaca status (dalam milidetik)"
  },
  display: {
    autoOnline: "Membuat status bot selalu online",
    readReceipts: "Mengaktifkan tanda centang biru untuk pesan yang dibaca",
    autoTyping: "Menampilkan indikator mengetik saat memproses",
    autoRecording: "Menampilkan status merekam untuk pesan suara"
  },
  security: {
    antitagswv2: "Melindungi grup dari tag/mention berlebihan",
    maxWarnings: "Batas peringatan sebelum mengambil tindakan",
    deleteMessages: "Menghapus pesan yang melanggar aturan",
    kickEnabled: "Mengizinkan bot mengeluarkan pelanggar aturan",
    warningTimeout: "Waktu kedaluwarsa peringatan (dalam jam)"
  },
  aiCharacter: {
    enabled: "Mengaktifkan/menonaktifkan fitur chat karakter AI",
    cooldownTime: "Waktu jeda antara respons AI (dalam milidetik)"
  },
  call: {
    autoRejectCall: "Otomatis menolak panggilan masuk"
  },
  emoji: {
    emojiFile: "Pilih set emoji (Lengkap_Emojis untuk semua atau Costum_Emojis untuk yang dipilih)"
  },
  access: {
    blackList: "Daftar nomor yang diblokir",
    whiteList: "Daftar nomor yang diizinkan (jika kosong, semua diizinkan)"
  }
};
