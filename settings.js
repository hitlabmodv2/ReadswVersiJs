
// Bot Features
exports.botConfig = {
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

// Penjelasan Fitur-Fitur Bot
exports.featureDescriptions = {
  // Fitur AI Character
  aiHoshino: {
    enabled: "Mengaktifkan/menonaktifkan fitur chat dengan AI Hoshino. Ketika aktif, bot dapat berkomunikasi seperti karakter anime.",
    cooldownTime: "Waktu jeda yang diperlukan antara setiap respon AI (dalam milidetik) untuk mencegah spam"
  },

  // Fitur Status & Media
  autoReadStatus: "Secara otomatis melihat status/story WhatsApp teman Anda tanpa perlu membukanya satu per satu",
  autoLikeStatus: "Memberikan reaksi emoji secara otomatis pada status yang dilihat untuk meningkatkan interaksi",
  downloadMediaStatus: "Menyimpan foto dan video dari status yang dilihat ke dalam folder penyimpanan bot",
  sensorNomor: "Menyembunyikan beberapa digit nomor WhatsApp di log untuk menjaga privasi",
  SpeedReadStory: "Mengatur seberapa cepat bot membaca status berikutnya (dalam milidetik)",

  // Fitur Panggilan & Tampilan
  autoRejectCall: "Menolak panggilan masuk secara otomatis untuk menghindari gangguan",
  autoOnline: "Membuat status bot selalu online untuk menunjukkan keaktifan",
  readReceipts: "Mengaktifkan tanda centang biru (read receipt) saat membaca pesan",
  autoTyping: "Menampilkan indikator 'sedang mengetik...' saat bot memproses pesan",
  autoRecording: "Menampilkan status 'sedang merekam' saat memproses pesan suara",

  // Fitur Emoji & Interaksi
  emojiFile: "Memilih kumpulan emoji yang akan digunakan (Lengkap_Emojis untuk semua emoji atau Costum_Emojis untuk emoji pilihan)",

  // Fitur Keamanan Grup
  antitagswv2: "Melindungi grup dari spam tag/mention berlebihan",
  maxWarnings: "Batas peringatan yang diberikan sebelum bot mengambil tindakan",
  deleteMessages: "Menghapus pesan-pesan yang melanggar aturan grup",
  kickEnabled: "Mengizinkan bot untuk mengeluarkan anggota yang melanggar aturan",
  warningTimeout: "Berapa lama peringatan akan bertahan sebelum dihapus (dalam jam)",

  // Fitur Kontrol Akses
  blackList: "Daftar nomor yang diblokir dan tidak dapat menggunakan fitur bot",
  whiteList: "Daftar nomor yang diizinkan menggunakan bot (jika kosong, semua nomor diizinkan)"
};
