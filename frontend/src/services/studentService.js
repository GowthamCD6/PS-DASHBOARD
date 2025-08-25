import apiClient from './apiConfig';

class StudentService {
  // Get all users/students
  async getAllUsers() {
    try {
      const response = await apiClient.get('/student/get_all_users');
      return {
        success: true,
        data: response.data,
        message: 'Users fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch users',
        error: error
      };
    }
  }

  // Get specific user data by ID
  async getUserData(userId) {
    try {
      const response = await apiClient.get(`/student/user_data/${userId}`);
      return {
        success: true,
        data: response.data,
        message: 'User data fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch user data',
        error: error
      };
    }
  }

  // Get users by filters (year, department, etc.)
  async getUsersByFilter(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await apiClient.get(`/student/get_all_users?${queryParams}`);
      return {
        success: true,
        data: response.data,
        message: 'Filtered users fetched successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch filtered users',
        error: error
      };
    }
  }

  // Add new skill (placeholder for future implementation)
  async addSkill(skillData) {
    try {
      const response = await apiClient.post('/student/add_skill', skillData);
      return {
        success: true,
        data: response.data,
        message: 'Skill added successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to add skill',
        error: error
      };
    }
  }

  // Update skill (placeholder for future implementation)
  async updateSkill(skillId, skillData) {
    try {
      const response = await apiClient.put(`/student/update_skill/${skillId}`, skillData);
      return {
        success: true,
        data: response.data,
        message: 'Skill updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update skill',
        error: error
      };
    }
  }

  // Delete skill (placeholder for future implementation)
  async deleteSkill(skillId) {
    try {
      const response = await apiClient.delete(`/student/delete_skill/${skillId}`);
      return {
        success: true,
        data: response.data,
        message: 'Skill deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete skill',
        error: error
      };
    }
  }
}

export default new StudentService();
