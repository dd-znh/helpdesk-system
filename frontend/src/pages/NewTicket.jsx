import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('@Helpdesk:user'));

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await api.get('/tickets');
      setTickets(response.data);
    } catch (err) {
      console.error('Erro ao carregar chamados', err);
      if (err.response?.status === 401) handleLogout();
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/tickets/${id}`, { status: newStatus });
      loadTickets(); // Recarrega a lista após atualizar
    } catch (err) {
      alert('Erro ao atualizar status. Verifique se você tem permissão.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('@Helpdesk:token');
    localStorage.removeItem('@Helpdesk:user');
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Dashboard de Chamados</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Olá, {user?.name} ({user?.role})</span>
          <button onClick={() => navigate('/new-ticket')} style={{ padding: '8px 15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
            + Novo Chamado
          </button>
          <button onClick={handleLogout} style={{ padding: '8px 15px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Sair
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {tickets.length === 0 && <p>Nenhum chamado encontrado.</p>}
        {tickets.map(ticket => (
          <div key={ticket.id} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', background: '#fafafa' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>#{ticket.id} - {ticket.title}</h3>
              <span style={{ fontWeight: 'bold', color: ticket.status === 'Aberto' ? '#d9534f' : '#5cb85c' }}>
                {ticket.status}
              </span>
            </div>
            <p style={{ color: '#555' }}>{ticket.description}</p>
            <div style={{ fontSize: '13px', color: '#777', marginTop: '10px' }}>
              <strong>Prioridade:</strong> {ticket.priority} | <strong>Solicitante:</strong> {ticket.requester_name}
            </div>
            
            {/* Exibe link do anexo se existir */}
            {ticket.attachment_url && (
              <div style={{ marginTop: '10px' }}>
                <a href={`http://localhost:3000${ticket.attachment_url}`} target="_blank" rel="noreferrer" style={{ color: '#0056b3' }}>
                  📎 Ver Anexo Original
                </a>
              </div>
            )}

            {/* Ações de Técnico/Admin */}
            {user?.role !== 'user' && ticket.status !== 'Fechado' && (
              <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <button onClick={() => updateStatus(ticket.id, 'Em Andamento')} style={{ marginRight: '10px', cursor: 'pointer' }}>Mover para Em Andamento</button>
                <button onClick={() => updateStatus(ticket.id, 'Fechado')} style={{ cursor: 'pointer' }}>Marcar como Fechado</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}