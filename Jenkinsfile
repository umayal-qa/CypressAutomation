pipeline {
    agent any
    environment {
        IMAGE_NAME = 'cypress-docker-image'
        BUILD_NUMBER = "${BUILD_NUMBER}"
        COMMIT_HASH = "${GIT_COMMIT}"
        REGISTRY = 'umayalqa/cypressautomation'
        DOCKER_CREDENTIALS_ID = 'dockerhub-creds'
        GIT_REPO_URL = 'https://github.com/umayal-qa/CypressAutomation.git'
        CYPRESS_ENV = 'staging'
    }
    stages {
        stage('Check Docker Info') {
            steps {
                script {
                    // Determine platform dynamically
                    def dockerInfo
                    if (isUnix()) {
                        dockerInfo = sh(script: 'docker info', returnStdout: true).trim()
                    } else {
                        dockerInfo = bat(script: 'docker info', returnStdout: true).trim()
                    }
                    echo "Docker Info: \n${dockerInfo}"
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    def imageTag = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
                    
                    // Debug: Print environment variables to ensure they are set correctly
                    echo "Building Docker image with the following tag: ${imageTag}"
                    echo "REGISTRY: ${REGISTRY}"
                    echo "IMAGE_NAME: ${IMAGE_NAME}"
                    echo "COMMIT_HASH: ${COMMIT_HASH}"
                    echo "BUILD_NUMBER: ${BUILD_NUMBER}"
                    
                    // Build the image depending on the platform
                    if (isUnix()) {
                        sh "docker build --no-cache -t ${imageTag} ."
                    } else {
                        bat "docker build --no-cache -t ${imageTag} ."
                    }
                }
            }
        }

        stage('Run Cypress Tests') {
            steps {
                script {
                    def imageTag = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
                    def image = docker.image(imageTag)
                    // Manually run the container with necessary options if `docker.inside()` is problematic.
                    if (isUnix()) {
                        sh "docker run -v ${pwd()}:/workspace ${imageTag} npx run udemytest --headless --browser chrome --env environment=staging"
                    } else {
                        bat "docker run -v ${pwd()}:/workspace ${imageTag} npx run udemytest --headless --browser chrome --env environment=staging"
                    }
                }
            }
        }

        // Corrected the placement of the 'Push Docker Image' stage
        stage('Push Docker Image') {
            steps {
                script {
                    def imageTag = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"

                    // Push Docker image logic
                    echo "Tagging Docker image ${imageTag} for DockerHub registry"

                    // Using Jenkins credentials securely for Docker login
                    if (isUnix()) {
                        // Login using Jenkins credentials securely
                        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh "docker login -u $DOCKER_USER -p $DOCKER_PASS"
                        }

                        // Tagging the Docker image
                        sh "docker tag ${imageTag} umayalqa/pythonapi:pythonframe"

                        // Push the tagged image
                        sh "docker push umayalqa/pythonapi:pythonframe"
                    } else {
                        // For Windows, similar logic can be applied
                        bat "docker login -u ${DOCKER_CREDENTIALS_ID} -p $(cat /path/to/password/file)"
                        bat "docker tag ${imageTag} umayalqa/pythonapi:pythonframe"
                        bat "docker push umayalqa/pythonapi:pythonframe"
                    }
                }
            }
        }

    }

    post {
        always {
            script {
                // Clean up Docker artifacts to avoid accumulation of unused data
                if (isUnix()) {
                    sh 'docker system prune -f'
                } else {
                    bat 'docker system prune -f'
                }
            }
        }
        success {
            echo 'Tests passed, Docker image pushed successfully.'
        }
        failure {
            echo 'Tests failed, Docker image pushed successfully.'
        }
    }
}
