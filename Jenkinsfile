pipeline {
    environment {
        registryFrontend =  'linea/manga_frontend'
        registryBackend = 'linea/manga_backend'
        registryCredential = 'Dockerhub'
        dockerImageBack = ''
        dockerImageFront = ''
        GIT_COMMIT_SHORT = sh(
            script: "printf \$(git rev-parse --short ${GIT_COMMIT})",
            returnStdout: true
        )
    }
    agent any
    stages {
        stage('Creating version.json') {
            steps {
                sh './version.sh && cat ./frontend/src/assets/json/version.json'
            }
        }
        stage('Build Images') {
            steps {
                parallel(
                    frontend: {
                        dir('frontend') {
                            script {
                                dockerImageFront = docker.build registryFrontend + ":$GIT_COMMIT_SHORT"
                            }
                        }
                    },
                    backend: {
                        dir('backend') {
                            script {
                                dockerImageBack = docker.build registryFrontend + ":$GIT_COMMIT_SHORT"
                            }
                        }
                    }
                )
            }
        }
        stage('Push Images') {
            steps {
                parallel(
                    frontend: {
                        dir('frontend') {
                            script {
                                if (env.BRANCH_NAME.toString().equals('master')) {
                                    // No caso de um merge em master
                                    // Faz o push da imagem também como latest.

                                    docker.withRegistry('', registryCredential) {
                                        dockerImageFront.push()
                                        dockerImageFront.push("frontend:latest")
                                    }

                                }
                            }
                            //  Para merges em qualquer branch faz o push apenas da imagem com o hash do commit.
                            script {
                                docker.withRegistry('', registryCredential) {
                                    dockerImageFront.push()
                                }
                            }
                        }
                    },
                    backend: {
                        dir('backend') {
                            script {
                                if (env.BRANCH_NAME.toString().equals('master')) {
                                    // No caso de um merge em master
                                    // Faz o push da imagem também como latest.

                                    docker.withRegistry('', registryCredential) {
                                        dockerImageBack.push()
                                        dockerImageBack.push("backend:latest")
                                    }

                                }
                            }
                            //  Para merges em qualquer branch faz o push apenas da imagem com o hash do commit.
                            script {
                                docker.withRegistry('', registryCredential) {
                                    dockerImageBack.push()
                                }
                            }
                        }
                    }
                )
            }
        }
    }
    post {
        always {
            sh "docker rmi $registryFrontend:$GIT_COMMIT_SHORT --force"
            sh "docker rmi $registryBackend:$GIT_COMMIT_SHORT --force"
        }
    }
}
