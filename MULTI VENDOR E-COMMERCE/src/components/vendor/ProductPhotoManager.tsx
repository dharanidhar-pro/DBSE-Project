import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Star,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  X,
  Loader2,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';
import { CATEGORY_PHOTO_PRESETS, PhotoPreset } from './productPhotoPresets';
import { processMultipleProductPhotos } from './photoCompression';
import { useToast } from '../../context/ToastContext';

interface ProductPhotoManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
  category?: string;
  productName?: string;
  maxImages?: number;
}

export const ProductPhotoManager: React.FC<ProductPhotoManagerProps> = ({
  images,
  onChange,
  category = 'Electronics',
  productName = '',
  maxImages = 10,
}) => {
  const { showSuccess, showError, showInfo } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<{ current: number; total: number } | null>(null);

  const [urlInput, setUrlInput] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const availablePresets = CATEGORY_PHOTO_PRESETS[category] || CATEGORY_PHOTO_PRESETS['Electronics'] || [];

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    await handleFiles(files);
  };

  // Multiple files selection
  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    await handleFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      showError(`Maximum of ${maxImages} product photos allowed.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    if (filesToProcess.length < files.length) {
      showInfo(`Adding first ${remainingSlots} photos (maximum limit reached).`);
    }

    setIsProcessing(true);
    setProcessingProgress({ current: 0, total: filesToProcess.length });

    try {
      const optimizedImages = await processMultipleProductPhotos(filesToProcess, (current, total) => {
        setProcessingProgress({ current, total });
      });

      if (optimizedImages.length > 0) {
        onChange([...images, ...optimizedImages]);
        showSuccess(
          `Added ${optimizedImages.length} product photo(s). Multiple pictures enabled!`,
          'Photos Added'
        );
      }
    } catch (err) {
      showError('Failed to process some product images.');
    } finally {
      setIsProcessing(false);
      setProcessingProgress(null);
    }
  };

  // Add via URL (supports single or comma/newline separated)
  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;

    const urls = trimmed
      .split(/[\n,]+/)
      .map(u => u.trim())
      .filter(u => u.startsWith('http://') || u.startsWith('https://'));

    if (urls.length === 0) {
      showError('Please enter valid image URL(s) starting with http:// or https://');
      return;
    }

    const remainingSlots = maxImages - images.length;
    const finalUrls = urls.slice(0, remainingSlots);

    onChange([...images, ...finalUrls]);
    setUrlInput('');
    showSuccess(`Added ${finalUrls.length} picture URL(s).`);
  };

  // Add preset photo
  const handleAddPreset = (preset: PhotoPreset) => {
    if (images.length >= maxImages) {
      showError(`Maximum of ${maxImages} product photos reached.`);
      return;
    }
    if (images.includes(preset.url)) {
      showInfo('This sample photo is already in your gallery.');
      return;
    }
    onChange([...images, preset.url]);
    showSuccess(`Added "${preset.title}" (${preset.angle})`);
  };

  // Reordering handlers
  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const target = images[index];
    const rest = images.filter((_, idx) => idx !== index);
    onChange([target, ...rest]);
    showSuccess('Set as main cover photo.');
  };

  const handleMoveLeft = (index: number) => {
    if (index === 0) return;
    const copy = [...images];
    const temp = copy[index - 1];
    copy[index - 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  const handleMoveRight = (index: number) => {
    if (index === images.length - 1) return;
    const copy = [...images];
    const temp = copy[index + 1];
    copy[index + 1] = copy[index];
    copy[index] = temp;
    onChange(copy);
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Header with Multi-Picture Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E2E8E6]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-xs text-[#172121]">Product Photos & Gallery</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-200">
              <Layers className="w-3 h-3" />
              Multiple Pics Allowed
            </span>
          </div>
          <p className="text-[11px] text-[#647070]">
            Add multiple angles (front, side, lifestyle, details). 1st photo is the primary cover image.
          </p>
        </div>

        <div className="text-right">
          <span
            className={`text-xs font-bold tabular-nums ${
              images.length >= maxImages ? 'text-amber-600' : 'text-[#0F766E]'
            }`}
          >
            {images.length} / {maxImages}
          </span>
          <span className="text-[10px] text-[#647070] block">photos attached</span>
        </div>
      </div>

      {/* Drag & Drop Multi-Photo Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer select-none ${
          isDragging
            ? 'border-[#0F766E] bg-teal-50/80 scale-[1.01]'
            : 'border-[#CBD5D1] hover:border-[#0F766E] bg-[#FAFCFB] hover:bg-stone-50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {isProcessing ? (
          <div className="py-2 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-7 h-7 text-[#0F766E] animate-spin" />
            <p className="text-xs font-semibold text-[#172121]">
              Optimizing & preparing photos...
              {processingProgress && (
                <span className="text-[#0F766E] ml-1">
                  ({processingProgress.current} of {processingProgress.total})
                </span>
              )}
            </p>
            <p className="text-[11px] text-[#647070]">Applying studio compression without loss of quality</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="p-2.5 rounded-full bg-teal-50 text-[#0F766E] border border-teal-100">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-[#172121]">
              <span className="text-[#0F766E] underline">Click to browse multiple photos</span> or drag & drop here
            </p>
            <p className="text-[11px] text-[#647070]">
              Select multiple pictures at once · PNG, JPG, JPEG, WEBP · Up to 15MB each
            </p>
          </div>
        )}
      </div>

      {/* Alternative URL & Presets Bar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex gap-1.5">
          <div className="relative flex-1">
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddUrl();
                }
              }}
              placeholder="Paste direct Image URL (or comma-separated URLs)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E2E8E6] rounded-lg focus:outline-none focus:border-[#0F766E]"
            />
            <LinkIcon className="w-3.5 h-3.5 text-[#647070] absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 text-xs font-semibold text-[#0F766E] bg-white border border-[#E2E8E6] hover:bg-stone-50 rounded-lg shrink-0 cursor-pointer shadow-2xs"
          >
            + Add URL
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowPresets(!showPresets)}
          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer shrink-0 ${
            showPresets
              ? 'bg-teal-50 text-[#0F766E] border-teal-200'
              : 'bg-white text-[#647070] border-[#E2E8E6] hover:bg-stone-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
          <span>{showPresets ? 'Hide Studio Shots' : `${category} Angle Shots`}</span>
        </button>
      </div>

      {/* Curated Category Studio Angle Presets */}
      {showPresets && (
        <div className="p-3 bg-stone-50 rounded-xl border border-[#E2E8E6] space-y-2.5 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#172121]">
              Recommended Multi-Angle Shots for {category}
            </span>
            <span className="text-[10px] text-[#647070]">Click to add instantly to your listing</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {availablePresets.map(preset => {
              const isAlreadyAdded = images.includes(preset.url);
              return (
                <div
                  key={preset.id}
                  className="bg-white rounded-lg border border-[#E2E8E6] overflow-hidden p-1.5 flex flex-col gap-1.5 shadow-2xs"
                >
                  <div className="relative aspect-video w-full rounded overflow-hidden bg-stone-100">
                    <img src={preset.url} alt={preset.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-black/70 text-white text-[9px] font-medium">
                      {preset.angle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-semibold text-[#172121] truncate">{preset.title}</span>
                    <button
                      type="button"
                      disabled={isAlreadyAdded || images.length >= maxImages}
                      onClick={() => handleAddPreset(preset)}
                      className={`px-1.5 py-0.5 text-[9px] font-bold rounded cursor-pointer ${
                        isAlreadyAdded
                          ? 'bg-emerald-50 text-emerald-700 cursor-default'
                          : 'bg-[#0F766E] text-white hover:bg-[#115E59]'
                      }`}
                    >
                      {isAlreadyAdded ? 'Added' : '+ Add'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Uploaded Photos Grid with Interactive Ordering */}
      {images.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#647070]">
            <span>Attached Pictures ({images.length})</span>
            <span>Use arrows to reorder or set new cover photo</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#FAFCFB] rounded-xl border border-[#E2E8E6] max-h-72 overflow-y-auto">
            {images.map((imgUrl, idx) => {
              const isCover = idx === 0;
              return (
                <div
                  key={idx}
                  className={`group relative rounded-xl overflow-hidden border-2 bg-white flex flex-col shadow-2xs transition-all ${
                    isCover ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20' : 'border-[#E2E8E6] hover:border-stone-400'
                  }`}
                >
                  {/* Image Aspect Box */}
                  <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={`Product picture ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />

                    {/* Badge: Cover or Index */}
                    <div className="absolute top-1.5 left-1.5 z-10">
                      {isCover ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0F766E] text-white text-[9px] font-bold shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          <span>Cover</span>
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold">
                          #{idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Top Right Quick Actions (Preview & Delete) */}
                    <div className="absolute top-1.5 right-1.5 flex items-center gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => setLightboxIndex(idx)}
                        className="p-1 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer shadow-xs"
                        title="View photo full size"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(idx)}
                        className="p-1 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Card Bottom Toolbar */}
                  <div className="p-1.5 bg-stone-50 border-t border-[#E2E8E6] flex items-center justify-between gap-1 text-[10px]">
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveLeft(idx)}
                        className="p-1 rounded hover:bg-stone-200 text-[#647070] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move left"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === images.length - 1}
                        onClick={() => handleMoveRight(idx)}
                        className="p-1 rounded hover:bg-stone-200 text-[#647070] disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                        title="Move right"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {!isCover && (
                      <button
                        type="button"
                        onClick={() => handleSetCover(idx)}
                        className="px-1.5 py-0.5 text-[9px] font-semibold text-[#0F766E] hover:bg-teal-50 rounded cursor-pointer"
                      >
                        Set Cover
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-stone-50 rounded-xl border border-dashed border-[#CBD5D1] text-center text-[#647070] space-y-1">
          <ImageIcon className="w-6 h-6 mx-auto text-stone-400" />
          <p className="text-xs font-medium text-[#172121]">No product pictures uploaded yet</p>
          <p className="text-[11px] text-[#647070]">
            Upload multiple photos or select from {category} studio shots above.
          </p>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in-50 duration-150"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="w-full flex items-center justify-between p-3 bg-stone-900/90 text-white border-b border-stone-800">
              <span className="text-xs font-semibold">
                Photo {lightboxIndex + 1} of {images.length}
                {lightboxIndex === 0 && ' · Main Cover Photo'}
              </span>
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="p-1 rounded-lg hover:bg-stone-800 text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Photo */}
            <div className="relative flex items-center justify-center p-2 max-h-[70vh] overflow-hidden">
              <img
                src={images[lightboxIndex]}
                alt={`Photo preview ${lightboxIndex + 1}`}
                className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-lg"
              />

              {/* Prev / Next Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : images.length - 1))
                    }
                    className="absolute left-4 p-2 rounded-full bg-black/60 hover:bg-black text-white cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex(prev => (prev !== null && prev < images.length - 1 ? prev + 1 : 0))
                    }
                    className="absolute right-4 p-2 rounded-full bg-black/60 hover:bg-black text-white cursor-pointer"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
