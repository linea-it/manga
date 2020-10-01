pipeline {
    environment {
        registryFrontend =  'linea/manga_frontend'
        registryBackend = 'linea/manga_backend'
        registryCredential = 'Dockerhub'
        deployment = 'manga'
        namespace = 'manga'
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
                                dockerImageBack = docker.build registryBackend + ":$GIT_COMMIT_SHORT"
                            }
                        }
                    }
                )
            }
        }
        stage('Push Images') {
            when {
                expression {
                   env.BRANCH_NAME.toString().equals('master')
                }
            }
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
                                        dockerImageFront.push(":latest")
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
                                        dockerImageBack.push(":latest")
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
            sh """
                curl -D - -X \"POST\" \
                -H \"content-type: application/json\" \
                -H \"X-Rundeck-Auth-Token: $RD_AUTH_TOKEN\" \
                -d '{\"argString\": \"-namespace $namespace -commit $GIT_COMMIT_SHORT -image $registryBackend:$GIT_COMMIT_SHORT -deployment $deployment\"}' \
                https://fox.linea.gov.br/api/1/job/15e5ca31-67e4-4c56-a7fa-fb5f97c1231f/executions
            """
        }
    }
}
