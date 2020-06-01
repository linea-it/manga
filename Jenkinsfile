pipeline {
    environment {
        registryFrontend = "linea/manga_frontend"
        registryBackend = "linea/manga_backend"
        registryCredential = 'Dockerhub'
        dockerImage = ''
        commit = ''
    }
    agent any
    stages {

        stage('Creating version.json') {
            dir('frontend') {
                steps {
                    sh './version.sh && cat ./src/assets/json/version.json'
                }
            }
        }
        stage('Building and push image') {
            when {
                allOf {
                    expression {
                        env.TAG_NAME == null
                    }
                    expression {
                        env.BRANCH_NAME.toString().equals('master')
                    }
                }
            }
            steps {
                parallel(
                    frontend: {
                        dir('frontend') {
                            script {
                                sh 'docker build -t $registryFrontend:$GIT_COMMIT .'
                                docker.withRegistry('', registryCredential) {
                                    sh 'docker push $registryFrontend:$GIT_COMMIT'
                                    sh 'docker rmi $registryFrontend:$GIT_COMMIT'
                                }
                            }
                        }
                    }
                    backend: {
                        dir('backend') {
                            script {
                                sh 'docker build -t $registryBackend:$GIT_COMMIT .'
                                docker.withRegistry('', registryCredential) {
                                    sh 'docker push $registryBackend:$GIT_COMMIT'
                                    sh 'docker rmi $registryBackend:$GIT_COMMIT'
                                }
                            }
                        }
                    }
                )
            }
            stage('Building and Push Image Release') {
                when {
                    expression {
                        env.TAG_NAME != null
                    }
                }
                steps {
                    parallel(
                        frontend: {
                            dir('frontend') {
                                script {
                                    sh 'docker build -t $registryFrontend:$TAG_NAME .'
                                    docker.withRegistry('', registryCredential) {
                                        sh 'docker push $registryFrontend:$TAG_NAME'
                                        sh 'docker rmi $registryFrontend:$TAG_NAME'
                                    }
                                }
                            }
                        }
                        backend: {
                            dir('backend') {
                                script {
                                    sh 'docker build -t $registryBackend:$TAG_NAME .'
                                    docker.withRegistry('', registryCredential) {
                                        sh 'docker push $registryBackend:$TAG_NAME'
                                        sh 'docker rmi $registryBackend:$TAG_NAME'
                                    }
                                }
                            }
                        }
                    )
                }
            }
        }
    }