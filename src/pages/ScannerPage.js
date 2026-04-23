import React, { useState, useEffect } from 'react';
import { scanApi } from '../api';

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkedInCount, setCheckedInCount] = useState(0);

  useEffect(() => {
    // Загружаем офлайн-буфер при старте
    const stored = localStorage.getItem('checked_in_uuids');
    if (stored) {
      try {
        const uuids = JSON.parse(stored);
        setCheckedInCount(uuids.length);
      } catch (e) {
        localStorage.removeItem('checked_in_uuids');
      }
    }
    // Показываем нативную кнопку "Назад"
    if (window.WebApp) {
      window.WebApp.BackButton.show();
      window.WebApp.BackButton.onClick(() => {
        // Действие назад – переключение вкладки, реализуется в App.js через колбэк, 
        // но пока можно просто спрятать кнопку и вызвать history.back()
        window.WebApp.BackButton.hide();
        // Для простоты: ничего не делаем, т.к. управление вкладками из App
      });
    }
    return () => {
      if (window.WebApp) {
        window.WebApp.BackButton.hide();
        window.WebApp.BackButton.offClick(() => {});
      }
    };
  }, []);

  const startScan = async () => {
    if (!window.WebApp) {
      alert('Сканер доступен только внутри MAX');
      return;
    }

    setLoading(true);
    setScanResult(null);

    try {
      // Повышаем яркость и запрещаем скриншоты
      await window.WebApp.requestScreenMaxBrightness();
      window.WebApp.ScreenCapture.disableScreenCapture();
      // Предупреждение о закрытии
      window.WebApp.enableClosingConfirmation();

      // Открываем камеру (только камера, без выбора из файла)
      const { value } = await window.WebApp.openCodeReader(false);
      if (!value) {
        setScanResult({ error: 'QR-код не распознан' });
        window.WebApp.HapticFeedback.notificationOccurred('error');
        return;
      }

      // Отправляем UUID на сервер
      const result = await scanApi.validate(value);
      setScanResult(result);

      if (result.valid) {
        window.WebApp.HapticFeedback.notificationOccurred('success');
        // Сохраняем UUID в офлайн-буфер
        addToLocalBuffer(value);
      } else {
        window.WebApp.HapticFeedback.notificationOccurred('error');
      }
    } catch (err) {
      setScanResult({ error: err.message || 'Ошибка сканирования' });
      window.WebApp.HapticFeedback.notificationOccurred('error');
    } finally {
      // Восстанавливаем яркость и разрешаем скриншоты
      if (window.WebApp) {
        window.WebApp.restoreScreenBrightness();
        window.WebApp.ScreenCapture.enableScreenCapture();
        window.WebApp.disableClosingConfirmation();
      }
      setLoading(false);
    }
  };

  const addToLocalBuffer = (uuid) => {
    const stored = localStorage.getItem('checked_in_uuids');
    let uuids = stored ? JSON.parse(stored) : [];
    if (!uuids.includes(uuid)) {
      uuids.push(uuid);
      localStorage.setItem('checked_in_uuids', JSON.stringify(uuids));
      setCheckedInCount(uuids.length);
    }
  };

  return (
    <div className="scanner-page">
      <h3>Сканер билетов</h3>
      <button className="btn" onClick={startScan} disabled={loading}>
        {loading ? 'Сканирование...' : 'Отсканировать QR-код'}
      </button>
      {checkedInCount > 0 && (
        <p style={{ marginTop: '12px' }}>Отмечено сегодня: {checkedInCount}</p>
      )}

      {scanResult && (
        <div className="scan-result">
          {scanResult.valid ? (
            <div className="success">
              <p>Билет действителен</p>
              <p><strong>Посетитель:</strong> {scanResult.student.full_name}</p>
              <p><strong>Институт:</strong> {scanResult.student.institute || 'не указан'}</p>
              {scanResult.student.group && (
                <p><strong>Группа:</strong> {scanResult.student.group}</p>
              )}
              <p><strong>Мероприятие:</strong> {scanResult.event}</p>
            </div>
          ) : (
            <div className="error">
              <p>❌ {scanResult.message || 'Ошибка'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ScannerPage;