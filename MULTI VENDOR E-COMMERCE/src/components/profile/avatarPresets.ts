/**
 * Curated avatar presets and client-side image optimization helpers
 * for MarketHub profile customization.
 */

export interface AvatarPreset {
  id: string;
  label: string;
  category: 'Modern' | 'Professional' | 'Creative' | 'Merchant';
  url: string;
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'p-1',
    label: 'Aarav (Modern)',
    category: 'Modern',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-2',
    label: 'Priya (Executive)',
    category: 'Professional',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-3',
    label: 'Rohan (Tech Lead)',
    category: 'Professional',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-4',
    label: 'Ananya (Creative)',
    category: 'Creative',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-5',
    label: 'Vikram (Entrepreneur)',
    category: 'Merchant',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-6',
    label: 'Meera (Designer)',
    category: 'Creative',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-7',
    label: 'Kabir (Explorer)',
    category: 'Modern',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-8',
    label: 'Sneha (Consultant)',
    category: 'Professional',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-9',
    label: 'Arjun (Developer)',
    category: 'Modern',
    url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-10',
    label: 'Kavita (Store Owner)',
    category: 'Merchant',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-11',
    label: 'Aditya (Maker)',
    category: 'Merchant',
    url: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'p-12',
    label: 'Deepa (Artisan)',
    category: 'Creative',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
  },
];

/**
 * Compresses and resizes an uploaded user image client-side to ensure
 * lightweight localStorage persistence (~15-30KB) without quality degradation.
 */
export const compressAndFormatImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPG, PNG, WebP, etc.).'));
      return;
    }

    // Limit maximum raw file size to 10MB to avoid browser freezing
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('Image file is too large. Please select a photo under 10MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image.'));
      img.onload = () => {
        // Target max avatar dimensions: 280x280 pixels
        const MAX_DIM = 280;
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio crop or downscale
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw data url if canvas context unavailable
          resolve(e.target?.result as string);
          return;
        }

        // Draw smooth image
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to optimized JPEG data url
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        resolve(compressedDataUrl);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};
