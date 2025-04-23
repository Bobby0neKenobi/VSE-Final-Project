import { useState } from 'react';

export default function ResistorNode({ data }) {
  const [value, setValue] = useState(data.value || 100);

  return (
    <div
      style={{
        padding: 10,
        border: '2px solid #4a5568',
        borderRadius: 5,
        backgroundColor: '#f7fafc',
        minWidth: 120,
        textAlign: 'center'
      }}
    >
      <strong>Resistor</strong>
      <div style={{ marginTop: 6 }}>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          style={{
            width: 60,
            padding: 4,
            fontSize: 14,
            marginRight: 4,
            textAlign: 'center'
          }}
        />
        Ω
      </div>
    </div>
  );
}
