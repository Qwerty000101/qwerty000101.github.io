import React, { useState, useRef, useEffect } from 'react';
import {
  Panel,
  Flex,
  Container,
  Typography,
  Button,
} from '@maxhub/max-ui';
import '@maxhub/max-ui/dist/styles.css';

const EventCard = ({ event, isRegistered, onRegister, onUnregister, role, onEdit, onDelete, onStats }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isFull = event.available_seats === 0;
  const instituteName = event.institute_name || 'Все институты';
  const isAdmin = role === 'admin';

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='card' style={{ marginBottom: '12px', position: 'relative', marginTop: '12px', 
    borderRadius:"20px", backgroundColor:"white"}}>
      {/* Административное меню (оставлено кастомное) */}
      {isAdmin && (
        <div ref={menuRef} style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
          <Button mode="tertiary" onClick={() => setMenuOpen(!menuOpen)}>
            ⋮
          </Button>
          {menuOpen && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              background: 'var(--max-panel-background, #dcdcdc)',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              overflow: 'hidden',
              minWidth: '140px',
            }}>
              <button onClick={() => { setMenuOpen(false); onEdit(event); }} style={menuItemStyle}>
                Редактировать
              </button>
              <button onClick={() => { setMenuOpen(false); onStats(event); }} style={menuItemStyle}>
                Статистика
              </button>
              <button onClick={() => { setMenuOpen(false); onDelete(event); }} style={{ ...menuItemStyle, color: '#ff6b6b' }}>
                Удалить
              </button>
            </div>
          )}
        </div>
      )}

      {/* Основной контент */}
      <Flex direction="column" gap={8}>
        <Container>
          <Typography.Headline variant="medium-strong" style={{ paddingRight: isAdmin ? '26px' : '0', paddingLeft:"0px"}}>
            {event.title}
          </Typography.Headline>
        </Container>

        <Typography.Body variant="small">
          {event.category_name} | {event.event_date} {event.event_time}
        </Typography.Body>

        <Typography.Body variant="small">{event.description}</Typography.Body>

        <Typography.Body variant="small">🏛️ {instituteName}</Typography.Body>

        <Typography.Body variant="small">📍 {event.location}</Typography.Body>
        <Typography.Body variant="small" style={{align:"right"}}>
            Мест: {event.available_seats} / {event.capacity}
          </Typography.Body>
        {/* Кнопки регистрации/отмены */}
          {isRegistered ? (
            <Button
            stretched
              style={{ background: '#B22222', color: 'white'}}
              onClick={() => onUnregister(event.id)}
            >
              Отменить запись
            </Button>
          ) : (
            <Button
            stretched
              disabled={isFull}
              onClick={() => onRegister(event.id)}
            >
              {isFull ? 'Мест нет' : 'Зарегистрироваться'}
            </Button>
          )}
      </Flex>
    </div>
  );
};

const menuItemStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 16px',
  background: 'none',
  border: 'none',
  color: 'var(--max-text-primary, #040404)',
  textAlign: 'left',
  cursor: 'pointer',
};

export default EventCard;