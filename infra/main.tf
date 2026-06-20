# Este arquivo define o provisionamento na nuvem (AWS) utilizando Terraform.
# O foco principal é a definição estrita de regras de rede (Hardening) apontadas
# durante os testes de segurança do tfsec.

# [...] provider e terraform blocks [...]

resource "aws_security_group" "helpdesk_sg" {
  name        = "helpdesk_sg"
  description = "Controle de trafego web para o sistema de Helpdesk"

  # INGRESS: Regras de Entrada
  # CORREÇÃO DE SEGURANÇA (tfsec): Acesso restrito à Intranet (10.0.0.0/8).
  # Evita exposição pública indiscriminada (0.0.0.0/0) das portas 80 e 3000.
  ingress {
    description = "HTTP do Front-end (Restrito a Rede Interna)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"] 
  }
  
  # EGRESS: Regras de Saída
  # Impede que a máquina faça requisições externas para IPs desconhecidos,
  # mitigando vazamento de dados em caso de invasão.
  egress {
    description = "Saida controlada restrita a Rede Interna"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/8"]
  }
}

resource "aws_instance" "helpdesk_server" {
  # [...] ami e tipo [...]

  # CORREÇÃO DE SEGURANÇA (tfsec): Ativação obrigatória de criptografia de dados
  # em repouso (At-Rest Encryption) no volume raiz da instância.
  root_block_device {
    encrypted = true
  }

  # CORREÇÃO DE SEGURANÇA (tfsec): Mitigação contra roubo de credenciais via SSRF.
  # Exige uso de token (IMDSv2) para acessar os metadados da instância AWS.
  metadata_options {
    http_tokens = "required"
  }
}