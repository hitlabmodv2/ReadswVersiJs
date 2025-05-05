
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

### 📺 Tutorial Video
[![Tutorial Replit](https://img.youtube.com/vi/x42DvCEqtgQ/0.jpg)](https://www.youtube.com/watch?v=x42DvCEqtgQ)

### 📝 Langkah-langkah:
1. Login/Register di [Replit](https://replit.com)
2. Klik [![Run on Replit](https://replit.com/badge/github/Onichaa/readsw)](https://replit.com/@replit/readsw)
3. Tunggu proses instalasi selesai
4. Pilih metode login:
   ```bash
   # Login dengan QR Code
   npm start
   
   # Login dengan Kode Pairing
   node index.js --pairing-code
   ```
5. Scan QR code atau masukkan kode pairing
6. Bot siap digunakan! Cek console untuk status

</details>

<details>
<summary>🖥️ Run di Pterodactyl Panel</summary>

### 📺 Tutorial Video
[![Tutorial Pterodactyl](https://img.youtube.com/vi/fyFyrcM2CC8/0.jpg)](https://www.youtube.com/watch?v=fyFyrcM2CC8)

### 🚀 Cara Install di Pterodactyl Panel

1. 📂 **Persiapan Server**
   ```bash
   # Install Node.js dan dependencies
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   apt-get install -y nodejs
   ```

2. 🔧 **Setup di Panel**
   - Buat server baru di panel
   - Pilih egg `Node.js Generic`
   - Set minimum RAM 512MB
   - Set startup command: `npm start`

3. 📦 **Upload Bot**
   - Download repo ini
   - Extract file
   - Upload semua file ke File Manager panel
   - Atau gunakan command SFTP:
     ```bash
     cd /home/container
     git clone --single-branch --branch js https://github.com/Onichaa/readsw.git .
     ```

4. ⚙️ **Install Dependencies**
   - Buka console panel
   - Jalankan perintah:
     ```bash
     npm install
     ```

5. 🔄 **Menjalankan Bot**
   - Klik tombol Start di panel
   - Scan QR atau masukkan kode pairing
   - Bot akan otomatis berjalan
   
6. 📱 **Fitur Tambahan**
   - Untuk login pairing: `npm run start -- --pairing-code`
   - Cek logs: Klik tab Logs di panel
   - Restart bot: Klik tombol Restart
   - Update bot: Jalankan `git pull` di console

### 🔍 Troubleshooting

- ❌ **Bot Crash**: Cek logs untuk error, restart server
- 🔌 **Koneksi Terputus**: Bot akan auto-reconnect
- 📊 **RAM Penuh**: Tambah alokasi RAM di panel
- 🚫 **Error Dependencies**: Jalankan `npm install` ulang

### ⚠️ Penting
- Pastikan server selalu aktif
- Backup file sesi secara berkala
- Jangan share informasi server panel
- Update node.js dan dependencies secara rutin

</details>

<details>
<summary>📱 Run on Termux</summary>

### 📺 Tutorial Video
[![Tutorial Termux](https://img.youtube.com/vi/u7CBdmMFXFI/0.jpg)](https://www.youtube.com/watch?v=u7CBdmMFXFI)

### 📝 Tutorial Lengkap di Android:

1. 📲 **Persiapan Awal**
   - Download Termux (Pilih salah satu):
     [![Download Termux](https://img.shields.io/badge/Download-Termux%20APK-blue?style=for-the-badge&logo=android)](https://f-droid.org/repo/com.termux_1021.apk)
     [![F-Droid](https://img.shields.io/badge/Download-F‒Droid-green?style=for-the-badge&logo=fdroid)](https://f-droid.org/en/packages/com.termux/)
   > ⚠️ **Penting**: Jangan download dari Play Store karena sudah tidak diupdate
   - Install Termux di Android
   - Buka Termux

2. 🛠️ **Setup Termux**
   ```bash
   # Izinkan akses penyimpanan
   termux-setup-storage
   
   # Update repository
   pkg update -y
   pkg upgrade -y
   
   # Install package yang dibutuhkan
   pkg install nodejs -y
   pkg install nodejs-lts -y
   pkg install git -y
   pkg install ffmpeg -y
   pkg install imagemagick -y
   pkg install wget -y
   ```

3. 📥 **Download & Setup Bot**
   ```bash
   # Buat folder khusus bot
   cd /sdcard
   mkdir bot-wa
   cd bot-wa
   
   # Clone repository
   git clone --single-branch --branch js https://github.com/Onichaa/readsw.git
   cd readsw
   
   # Install dependencies
   npm install
   ```

4. 🚀 **Menjalankan Bot**
   ```bash
   # Login dengan QR Code
   npm start
   
   # ATAU Login dengan Kode Pairing (Recommended)
   node index.js --pairing-code
   ```

5. 💡 **Tips Penggunaan**
   - Scan QR yang muncul dengan WhatsApp
   - Atau masukkan nomor WA & kode pairing
   - Bot akan otomatis membaca status
   - Data tersimpan di folder `/sdcard/bot-wa/readsw/DATA`

6. 🔄 **Auto-Start (24/7)**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Jalankan bot di background
   pm2 start index.js --name "wa-bot"
   
   # Simpan PM2 process
   pm2 save
   
   # Cek status bot
   pm2 logs wa-bot
   ```

7. 🔧 **Troubleshooting**
   ```bash
   # Jika error, coba:
   rm -rf node_modules
   npm install
   
   # Reset sesi WA:
   rm -rf sesi
   npm start
   ```

### ⚠️ Catatan Penting
- Pastikan Android sudah Android 7.0 ke atas
- Jaga storage minimal 1GB free
- Koneksi internet stabil
- WhatsApp terdaftar dengan nomor aktif
- Backup file sesi secara berkala

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
