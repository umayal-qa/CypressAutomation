pipeline {
    agent any

    environment {
        IMAGE_NAME = 'cypress-docker-image'
        BUILD_NUMBER = "${GIT_COMMIT}"  // Git commit hash used as build version
        REGISTRY = 'docker.io'  // Docker Hub registry
        DOCKER_CREDENTIALS_ID = 'dockerhub-creds'  // Jenkins Docker credentials ID
        GIT_REPO_URL = 'https://github.com/umayal-qa/CypressAutomation.git'
        CYPRESS_ENV = 'staging' // Example: specify your Cypress environment here
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
                    // Build the Docker image using the Dockerfile, with no cache
                    sh "docker build --no-cache -t ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} ."
                }
            }
        }

//         stage('Run Cypress Tests') {
//             steps {
//                 script {
//                     def image = docker.image("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}")
//                     image.inside() {
//                         if (isUnix()) {
//                             // On Unix-like systems (Linux/MacOS), use `nohup` or `&` to run Cypress tests in the background
//                             sh 'nohup npx cypress run --headless --browser chrome --env environment=${CYPRESS_ENV} &'
//                         } else if (isWindows()) {
//                             // On Windows, use `start /B` to run Cypress tests in the background
//                             bat 'start /B npx cypress run --headless --browser chrome --env environment=${CYPRESS_ENV}'
//                         }
//                     }
//                 }
//             }
//         }

//         stage('Push Docker Image') {
//             when {
//                 allOf {
//                     branch 'main'  // Optional: Push only for the main branch, or any branch you choose
//                     expression {
//                         return currentBuild.result == 'SUCCESS'  // Only push if the tests passed
//                     }
//                 }
//             }
//             steps {
//                 script {
//                     // Log in to Docker registry using Jenkins credentials
//                     docker.withRegistry('https://hub.docker.com', "${DOCKER_CREDENTIALS_ID}") {
//                         // Push the Docker image to the registry
//                         docker.image("${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}").push()
//                     }
//                 }
//             }
//         }
//     }

//     post {
//         always {
//             // Clean up Docker artifacts to avoid accumulation of unused data
//             sh 'docker system prune -f'
//         }
//         success {
//             echo 'Tests passed, Docker image pushed successfully.'
//         }
//         failure {
//             echo 'Tests failed, Docker image not pushed.'
//         }
//     }
// }
