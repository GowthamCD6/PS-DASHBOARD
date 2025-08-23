import apiClient from './apiConfig';

class AuthService {
  // Login user
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      // Store token and user data if login successful
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
        error: error
      };
    }
  }

  // Logout user
  async logout() {
    try {
      await apiClient.post('/auth/logout');
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return {
        success: false,
        message: error.message || 'Logout failed',
        error: error
      };
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  // Get current user
  getCurrentUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }
}

export default new AuthService();
