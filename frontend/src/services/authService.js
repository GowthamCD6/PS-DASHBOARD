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
      const token = this.getToken();
      if (token) {
        await apiClient.post('/auth/logout');
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local storage and headers
      this.clearAuthData();
      
      return {
        success: true,
        message: 'Logout successful'
      };
    }
  }

  // Clear authentication data
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete apiClient.defaults.headers.common['Authorization'];
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
      this.clearAuthData(); // Clear corrupted data
      return null;
    }
  }

  // Get token
  getToken() {
    return localStorage.getItem('token');
  }

  // Initialize auth on app start
  initializeAuth() {
    const token = this.getToken();
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  // Refresh token if needed
  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh');
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        return true;
      }
      return false;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }
}

export default new AuthService();
