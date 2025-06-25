import { useState, useEffect } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('todayRecords');
    if (saved) setRecords(JSON.parse(saved));
  }, []);

  const saveRecord = () => {
    if (!inputText.trim()) return;
    const newRecord = {
      id: Date.now(),
      text: inputText.trim(),
      date: new Date().toLocaleDateString(),
    };
    const updated = [newRecord, ...records];
    setRecords(updated);
    localStorage.setItem('todayRecords', JSON.stringify(updated));
    setInputText('');
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>今日できたことアプリ ✨</h2>
      <input
        type="text"
        placeholder="今日できたことを1行で"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && saveRecord()}
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
      />
      <button onClick={saveRecord} style={{ marginTop: '0.5rem', width: '100%', padding: '0.5rem' }}>
        保存
      </button>

      <hr style={{ margin: '1.5rem 0' }} />

      <h3>記録一覧</h3>
      {records.length === 0 && <p>まだ記録はありません。</p>}
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {records.map(({ id, text, date }) => (
          <li key={id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
            <small style={{ color: '#666' }}>{date}</small>
            <div>{text}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
