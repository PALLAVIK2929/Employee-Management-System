const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const handleResponse = async (res) => {
  if (!res.ok) {
    let errorMessage = `API Error: ${res.status}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.detail || errorData.message || errorMessage;
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage.map(e => e.msg).join(', ');
      }
    } catch (e) {
      // Fallback if JSON parsing fails
    }
    throw new Error(errorMessage);
  }
  return res.json();
};

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

export const api = {
  login: async (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('grant_type', 'password');

    const response = await fetch(`${API_BASE_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  getEmployees: () => request('/employees/'),
  createEmployee: (data) => request('/employees/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateEmployee: (id, data) => request(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteEmployee: (id) => request(`/employees/${id}`, {
    method: 'DELETE',
  }),
  bulkCreateEmployees: (employees) => request('/employees/bulk', {
    method: 'POST',
    body: JSON.stringify({ employees }),
  }),
  getDepartments: () => request('/departments/'),
  createDepartment: (data) => request('/departments/', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateDepartment: (id, data) => request(`/departments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteDepartment: (id) => request(`/departments/${id}`, {
    method: 'DELETE',
  }),
  sendMessage: (message, useMcp = false) => request('/chat/', {
    method: 'POST',
    body: JSON.stringify({ message, use_mcp: useMcp }),
  }),
  generateOnboardingPlan: (role, skills) => request('/onboarding/generate', {
    method: 'POST',
    body: JSON.stringify({ role, skills }),
  }),
  listMcpTools: () => request('/mcp/api/tools'),
  callMcpTool: (name, args = {}) => request('/mcp/api/call', {
    method: 'POST',
    body: JSON.stringify({ name, arguments: args }),
  }),
};
