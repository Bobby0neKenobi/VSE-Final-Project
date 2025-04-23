export default function Sidebar(){
    return(
        <div style={{ width: 200, padding: 10, borderRight: '1px solid #ccc' }}>
        <div
          draggable
          onDragStart={(event) =>
            event.dataTransfer.setData('application/reactflow', 'resistor')
          }
          style={{
            padding: 10,
            background: '#e2e8f0',
            marginBottom: 10,
            cursor: 'grab',
            borderRadius: 5,
          }}
        >
          Resistor
        </div>
      </div>
    )
}