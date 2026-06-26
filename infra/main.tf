resource "aws_security_group" "helpdesk_sg" {
  name        = "helpdesk_sg"
  description = "Controle de trafego web para o sistema de Helpdesk"

  ingress {
    description = "HTTP do Front-end (Restrito a Rede Interna)"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/8"] 
  }

  egress {
    description = "Saida controlada restrita a Rede Interna"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/8"]
  }
}

resource "aws_instance" "helpdesk_server" {

  root_block_device {
    encrypted = true
  }

  metadata_options {
    http_tokens = "required"
  }
}