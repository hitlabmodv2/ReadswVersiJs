
<div align="center">
  <img src="https://pomf2.lain.la/f/tjwpce10.jpg" width="300" alt="WhatsApp Status Bot">
  
  # 📱 WhatsApp Status Bot
  _Auto Read & React to WhatsApp Stories_

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
</div>

---

<details>
<summary>🚀 Run on Replit</summary>

1. Click [![Run on Replit](https://replit.com/badge/github/Onichaa/readsw)](https://replit.com/@replit/readsw)
2. Wait for installation to complete
3. Choose login method:
   ```bash
   # Login with QR Code
   npm start
   
   # Login with Pairing Code
   node index.js --pairing-code
   ```
4. Scan QR code or enter pairing code
5. Bot is ready! Check the console for status

</details>

<details>
<summary>🖥️ Run on Panel</summary>

1. Upload files to your hosting panel
2. Connect via SSH/Terminal
3. Install dependencies:
   ```bash
   cd readsw
   npm install
   ```
4. Start the bot:
   ```bash 
   # Regular start
   npm start
   
   # Background process
   npm install -g pm2
   pm2 start index.js
   ```
5. Monitor logs with `pm2 logs`

</details>

<details>
<summary>📱 Run on Termux</summary>

1. Install Termux from F-Droid
2. Install requirements:
   ```bash
   pkg update && pkg upgrade
   pkg install nodejs git
   ```
3. Clone & Setup:
   ```bash
   git clone --single-branch --branch js https://github.com/Onichaa/readsw.git
   cd readsw
   npm install
   ```
4. Run bot:
   ```bash
   npm start
   ```
</details>

## ✨ Features

- 🔄 Auto Read Status
- ❤️ Random Emoji Reactions
- 📥 Media Download Option
- ⚡ Fast Response Time
- 🕒 24/7 Online Capability
- 📊 View Counter

## ⚙️ Configuration

Edit these values in `index.js`:
```js
let config = {
  autoReadStatus: true,      // Auto read stories
  autoLikeStatus: true,      // Auto react with emoji
  downloadMediaStatus: true,  // Save media to device
  sensorNomor: true,         // Hide phone numbers
  SpeedReadStory: 2000,      // Delay between reads (ms)
}
```

## 📝 License
This project is [MIT](LICENSE) licensed.

---
<div align="center">
Made with ❤️ by <a href="https://github.com/Onichaa">Onicha</a>
</div>
