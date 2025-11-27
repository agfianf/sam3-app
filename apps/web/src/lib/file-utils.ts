/**
 * Allowed image file extensions for upload
 */
export const ALLOWED_IMAGE_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.bmp'
] as const

/**
 * Check if a file has an allowed image extension
 */
export function isAllowedImageFile(filename: string): boolean {
  const lowerName = filename.toLowerCase()
  return ALLOWED_IMAGE_EXTENSIONS.some(ext => lowerName.endsWith(ext))
}

/**
 * Extract relative path from File with webkitRelativePath
 * Falls back to filename if no relative path available
 */
export function getRelativePath(file: File): string {
  // @ts-ignore - webkitRelativePath is non-standard but widely supported
  const webkitPath = file.webkitRelativePath as string | undefined
  return webkitPath && webkitPath.trim() !== '' ? webkitPath : file.name
}

/**
 * Get display name - returns relative path if available, otherwise filename
 */
export function getDisplayName(file: File): string {
  return getRelativePath(file)
}

/**
 * Check if browser supports folder upload
 */
export function isFolderUploadSupported(): boolean {
  const input = document.createElement('input')
  return 'webkitdirectory' in input || 'directory' in input
}
