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
                    Rn = (Rn * R) / (Rn + R)
            else:
                Rn = nodes[next((i for i, node in enumerate(nodes) if node["id"] == graphtarg[graphtarg[node_id][0]][0]), -1)]["data"]["value"]

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
            "id": "1747826606105",
            "type": "resistor",
            "position": {"x": 593.109375, "y": 273},
            "data": {"label": "resistor node", "value": 100},
            "width": 120,
            "height": 82,
        },
        {
            "id": "1747826616037",
            "type": "resistor",
            "position": {"x": 392.6640625, "y": 189.75},
            "data": {"label": "resistor node", "value": 100},
            "width": 120,
            "height": 82,
        },
        {
            "id": "1748438128985",
            "type": "resistor",
            "position": {"x": 234.53647105012885, "y": 304.4087955182405},
            "data": {"label": "resistor node", "value": 100},
            "width": 120,
            "height": 82,
            "selected": 0,
            "positionAbsolute": {"x": 234.53647105012885, "y": 304.4087955182405},
            "dragging": 0,
        },
        {
            "id": "1749042654421",
            "type": "battery",
            "position": {"x": 462.6227954571734, "y": 485.8626560489172},
            "data": {"label": "battery node", "value": 100},
            "width": 120,
            "height": 82,
        },
        {
            "id": "1749586502163",
            "type": "resistor",
            "position": {"x": 445.25459614895067, "y": 345.93597114884454},
            "data": {"label": "resistor node", "value": 100},
            "width": 120,
            "height": 82,
        },
    ],
    "edges": [
        {
            "source": "1749042654421",
            "sourceHandle": "ls",
            "target": "1748438128985",
            "targetHandle": "lt",
            "type": "smoothstep",
            "id": "reactflow__edge-1749042654421ls-1748438128985lt",
        },
        {
            "source": "1748438128985",
            "sourceHandle": "rs",
            "target": "1747826616037",
            "targetHandle": "lt",
            "type": "smoothstep",
            "id": "reactflow__edge-1748438128985rs-1747826616037lt",
        },
        {
            "source": "1748438128985",
            "sourceHandle": "rs",
            "target": "1749586502163",
            "targetHandle": "lt",
            "type": "smoothstep",
            "id": "reactflow__edge-1748438128985rs-1749586502163lt",
        },
        {
            "source": "1747826616037",
            "sourceHandle": "rs",
            "target": "1747826606105",
            "targetHandle": "lt",
            "type": "smoothstep",
            "id": "reactflow__edge-1747826616037rs-1747826606105lt",
        },
        {
            "source": "1749586502163",
            "sourceHandle": "rs",
            "target": "1749042654421",
            "targetHandle": "rt",
            "type": "smoothstep",
            "id": "reactflow__edge-1749586502163rs-1749042654421rt",
        },
        {
            "source": "1747826606105",
            "sourceHandle": "rs",
            "target": "1749042654421",
            "targetHandle": "rt",
            "type": "smoothstep",
            "id": "reactflow__edge-1747826606105rs-1749042654421rt",
        },
    ],
}

calculate_total_resistance(data.get("nodes", []), data.get("edges", []))
