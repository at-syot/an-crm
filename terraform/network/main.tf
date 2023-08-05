resource "aws_vpc" "anp" {
  cidr_block = "145.0.0.0/16"
  tags = {
    Name = "crm-vpc"
    Project = "crm"
  }
}

resource "aws_subnet" "pub" {
  vpc_id = aws_vpc.anp.id
  cidr_block = "145.0.1.0/24"
  tags = {
    Name = "pub-subnet"
    Project = "crm"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.anp.id
  tags = {
    Name = "crm-igw"
    Project = "crm"
  }
}

resource "aws_route_table" "rt" {
  vpc_id = aws_vpc.anp.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "rt"
    Project = "crm"
  }
}

resource "aws_route_table_association" "rt-assoc" {
  route_table_id = aws_route_table.rt.id
  subnet_id = aws_subnet.pub.id
}

resource "aws_security_group" "scg" {
  vpc_id = aws_vpc.anp.id
  name = "instance-scg"

  ingress {
    from_port = 80
    to_port = 80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "instance-scg"
  }
}