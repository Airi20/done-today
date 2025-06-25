import React, { useState, useEffect } from 'react';

function App() {
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('doneTodayRecords');
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('doneTodayRecords', JSON.stringify(records));
  }, [records]);

  const addRecord = () => {
    if (!input.trim()) return;
    setRecords([...records, { id: Date.now(), text: input.trim() }]);
    setInput('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>今日できたこと</h1>
        <div style={styles.inputContainer}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="できたことを書こう"
            style={styles.input}
          />
          <button onClick={addRecord} style={styles.button}>追加</button>
        </div>

        <ul style={styles.list}>
          {records.map(r => (
            <li key={r.id} style={styles.item}>{r.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fdf6e3',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  heading: {
    fontSize: '1.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  inputContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '1rem',
  },
  input: {
    flex: 1,
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 16px',
    fontSize: '1rem',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    backgroundColor: '#f1f1f1',
    padding: '10px',
    marginBottom: '6px',
    borderRadius: '6px',
  },
};

export default App;
