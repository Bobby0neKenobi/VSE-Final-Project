from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from .models import User, Graph
from .serializers import UserSerializer, GraphSerializer, JWTSerializer
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.tokens import RefreshToken
import base64
from django.core.files.base import ContentFile
# views.py
from rest_framework import status

def calculate_total_resistance(nodes, edges):
    from collections import defaultdict

    graphtarg = defaultdict(list)
    graphsour = defaultdict(list)
    for edge in edges:
        a, b = edge["source"], edge["target"]
        graphtarg[a].append(b)
        graphsour[b].append(a)
    print(graphtarg, graphsour)
    battery_node = 0
    for n in nodes:
        if n["type"] == "battery":
            battery_node = n
            break
    visited = set()
    print(battery_node["id"])

    def getNodeType(node_id):
        for i in range(len(nodes)):
            if nodes[i]["id"] == node_id:
                return nodes[i]["type"]
    
    def getResistance(node_id):
        visited.add(node_id)
        Rn = 0
        for n_id in graphtarg[node_id]:
            R = rec(n_id)
            if Rn == 0:
                Rn = R
                continue
            Rn = (Rn * R) / (Rn + R)
        return Rn

    def rec(node_id):
        Res = 0
        for i in range(len(nodes)):
            if nodes[i]["id"] == node_id and node_id not in visited:
                Res = nodes[i]["data"]["value"]
                visited.add(node_id)
                break
        while True:
            Rn = 0
            if len(graphtarg[node_id]) > 1:
                for n_id in graphtarg[node_id]:
                    R = rec(n_id)
                    if Rn == 0:
                        Rn = R
                        continue
                    Rn = (Rn * R) / (Rn + R)
            else:
                for i in range(len(nodes)):
                    if nodes[i]["id"] == graphtarg[node_id][0] and graphtarg[node_id][0] not in visited:
                        Rn = nodes[i]["data"]["value"]
                        break
            # Calc resistor sum
            Res = Res + Rn

            visited.add(node_id)
            if len(visited) == len(nodes):
                break
            else:
                if len(graphtarg[graphtarg[node_id][0]]) == 1:
                    if len(graphsour[graphtarg[node_id][0]]) > 1:
                        break

            node_id = graphtarg[node_id][0]
        return Res

    return getResistance(battery_node["id"])


class LoginView(TokenObtainPairView):
    serializer_class = JWTSerializer


class UserView(APIView):
    def get(self, request):
        selectedUser = request.user
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=401)
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
                {
                    "user": {"id": user.id, "username": user.username},
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=201,
            )
        return Response(serializer.errors, status=400)

    def put(self, request):
        selectedUser = request.user
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=401)
        try:
            user = User.objects.get(pk=selectedUser.id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        data = request.data.copy()
        if data["password"]:
            data["password"] = make_password(data["password"])
        if data["profile_image"]:
            if user.profile_image:
                user.profile_image.delete(save=True)
        serializer = UserSerializer(user, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request):
        selectedUser = request.user
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=401)
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
            return Response({"error": "Unauthorized"}, status=401)
        id = request.query_params.get("id")
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
            return Response({"error": "Unauthorized"}, status=401)
        data = request.data.copy()
        data["user"] = user.id
        serializer = GraphSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def put(self, request):
        user = request.user
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=401)
        try:
            graph = Graph.objects.get(pk=request.data["id"], user=user.id)
        except User.DoesNotExist:
            return Response({"error": "Graph not found"}, status=404)
        data = request.data.copy()
        data["user"] = user.id
        snapshot = request.data["data"].get("snapshot")
        if snapshot:
            if graph.snapshot:
                graph.snapshot.delete(save=True)
        format, imgstr = snapshot.split(";base64,")
        ext = format.split("/")[-1]
        snapshot_name = f"preview_{user.id}.{ext}"
        snapshot_file = ContentFile(base64.b64decode(imgstr), name=snapshot_name)
        print(snapshot_file)
        data["snapshot"] = snapshot_file
        serializer = GraphSerializer(graph, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def delete(self, request):
        user = request.user
        if not request.user.is_authenticated:
            return Response({"error": "Unauthorized"}, status=401)
        id = request.query_params.get("id")
        if not id:
            return Response({"error": "Graph not found"}, status=404)
        try:
            graph = Graph.objects.get(pk=id, user=user.id)
        except User.DoesNotExist:
            return Response({"error": "Graph not found"}, status=404)
        graph.delete()
        return Response(status=204)

class ResistanceCalculator(APIView):
    def post(self, request):
        data = request.data
        nodes = data.get('nodes', [])
        edges = data.get('edges', [])

        try:
            resistance = calculate_total_resistance(nodes, edges)
            return Response({'totalResistance': round(resistance, 2)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
