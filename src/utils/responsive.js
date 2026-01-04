/**
 * Responsive utilities for mobile/desktop detection and adaptation
 */

/**
 * Check if the current device is mobile
 * @returns {boolean} - True if mobile device
 */
export function isMobileDevice() {
  try {
    // Check for mobile user agents including tablets
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i
    return mobileRegex.test(navigator.userAgent)
  } catch {
    return false
  }
}

/**
 * Check if we're running in a mobile browser environment
 * @returns {boolean} - True if mobile browser
 */
export function isMobileBrowser() {
  try {
    // Check for touch support and mobile-specific properties
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0)
  } catch {
    return false
  }
}

/**
 * Check if the current viewport is mobile-sized
 * @returns {boolean} - True if mobile viewport
 */
export function isMobileViewport() {
  try {
    return window.innerWidth <= 768
  } catch {
    return false
  }
}

/**
 * Check if we should use mobile layout
 * @returns {boolean} - True if mobile layout should be used
 */
export function shouldUseMobileLayout() {
  return isMobileDevice() || isMobileBrowser() || isMobileViewport()
}

/**
 * Apply mobile-specific styles
 */
export function applyMobileStyles() {
  if (shouldUseMobileLayout()) {
    // Find elements with mobile padding attribute
    const elements = document.querySelectorAll('[data-mobile-padding="true"]')
    elements.forEach(el => {
      // Completely remove padding on mobile
      el.style.padding = '0px'
    })
  }
}

/**
 * Reset to desktop styles
 */
export function applyDesktopStyles() {
  const elements = document.querySelectorAll('[data-mobile-padding="true"]')
  elements.forEach(el => {
    // Restore original desktop padding
    const desktopPadding = el.getAttribute('data-desktop-padding')
    if (desktopPadding) {
      el.style.padding = desktopPadding
    }
  })
}

/**
 * Initialize responsive behavior
 */
export function initResponsiveBehavior() {
  // Set initial state
  if (shouldUseMobileLayout()) {
    applyMobileStyles()
  }

  // Add resize listener
  window.addEventListener('resize', () => {
    if (shouldUseMobileLayout()) {
      applyMobileStyles()
    } else {
      applyDesktopStyles()
    }
  })
}