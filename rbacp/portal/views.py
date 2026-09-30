from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import *

# Create your views here.


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        groups = request.user.groups.first()
        return Response({
            "username": request.user.username,
            "role": groups.name if groups else None,
        })


class dashboard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, _request):
        return Response({"message": "access granted"})

class groundops(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "ground"

    def get(self, _request):
        return Response({"message": "access granted"})


class maintenance(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "maintenance"

    def get(self, _request):
        return Response({"message": "access granted"})


class users(APIView):
    permission_classes = [IsAuthenticated, access]
    feature = "users"

    def get(self, _request):
        return Response({"message": "access granted"})