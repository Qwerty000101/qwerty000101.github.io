import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const TicketCard = ({ ticket }) => {
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (ticket.uuid) {
      QRCode.toDataURL(ticket.uuid, { width: 200, margin: 1 })
        .then(url => setQrDataUrl(url))
        .catch(err => console.error(err));
    }
  }, [ticket.uuid]);

  const statusColor = ticket.status === 'registered' ? '#4caf50' : '#2196f3';
  const statusText = ticket.status === 'registered' ? 'Активен' : 'Отмечен';

  return (
    <div className="card">
      <h3>{ticket.title}</h3>
      <p className="caption">{ticket.event_date} {ticket.event_time}</p>
      <p>📍 {ticket.location}</p>
      <div className="qr-code">
        {qrDataUrl && <img src={qrDataUrl} alt="QR-код билета" style={{ maxWidth: '200px' }} />}
      </div>
      <div className="ticket-footer">
        <span style={{ color: statusColor }}>Статус: {statusText}</span>
        <span className="caption">UUID: {ticket.uuid}</span>
      </div>
    </div>
  );
};

export default TicketCard;