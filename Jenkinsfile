pipeline {
    agent any

    environment {
        IMAGE_NAME = 'cypress-docker-image'
        BUILD_NUMBER = "${BUILD_NUMBER}"
        COMMIT_HASH = "${GIT_COMMIT}"
        REGISTRY = 'umayalqa/cypressautomation'
        DOCKER_CREDENTIALS_ID = 'dockerhubtoken'  // Jenkins credentials ID
        GIT_REPO_URL = 'https://github.com/umayal-qa/CypressAutomation.git'
        CYPRESS_ENV = 'staging'
    }

    stages {
        stage('Check Docker Info') {
            steps {
                script {
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
                    echo "Building Docker image with the following tag: ${imageTag}"

                    // Build the Docker image based on the environment (Unix or Windows)
                    if (isUnix()) {
                        sh "docker build --no-cache -t ${imageTag} ."
                    } else {
                        bat "docker build --no-cache -t ${imageTag} ."
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    def imageTag = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"

                    echo "Tagging Docker image ${imageTag} for DockerHub registry"

                    // Log in to Docker Hub using Jenkins credentials securely (via Personal Access Token)
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_TOKEN')]) {
                        if (isUnix()) {
                            // Run the docker login command for Unix-based systems (Linux/macOS)
                            sh """
                                echo \$DOCKER_TOKEN | docker login -u \$DOCKER_USER --password-stdin
                            """
                        } else {
                            // Run the docker login command for Windows-based systems
                            bat """
                                echo %DOCKER_TOKEN% | docker login -u %DOCKER_USER% --password-stdin
                            """
                        }
                    }

                    // Tag and push the Docker image (for both 'latest' and commit-specific tags)
                    if (isUnix()) {
                        sh "docker tag ${imageTag} ${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
                        sh "docker push ${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
                    } else {
                        bat "docker tag ${imageTag} ${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
                        bat "docker push ${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Clean up unused Docker images and containers after the build
                if (isUnix()) {
                    sh 'docker system prune -f'
                } else {
                    bat 'docker system prune -f'
                }
            }
        }
        success {
            echo 'Docker image pushed successfully.'
        }
        failure {
            echo 'Failed to push Docker image.'
        }
    }
}
