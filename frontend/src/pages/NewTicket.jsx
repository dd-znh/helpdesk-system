import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function NewTicket() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Média');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Usando FormData para enviar texto e o arquivo físico juntos
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('priority', priority);
    if (file) {
      formData.append('attachment', file);
    }

    try {
      await api.post('/tickets', formData);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar chamado. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', cursor: 'pointer' }}>← Voltar</button>
      
      <h2>Abrir Novo Chamado</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Título do Problema</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Descrição Detalhada</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required rows="5" style={{ width: '100%', padding: '8px' }} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Prioridade</label>
          <select value={priority} onChange={e => setPriority(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Anexar Print ou PDF (Opcional)</label>
          <input type="file" accept="image/*,application/pdf" onChange={e => setFile(e.target.files[0])} />
        </div>

        <button type="submit" style={{ padding: '10px', background: '#0056b3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
          Enviar Chamado
        </button>
      </form>
    </div>
  );
}