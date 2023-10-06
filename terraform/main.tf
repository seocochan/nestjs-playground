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
    bucket = "example-tfstate"
    key    = "terraform.tfstate"
    region = "ap-northeast-2"
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
  name        = "tf_batch"
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
  name = "tf_aws_batch_service_role"
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
  name = "tf_ecs_task_execution_role"
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

resource "aws_iam_policy" "scheduler_batch_policy" {
  name = "tf_scheduler_batch_policy"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : [
          "batch:SubmitJob",
          "batch:DescribeJobs",
          "batch:TerminateJob"
        ],
        "Resource" : "*",
        "Effect" : "Allow"
      },
      {
        "Action" : [
          "events:PutTargets",
          "events:PutRule",
          "events:DescribeRule"
        ],
        "Resource" : [
          "*"
        ],
        "Effect" : "Allow"
      }
    ]
    }
  )
}

resource "aws_iam_role" "scheduler_batch_role" {
  name                = "tf_scheduler_batch_role"
  managed_policy_arns = [aws_iam_policy.scheduler_batch_policy.arn]

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "scheduler.amazonaws.com"
        }
      },
    ]
  })
}

resource "aws_batch_compute_environment" "batch" {
  compute_environment_name = "tf_example_compute_env"

  compute_resources {
    max_vcpus = 256
    security_group_ids = [
      aws_security_group.batch.id,
    ]
    subnets = data.aws_subnets.all_default_subnets.ids
    type    = "FARGATE"
  }
  service_role = aws_iam_role.aws_batch_service_role.arn
  type         = "MANAGED"
  depends_on = [
    aws_iam_role_policy_attachment.aws_batch_service_role
  ]
}

resource "aws_batch_job_queue" "batch" {
  name     = "tf_example_job_queue"
  state    = "ENABLED"
  priority = "0"
  compute_environments = [
    aws_batch_compute_environment.batch.arn,
  ]
}

resource "aws_batch_job_definition" "batch" {
  name = "tf_example_job_definition"
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

resource "aws_scheduler_schedule" "batch" {
  name  = "tf_batch_submit_job_schedule"
  state = "ENABLED"

  flexible_time_window {
    mode = "OFF"
  }

  schedule_expression          = "rate(5 minutes)"
  schedule_expression_timezone = "Asia/Seoul"
  description                  = "submitJob Batch event"

  target {
    arn      = "arn:aws:scheduler:::aws-sdk:batch:submitJob"
    role_arn = aws_iam_role.scheduler_batch_role.arn

    input = jsonencode({
      "JobName" : "scheduled_job",
      "JobDefinition" : replace(aws_batch_job_definition.batch.arn, "/:\\d+$/", ""),
      "JobQueue" : aws_batch_job_queue.batch.arn
    })
  }
}