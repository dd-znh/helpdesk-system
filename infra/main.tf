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
  description = "Permite trafego web para o Helpdesk"

  ingress {
    description = "HTTP do Front-end"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Acesso a API (Backend)"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Provisionamento da Máquina Virtual
resource "aws_instance" "helpdesk_server" {
  ami           = "ami-0c7217cdde317cfec" # Ubuntu Server 22.04 LTS
  instance_type = "t2.micro"
  
  vpc_security_group_ids = [aws_security_group.helpdesk_sg.id]

  tags = {
    Name        = "Helpdesk-Production-Server"
    Environment = "Prod"
  }
}