export const STORAGE_KEY = 'app_posts_v1'
export const USER_KEY = 'app_user_v1'
export const REPORTS_KEY = 'app_reports_v1'

export function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    window.dispatchEvent(new Event('posts_updated'))
  } catch (error) {
    console.error('Failed to save posts:', error)
  }
}

export function loadUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveUser(user) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch {
    // Silent fail
  }
}

export function loadReports() {
  try {
    const raw = localStorage.getItem(REPORTS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveReport(report) {
  try {
    const reports = loadReports()
    reports.push(report)
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
  } catch {
    // Silent fail
  }
}

export function clearUser() {
  localStorage.removeItem(USER_KEY)
}