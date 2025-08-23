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
        
        // Set default authorization header for future requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Login failed',
        error: error
      };
    }
  }

  // Google OAuth login
  async googleLogin(token) {
    try {
      const response = await apiClient.post('/auth/google', { token });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      
      return {
        success: true,
        data: response.data,
        message: 'Google login successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Google login failed',
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
