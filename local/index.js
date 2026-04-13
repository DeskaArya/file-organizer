const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Tentukan path ke folder Downloads pengguna
const downloadsFolder = path.join(os.homedir(), 'Downloads');

// Konfigurasi kategori dan ekstensi filenya
const categories = {
    files: {
        extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.csv', '.txt'],
        folder: path.join(downloadsFolder, 'files')
    },
    images: {
        extensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'],
        folder: path.join(downloadsFolder, 'images')
    },
    archive: {
        extensions: ['.zip', '.rar', '.7z', '.tar', '.gz'],
        folder: path.join(downloadsFolder, 'archive')
    },
    programs: {
        extensions: ['.exe', '.msi', '.apk', '.dmg', '.pkg', '.deb'],
        folder: path.join(downloadsFolder, 'programs')
    },
    Audio: {
        extensions: ['.mp3', '.wav', '.aac', '.flac', '.ogg', '.m4a'],
        folder: path.join(downloadsFolder, 'audio')
    },
    Video: {
        extensions: ['.mp4', '.mkv', '.avi', '.mov', '.wmv', '.flv'],
        folder: path.join(downloadsFolder, 'video')
    },
    ISO: {
        extensions: ['.iso'],
        folder: path.join(downloadsFolder, 'iso')
    }
};

// Pastikan semua folder tujuan sudah ada
for (const key in categories) {
    const dir = categories[key].folder;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`[INFO] Membuat folder: ${dir}`);
    }
}

console.log(`[START] Menonton folder: ${downloadsFolder}`);

// Inisialisasi chokidar
const watcher = chokidar.watch(downloadsFolder, {
    ignored: /(^|[\/\\])\../, // Abaikan file tersembunyi
    persistent: true,
    depth: 0, 
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
    }
});

// Event listener saat ada file baru
watcher.on('add', (filePath) => {
    // Hanya memproses file yang berada langsung di dalam folder Downloads
    if (path.dirname(filePath) !== downloadsFolder) return;

    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath);

    let targetFolder = null;

    // Cari kategori tujuan berdasarkan ekstensi file
    for (const key in categories) {
        if (categories[key].extensions.includes(ext)) {
            targetFolder = categories[key].folder;
            break;
        }
    }

    if (targetFolder) {
        const destPath = path.join(targetFolder, fileName);

        // Pindahkan file
        fs.rename(filePath, destPath, (err) => {
            if (err) {
                console.error(`[ERROR] Gagal memindahkan ${fileName}:`, err);
            } else {
                console.log(`[MOVED] ${fileName} -> ${path.basename(targetFolder)}/`);
            }
        });
    }
});
