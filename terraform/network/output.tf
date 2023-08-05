output "pub_subnet_id" {
  value = aws_subnet.pub.id
}

output "instance_scg_id" {
  value = aws_security_group.scg.id
}
