# Sistema de Gerenciamento de Helpdesk (TI)

Sistema completo para gerenciamento de chamados de suporte técnico, desenvolvido com arquitetura modularizada, separando responsabilidades entre Interface de Usuário, API RESTful e Persistência Relacional.

## 🏗️ Arquitetura e Stack Tecnológico

*   **Front-end:** Single Page Application (SPA) em React.js (Vite), gerenciamento de estado local e Axios para consumo de API.
*   **Back-end:** Node.js com Express.js. Implementa autenticação baseada em JWT, upload de anexos via Multer e rotas protegidas por RBAC (Role-Based Access Control).
*   **Banco de Dados:** PostgreSQL, modelado com integridade referencial para usuários, chamados e anexos.
*   **Infraestrutura:** Containers Docker orquestrados por Docker Compose (Front, Back, DB), com provisionamento de máquina virtual automatizado via Terraform.
