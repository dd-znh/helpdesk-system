terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

# Criação de um Grupo de Segurança (Firewall)
resource "aws_security_group" "helpdesk_sg" {
  name        = "helpdesk_sg"
  description = "Permite trafego web para o Helpdesk restrito a Intranet"

  ingress {
    description = "HTTP do Front-end (Restrito a Rede Interna)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"] # Correção CRITICAL: Restrito à intranet
  }

  ingress {
    description = "Acesso a API (Restrito a Rede Interna)"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"] # Correção CRITICAL: Restrito à intranet
  }

  egress {
    description = "Saida controlada para a Rede Interna" # Correção LOW: Adicionada descrição
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/8"] # Correção CRITICAL: Evita vazamento de dados para a internet externa
  }
}

# Provisionamento da Máquina Virtual
resource "aws_instance" "helpdesk_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu Server 22.04 LTS
  instance_type = "t2.micro"
  
  vpc_security_group_ids = [aws_security_group.helpdesk_sg.id]

  # Correção HIGH: Criptografia ativada no disco raiz
  root_block_device {
    encrypted = true
  }

  # Correção HIGH: Exige token de segurança para acessar os metadados da instância
  metadata_options {
    http_tokens = "required"
  }

  tags = {
    Name        = "Helpdesk-Production-Server"
    Environment = "Prod"
  }
}