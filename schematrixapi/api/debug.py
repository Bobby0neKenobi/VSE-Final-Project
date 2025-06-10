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

    def rec(node_id):
        Res = 0
        while True:
            visited.add(node_id)
            Rn = 0
            if len(graphtarg[node_id]) > 1:
                for n_id in graphtarg[node_id]:
                    R = rec(n_id)
                    if Rn == 0:
                        Rn = R
                        continue
                    Rn = (Rn * R)/(Rn + R)
            else:
                Rn = nodes[int(graphtarg[graphtarg[node_id][0]][0])]["data"]["value"]

            # Calc resistor sum
            Res = Res + Rn
            
            if len(visited) == len(nodes):
                break
            else:
                if len(graphtarg[graphtarg[node_id][0]]) == 1:
                    if len(graphsour[graphtarg[node_id][0]]) > 1:
                        break
            node_id = graphtarg[node_id][0]
        return Res

    rec(battery_node["id"])


data = {
    "nodes": [
        {
            "id": "1",
            "type": "resistor",
            "position": {"x": 593.109375, "y": 273},
            "data": {"label": "resistor node", "value": 100},
            "width": 120,
            "height": 82,
        },
        {
            "id": "2",
            "type": "resistor",
            "position": {"x": 392.6640625, "y": 189.75},
            "data": {"label": "resistor node", "value": 100},
            "width": 120,
            "height": 82,
        },
        {
            "id": "4",
            "type": "resistor",
            "position": {"x": 234.53647105012885, "y": 304.4087955182405},
            "data": {"label": "resistor node", "value": 100},
            "width": 120,
            "height": 82,
            "selected": False,
            "positionAbsolute": {"x": 234.53647105012885, "y": 304.4087955182405},
            "dragging": False,
        },
        {
            "id": "3",
            "type": "battery",
            "position": {"x": 462.6227954571734, "y": 485.8626560489172},
            "data": {"label": "battery node", "value": 100},
            "width": 120,
            "height": 82,
        },
        {
            "id": "5",
            "type": "resistor",
            "position": {"x": 392.6640625, "y": 189.75},
            "data": {"label": "resistor node", "value": 100},
            "width": 120,
            "height": 82,
        },
    ],
    "edges": [
        {
            "source": "2",
            "sourceHandle": "rs",
            "target": "1",
            "targetHandle": "lt",
            "type": "smoothstep",
            "id": "reactflow__edge-2rs-1lt",
        },
        {
            "source": "3",
            "sourceHandle": "rs",
            "target": "2",
            "targetHandle": "lt",
            "type": "smoothstep",
            "id": "reactflow__edge-3rs-2lt",
        },
        {
            "source": "4",
            "sourceHandle": "ls",
            "target": "3",
            "targetHandle": "lt",
            "type": "smoothstep",
            "id": "reactflow__edge-3ls-4lt",
        },
        {
            "source": "1",
            "sourceHandle": "rs",
            "target": "4",
            "targetHandle": "rt",
            "type": "smoothstep",
            "id": "reactflow__edge-4rs-1rt",
        },
        {
            "source": "2",
            "sourceHandle": "rs",
            "target": "5",
            "targetHandle": "rt",
            "type": "smoothstep",
            "id": "reactflow__edge-4rs-1rt",
        },
        {
            "source": "5",
            "sourceHandle": "rs",
            "target": "3",
            "targetHandle": "rt",
            "type": "smoothstep",
            "id": "reactflow__edge-4rs-1rt",
        },
    ],
}

calculate_total_resistance(data.get("nodes", []), data.get("edges", []))
