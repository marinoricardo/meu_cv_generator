pipeline {
    agent any

    environment {
        APP_NAME = "meu-cv-generator"
        APP_PORT = "3000"
        DOCKER_IMAGE = "meu-cv-generator:latest"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/marinoricardo/meu_cv_generator.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    export DOCKER_BUILDKIT=0
                    docker build -t $DOCKER_IMAGE .
                '''
            }
        }

        stage('Stop & Remove Container') {
            steps {
                sh '''
                    docker stop $APP_NAME || true
                    docker rm $APP_NAME || true
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                    docker run -d \
                      --restart always \
                      --name $APP_NAME \
                      -p $APP_PORT:$APP_PORT \
                      $DOCKER_IMAGE
                '''
            }
        }
    }
}
