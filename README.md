# 🛠️ Helpdesk System

Um sistema simples de gestão de chamados técnicos (Helpdesk), desenvolvido utilizando uma arquitetura baseada em microsserviços conteinerizados. O projeto fornece uma interface completa para abertura, acompanhamento e gerenciamento de tickets de suporte.

---

## 🏗️ Arquitetura e Tecnologias

O sistema separa as responsabilidades entre interface, API e persistência de dados, garantindo isolamento através do Docker:

* **Frontend:** Interface de usuário construída com React.js e Vite, servida de forma estática através do Nginx.
* **Backend:** API REST desenvolvida em Node.js (Express), responsável pela lógica de negócios, autenticação via JWT e manipulação dos dados.
* **Banco de Dados:** PostgreSQL rodando em uma rede virtual privada do Docker.
* **Infraestrutura:** Provisionamento em nuvem (AWS) gerenciado de forma declarativa através de scripts do **Terraform** (IaC).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados na sua máquina.

### Passos

1. **Clone o repositório:**
```bash
git clone [https://github.com/dd-znh/helpdesk-system.git](https://github.com/dd-znh/helpdesk-system.git)
cd helpdesk-system
```

2. **Configure as variáveis de ambiente:**
Copie o arquivo de exemplo para gerar as credenciais locais que o banco de dados e a API utilizarão:
```bash
cp backend/.env.example backend/.env
```
*(Opcional: você pode editar o arquivo `backend/.env` caso queira alterar alguma configuração padrão, como o `JWT_SECRET` ou a porta da API).*

3. **Inicie a arquitetura de contêineres:**
Na raiz do projeto, execute o comando abaixo para construir as imagens e subir todos os serviços em segundo plano:
```bash
docker compose up --build -d
```

4. **Acesse a aplicação:**
* **Interface (Frontend):** [http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)
* **API REST (Backend):** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)

---

## 🛑 Como Parar os Serviços

Para parar a execução da aplicação e desligar os contêineres sem apagar o banco de dados, execute na raiz do projeto:

```bash
docker compose stop
```

Para destruir os contêineres e remover a rede (os dados do banco serão mantidos nos volumes):

```bash
docker compose down
```