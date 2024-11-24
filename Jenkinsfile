pipeline {
    agent any

    environment {
        IMAGE_NAME = 'cypress-docker-image'
        BUILD_NUMBER = "${GIT_COMMIT}"  // Git commit hash used as build version
        REGISTRY = 'docker.io'  // Docker Hub registry
        DOCKER_CREDENTIALS_ID = 'dockerhub-creds'  // Jenkins Docker credentials ID
        GIT_REPO_URL = 'https://github.com/umayal-qa/CypressAutomation.git'
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: "${GIT_REPO_URL}"
            }
        }

        stage('Check Docker Info') {
            steps {
                script {
                    // Run `docker info` to check Docker status and environment
                    sh 'docker info'
                }
            }
        }

        // Build Docker Image with no-cache option
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image using the Dockerfile, with no cache
                    sh "docker build --no-cache -t ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} ."
                }
            }
        }

        stage('Run Cypress Tests') {
            steps {
                script {
                    // Run Cypress tests in headless mode inside the container
                    def image = docker.image("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                    image.inside() {
                        // Execute Cypress tests inside the container
                        sh 'npx cypress run --headless --browser chrome'
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Log in to Docker registry using Jenkins credentials
                    docker.withRegistry('https://hub.docker.com', "${DOCKER_CREDENTIALS_ID}") {
                        // Push the Docker image to the registry
                        docker.image("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}").push()
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up Docker artifacts to avoid accumulation of unused data
            //test1
            sh 'docker system prune -f'
        }
    }
}
