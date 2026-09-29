/**
 * Client-side multi-image optimizer for vendor product photography
 * Efficiently resizes and compresses high-res product photos
 * Keeps image quality high while preventing localStorage exhaustion
 */

export const compressProductPhoto = (file: File, maxDim = 900, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error(`"${file.name}" is not a supported image file.`));
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      reject(new Error(`"${file.name}" exceeds the 15MB file size limit.`));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Failed to read "${file.name}"`));
    reader.onload = e => {
      const img = new Image();
      img.onerror = () => reject(new Error(`Failed to decode image from "${file.name}"`));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const processMultipleProductPhotos = async (
  files: FileList | File[],
  onProgress?: (completed: number, total: number) => void
): Promise<string[]> => {
  const fileArray = Array.from(files).filter(f => f.type.startsWith('image/'));
  if (fileArray.length === 0) return [];

  const results: string[] = [];
  let completed = 0;

  for (const file of fileArray) {
    try {
      const dataUrl = await compressProductPhoto(file);
      results.push(dataUrl);
    } catch (err) {
      console.warn('Skipping file due to compression error:', file.name, err);
    }
    completed++;
    if (onProgress) {
      onProgress(completed, fileArray.length);
    }
  }

  return results;
};
