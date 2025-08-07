export function sanitizeImageUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  
  // Convert to string and trim
  const urlString = String(url).trim();
  
  // List of allowed protocols
  const allowedProtocols = ['http:', 'https:', 'data:'];
  
  try {
    // Parse the URL
    const parsedUrl = new URL(urlString);
    
    // Check if protocol is allowed
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      console.warn(`Blocked potentially malicious URL with protocol: ${parsedUrl.protocol}`);
      return undefined;
    }
    
    // Additional checks for data URLs
    if (parsedUrl.protocol === 'data:') {
      // Only allow image data URLs
      if (!urlString.startsWith('data:image/')) {
        console.warn('Blocked non-image data URL');
        return undefined;
      }
    }
    
    return urlString;
  } catch (error) {
    // If URL parsing fails, check if it's a relative URL
    if (urlString.startsWith('/') || urlString.startsWith('./') || urlString.startsWith('../')) {
      return urlString;
    }
    
    // Otherwise, it's an invalid URL
    console.warn('Invalid URL format:', urlString);
    return undefined;
  }
}

export function isValidImageUrl(url: string | undefined | null): boolean {
  return sanitizeImageUrl(url) !== undefined;
}