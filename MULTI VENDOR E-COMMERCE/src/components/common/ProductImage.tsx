import React, { useState, useEffect } from 'react';
import { getProductImageUrl, getProductBackupUrl } from '../../services/productImages';

interface ProductImageProps {
  productId: number;
  category?: string;
  productName?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'hero';
  src?: string;
  customImages?: string[];
}

export const ProductImage: React.FC<ProductImageProps> = ({
  productId,
  category,
  productName = 'Product',
  className = '',
  size = 'md',
  src,
  customImages,
}) => {
  const primaryUrl = src || (customImages && customImages[0]) || getProductImageUrl(productId, category, customImages);
  const backupUrl = getProductBackupUrl(productId, category);

  const [currentSrc, setCurrentSrc] = useState<string>(primaryUrl);
  const [hasTriedBackup, setHasTriedBackup] = useState<boolean>(false);
  const [hasFailed, setHasFailed] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(src || (customImages && customImages[0]) || getProductImageUrl(productId, category, customImages));
    setHasTriedBackup(false);
    setHasFailed(false);
  }, [productId, category, src, customImages]);

  const handleError = () => {
    if (!hasTriedBackup && backupUrl && backupUrl !== currentSrc) {
      setHasTriedBackup(true);
      setCurrentSrc(backupUrl);
    } else {
      setHasFailed(true);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'h-10 w-10 min-w-[2.5rem]';
      case 'sm':
        return 'h-16 w-16 min-w-[4rem]';
      case 'lg':
        return 'h-80 sm:h-96 w-full';
      case 'hero':
        return 'h-[360px] sm:h-[450px] w-full';
      case 'md':
      default:
        return 'h-48 sm:h-52 w-full';
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-white flex items-center justify-center rounded-lg border border-[#E2E8E6]/60 ${getSizeClasses()} ${className}`}
    >
      {!hasFailed ? (
        <img
          src={currentSrc}
          alt={productName}
          onError={handleError}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        /* Clean minimal product fallback frame only if both primary and CDN fail */
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-2 text-center select-none">
          <svg
            className="w-8 h-8 mb-1 opacity-40 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="text-[10px] font-medium text-slate-500 truncate max-w-[100px]">
            {productName}
          </span>
        </div>
      )}
    </div>
  );
};
