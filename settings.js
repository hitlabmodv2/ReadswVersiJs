
// Bot Features
exports.botConfig = {
  aiHoshino: {
    enabled: false,
    cooldownTime: 1000
  },
  autoReadStatus: true,
  autoLikeStatus: true,
  downloadMediaStatus: false, 
  sensorNomor: true,
  SpeedReadStory: 3000,

  // Call Settings
  autoRejectCall: false,

  // Display Settings
  autoOnline: true,
  readReceipts: true,
  autoTyping: false,
  autoRecording: true,

  // Emoji Settings
  emojiFile: "Lengkap_Emojis",

  // Anti-Tag Settings
  antitagswv2: true,
  maxWarnings: 5,
  deleteMessages: true,
  kickEnabled: true, 
  warningTimeout: 24,

  // Filter Settings
  blackList: [],
  whiteList: []
};

// Feature Descriptions
exports.featureDescriptions = {
  aiHoshino: {
    enabled: "Mengaktifkan/menonaktifkan fitur AI chat",
    cooldownTime: "Waktu jeda antara respon AI dalam milidetik"
  },
  autoReadStatus: "Otomatis membaca status WhatsApp",
  autoLikeStatus: "Otomatis memberikan reaksi emoji pada status",
  downloadMediaStatus: "Mengunduh media dari status yang dilihat",
  sensorNomor: "Menyembunyikan sebagian nomor WhatsApp di log",
  SpeedReadStory: "Kecepatan membaca status dalam milidetik",
  autoRejectCall: "Otomatis menolak panggilan masuk",
  autoOnline: "Bot selalu terlihat online",
  readReceipts: "Mengaktifkan tanda centang biru",
  autoTyping: "Menampilkan status 'sedang mengetik'",
  autoRecording: "Menampilkan status 'sedang merekam'",
  emojiFile: "Pilihan file emoji (Lengkap_Emojis atau Costum_Emojis)",
  antitagswv2: "Fitur anti-tag di grup",
  maxWarnings: "Jumlah maksimal peringatan sebelum tindakan",
  deleteMessages: "Hapus pesan yang melanggar",
  kickEnabled: "Izinkan bot untuk mengeluarkan anggota",
  warningTimeout: "Durasi peringatan dalam jam",
  blackList: "Daftar nomor yang diblokir",
  whiteList: "Daftar nomor yang diizinkan (jika kosong, semua diizinkan)"
};
