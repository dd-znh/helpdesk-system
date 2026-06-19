require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve os arquivos estáticos de upload para acesso (prints/anexos)
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Prefixando todas as rotas da aplicação
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Helpdesk HTTP rodando perfeitamente na porta ${PORT}`);
});
