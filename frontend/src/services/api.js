const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = null;
  }

  setAccessToken(token) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  clearAccessToken() {
    this.accessToken = null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken && !options.skipAuth) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include', // Include cookies for refresh token
    };

    if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      // If unauthorized, try refresh once (don't refresh when calling refresh endpoint)
      if (response.status === 401 && endpoint !== '/auth/refresh' && !options._retry) {
        try {
          const refreshResp = await this.refreshToken();
          if (refreshResp && refreshResp.success && refreshResp.data?.accessToken) {
            this.setAccessToken(refreshResp.data.accessToken);
            // retry original request with new token
            const retryHeaders = { ...headers };
            if (this.accessToken && !options.skipAuth) {
              retryHeaders.Authorization = `Bearer ${this.accessToken}`;
            }
            const retryConfig = {
              ...config,
              headers: retryHeaders,
              _retry: true
            };
            const retryResponse = await fetch(url, retryConfig);
            const retryData = await retryResponse.json().catch(() => ({}));
            if (!retryResponse.ok) throw { status: retryResponse.status, ...retryData };
            return retryData;
          }
        } catch (err) {
          // fall through to throw original 401
        }
      }

      if (!response.ok) {
        throw { status: response.status, ...data };
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async registerStudent(userData) {
    return this.request('/auth/register/student', {
      method: 'POST',
      body: userData,
      skipAuth: true,
    });
  }

  async registerFaculty(userData) {
    return this.request('/auth/register/faculty', {
      method: 'POST',
      body: userData,
      skipAuth: true,
    });
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: { email, password },
      skipAuth: true,
    });

    if (response.success && response.data.accessToken) {
      this.setAccessToken(response.data.accessToken);
    }

    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    this.clearAccessToken();
    return response;
  }

  async refreshToken() {
    const response = await this.request('/auth/refresh', {
      method: 'POST',
      skipAuth: true,
    });

    if (response.success && response.data.accessToken) {
      this.setAccessToken(response.data.accessToken);
    }

    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  async verifyEmail(token) {
    return this.request(`/auth/verify-email?token=${token}`, {
      method: 'GET',
      skipAuth: true,
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      skipAuth: true,
    });
  }

  async resetPassword(token, newPassword, confirmPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: { token, newPassword, confirmPassword },
      skipAuth: true,
    });
  }

  // Student endpoints
  async getStudentDashboard() {
    return this.request('/student/dashboard', {
      method: 'GET',
    });
  }

  async getNotices() {
    return this.request('/student/notices', {
      method: 'GET',
    });
  }

  async getEvents() {
    return this.request('/student/events', {
      method: 'GET',
    });
  }

  async getResources() {
    return this.request('/student/resources', {
      method: 'GET',
    });
  }

  // Faculty endpoints
  async getFacultyDashboard() {
    return this.request('/faculty/dashboard', {
      method: 'GET',
    });
  }

  async createNotice(noticeData) {
    return this.request('/faculty/notices', {
      method: 'POST',
      body: noticeData,
    });
  }

  async updateNotice(id, noticeData) {
    return this.request(`/faculty/notices/${id}`, {
      method: 'PUT',
      body: noticeData,
    });
  }

  async deleteNotice(id) {
    return this.request(`/faculty/notices/${id}`, {
      method: 'DELETE',
    });
  }

  async getStudents() {
    return this.request('/faculty/students', {
      method: 'GET',
    });
  }

  async markAttendance(attendanceData) {
    return this.request('/faculty/attendance', {
      method: 'POST',
      body: attendanceData,
    });
  }
}

export default new ApiService();
