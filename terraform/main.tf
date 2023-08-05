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

module "network" {
  source = "./network"
}

resource "aws_instance" "crm" {
  ami = "ami-053b0d53c279acc90"
  instance_type = "t2.micro"
  associate_public_ip_address = true

  vpc_security_group_ids = [module.network.instance_scg_id]
  subnet_id = module.network.pub_subnet_id

  user_data = file("${path.module}/user_data.sh")
  tags = {
    Name = "crm"
  }
}