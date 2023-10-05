terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0"
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
}

terraform {
  backend "s3" {
    bucket         = "example-tfstate"
    key            = "terraform.tfstate"
    region         = "ap-northeast-2"
  }
}

data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "all_default_subnets" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "batch" {
  name        = "batch"
  vpc_id      = data.aws_vpc.default.id
  description = "batch VPC security group"

  egress {
    from_port = 0
    to_port   = 0
    protocol  = "-1"
    cidr_blocks = [
      "0.0.0.0/0",
    ]
  }
}

resource "aws_iam_role" "aws_batch_service_role" {
  name = "aws_batch_service_role"
  assume_role_policy = jsonencode({
    Version : "2012-10-17",
    Statement : [{
      Action : "sts:AssumeRole",
      Effect : "Allow",
      Principal : {
        Service : "batch.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "aws_batch_service_role" {
  role       = aws_iam_role.aws_batch_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSBatchServiceRole"
}

resource "aws_iam_role" "aws_ecs_task_execution_role" {
  name = "ecs_task_execution_role"
  assume_role_policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        Sid : "",
        Effect : "Allow",
        Principal : {
          Service : "ecs-tasks.amazonaws.com"
        },
        Action : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "aws_ecs_task_execution_role" {
  role       = aws_iam_role.aws_ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

resource "aws_batch_compute_environment" "batch" {
  compute_environment_name = "example_compute_env"

  compute_resources {
    max_vcpus = 256
    security_group_ids = [
      aws_security_group.batch.id,
    ]
    subnets = data.aws_subnets.all_default_subnets.ids
    type = "FARGATE"
  }
  service_role = aws_iam_role.aws_batch_service_role.arn
  type         = "MANAGED"
  depends_on = [
    aws_iam_role_policy_attachment.aws_batch_service_role
  ]
}

resource "aws_batch_job_queue" "batch" {
  name     = "example_job_queue"
  state    = "ENABLED"
  priority = "0"
  compute_environments = [
    aws_batch_compute_environment.batch.arn,
  ]
}

resource "aws_batch_job_definition" "batch" {
  name = "example_job_definition_temp" # TODO: 원복
  type = "container"
  platform_capabilities = [
    "FARGATE",
  ]
  container_properties = jsonencode({
    command = ["echo", "uwu"]
    image   = "busybox"
    fargatePlatformConfiguration = {
      platformVersion = "LATEST"
    }
    networkConfiguration = {
      assignPublicIp = "ENABLED"
    }
    resourceRequirements = [
      {
        type  = "VCPU"
        value = "0.25"
      },
      {
        type  = "MEMORY"
        value = "512"
      }
    ]
    executionRoleArn = aws_iam_role.aws_ecs_task_execution_role.arn
  })
}