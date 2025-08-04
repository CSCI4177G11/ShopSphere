import React from 'react';
import { sanitizeImageUrl } from '@/lib/sanitize-url';

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallback?: React.ReactNode;
}

export function SafeImage({ src, fallback, alt = '', ...props }: SafeImageProps) {
  const sanitizedUrl = sanitizeImageUrl(src);
  
  if (!sanitizedUrl) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }
  
  return (
    <img
      {...props}
      src={sanitizedUrl}
      alt={alt}
      onError={(e) => {
        // Prevent infinite error loops
        e.currentTarget.style.display = 'none';
        if (props.onError) {
          props.onError(e);
        }
      }}
    />
  );
}