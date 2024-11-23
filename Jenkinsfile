pipeline {
    agent any

    environment {
        // Define environment variables (change as per your setup)
        IMAGE_NAME = 'cypress-docker-image'
        BUILD_NUMBER = "${GIT_COMMIT}"
        REGISTRY = 'docker.io'  // Example: Docker Hub, change if using another registry
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

        // Stage 3: Test Docker Image
        stage('Test Docker Image') {
            steps {
                script {
                    // You can add your own test or health check here.
                    // For example, running a container and checking its health.
                    def image = docker.image("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
                    image.inside {
                        // Run basic tests or health checks
                        sh 'echo "Running tests"'
                        sh 'npm install'
                        sh 'npm run headlessChromeTest'
                    }
                }
            }
        }

        // Stage 4: Push Docker Image
        stage('Push Docker Image') {
            steps {
                script {
                    // Log in to Docker registry using credentials stored in Jenkins
                    docker.withRegistry('https://hub.docker.com', "${DOCKER_CREDENTIALS_ID}") {
                        // Push the Docker image to the registry
                        docker.image("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}").push()
                    }
                }
            }
        }
    }

    // Post section: actions to be executed after the stages
    post {
        always {
            // Clean up after the job (optional)
            sh 'docker system prune -f'
        }
    }
}
