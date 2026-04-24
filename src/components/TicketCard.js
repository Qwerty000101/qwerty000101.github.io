import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ticketsApi } from '../api';
import {
  Panel,
  Flex,
  Container,
  Typography,
  Button,
} from '@maxhub/max-ui';
import '@maxhub/max-ui/dist/styles.css';

const TicketCard = ({ ticket, onCancel }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (ticket.uuid) {
      QRCode.toDataURL(ticket.uuid, { width: 200, margin: 1 })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [ticket.uuid]);

  const handleCancel = async () => {
    if (!window.confirm('Удалить билет?')) return;
    setDeleting(true);
    try {
      await ticketsApi.cancel(ticket.uuid);
      if (onCancel) onCancel(); // перезагрузить список
    } catch (err) {
      alert('Ошибка: ' + (err.response?.data?.error || err.message));
    } finally {
      setDeleting(false);
    }
  };

  const statusColor = ticket.status === 'registered' ? '#4caf50' : ticket.status === 'checked_in' ? '#2196f3' : '#999';
  const statusText = ticket.status === 'registered' ? 'Активен' : ticket.status === 'checked_in' ? 'Отмечен' : 'Отменён';

  return (
    <div className="card">
      <Typography.Title>{ticket.title}</Typography.Title>
      <p className="caption">{ticket.event_date} {ticket.event_time}</p>
      <p>📍 {ticket.location}</p>
      <div className="qr-code">
        {qrDataUrl && <img src={qrDataUrl} alt="QR-код билета" style={{ maxWidth: '200px' }} />}
      </div>

      <div style={{ color: statusColor, marginTop:"8px", marginBottom:"8px"}}>Статус: {statusText}</div>
      <div className="caption" style={{ marginBottom:"8px"}}>UUID: {ticket.uuid}</div>

  
      {ticket.status !== 'cancelled' && (
        <Button stretched onClick={handleCancel} disabled={deleting} style={{ marginTop: '8px', background: '#d32f2f' }}>
          {deleting ? 'Удаление...' : 'Удалить билет'}
        </Button>
      )}
    </div>
  );
};

export default TicketCard;