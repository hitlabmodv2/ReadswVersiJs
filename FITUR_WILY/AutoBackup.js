
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const archiver = require('archiver');

async function createZipBackup(client, settings) {
  try {
    console.log('\n└─📦 Membuat backup ZIP...');

    const output = fs.createWriteStream('AutoReadStory.zip');
    const archive = archiver('zip', {
      zlib: { level: 9 } // Kompresi maksimal
    });

    output.on('close', async () => {
      console.log(`\n└─✅ ZIP file created (${(archive.pointer()/1024/1024).toFixed(2)} MB)`);

      const currentDate = new Date();
      const date = currentDate.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const jakartaTime = currentDate.toLocaleString('id-ID', { 
        timeZone: 'Asia/Jakarta',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });

      const hour = parseInt(currentDate.toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: 'numeric',
        hour12: false
      }));

      let session;
      if (hour >= 5 && hour < 11) session = '🌅 Pagi';
      else if (hour >= 11 && hour < 15) session = '☀️ Siang';
      else if (hour >= 15 && hour < 18) session = '🌤️ Sore';
      else session = '🌜 Malam';

      const getFolderContent = (path) => {
        try {
          if (!fs.existsSync(path)) return { files: 0, folders: 0 };
          const items = fs.readdirSync(path, { withFileTypes: true });
          return {
            files: items.filter(item => item.isFile()).length,
            folders: items.filter(item => item.isDirectory()).length
          };
        } catch (err) {
          return { files: 0, folders: 0 };
        }
      };

      const getFilesAndFolders = () => {
        const items = fs.readdirSync('.', { withFileTypes: true });
        const folders = items
          .filter(item => item.isDirectory())
          .map(item => ({ name: item.name, hidden: item.name.startsWith('.') }));
        const files = items
          .filter(item => item.isFile())
          .map(item => ({ name: item.name, hidden: item.name.startsWith('.') }));
        return { folders, files };
      };

      const getFileEmoji = (filename) => {
        const ext = path.extname(filename).toLowerCase();
        const emojis = {
          '.js': '🤖',
          '.json': '📦',
          '.md': '📝',
          '.txt': '📄',
          '.jpg': '🖼️',
          '.png': '🖼️',
          '.gif': '🖼️',
          '.mp4': '🎥',
          '.mp3': '🎵'
        };
        return emojis[ext] || '📄';
      };

      const { folders: dirList, files: fileList } = getFilesAndFolders();
      let backupItems = [];

      for (const folder of dirList) {
        const content = getFolderContent(folder.name);
        if (content.files > 0 || content.folders > 0) {
          const emoji = 
            folder.name.toLowerCase().includes('session') ? '📱' :
            folder.name.toLowerCase().includes('data') ? '📊' :
            folder.name.toLowerCase().includes('fitur') ? '🛠️' :
            folder.name.toLowerCase().includes('warna') ? '🎨' :
            folder.name.toLowerCase().includes('emoji') ? '😊' : '📁';
          backupItems.push(`${emoji} ${folder.name}/* (${content.files} file${content.files > 1 ? 's' : ''}${content.folders ? `, ${content.folders} subfolder${content.folders > 1 ? 's' : ''}` : ''})`);
        }
      }

      for (const file of fileList) {
        const emoji = getFileEmoji(file.name);
        backupItems.push(`${emoji} ${file.name}`);
      }

      const formattedBackup = `╭═══════ 📦 BACKUP BOT ═══════╮
├──────── 📅 WAKTU ────────┤
├ 📆 Tanggal : ${date}
├ ⏰ Waktu   : ${jakartaTime} WIB
├ 🕒 Selamat : ${session}
├──────── 📂 FILES ────────┤
├ ${backupItems.join('\n├ ')}
├──────── ℹ️ INFO ─────────┤
├ 📊 Ukuran  : ${(archive.pointer()/1024/1024).toFixed(2)} MB
├ ✅ Status  : Backup Berhasil
╰═════════════════════════╯`;

      if (!settings.autoBackup?.targetNumber) {
        console.error('❌ Target number not configured in settings');
        return false;
      }

      // Validate client connection
      if (!client?.user?.id) {
        console.log('⏳ Menunggu koneksi WhatsApp...');
        
        // Wait up to 30 seconds for connection
        for (let i = 0; i < 15; i++) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          if (client?.user?.id) break;
          console.log(`⏳ Mencoba koneksi... (${i + 1}/15)`);
        }
        
        if (!client?.user?.id) {
          console.error('❌ Gagal terhubung ke WhatsApp setelah mencoba');
          return false;
        }
      }

      // Double check connection
      if (!client.ws.readyState === client.ws.OPEN) {
        console.error('❌ Koneksi WebSocket tidak siap');
        return false;
      }

      try {
        // Tunggu sampai koneksi benar-benar siap
        let maxRetries = 10;
        let isConnected = false;
        
        for (let i = 0; i < maxRetries && !isConnected; i++) {
          if (client?.user?.id && client.ws.readyState === client.ws.OPEN) {
            isConnected = true;
          } else {
            console.log(`⏳ Menunggu koneksi siap... (${i + 1}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }

        if (!isConnected) {
          throw new Error('Koneksi WhatsApp tidak siap setelah beberapa percobaan');
        }

        // Coba kirim backup
        console.log('\n└─📤 Mengirim backup...');
        
        async function ReplyRynzz(teks, file) {
          const hariini = new Date().toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
          const packname = "Auto Backup";
          const nedd = {      
            document: fs.readFileSync(file),
            fileName: 'AutoReadStory.zip',
            mimetype: 'application/zip',
            caption: teks,
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
            }
          };
          return client.sendMessage(settings.autoBackup.targetNumber, nedd);
        }

        const msg = await ReplyRynzz(formattedBackup, 'AutoReadStory.zip').catch(e => {
          throw new Error(`Gagal mengirim: ${e.message}`);
        });

        if (msg) {
          console.log('\n└─✅ Backup berhasil dikirim!');
          fs.unlinkSync('AutoReadStory.zip');
          console.log('\n└─✅ ZIP file sent and cleaned up');
          return true;
        }
      } catch (error) {
        console.error('❌ Error sending backup:', error.message);
        return false;
      }
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    archive.glob('**/*', {
      ignore: [
        'node_modules/**', 
        '.git/**',
        'AutoReadStory.zip',
        'package-lock.json'
      ],
      dot: true
    });

    await archive.finalize();
    return true;
  } catch (error) {
    console.error('❌ Error creating zip:', error);
    return false;
  }
}

async function backupFiles(client, settings) {
  if (!settings.autoBackup?.enabled) {
    console.log('└─Auto backup dinonaktifkan');
    return;
  }

  try {
    console.log('\n└─🚀 Memulai proses backup...');
    const success = await createZipBackup(client, settings);
    
    if (success) {
      const interval = getIntervalInMs(settings);
      console.log(`\n└─⏰ Backup berikutnya dalam ${interval/1000} detik`);
      setTimeout(() => backupFiles(client, settings), interval);
    } else {
      console.log('❌ Backup gagal, mencoba lagi dalam 5 menit');
      setTimeout(() => backupFiles(client, settings), 300000);
    }
  } catch (err) {
    console.error('❌ Proses backup gagal:', err);
    console.error('Detail error:', err.message);
    setTimeout(() => backupFiles(client, settings), 300000);
  }
}

function getIntervalInMs(settings) {
  const { interval, intervalType } = settings.autoBackup;
  switch (intervalType) {
    case 'seconds': return interval * 1000;
    case 'minutes': return interval * 60 * 1000;
    case 'hours': return interval * 60 * 60 * 1000;
    default: return 10 * 1000;
  }
}

module.exports = { backupFiles };
