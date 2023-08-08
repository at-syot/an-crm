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


resource "aws_ecr_repository" "crm" {
  name = "crm"
  image_tag_mutability = "MUTABLE"
}


data "aws_iam_policy_document" "assume" {
  statement {
    sid = ""
    effect = "Allow"
    actions = [
      "sts:AssumeRole"
    ]
    principals {
      type = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "policy" {
  statement {
    effect = "Allow"
    actions = [
      "ecr:*",
      "cloudtrail:LookupEvents"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "crm" {
  role = aws_iam_role.crm.id
  policy = data.aws_iam_policy_document.policy.json
  name = "crm"
}

resource "aws_iam_role" "crm" {
  name = "crm-ec2"
  assume_role_policy = data.aws_iam_policy_document.assume.json
}


resource "aws_iam_instance_profile" "crm" {
  name = "crm-ec2-instance-profile"
  role = aws_iam_role.crm.name
}

resource "aws_instance" "crm" {
  ami = "ami-053b0d53c279acc90"
  instance_type = "t2.micro"
  associate_public_ip_address = true

  iam_instance_profile = aws_iam_instance_profile.crm.name
  vpc_security_group_ids = [module.network.instance_scg_id]
  subnet_id = module.network.pub_subnet_id

  user_data = file("${path.module}/user_data.sh")
  tags = {
    Name = "crm"
  }
}

resource "aws_eip" "static" {
  instance = aws_instance.crm.id
  depends_on = [ module.network.igw ]
}