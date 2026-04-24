import axios from 'axios';

// URL вашего туннеля (без пробела!)
const API_BASE_URL = (process.env.REACT_APP_API_URL || '5.42.126.192/api').trim();

// Тестовый ID, который будет использован при отсутствии реальной сессии MAX
const TEST_USER_ID = 123456;

// Получение userId с гарантированным значением
function getUserId() {
  let id = null;
  if (window.WebApp && window.WebApp.initDataUnsafe) {
    id = window.WebApp.initDataUnsafe.user?.id;
  }
  if (!id) {
    console.warn('MAX Bridge не загружен или userId отсутствует, используется тестовый', TEST_USER_ID);
    return TEST_USER_ID;
  }
  console.log('👤 userId получен:', id);
  return id;
}

async function apiRequest(endpoint, data = {}) {
  const userId = getUserId();
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`📡 POST ${url}`, { userId, ...data });

  try {
    const response = await axios.post(url, { userId, ...data });
    console.log(`✅ Ответ от ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Ошибка запроса к ${endpoint}:`, error);
    throw error;
  }
}

export const usersApi = {
  getMe: () => apiRequest('/users/me'),
  updateProfile: (data) => apiRequest('/users/update', data),
};
export const eventsApi = {
  getList: (filters) => apiRequest('/events/list', filters),
  getById: (eventId) => apiRequest(`/events/${eventId}`),
  register: (eventId) => apiRequest('/tickets/register', { eventId }),
  create: (data) => apiRequest('/events/create', data),
  update: (data) => apiRequest('/events/update', data),
  delete: (id) => apiRequest('/events/delete', { id }),
  stats: (eventId) => apiRequest('/events/stats', { eventId }),
  exportXlsx: (eventId) => apiRequest('/events/export_xlsx', { eventId }),
  participants: (eventId) => apiRequest('/events/participants', { eventId }),
};
export const ticketsApi = {
  getMy: () => apiRequest('/tickets/my'),
  cancel: (uuid) => apiRequest('/tickets/cancel', { uuid }),
};
export const scanApi = {
  validate: (uuid) => apiRequest('/scan/validate', { uuid }),
};
export const categoriesApi = {
  getList: () => apiRequest('/categories'),
};
export const institutesApi = {
  getList: () => apiRequest('/institutes'),
};
