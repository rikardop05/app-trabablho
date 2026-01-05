import { MAX_STORAGE_SIZE } from './storage'

// Maximum individual image size before compression
export const MAX_UPLOAD_SIZE = 20 * 1024 * 1024 // 20MB

// Image compression limits
export const AVATAR_LIMITS = {
  maxWidth: 300,
  maxHeight: 300,
  quality: 0.9,
  maxSize: 0 // No size limit
}

export const POST_LIMITS = {
  maxWidth: 2000,
  maxHeight: 2000,
  quality: 0.9,
  maxSize: 0 // No size limit
}

export const STORY_LIMITS = {
  maxWidth: 1000,
  maxHeight: 1000,
  quality: 0.85,
  maxSize: 0 // No size limit
}

/**
 * Image compression utility for client-side resizing and compression
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @param {number} [options.maxWidth=1024] - Maximum width in pixels
 * @param {number} [options.maxHeight=1024] - Maximum height in pixels
 * @param {number} [options.quality=0.8] - JPEG compression quality (0-1)
 * @param {number} [options.maxSize=500] - Maximum file size in KB
 * @returns {Promise<string>} - Base64 encoded compressed image
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8,
    maxSize = 500
  } = options

  return new Promise((resolve, reject) => {
    console.log('Starting compression for:', file.name, file.size)
    if (!file || !file.type.match('image.*')) {
      reject(new Error('Invalid image file'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        try {
          console.log('Original dimensions:', img.width, img.height)
          const compressedDataUrl = applyCanvasCompression(img, maxWidth, maxHeight, quality, maxSize)
          console.log('Compression complete. Result size:', compressedDataUrl.length)
          resolve(compressedDataUrl)
        } catch (error) {
          console.error('Compression failed:', error)
          reject(error)
        }
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Apply canvas-based compression to an image
 * @param {HTMLImageElement} img - Image element
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @param {number} quality - JPEG quality (0-1)
 * @param {number} maxSize - Maximum size in KB
 * @returns {string} - Base64 encoded compressed image
 */
function applyCanvasCompression(img, maxWidth, maxHeight, quality, maxSize) {
  // Calculate new dimensions while maintaining aspect ratio
  let width = img.width
  let height = img.height
  
  console.log('Original aspect ratio:', width / height)
  
  // Fixed aspect ratio calculation with better debugging
  if (width > maxWidth || height > maxHeight) {
    const widthRatio = maxWidth / width
    const heightRatio = maxHeight / height
    const ratio = Math.min(widthRatio, heightRatio)
    width = Math.floor(width * ratio)
    height = Math.floor(height * ratio)
    console.log('Width ratio:', widthRatio, 'Height ratio:', heightRatio, 'Final ratio:', ratio)
    console.log('Resized dimensions:', width, height, 'New aspect ratio:', width / height)
  } else {
    console.log('No resizing needed, keeping original dimensions')
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = width
  canvas.height = height
  
  console.log('Canvas created with dimensions:', canvas.width, canvas.height)
  
  // Draw image with compression
  try {
    ctx.drawImage(img, 0, 0, width, height)
    console.log('Image drawn to canvas successfully')
  } catch (error) {
    console.error('Failed to draw image to canvas:', error)
    throw error
  }
  
  // Convert to base64 with quality setting
  let compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
  console.log('Compressed data URL length:', compressedDataUrl.length)

  // If size limit is specified, reduce quality further if needed
  if (maxSize > 0) {
    const maxBytes = maxSize * 1024
    let currentQuality = quality
    let attempts = 0

    while (compressedDataUrl.length * 0.75 > maxBytes && currentQuality > 0.1 && attempts < 15) {
      currentQuality -= 0.05
      compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality)
      attempts++
    }
  }

  return compressedDataUrl
}

/**
 * Check if adding new data would exceed localStorage limit
 * @param {string} newData - The data to be added
 * @returns {boolean} - True if there's enough space
 */
export function hasStorageSpace(newData) {
  try {
    const testKey = '__storage_test__'
    const currentUsage = JSON.stringify(localStorage).length
    const estimatedNewSize = currentUsage + newData.length

    // Test if we can write the data
    localStorage.setItem(testKey, newData)
    localStorage.removeItem(testKey)
    
    return estimatedNewSize < MAX_STORAGE_SIZE
  } catch (error) {
    return false
  }
}

/**
 * Calculate estimated storage usage
 * @returns {number} - Estimated usage in bytes
 */
export function getStorageUsage() {
  try {
    return JSON.stringify(localStorage).length
  } catch {
    return 0
  }
}

/**
 * Generate a reliable placeholder image URL
 * @param {string} userId - User ID for unique placeholder
 * @param {string} type - Type of placeholder ('avatar', 'post', 'story')
 * @returns {string} - Placeholder image URL
 */
export function getPlaceholderImage(userId = '', type = 'avatar') {
  // Use different services for better reliability
  const services = [
    `https://i.pravatar.cc/150?u=${userId}`,
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
    `https://ui-avatars.com/api/?name=User&background=random&size=150`
  ];
  
  // Return first service that works (we'll try them in order)
  return services[0];
}

/**
 * Safely get user avatar URL with fallback
 * @param {Object} user - User object
 * @returns {string} - Valid avatar URL or placeholder
 */
export function getUserAvatar(user) {
  if (!user) return getPlaceholderImage('', 'avatar');
  
  // Check if avatar exists and is not empty string
  if (user.avatar && user.avatar.trim().length > 0) {
    return user.avatar;
  }
  
  // Fallback to placeholder
  return getPlaceholderImage(user.id || '', 'avatar');
}

/**
 * Safely get story image URL with fallback
 * @param {Object} story - Story object
 * @returns {string} - Valid image URL or placeholder
 */
export function getStoryImage(story) {
  if (!story) return getPlaceholderImage('', 'story');
  
  // Check if image exists and is not empty string
  if (story.image && story.image.trim().length > 0) {
    return story.image;
  }
  
  // Fallback to placeholder
  return getPlaceholderImage(story.user?.id || '', 'story');
}