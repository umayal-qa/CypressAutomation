pipeline {
    agent any
    environment {
        IMAGE_NAME = 'cypress-docker-image'
        BUILD_NUMBER = "${BUILD_NUMBER}"
        COMMIT_HASH = "${GIT_COMMIT}"
        REGISTRY = 'docker.io'
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
                    
                    // Mount workspace with proper path for Windows
                    def workspaceVolume = isUnix() ? "/workspace" : "/c/ProgramData/Jenkins/.jenkins/workspace/Docker_Build_Image"
                    
                    image.inside("-v ${workspaceVolume}:${workspaceVolume}") {
                        if (isUnix()) {
                            // Run Cypress tests on Unix-like systems (Linux/MacOS)
                            sh 'npx cypress run --headless --browser chrome --env environment=${CYPRESS_ENV}'
                        } else {
                            // Run Cypress tests on Windows
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
                    docker.withRegistry('docker.io', "${DOCKER_CREDENTIALS_ID}") {
                        docker.image("${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}").push()
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
            echo 'Tests failed, Docker image not pushed.'
        }
    }
}
