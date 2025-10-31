interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  upiId: string;
  createdAt: string;
}

interface AuthData {
  users: User[];
}

const STORAGE_KEY = 'smart_upi_users';

// Initialize with some dummy data
const initializeData = (): AuthData => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return JSON.parse(existing);
  }
  
  const initialData: AuthData = {
    users: []
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  return initialData;
};

export const getAuthData = (): AuthData => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initializeData();
};

export const saveAuthData = (data: AuthData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const registerUser = (email: string, password: string, name: string, phone: string): { success: boolean; message: string; user?: User } => {
  const data = getAuthData();
  
  // Check if user already exists
  const existingUser = data.users.find(u => u.email === email);
  if (existingUser) {
    return { success: false, message: 'User already exists' };
  }
  
  // Generate UPI ID from email
  const upiId = `${email.split('@')[0]}@smartupi`;
  
  const newUser: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    phone,
    upiId,
    createdAt: new Date().toISOString()
  };
  
  data.users.push(newUser);
  saveAuthData(data);
  
  // Store password separately (in real app, this would be hashed)
  localStorage.setItem(`pwd_${email}`, password);
  
  return { success: true, message: 'Registration successful', user: newUser };
};

export const loginUser = (email: string, password: string): { success: boolean; message: string; user?: User } => {
  const data = getAuthData();
  const user = data.users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, message: 'User not found' };
  }
  
  const storedPassword = localStorage.getItem(`pwd_${email}`);
  if (storedPassword !== password) {
    return { success: false, message: 'Invalid password' };
  }
  
  return { success: true, message: 'Login successful', user };
};

export const getCurrentUser = (): User | null => {
  const userStr = sessionStorage.getItem('current_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (user) {
    sessionStorage.setItem('current_user', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('current_user');
  }
};

export const logoutUser = (): void => {
  sessionStorage.removeItem('current_user');
};
