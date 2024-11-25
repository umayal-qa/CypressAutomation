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

        stage('Run Specific Cypress Test') {
            steps {
                script {
                    def testFile = 'cypress/integration/examples/UdemyTest.spec.js'
                    def imageTag = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
                    def image = docker.image(imageTag)

                    // Run specific Cypress test in headless mode using chrome
                    if (isUnix()) {
                        sh "docker run -v ${pwd()}:/workspace ${imageTag} npx cypress run --spec ${testFile} --headless --browser chrome"
                    } else {
                        bat "docker run -v ${pwd()}:/workspace ${imageTag} npx cypress run --spec ${testFile} --headless --browser chrome"
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Use Jenkins credentials securely to login to Docker Hub using Personal Access Token
                    withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_TOKEN')]) {
                        withEnv(["DOCKER_USER=${DOCKER_USER}", "DOCKER_TOKEN=${DOCKER_TOKEN}"]) {
                            // Run the docker login command for Windows (PowerShell)
                            bat """
                                echo %DOCKER_TOKEN% | docker login -u %DOCKER_USER% --password-stdin
                            """
                        }
                    }

                    // Tag and push the Docker image
                    def imageTag = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
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
