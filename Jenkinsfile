pipeline {
    agent any

    environment {
        // Define environment variables (customize as per your setup)
        IMAGE_NAME = 'cypress-docker-image'
        BUILD_NUMBER = "${GIT_COMMIT}"  // Git commit hash used as build version
        REGISTRY = 'docker.io'  // Example Docker registry (Docker Hub)
        DOCKER_CREDENTIALS_ID = 'dockerhub-creds'  // Jenkins credentials ID for Docker registry
        GIT_REPO_URL = 'https://github.com/umayal-qa/CypressAutomation.git'
    }

    stages {
        // Stage 1: Clone the repository
        stage('Clone Repository') {
            steps {
                // Checkout the code from the repository
                git branch: 'main', url: "${GIT_REPO_URL}"
            }
        }

        // Stage 2: Build Docker Image
        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image from the Dockerfile
                    docker.build("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                }
            }
        }

        // Stage 3: Run Cypress Tests in Headless Mode
        stage('Run Cypress Tests') {
            steps {
                script {
                    // Run Cypress tests in headless mode inside the container
                    def image = docker.image("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                    image.inside('--entrypoint="" --privileged') {
                        sh 'npx cypress run --headless --browser chrome'
                    }
                }
            }
        }

        // Stage 4: Push Docker Image to Registry
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
            sh 'docker system prune -f'
        }
    }
}
