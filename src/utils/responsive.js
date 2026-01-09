/**
 * Utilidade responsiva para detectar dispositivos móveis e aplicar estilos
 */

/**
 * Check se o dispositivo é móvel
 * @returns {boolean} - True if mobile device
 */
export function isMobileDevice() {
  try {
    // Check por user agent móvel
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i
    return mobileRegex.test(navigator.userAgent)
  } catch {
    return false
  }
}

/**
 * Check se está rodando em um navegador móvel
 * @returns {boolean} - True if mobile browser
 */
export function isMobileBrowser() {
  try {
    // Check por suporte touch
    return ('ontouchstart' in window) ||
           (navigator.maxTouchPoints > 0) ||
           (navigator.msMaxTouchPoints > 0)
  } catch {
    return false
  }
}

/**
 * Check se a visualização é móvel (largura da janela)
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
 * Check se deve usar layout móvel
 * @returns {boolean} - True if mobile layout should be used
 */
export function shouldUseMobileLayout() {
  return isMobileDevice() || isMobileBrowser() || isMobileViewport()
}

/**
 * Aplica estilos móveis se necessário
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
 * Reset para estilos desktop
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
 * Inicializa comportamento responsivo
 */
export function initResponsiveBehavior() {
  // Seta estilos iniciais
  if (shouldUseMobileLayout()) {
    applyMobileStyles()
  }

  // Adiciona listener para redimensionamento
  window.addEventListener('resize', () => {
    if (shouldUseMobileLayout()) {
      applyMobileStyles()
    } else {
      applyDesktopStyles()
    }
  })
}