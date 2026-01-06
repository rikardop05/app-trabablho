export const STORAGE_KEY = 'app_posts_v1'
export const USER_KEY = 'app_user_v1'
export const REPORTS_KEY = 'app_reports_v1'
export const STORIES_KEY = 'app_stories_v1'
export const USERS_KEY = 'app_users_v1'
export const MAX_STORAGE_SIZE = 1000 * 1024 * 1024 // 1GB

export function resolveUserById(userId) {
  const users = loadUsers();
  return users.find(u => String(u.id) === String(userId)) || null;
}


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
    const user = raw ? JSON.parse(raw) : null
    console.log('loadUser chamado, usuário:', user)
    return user
  } catch (error) {
    console.error('Erro ao carregar usuário:', error)
    return null
  }
}

export function loadCurrentUserId() {
  try {
    const raw = localStorage.getItem('currentUserId')
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('Erro ao carregar currentUserId:', error)
    return null
  }
}

export function saveCurrentUserId(userId) {
  try {
    localStorage.setItem('currentUserId', JSON.stringify(userId))
  } catch (error) {
    console.error('Erro ao salvar currentUserId:', error)
  }
}

export function saveUser(user) {
  try {
    console.log('Salvando usuário:', user)
    const users = loadUsers()
    const existingUserIndex = users.findIndex(u => u.id === user.id)
      
    let updatedUsers
    if (existingUserIndex >= 0) {
      updatedUsers = [...users]
      updatedUsers[existingUserIndex] = user
    } else {
      updatedUsers = [...users, user]
    }
      
    // Verifica se o avatar é muito grande
    if (user.avatar && user.avatar.length > MAX_STORAGE_SIZE / 10) {
      console.warn('Avatar muito grande, removendo para evitar quota excedida')
      user = { ...user, avatar: null }
      updatedUsers = updatedUsers.map(u => u.id === user.id ? user : u)
    }
      
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
    saveCurrentUserId(user.id)
    console.log('Usuário salvo com sucesso')
  } catch (error) {
    console.error('Erro ao salvar usuário:', error)
    // Tentar salvar sem o avatar se houver erro de quota
    if (error.name === 'QuotaExceededError' && user.avatar) {
      console.warn('Tentando salvar usuário sem avatar devido à quota excedida')
      const userWithoutAvatar = { ...user, avatar: null }
      localStorage.setItem(USER_KEY, JSON.stringify(userWithoutAvatar))
      const updatedUsers = loadUsers().map(u => u.id === user.id ? userWithoutAvatar : u)
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers))
      saveCurrentUserId(user.id)
    }
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

export function clearAllData() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(REPORTS_KEY)
    localStorage.removeItem(STORIES_KEY)
    localStorage.removeItem(USERS_KEY)
    console.log('Todos os dados foram removidos do storage')
  } catch (error) {
    console.error('Erro ao limpar dados do storage:', error)
  }
}

export function unifyStorage() {
  try {
    const posts = loadPosts()
    const user = loadUser()
    const reports = loadReports()
    const stories = loadStories()
    const users = loadUsers()
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports))
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories))
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    
    console.log('Storage unificado com sucesso')
  } catch (error) {
    console.error('Erro ao unificar storage:', error)
  }
}