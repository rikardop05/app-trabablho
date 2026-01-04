export const STORAGE_KEY = 'app_posts_v1'
export const USER_KEY = 'app_user_v1'
export const REPORTS_KEY = 'app_reports_v1'
export const STORIES_KEY = 'app_stories_v1'
export const USERS_KEY = 'app_users_v1'
export const MAX_STORAGE_SIZE = 1000 * 1024 * 1024 // 1GB

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
    const jsonData = JSON.stringify(posts)
    console.log('Saving posts to localStorage:', jsonData.length, 'bytes')
    localStorage.setItem(STORAGE_KEY, jsonData)
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
    const users = loadUsers()
    const existingUserIndex = users.findIndex(u => u.id === user.id)
    
    let updatedUsers
    if (existingUserIndex >= 0) {
      updatedUsers = [...users]
      updatedUsers[existingUserIndex] = user
    } else {
      updatedUsers = [...users, user]
    }
    
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
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

export function loadStories() {
  try {
    const raw = localStorage.getItem(STORIES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveStories(stories) {
  try {
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories))
  } catch {
    // Silent fail
  }
}

export function loadUsers() {
  try {
    const raw = localStorage.getItem('app_users_v1')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem('app_users_v1', JSON.stringify(users))
  } catch {
    // Silent fail
  }
}