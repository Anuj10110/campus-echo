// For network access, use the actual backend URL from environment or auto-detect
function getAPIBaseURL() {
  // 1. Check if explicitly set in environment
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // 2. In development, try to detect if accessing from another machine
  if (import.meta.env.DEV) {
    // If the current host is not localhost, use direct URL to backend
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      // Accessing from another machine on the network
      return `http://${hostname}:5000/api`;
    }
  }
  
  // 3. Default to proxy for localhost
  return '/api';
}

const API_BASE_URL = getAPIBaseURL();

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    console.log('[API] Using base URL:', this.baseURL);
    this.accessToken = null;
    // IMPORTANT: don't name this "refreshToken" (it would shadow the refreshToken() method)
    this.refreshTokenValue = null;
  }

  setAccessToken(token) {
    this.accessToken = token;
    if (token) {
      sessionStorage.setItem('accessToken', token);
    }
  }

  getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = sessionStorage.getItem('accessToken');
    }
    return this.accessToken;
  }

  setRefreshToken(token) {
    this.refreshTokenValue = token;
    if (token) {
      localStorage.setItem('refreshToken', token);
    }
  }

  getRefreshToken() {
    if (!this.refreshTokenValue) {
      this.refreshTokenValue = localStorage.getItem('refreshToken');
    }
    return this.refreshTokenValue;
  }

  clearAccessToken() {
    this.accessToken = null;
    sessionStorage.removeItem('accessToken');
  }

  clearRefreshToken() {
    this.refreshTokenValue = null;
    localStorage.removeItem('refreshToken');
  }

  clearAll() {
    this.clearAccessToken();
    this.clearRefreshToken();
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const isFormData =
      typeof FormData !== 'undefined' && options.body instanceof FormData;

    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    };

    const accessToken = this.getAccessToken();
    if (accessToken && !options.skipAuth) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const config = {
      ...options,
      headers,
      credentials: 'include', // Include cookies for refresh token
    };

    if (isFormData) {
      // Let the browser set multipart boundaries.
      config.body = options.body;
    } else if (options.body && typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    }

    try {
      console.log('[API] Requesting:', url, config);
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
            const newAccessToken = this.getAccessToken();
            if (newAccessToken && !options.skipAuth) {
              retryHeaders.Authorization = `Bearer ${newAccessToken}`;
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
          this.clearAll();
        }
      }

      if (!response.ok) {
        throw { status: response.status, ...data };
      }

      return data;
    } catch (error) {
      console.error('[API] Error fetching', url, ':', error);
      if (error instanceof TypeError) {
        // Network error or CORS issue
        console.error('[API] Network/CORS Error - Is backend running at', url, '?');
        throw {
          message: `Failed to connect to server at ${url}. Is the backend running?`,
          originalError: error
        };
      }
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
      if (response.data.refreshToken) {
        this.setRefreshToken(response.data.refreshToken);
      }
    }

    return response;
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    });

    this.clearAll();
    return response;
  }

  async refreshToken() {
    const storedRefreshToken = this.getRefreshToken();
    const response = await this.request('/auth/refresh', {
      method: 'POST',
      body: storedRefreshToken ? { refreshToken: storedRefreshToken } : {},
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

  // Voice endpoints
  async processVoiceQuery(query) {
    return this.request('/voice/query', {
      method: 'POST',
      body: { query },
    });
  }

  async transcribeAudio(audioBlob, filename = 'recording.webm') {
    const formData = new FormData();
    formData.append('audio', audioBlob, filename);

    return this.request('/voice/transcribe', {
      method: 'POST',
      body: formData,
    });
  }

  async getVoiceHistory() {
    return this.request('/voice/history', {
      method: 'GET',
    });
  }
}

export default new ApiService();
