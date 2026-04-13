// Konfigurasi ekstensi ke masing-masing folder
const categories = {
  files: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt'],
  images: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'],
  archive: ['zip', 'rar', '7z', 'tar', 'gz']
};

function getFolderForExtension(ext) {
  ext = ext.toLowerCase();
  for (const [folder, extensions] of Object.entries(categories)) {
    if (extensions.includes(ext)) {
      return folder;
    }
  }
  return null;
}

chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  // Ambil ekstensi dari nama file
  const parts = item.filename.split('.');
  const extension = parts.length > 1 ? parts[parts.length - 1] : '';
  
  const targetFolder = getFolderForExtension(extension);

  if (targetFolder) {
    // Sarankan browser untuk menyimpan file di sub-folder yang ditentukan
    suggest({ filename: `${targetFolder}/${item.filename}` });
  } else {
    // Biarkan default
    suggest();
  }
});
