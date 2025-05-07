from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import User, Graph
from .serializers import UserSerializer, GraphSerializer, JWTSerializer
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(TokenObtainPairView):
    serializer_class = JWTSerializer

class UserView(APIView):
    def get(self, request):
        selectedUser = request.user
        if not request.user.is_authenticated:
            return Response({"error" : "Unauthorized"}, status=401)
        try:
            user = User.objects.get(pk=selectedUser.id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)

            return Response(
                {"user": {"id": user.id, "username": user.username}, "refresh": str(refresh), "access": str(refresh.access_token),}, status=201
            )
        return Response(serializer.errors, status=400)

    def put(self, request):
        selectedUser = request.user
        if not request.user.is_authenticated:
            return Response({"error" : "Unauthorized"}, status=401)
        try:
            user = User.objects.get(pk=selectedUser.id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        data = request.data
        data['password'] = make_password(data['password'])
        serializer = UserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request):
        selectedUser = request.user
        if not request.user.is_authenticated:
            return Response({"error" : "Unauthorized"}, status=401)
        try:
            user = User.objects.get(pk=selectedUser.id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        user.delete()
        return Response(status=204)

class GraphView(APIView):
    def get(self, request):
        user = request.user
        if not request.user.is_authenticated:
            return Response({"error" : "Unauthorized"}, status=401)
        id = request.query_params.get('id')
        if not id:
            try:
                graph = Graph.objects.filter(user=user)
            except Graph.DoesNotExist:
                return Response({"error": "Graph not found"}, status=404)
            serializer = GraphSerializer(graph, many=True)
            return Response(serializer.data)
        else:
            try:
                graph = Graph.objects.get(user=user, id=id)
            except Graph.DoesNotExist:
                return Response({"error": "Graph not found"}, status=404)
            serializer = GraphSerializer(graph)
            return Response(serializer.data)
    
    def post(self, request):
        user = request.user
        if not request.user.is_authenticated:
            return Response({"error" : "Unauthorized"}, status=401)
        data = request.data.copy()
        data['user'] = user.id
        serializer = GraphSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request):
        user = request.user
        if not request.user.is_authenticated:
            return Response({"error" : "Unauthorized"}, status=401)
        try:
            graph = Graph.objects.get(pk=request.data['id'], user=user.id)
        except User.DoesNotExist:
            return Response({"error": "Graph not found"}, status=404)
        data = request.data.copy()
        data['user'] = user.id
        serializer = GraphSerializer(graph, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def delete(self, request):
        user = request.user
        if not request.user.is_authenticated:
            return Response({"error" : "Unauthorized"}, status=401)
        id = request.query_params.get('id')
        if not id:
            return Response({"error": "Graph not found"}, status=404)
        try:
            graph = Graph.objects.get(pk=id, user=user.id)
        except User.DoesNotExist:
            return Response({"error": "Graph not found"}, status=404)
        graph.delete()
        return Response(status=204)
        