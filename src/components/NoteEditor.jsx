import { useState } from 'react';

export default function NoteEditor() {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState('16px');
  const [isBold, setIsBold] = useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '500px' }}>
      {/* Toolbar Controls */}
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setIsBold(!isBold)}>
          {isBold ? 'Unbold' : 'Bold'}
        </button>
        
        <select 
          value={fontSize} 
          onChange={(e) => setFontSize(e.target.value)}
        >
          <option value="12px">Small (12px)</option>
          <option value="16px">Normal (16px)</option>
          <option value="24px">Large (24px)</option>
        </select>
      </div>

      {/* Writing Area */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something here..."
        style={{
          width: '100%',
          height: '150px',
          fontSize: fontSize,
          fontWeight: isBold ? 'bold' : 'normal',
          padding: '10px'
        }}
      />
    </div>
  );
}
