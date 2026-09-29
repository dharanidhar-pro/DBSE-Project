import React, { useState } from 'react';
import { Camera, User } from 'lucide-react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface UserAvatarProps {
  name?: string;
  avatar?: string | null;
  size?: AvatarSize;
  className?: string;
  editable?: boolean;
  onEditClick?: () => void;
  alt?: string;
}

const sizeClasses: Record<AvatarSize, { container: string; text: string; icon: string; editBadge: string }> = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-[10px]',
    icon: 'w-3 h-3',
    editBadge: 'w-3 h-3',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-xs',
    icon: 'w-4 h-4',
    editBadge: 'w-4 h-4',
  },
  md: {
    container: 'w-10 h-10',
    text: 'text-sm',
    icon: 'w-5 h-5',
    editBadge: 'w-5 h-5',
  },
  lg: {
    container: 'w-14 h-14',
    text: 'text-lg',
    icon: 'w-6 h-6',
    editBadge: 'w-6 h-6',
  },
  xl: {
    container: 'w-20 h-20',
    text: 'text-2xl',
    icon: 'w-8 h-8',
    editBadge: 'w-7 h-7',
  },
  '2xl': {
    container: 'w-24 h-24',
    text: 'text-3xl',
    icon: 'w-10 h-10',
    editBadge: 'w-8 h-8',
  },
};

/**
 * Extracts clean 2-letter uppercase initials from any name or email
 */
export const getInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'MH';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = '',
  avatar,
  size = 'md',
  className = '',
  editable = false,
  onEditClick,
  alt,
}) => {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const sizeConfig = sizeClasses[size];

  const hasValidImage = Boolean(avatar && !imageError && avatar.trim().length > 0);

  return (
    <div className={`relative inline-block shrink-0 select-none ${className}`}>
      <div
        className={`${sizeConfig.container} rounded-full overflow-hidden flex items-center justify-center font-bold tracking-tight border border-[#E2E8E6] shadow-2xs transition-all ${
          hasValidImage ? 'bg-stone-100' : 'bg-teal-50 text-[#0F766E]'
        }`}
      >
        {hasValidImage ? (
          <img
            src={avatar!}
            alt={alt || name || 'User avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <span className={`${sizeConfig.text} font-bold font-sans`}>
            {initials || <User className={sizeConfig.icon} />}
          </span>
        )}
      </div>

      {editable && onEditClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick();
          }}
          title="Change profile picture"
          aria-label="Change profile picture"
          className={`absolute -bottom-1 -right-1 ${sizeConfig.editBadge} rounded-full bg-[#0F766E] text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-[#115E59] active:scale-95 transition-all cursor-pointer`}
        >
          <Camera className="w-3/5 h-3/5" />
        </button>
      )}
    </div>
  );
};
