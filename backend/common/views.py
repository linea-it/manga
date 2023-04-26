from django.contrib.auth.models import User
from rest_framework import serializers, viewsets, mixins, response, viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import (IsAdminUser, IsAuthenticated,
                                        IsAuthenticatedOrReadOnly, AllowAny)
from rest_framework.response import Response

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import redirect
from django.core.mail import send_mail

import requests

from smtplib import SMTPException


# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']

# ViewSets define the view behavior.


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]

        return [permission() for permission in permission_classes]

    def retrieve(self, request, pk=None):
        """
            este metodo serve para retornar informacoes do usuario logado e
            so retorna informacao se o id passado por 'i'
        """
        if pk == 'i':
            return response.Response(UserSerializer(request.user,
                                                    context={'request': request}).data)

        return super(UserViewSet, self).retrieve(request, pk)


@api_view(['POST'])
@permission_classes([AllowAny])
def contact_us(request):
    """
        API Endpoint to send a email to helpdesk
    Args:
        request:

    Returns:

    """
    if request.method == 'POST':

        # Dados da Mensagem
        name = request.data.get('name', None)
        user_email = request.data.get('from', None)
        subject = "[MaNGA] %s" % (request.data.get('subject', None))
        message = request.data.get('message', None)

        if name is not None and user_email is not None and subject is not None and message is not None:
            try:
                to_email = settings.EMAIL_HELPDESK
                from_email = settings.EMAIL_HELPDESK_CONTACT

                message_header = (
                    "Name: %s\nUsername: %s\nEmail: %s\nMessage:\n" % (name, request.user.username, user_email))

                body = message_header + message

                send_mail(
                    subject,
                    body,
                    from_email,
                    [to_email],
                    fail_silently=False,
                )

                return Response({"message": "Message sent successfully!"})

            except SMTPException as e:
                return Response(e, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def LogoutView(request):
    logout(request)

    # Redireciona para a home
    home = settings.HOST_URL
    response = redirect(home)

    return response


@api_view(['GET'])
def send_statistic_email(request):
    """
    Este metodo e usado para enviar o email de estatistica a qualquer momento.
    independente da task diaria.
    :param request:
    :return:
    """
    if request.method == 'GET':
        from activity_statistic.reports import ActivityReports
        import datetime

        try:
            ActivityReports().report_email_unique_visits(datetime.date.today())
            return Response(dict({'status': "success"}))

        except Exception as e:

            return Response(dict({'status': "failure", "Exception": e}))
