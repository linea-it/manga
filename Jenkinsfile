pipeline {
    environment {
        registry = "linea/manga"
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
        stage('Build Images') {
            steps {
              parallel(
              frontend: {
                  dir('frontend') {
                      script {
                          dockerImageFront = docker.build registry + "_frontend:$GIT_COMMIT_SHORT"
                      }
                  }
              },
              backend: {
                dir('backend') {
                    script {
                        dockerImageBack = docker.build registry + "_backend:$GIT_COMMIT_SHORT"
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
                    script{
                        if (env.BRANCH_NAME.toString().equals('master')) {
                            // No caso de um merge em master
                            // Faz o push da imagem também como latest.

                            docker.withRegistry( '', registryCredential ) {
                                    dockerImageFront.push()
                            }

                        }
                    }
                    //  Para merges em qualquer branch faz o push apenas da imagem com o hash do commit.
                    script {
                        docker.withRegistry( '', registryCredential ) {
                            dockerImageFront.push()
                        }
                    }
                  }
              },
              backend: {
                  dir('backend') {
                    script{
                        if (env.BRANCH_NAME.toString().equals('master')) {
                            // No caso de um merge em master
                            // Faz o push da imagem também como latest.

                            docker.withRegistry( '', registryCredential ) {
                                dockerImageBack.push()
  
                            }

                        }
                    }
                    //  Para merges em qualquer branch faz o push apenas da imagem com o hash do commit.
                    script {
                        docker.withRegistry( '', registryCredential ) {
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
            sh "docker rmi $registry" + "_frontend:$GIT_COMMIT_SHORT --force"
            sh "docker rmi $registry" + "_backend:$GIT_COMMIT_SHORT --force"
        }
    }
}
