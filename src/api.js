import axios from 'axios';

// Убираем возможные пробелы и лишние символы
const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://fde1e50f-7598-4e00-a2c4-729676c2cb28.tunnel4.com').trim();
console.log('🔗 NEW API_BASE_URL:', API_BASE_URL);

// Получение userId из initDataUnsafe
function getUserId() {
  if (!window.WebApp) {
    console.warn('MAX Bridge не загружен, используется тестовый userId');
    return 94574886; // Для тестов вне MAX
  }
  const initData = window.WebApp.initDataUnsafe;
  const id = initData?.user?.id;
  console.log('👤 userId получен:', id);
  return id;
}

// Универсальный запрос
async function apiRequest(endpoint, data = {}) {
  const userId = getUserId();
  if (!userId) throw new Error('Не удалось получить userId');

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`📡 Отправка POST на ${url}`, { userId, ...data });

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

// 📌 Глобальная функция для тестирования из консоли браузера
window.testApi = async () => {
  console.log('🧪 Запуск теста API...');
  try {
    const result = await apiRequest('/events/list', {});
    console.log('✅ Тест API успешен, получено событий:', result.events?.length);
    alert(`Успешно! Получено ${result.events?.length || 0} событий.`);
  } catch (e) {
    console.error('❌ Тест API провалился:', e);
    alert(`Ошибка подключения: ${e.message}`);
  }
};