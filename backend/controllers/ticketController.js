const db = require('../config/database');

const TicketController = {
  async create(req, res) {
    const { title, description, priority } = req.body;
    const requester_id = req.userId; // Capturado do middleware de autenticação

    try {
      const ticketResult = await db.query(
        'INSERT INTO tickets (title, description, priority, requester_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, description, priority || 'Média', requester_id]
      );
      const ticket = ticketResult.rows[0];

      // Se houver anexo, insere na tabela de attachments
      if (req.file) {
        const filePath = `/uploads/${req.file.filename}`;
        await db.query(
          'INSERT INTO attachments (ticket_id, file_path) VALUES ($1, $2)',
          [ticket.id, filePath]
        );
        ticket.attachment = filePath;
      }

      return res.status(201).json(ticket);
    } catch (err) {
      console.error('❌ ERRO NO BACKEND (Create Ticket):', err);
      return res.status(500).json({ error: 'Erro ao criar chamado: ' + err.message });
    }
  },

  async listAll(req, res) {
    try {
      let queryText = `
        SELECT t.*, u.name as requester_name, tech.name as tech_name, a.file_path as attachment_url
        FROM tickets t
        LEFT JOIN users u ON t.requester_id = u.id
        LEFT JOIN users tech ON t.assigned_tech_id = tech.id
        LEFT JOIN attachments a ON a.ticket_id = t.id
      `;
      
      let params = [];

      // Se o usuário logado for comum ('user'), ele só vê os chamados dele
      if (req.userRole === 'user') {
        queryText += ' WHERE t.requester_id = $1';
        params.push(req.userId);
      }

      queryText += ' ORDER BY t.created_at DESC';

      const result = await db.query(queryText, params);
      return res.json(result.rows);
    } catch (err) {
      console.error('❌ ERRO NO BACKEND (List Tickets):', err);
      return res.status(500).json({ error: 'Erro ao listar chamados: ' + err.message });
    }
  },

  async updateStatus(req, res) {
    const { id } = req.params;
    const { status, assigned_tech_id } = req.body;

    try {
      if (req.userRole === 'user') {
        return res.status(403).json({ error: 'Operação não permitida para o seu nível de acesso.' });
      }

      let updateFields = [];
      let params = [];
      let index = 1;

      if (status) {
        updateFields.push(`status = $${index}`);
        params.push(status);
        index++;
      }

      if (assigned_tech_id) {
        updateFields.push(`assigned_tech_id = $${index}`);
        params.push(assigned_tech_id);
        index++;
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ error: 'Nenhum dado informado para atualização.' });
      }

      params.push(id);
      const queryText = `UPDATE tickets SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${index} RETURNING *`;

      const result = await db.query(queryText, params);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Chamado não encontrado.' });
      }

      return res.json(result.rows[0]);
    } catch (err) {
      console.error('❌ ERRO NO BACKEND (Update Ticket):', err);
      return res.status(500).json({ error: 'Erro ao atualizar chamado: ' + err.message });
    }
  }
};

module.exports = TicketController;
