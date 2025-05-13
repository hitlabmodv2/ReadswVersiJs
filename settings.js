
// Bot Configuration
exports.botConfig = {
  // WhatsApp Status Features
  status: {
    autoReadStatus: true,      // Auto read WhatsApp status
    autoLikeStatus: true,      // Auto react to status with emoji
    downloadMediaStatus: false, // Save status media to device
    SpeedReadStory: 3000,      // Delay between reading status (ms)
  },

  // Backup Configuration
  autoBackup: {
    enabled: false,                    // Enable/disable auto backup
    targetNumber: '6289688206739@s.whatsapp.net', // Backup destination number
    interval: 30,                      // Backup interval value
    intervalType: 'minutes',          // Interval type: 'seconds', 'minutes', 'hours'
    sendBackup: true,                 // Send backup to target number
    deleteBackupAfterSend: true       // Delete backup file after sending
  },

  // AI Characters Configuration
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

  // Display Settings
  display: {
    autoOnline: true,     // Always show online status
    readReceipts: false,   // Show read receipts
    autoTyping: false,    // Show typing indicator
    autoRecording: true,  // Show recording indicator
    sensorNomor: true,    // Hide phone numbers in logs
  },

  // Call Handling
  call: {
    autoRejectCall: false // Auto reject incoming calls
  },

  // Emoji Configuration
  emoji: {
    emojiFile: "Lengkap_Emojis" // Emoji set to use
  },

  // Anti-Tag Protection
  antiTag: {
    antitagswv2: true,     // Enable anti-tag protection
    maxWarnings: 5,        // Maximum warnings before action
    deleteMessages: true,  // Delete violating messages
    kickEnabled: true,     // Enable kicking violators
    warningTimeout: 24     // Warning timeout in hours
  },

  // Access Control
  accessControl: {
    blackList: [], // Blocked numbers
    whiteList: []  // Allowed numbers
  }
};

// Feature Descriptions
exports.featureDescriptions = {
  // Status Features
  status: {
    autoReadStatus: "Automatically view WhatsApp status/stories",
    autoLikeStatus: "Automatically react to viewed status with emoji",
    downloadMediaStatus: "Save status media to storage",
    SpeedReadStory: "Set delay between reading status (in milliseconds)"
  },

  // AI Character Features
  aiCharacter: {
    enabled: "Enable/disable AI character chat feature",
    cooldownTime: "Cooldown time between AI responses (in milliseconds)"
  },

  // Call Features
  call: {
    autoRejectCall: "Automatically reject incoming calls"
  },

  // Display Features
  display: {
    autoOnline: "Keep bot status always online",
    readReceipts: "Enable blue ticks for read messages",
    autoTyping: "Show typing indicator when processing",
    autoRecording: "Show recording status for voice messages"
  },

  // Emoji Features
  emoji: {
    emojiFile: "Choose emoji set (Lengkap_Emojis for all or Costum_Emojis for selected)"
  },

  // Group Security
  security: {
    antitagswv2: "Protect groups from excessive tagging/mentions",
    maxWarnings: "Warning limit before taking action",
    deleteMessages: "Delete rule-violating messages",
    kickEnabled: "Allow bot to remove rule violators",
    warningTimeout: "Warning expiry time (in hours)"
  },

  // Access Control
  access: {
    blackList: "Blocked numbers list",
    whiteList: "Allowed numbers list (if empty, all allowed)"
  }
};
