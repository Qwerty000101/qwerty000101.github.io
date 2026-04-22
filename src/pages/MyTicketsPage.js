import React, { useState, useEffect } from 'react';
import { ticketsApi } from '../api';
import TicketCard from '../components/TicketCard';

const MyTicketsPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ticketsApi.getMy()
      .then(data => {
        setTickets(data.tickets || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="spinner"></div>;
  if (tickets.length === 0) {
    return <div className="empty-message">У вас пока нет билетов. Зарегистрируйтесь на мероприятие в разделе «Афиша».</div>;
  }

  return (
    <div>
      {tickets.map(ticket => (
        <TicketCard key={ticket.uuid} ticket={ticket} />
      ))}
    </div>
  );
};

export default MyTicketsPage;