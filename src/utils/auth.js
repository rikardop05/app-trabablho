export function isAdmin(currentUser) {
  if (!currentUser) return false;
  return currentUser.role === 'admin';
}

export function createAdminUserIfNeeded() {
  const users = JSON.parse(localStorage.getItem('app_users_v1')) || [];
  const hasAdmin = users.some(user => user.role === 'admin');
  
  if (!hasAdmin) {
    const adminUser = {
      id: 'admin-' + Date.now(),
      name: 'Admin',
      avatar: null,
      bio: 'Administrator account',
      role: 'admin',
      createdAt: Date.now()
    };
    
    users.push(adminUser);
    localStorage.setItem('app_users_v1', JSON.stringify(users));
    console.log('Admin user created:', adminUser);
  }
}