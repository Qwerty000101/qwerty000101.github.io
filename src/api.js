import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Получение userId из initDataUnsafe
function getUserId() {
  if (!window.WebApp) {
    console.warn('MAX Bridge не загружен, используется тестовый userId');
    return 123456; // Для тестов вне MAX
  }
  const initData = window.WebApp.initDataUnsafe;
  return initData?.user?.id;
}

// Универсальный запрос
async function apiRequest(endpoint, data = {}) {
  const userId = getUserId();
  if (!userId) throw new Error('Не удалось получить userId');

  const response = await axios.post(`${API_BASE_URL}${endpoint}`, {
    userId,
    ...data
  });
  return response.data;
}
export const usersApi = {
  getMe: () => apiRequest('/users/me'),
};
export const eventsApi = {
  getList: (filters) => apiRequest('/events/list', filters),
  getById: (eventId) => apiRequest(`/events/${eventId}`),
  register: (eventId) => apiRequest('/tickets/register', { eventId }),
};

export const ticketsApi = {
  getMy: () => apiRequest('/tickets/my'),
};

export const scanApi = {
  validate: (uuid) => apiRequest('/scan/validate', { uuid }),
};