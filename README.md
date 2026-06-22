# 🛡️ DevSecOps Helpdesk System

Um sistema de gestão de chamados técnicos (Helpdesk) baseado em microsserviços, desenvolvido com o propósito de demonstrar a implementação prática de uma esteira **DevSecOps** completa. Este projeto integra ferramentas de segurança contínua (CI/CD) para garantir a identificação e mitigação de vulnerabilidades desde o código-fonte até à infraestrutura em nuvem.

---

## 🏗️ Arquitetura do Sistema

A aplicação adota uma arquitetura de microsserviços separando responsabilidades entre interface, API e base de dados, garantindo isolamento através de contentores Docker.

* **Frontend:** React.js construído com Vite e servido através de um servidor **Nginx** otimizado e seguro.
* **Backend:** API REST desenvolvida em Node.js (Express), com autenticação JWT e rotinas de gestão de chamados.
* **Base de Dados:** PostgreSQL isolado em rede virtual privada (Docker).
* **Infraestrutura Cloud:** Provisionamento simulado na AWS (EC2, Security Groups) gerido através de **Terraform** (IaC).

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.

### Passos

1. Clone o repositório:
```bash
   git clone https://github.com/dd-znh/helpdesk-system.git
   cd helpdesk-system
```

2. Configure as variáveis de ambiente:
Navegue até à pasta `backend`, copie o ficheiro de exemplo e configure os dados (para uso local):
```bash
cp backend/.env.example backend/.env
```


3. Inicie a arquitetura de contentores:
```bash
docker compose up --build -d
```


4. Aceda aos serviços:
* **Interface (Frontend):** `http://localhost:5173`
* **API (Backend):** `http://localhost:3000`



---
