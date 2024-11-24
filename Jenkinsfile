pipeline {
    agent any

    environment {
        IMAGE_NAME = 'cypress-docker-image'
        BUILD_NUMBER = "${BUILD_NUMBER}"  // Use Jenkins build number as usual
        COMMIT_HASH = "${GIT_COMMIT}"  // Store the Git commit hash
        REGISTRY = 'docker.io'
        DOCKER_CREDENTIALS_ID = 'dockerhub-creds'
        GIT_REPO_URL = 'https://github.com/umayal-qa/CypressAutomation.git'
        CYPRESS_ENV = 'staging'
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

        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
                    // Build the Docker image using the Dockerfile, with no cache
                    sh "docker build --no-cache -t ${imageTag} ."
                }
            }
        }

        stage('Run Cypress Tests') {
            steps {
                script {
                    def imageTag = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
                    def image = docker.image(imageTag)
                    image.inside() {
                        if (isUnix()) {
                            // Run Cypress tests in the foreground on Unix-like systems (Linux/MacOS)
                            sh 'npx cypress run --headless --browser chrome --env environment=${CYPRESS_ENV}'
                        } else if (isWindows()) {
                            // Run Cypress tests in the foreground on Windows
                            bat 'npx cypress run --headless --browser chrome --env environment=${CYPRESS_ENV}'
                        }
                    }
                }
            }
        }

        stage('Push Docker Image') {
            when {
                allOf {
                    branch 'main'
                    expression { currentBuild.result == 'SUCCESS' }
                }
            }
            steps {
                script {
                    docker.withRegistry('https://hub.docker.com', "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}").push()
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
        success {
            echo 'Tests passed, Docker image pushed successfully.'
        }
        failure {
            echo 'Tests failed, Docker image not pushed.'
        }
    }
}
