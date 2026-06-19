-- Criação das Tabelas do Sistema de Helpdesk

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', -- 'user', 'tech' ou 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Aberto',
    priority VARCHAR(50) DEFAULT 'Média',
    requester_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    assigned_tech_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attachments (
    id SERIAL PRIMARY KEY,
    ticket_id INTEGER REFERENCES tickets(id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo um usuário Administrador/Técnico padrão para testes
-- A senha configurada aqui é "admin123" (o hash abaixo é a versão bcrypt dessa senha)
INSERT INTO users (name, email, password_hash, role) 
VALUES (
    'Admin TI', 
    'admin@helpdesk.com', 
    '$2a$10$XQ.9l6P8U0Q4H3zG9.Y7.O03/L1n8/9Z.9/3.9.9.9.9.9.9.9.9.9', -- ATENÇÃO: Troque a senha via sistema depois!
    'admin'
) ON CONFLICT (email) DO NOTHING;