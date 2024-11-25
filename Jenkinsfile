pipeline {
    agent any

    environment {
        IMAGE_NAME = 'cypress-docker-image'
        BUILD_NUMBER = "${BUILD_NUMBER}"
        COMMIT_HASH = "${GIT_COMMIT}"
        REGISTRY = 'cypressautomation'
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
                    // def imageTag = "${REGISTRY}/${IMAGE_NAME}:${COMMIT_HASH}-${BUILD_NUMBER}"
                    // def image = docker.image(imageTag)

                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials-id') {
                        def image = docker.build("umayalqa/cypressautomation:latest")
                        image.push()
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
