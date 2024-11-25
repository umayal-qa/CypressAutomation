pipeline {
    agent any

    environment {
        IMAGE_NAME = 'cypress-docker-image'
        BUILD_NUMBER = "${BUILD_NUMBER}"
        COMMIT_HASH = "${GIT_COMMIT}"
        REGISTRY = 'umayalqa/cypressautomation'
        DOCKER_CREDENTIALS_ID = 'dockerhubtoken'
        CYPRESS_ENV = 'staging'
        GIT_REPO_URL = 'https://github.com/umayal-qa/CypressAutomation.git'
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

            echo "Running Cypress tests using Docker image ${imageTag}"

            // Mount workspace and set the working directory
            docker.image("${imageTag}").inside(
                "-v /c/ProgramData/Jenkins/.jenkins/workspace/Docker_Build_Image:/app " + 
                "-w /app"
            ) {
                sh '''
                    # Set environment variable for Cypress
                    export CYPRESS_ENV=${CYPRESS_ENV}

                    # Run Cypress tests (assuming Cypress is installed in the container)
                    npx cypress run --env configFile=${CYPRESS_ENV}
                '''
            }
        }
    }
}


        stage('Push Docker Image') {
            steps {
                script {
                    def imageTag = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"

                    echo "Tagging Docker image ${imageTag} for DockerHub registry"

                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_TOKEN')]) {
                        if (isUnix()) {
                            sh """
                                echo \$DOCKER_TOKEN | docker login -u \$DOCKER_USER --password-stdin
                            """
                        } else {
                            bat """
                                echo %DOCKER_TOKEN% | docker login -u %DOCKER_USER% --password-stdin
                            """
                        }
                    }

                    // Tag and push the Docker image
                    if (isUnix()) {
                        sh "docker tag ${imageTag} ${REGISTRY}/${IMAGE_NAME}:latest"
                        sh "docker push ${REGISTRY}/${IMAGE_NAME}:latest"
                    } else {
                        bat "docker tag ${imageTag} ${REGISTRY}/${IMAGE_NAME}:latest"
                        bat "docker push ${REGISTRY}/${IMAGE_NAME}:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (isUnix()) {
                    sh 'docker system prune -f'
                } else {
                    bat 'docker system prune -f'
                }
            }
        }
        success {
            echo 'Cypress tests completed and Docker image pushed successfully.'
        }
        failure {
            echo 'Cypress tests or Docker image push failed.'
        }
    }
}
